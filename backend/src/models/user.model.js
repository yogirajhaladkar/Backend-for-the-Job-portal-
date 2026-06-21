import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// userSchema
const userLoginSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username cannot exceed 20 characters"],
            match: [
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            ]
        },

        fullName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
            minlength: [3, "Full Name must be at least 3 characters"],
            maxlength: [50, "Full Name cannot exceed 50 characters"],
            index: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        mobile: {
            type: String,
            required: [true, "Mobile Number is required"],
            unique: true,
            trim: true,
            match: [
                /^[0-9]{10}$/,
                "Please enter a valid 10-digit mobile number"
            ]
        },

        isMobileVerified: {
            type: Boolean,
            default: false
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [
                8,
                "Password must be at least 8 characters long"
            ]
        },

        role: {
            type: String,
            enum: {
                values: [
                    "admin",
                    "recruiter",
                    "user"
                ],
                message:
                    "Role must be admin, recruiter, or user"
            },
            default: "user"
        },

        refreshToken: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    });



// passwordBcrypt 
userLoginSchema.pre("save", async function () {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    
})

//isPasswordCorrect
userLoginSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// generateAccessToken
userLoginSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generateRefreshToken
userLoginSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userLoginSchema);