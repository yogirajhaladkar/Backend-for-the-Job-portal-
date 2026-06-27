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

/**
 * @swagger
 * /recruiters/register:
 *   post:
 *     summary: Register Recruiter
 *     tags:
 *       - Recruiters
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *
 *             properties:
 *               username:
 *                 type: string
 *
 *               fullName:
 *                 type: string
 *
 *               email:
 *                 type: string
 *
 *               mobile:
 *                 type: string
 *
 *               password:
 *                 type: string
 *
 *               companyName:
 *                 type: string
 *
 *               companyDescription:
 *                 type: string
 *
 *               companyEmail:
 *                 type: string
 *
 *               companyPhone:
 *                 type: string
 *
 *               companyAddress:
 *                 type: string
 *
 *               companyCity:
 *                 type: string
 *
 *               companyState:
 *                 type: string
 *
 *               companyCountry:
 *                 type: string
 *
 *               industry:
 *                 type: string
 *
 *               companySize:
 *                 type: string
 *
 *               foundedYear:
 *                 type: integer
 *
 *               gstNumber:
 *                 type: string
 *
 *               companyRegistrationNumber:
 *                 type: string
 *
 *               hrDesignation:
 *                 type: string
 *
 *               companyLogo:
 *                 type: string
 *                 format: binary
 *
 *               gstCertificate:
 *                 type: string
 *                 format: binary
 *
 *               registrationCertificate:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Recruiter Registered Successfully
 */

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
