import { Router } from "express";
import {
    registerRecruiter,
    approveRecruiter,
    rejectRecruiter,
    getPendingRecruiters,
    getApprovedRecruiters,
    getRejectedRecruiters,
    getRecruiterProfile
} from "../controllers/recruiter.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

// Public routes
router.route("/register").post(
    upload.fields([
        { name: "companyLogo", maxCount: 1 },
        { name: "gstCertificate", maxCount: 1 },
        { name: "registrationCertificate", maxCount: 1 }
    ]),
    registerRecruiter
);

// Get recruiter profile by ID
router.route("/:recruiterId").get(getRecruiterProfile);

// Admin routes for verification
// Get all pending recruiters
router.route("/admin/pending").get(getPendingRecruiters);

// Get all approved recruiters
router.route("/admin/approved").get(getApprovedRecruiters);

// Get all rejected recruiters
router.route("/admin/rejected").get(getRejectedRecruiters);

// Approve recruiter
router.route("/admin/:recruiterId/approve").patch(approveRecruiter);

// Reject recruiter
router.route("/admin/:recruiterId/reject").patch(rejectRecruiter);

export default router;
