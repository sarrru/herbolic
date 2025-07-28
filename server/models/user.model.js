import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide password"]
    },
    password_history: {
        type: [String],  // Array of bcrypt hashed passwords
        default: []
    },
    password_last_changed: {
        type: Date,
        default: Date.now //for password reset after 90days
    },
    login_attempts: {
        type: Number,
        default: 0
    },
    lock_until: {
        type: Date,
        default: null
    },
    is_mfa_enabled: {
        type: Boolean,
        default: true // ✅ Enable MFA by default
    },

    mfa_otp: {
        type: String,
        default: null
    },
    mfa_otp_expiry: {
        type: Date,
        default: null
    },

    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refresh_token: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'address'
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cartProduct'
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ['ADMIN', "USER"],
        default: "USER"
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model("User", userSchema)

export default UserModel