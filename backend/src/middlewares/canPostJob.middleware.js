import { ApiError } from "../utils/Apierror.js";
import { Recruiter } from "../models/Recruiter.model.js";

const canPostJob = async (req, res, next) => {
    try {
        
        // Get user ID from request (assumes user is authenticated and user info is in req.user)
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized - User not authenticated");
        }

        // Find recruiter profile by userId
        const recruiterProfile = await Recruiter.findOne({ userId });

        if (!recruiterProfile) {
            throw new ApiError(404, "Recruiter profile not found");
        }

        // Check if verification status is approved
        if (recruiterProfile.verificationStatus !== "approved") {
            throw new ApiError(
                403,
                "Your company profile is awaiting admin verification. You cannot post jobs until your profile is verified."
            );
        }

        // Store recruiter profile in request for later use
        req.recruiterProfile = recruiterProfile;

        next();
    } catch (error) {
        next(error);
    }
};

export { canPostJob };
