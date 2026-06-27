import mongoose from 'mongoose';

//recruiter schema

const recruiterSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true
        },

        companyName: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: [3, "Company name must be at least 3 characters"],
            maxlength: [100, "Company name cannot exceed 100 characters"]
        },

        companyDescription: {
            type: String,
            required: [true, "Company description is required"],
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },

        companyWebsite: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
            match: [
                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                "Please enter a valid website URL"
            ]
        },

        companyEmail: {
            type: String,
            required: [true, "Company email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        companyPhone: {
            type: String,
            required: [true, "Company phone is required"],
            trim: true,
            match: [
                /^[0-9]{10}$/,
                "Please enter a valid 10-digit phone number"
            ]
        },

        companyAddress: {
            type: String,
            required: [true, "Company address is required"],
            trim: true,
            minlength: [5, "Address must be at least 5 characters"]
        },

        companyCity: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },

        companyState: {
            type: String,
            required: [true, "State is required"],
            trim: true
        },

        companyCountry: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
            default: "India"
        },

        industry: {
            type: String,
            required: [true, "Industry is required"],
            enum: {
                values: [
                    "IT",
                    "Finance",
                    "Healthcare",
                    "Manufacturing",
                    "Retail",
                    "Education",
                    "E-commerce",
                    "Real Estate",
                    "Consulting",
                    "Energy",
                    "Telecommunications",
                    "Media",
                    "Hospitality",
                    "Logistics",
                    "Other"
                ],
                message: "Please select a valid industry"
            }
        },

        companySize: {
            type: String,
            required: [true, "Company size is required"],
            enum: {
                values: [
                    "1-50",
                    "51-200",
                    "201-500",
                    "501-1000",
                    "1001-5000",
                    "5001-10000",
                    "10000+"
                ],
                message: "Please select a valid company size"
            }
        },

        foundedYear: {
            type: Number,
            required: [true, "Founded year is required"],
            min: [1900, "Founded year cannot be before 1900"],
            max: [new Date().getFullYear(), "Founded year cannot be in the future"]
        },

        companyLogo: {
            type: String,
            required: [true, "Company logo is required"]
        },

        gstNumber: {
            type: String,
            trim: true,
            match: [
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                "Please enter a valid GST number"
            ]
        },

        companyRegistrationNumber: {
            type: String,
            required: [true, "Company registration number is required"],
            trim: true,
            unique: true
        },

        hrDesignation: {
            type: String,
            required: [true, "HR designation is required"],
            trim: true
        },

        verificationDocuments: {
            gstCertificate: {
                type: String,
                required: [true, "GST certificate is required"]
            },
            registrationCertificate: {
                type: String,
                required: [true, "Registration certificate is required"]
            }
        },

        verificationStatus: {
            type: String,
            enum: {
                values: ["pending", "approved", "rejected"],
                message: "Verification status must be pending, approved, or rejected"
            },
            default: "pending"
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        verifiedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const Recruiter = mongoose.model("Recruiter", recruiterSchema);