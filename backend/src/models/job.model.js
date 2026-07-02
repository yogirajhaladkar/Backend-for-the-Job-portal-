import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            minlength: [3, "Job title must be at least 3 characters"],
            maxlength: [100, "Job title cannot exceed 100 characters"]
        },

        jobDescription: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
            minlength: [20, "Job description must be at least 20 characters"],
            maxlength: [5000, "Job description cannot exceed 5000 characters"]
        },

        employmentType: {
            type: String,
            required: [true, "Employment type is required"],
            enum: {
                values: ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"],
                message: "Please select a valid employment type"
            }
        },

        workMode: {
            type: String,
            required: [true, "Work mode is required"],
            enum: {
                values: ["Remote", "Hybrid", "On-site"],
                message: "Please select a valid work mode"
            }
        },

        jobCategory: {
            type: String,
            required: [true, "Job category is required"],
            trim: true,
            maxlength: [100, "Job category cannot exceed 100 characters"]
        },

        experienceLevel: {
            type: String,
            required: [true, "Experience level is required"],
            enum: {
                values: ["Fresher", "Junior", "Mid-Level", "Senior"],
                message: "Please select a valid experience level"
            }
        },

        minimumExperience: {
            type: Number,
            default: 0,
            min: [0, "Minimum experience cannot be negative"]
        },

        maximumExperience: {
            type: Number,
            default: 0,
            min: [0, "Maximum experience cannot be negative"]
        },

        minimumQualification: {
            type: String,
            required: [true, "Minimum qualification is required"],
            trim: true,
            maxlength: [100, "Minimum qualification cannot exceed 100 characters"]
        },

        branch: {
            type: String,
            trim: true,
            maxlength: [100, "Branch cannot exceed 100 characters"]
        },

        skills: {
            type: [String],
            required: [true, "At least one skill is required"],
            validate: {
                validator: (value) => Array.isArray(value) && value.length > 0,
                message: "At least one skill is required"
            }
        },

        salaryType: {
            type: String,
            required: [true, "Salary type is required"],
            enum: {
                values: ["Fixed", "Range", "Stipend"],
                message: "Please select a valid salary type"
            }
        },

        minSalary: {
            type: Number,
            default: 0,
            min: [0, "Minimum salary cannot be negative"]
        },

        maxSalary: {
            type: Number,
            default: 0,
            min: [0, "Maximum salary cannot be negative"]
        },

        currency: {
            type: String,
            default: "INR",
            trim: true,
            maxlength: [10, "Currency cannot exceed 10 characters"]
        },

        jobLocation: {
            type: String,
            required: [true, "Job location is required"],
            trim: true,
            maxlength: [200, "Job location cannot exceed 200 characters"]
        },

        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
            maxlength: [100, "City cannot exceed 100 characters"]
        },

        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
            maxlength: [100, "State cannot exceed 100 characters"]
        },

        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
            maxlength: [100, "Country cannot exceed 100 characters"]
        },

        numberOfOpenings: {
            type: Number,
            required: [true, "Number of openings is required"],
            min: [1, "Number of openings must be at least 1"]
        },

        applicationDeadline: {
            type: Date,
            required: [true, "Application deadline is required"],
            validate: {
                validator: function (value) {
                    if (!value) return false;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return value >= today;
                },
                message: "Application deadline cannot be in the past"
            }
        },

        isInternship: {
            type: Boolean,
            default: false
        },

        stipend: {
            type: Number,
            default: 0,
            min: [0, "Stipend cannot be negative"]
        },

        internshipDuration: {
            type: String,
            trim: true,
            maxlength: [100, "Internship duration cannot exceed 100 characters"]
        },

        benefits: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: {
                values: ["Draft", "Published", "Closed", "Expired"],
                message: "Please select a valid status"
            },
            default: "Published"
        },

        visibility: {
            type: String,
            enum: {
                values: ["Public", "Private"],
                message: "Please select a valid visibility"
            },
            default: "Public"
        }
    },
    {
        timestamps: true
    }
);

jobSchema.pre("validate", function () {
    if (
        this.maxSalary !== undefined &&
        this.minSalary !== undefined &&
        this.maxSalary < this.minSalary
    ) {
        this.invalidate("maxSalary", "Maximum salary cannot be less than minimum salary");
    }
});

export const Job = mongoose.model("Job", jobSchema);
