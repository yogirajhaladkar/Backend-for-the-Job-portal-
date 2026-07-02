import { Router } from "express";
import { createJob } from "../controllers/job.controller.js";

const router = Router();

/**
 * @swagger
 * /jobs/create:
 *   post:
 *     summary: Create a new job posting
 *     description: Creates a new job posting independently without recruiter authentication or company integration.
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobTitle
 *               - jobDescription
 *               - employmentType
 *               - workMode
 *               - jobCategory
 *               - experienceLevel
 *               - minimumQualification
 *               - skills
 *               - salaryType
 *               - jobLocation
 *               - city
 *               - state
 *               - country
 *               - numberOfOpenings
 *               - applicationDeadline
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 example: Full Stack Developer
 *               jobDescription:
 *                 type: string
 *                 example: Build and maintain scalable web applications.
 *               employmentType:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Internship, Contract, Freelance]
 *                 example: Full-Time
 *               workMode:
 *                 type: string
 *                 enum: [Remote, Hybrid, On-site]
 *                 example: Hybrid
 *               jobCategory:
 *                 type: string
 *                 example: Software Development
 *               experienceLevel:
 *                 type: string
 *                 enum: [Fresher, Junior, Mid-Level, Senior]
 *                 example: Mid-Level
 *               minimumExperience:
 *                 type: integer
 *                 example: 2
 *               maximumExperience:
 *                 type: integer
 *                 example: 5
 *               minimumQualification:
 *                 type: string
 *                 example: B.Tech
 *               branch:
 *                 type: string
 *                 example: Computer Science
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Node.js", "Express", "MongoDB", "React"]
 *               salaryType:
 *                 type: string
 *                 enum: [Fixed, Range, Stipend]
 *                 example: Range
 *               minSalary:
 *                 type: number
 *                 example: 600000
 *               maxSalary:
 *                 type: number
 *                 example: 900000
 *               currency:
 *                 type: string
 *                 example: INR
 *               jobLocation:
 *                 type: string
 *                 example: Bengaluru
 *               city:
 *                 type: string
 *                 example: Bengaluru
 *               state:
 *                 type: string
 *                 example: Karnataka
 *               country:
 *                 type: string
 *                 example: India
 *               numberOfOpenings:
 *                 type: integer
 *                 example: 3
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               isInternship:
 *                 type: boolean
 *                 example: false
 *               stipend:
 *                 type: number
 *                 example: 20000
 *               internshipDuration:
 *                 type: string
 *                 example: 3 Months
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Health Insurance", "Work From Home", "Flexible Hours"]
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Closed, Expired]
 *                 example: Published
 *               visibility:
 *                 type: string
 *                 enum: [Public, Private]
 *                 example: Public
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post("/create", createJob);

export default router;
