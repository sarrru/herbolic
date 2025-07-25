import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import genertedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageClodinary from '../utils/uploadImageClodinary.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';
import AuditModel from '../models/audit.model.js';
import mfaOtpTemplate from '../utils/mfaOtpTemplate.js';

export async function verifyMfaController(request, response) {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Email and OTP are required",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (!user.mfa_otp || !user.mfa_otp_expiry) {
            return response.status(400).json({
                message: "OTP not requested or already verified",
                error: true,
                success: false
            });
        }

        const isOtpExpired = new Date() > new Date(user.mfa_otp_expiry);
        const isOtpValid = user.mfa_otp === otp;

        if (isOtpExpired) {
            return response.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false
            });
        }

        if (!isOtpValid) {
            return response.status(401).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        // Clear OTP fields after successful verification
        user.mfa_otp = null;
        user.mfa_otp_expiry = null;
        await user.save();

        // Generate tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await genertedRefreshToken(user._id);

        // Save refresh token in DB
        user.refresh_token = refreshToken;
        await user.save();

        // Set tokens as secure cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        // Optional: Log audit event
        await AuditModel.create({
            email: user.email,
            action: "MFA_VERIFIED",
            ip: request.ip || request.headers['x-forwarded-for'] || "unknown",
            userAgent: request.headers['user-agent'] || "unknown",
            timestamp: new Date()
        });

        return response.status(200).json({
            message: "MFA verified and login successful",
            error: false,
            success: true,
            data: { accessToken, refreshToken }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
}

async function logAudit({ email, action, ip, userAgent }) {
    try {
        await AuditModel.create({
            email,
            action,
            ip,
            userAgent,
            timestamp: new Date()
        });
    } catch (err) {
        console.error("Audit logging failed:", err.message);
    }
}

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return response.json({
                message: "Email already registered",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            password_last_changed: new Date()
        });

        const save = await newUser.save();

        //  Log Audit
        await logAudit({
            email,
            action: 'REGISTER',
            ip: request.ip || request.headers['x-forwarded-for'] || "unknown",
            userAgent: request.headers['user-agent'] || "unknown"
        });

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Verify your email with Herbolic",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        });

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;
        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return response.status(400).json({
                message: "Invalid verification code",
                error: true,
                success: false
            });
        }

        await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.json({
            message: "Email verification complete",
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}



export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user || user.status !== "Active") {
            return response.status(400).json({
                message: user ? "Contact admin" : "User not registered",
                error: true,
                success: false
            });
        }

        // Check if user is temporarily locked
        if (user.lock_until && user.lock_until > new Date()) {
            return response.status(403).json({
                message: "Account is temporarily locked due to multiple failed login attempts. Try again after 10 minutes.",
                error: true,
                success: false
            });
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);

        if (!isValidPassword) {
            user.login_attempts = (user.login_attempts || 0) + 1;

            if (user.login_attempts >= 3) {
                user.lock_until = new Date(Date.now() + 10 * 60 * 1000); // lock for 10 mins
                user.login_attempts = 0;
            }

            await user.save();

            return response.status(400).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        // Password expiry check
        const lastChanged = user.password_last_changed || user.createdAt;
        const daysSinceChange = (Date.now() - new Date(lastChanged)) / (1000 * 60 * 60 * 24);

        if (daysSinceChange > 90) {
            return response.status(403).json({
                message: "Your password has expired. Please reset it.",
                error: true,
                success: false
            });
        }

        // Reset lock and login_attempts on success
        user.login_attempts = 0;
        user.lock_until = null;
        user.last_login_date = new Date();

        // 🛡️ MFA Flow
        if (user.is_mfa_enabled) {
            const otp = generatedOtp(); // 6-digit OTP
            user.mfa_otp = otp;
            user.mfa_otp_expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
            await user.save();

            // Send OTP to email
            await sendEmail({
                sendTo: user.email,
                subject: "Your MFA Login Code",
                html: mfaOtpTemplate(otp)
            });

            return response.status(200).json({
                message: "MFA OTP sent to your email",
                mfaRequired: true,
                error: false,
                success: true
            });
        }

        await user.save();

        // Audit Log
        await logAudit({
            email,
            action: 'LOGIN',
            ip: request.ip || request.headers['x-forwarded-for'] || "unknown",
            userAgent: request.headers['user-agent'] || "unknown"
        });

        // Generate access and refresh tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await genertedRefreshToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.json({
            message: "Login successful",
            error: false,
            success: true,
            data: { accessToken, refreshToken }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function logoutController(request, response) {
    try {
        const userId = request.userId;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.clearCookie("accessToken", cookieOptions);
        response.clearCookie("refreshToken", cookieOptions);

        await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

        return response.json({
            message: "Logged out successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId;
        const image = request.file;

        const upload = await uploadImageClodinary(image);

        await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        });

        return response.json({
            message: "Profile image uploaded",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId;
        const { name, email, mobile, password } = request.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            updateData.password = await bcryptjs.hash(password, salt);
        }

        await UserModel.updateOne({ _id: userId }, updateData);

        return response.json({
            message: "User details updated",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not registered",
                error: true,
                success: false
            });
        }

        const otp = generatedOtp();
        const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: expireTime.toISOString()
        });

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from Herbolic",
            html: forgotPasswordTemplate({
                name: user.name,
                otp
            })
        });

        return response.json({
            message: "Check your email",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;
        const user = await UserModel.findOne({ email });

        if (!user || otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid email or OTP",
                error: true,
                success: false
            });
        }

        const now = new Date().toISOString();
        if (user.forgot_password_expiry < now) {
            return response.status(400).json({
                message: "OTP expired",
                error: true,
                success: false
            });
        }

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        });

        return response.json({
            message: "OTP verified",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}




export async function resetpassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "Passwords do not match",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        //  Prevent reuse of most recent password
        const recentHash = user.password_history?.[0];
        if (recentHash && await bcryptjs.compare(newPassword, recentHash)) {
            return response.status(400).json({
                message: "You cannot reuse your most recent password.",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        //  Update password history
        const newHistory = [hashedPassword, ...(user.password_history || [])].slice(0, 3);

        user.password = hashedPassword;
        user.password_history = newHistory;
        user.password_last_changed = new Date();
        await user.save();

        // Audit Log
        await logAudit({
            email,
            action: 'PASSWORD_RESET',
            ip: request.ip || request.headers['x-forwarded-for'] || "unknown",
            userAgent: request.headers['user-agent'] || "unknown"
        });

        return response.json({
            message: "Password reset successful",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}



export async function refreshToken(request, response) {
    try {
        const token = request.cookies.refreshToken || request.headers.authorization?.split(" ")[1];
        if (!token) {
            return response.status(401).json({
                message: "Missing refresh token",
                error: true,
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN);
        const userId = decoded._id;

        const newAccessToken = await generatedAccessToken(userId);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie('accessToken', newAccessToken, cookieOptions);

        return response.json({
            message: "Access token refreshed",
            error: false,
            success: true,
            data: { accessToken: newAccessToken }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function userDetails(request, response) {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId).select('-password -refresh_token');

        return response.json({
            message: "User details retrieved",
            data: user,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: "Error retrieving user",
            error: true,
            success: false
        });
    }
}

