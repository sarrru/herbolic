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

        const newUser = new UserModel({ name, email, password: hashPassword });
        const save = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Verify your email with TAJA",
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

        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return response.status(400).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await genertedRefreshToken(user._id);

        await UserModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date()
        });

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
            subject: "Forgot password from TAJA",
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
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

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

