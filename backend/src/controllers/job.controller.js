import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Job } from "../models/job.model.js";

const createJob = asyncHandler(async (req, res) => {
    const {
        jobTitle,
        jobDescription,
        employmentType,
        workMode,
        jobCategory,
        experienceLevel,
        minimumExperience,
        maximumExperience,
        minimumQualification,
        branch,
        skills,
        salaryType,
        minSalary,
        maxSalary,
        currency,
        jobLocation,
        city,
        state,
        country,
        numberOfOpenings,
        applicationDeadline,
        isInternship,
        stipend,
        internshipDuration,
        benefits,
        status,
        visibility
    } = req.body;

    const requiredFields = [
        jobTitle,
        jobDescription,
        employmentType,
        workMode,
        jobCategory,
        experienceLevel,
        minimumQualification,
        skills,
        salaryType,
        jobLocation,
        city,
        state,
        country,
        numberOfOpenings,
        applicationDeadline
    ];

    if (requiredFields.some((field) => field === undefined || field === null || (typeof field === "string" && field.trim() === "") || (Array.isArray(field) && field.length === 0))) {
        throw new ApiError(400, "All required fields are required");
    }

    const job = await Job.create({
        jobTitle,
        jobDescription,
        employmentType,
        workMode,
        jobCategory,
        experienceLevel,
        minimumExperience: minimumExperience ?? 0,
        maximumExperience: maximumExperience ?? 0,
        minimumQualification,
        branch,
        skills,
        salaryType,
        minSalary: minSalary ?? 0,
        maxSalary: maxSalary ?? 0,
        currency: currency || "INR",
        jobLocation,
        city,
        state,
        country,
        numberOfOpenings,
        applicationDeadline,
        isInternship: isInternship === true || isInternship === "true",
        stipend: stipend ?? 0,
        internshipDuration,
        benefits: benefits || [],
        status: status || "Published",
        visibility: visibility || "Public"
    });

    if (!job) {
        throw new ApiError(500, "Job not created. Something went wrong");
    }

    return res.status(201).json(
        new ApiResponce(201, job, "Job created successfully")
    );
});

export { createJob };
