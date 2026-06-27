import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { Recruiter } from "../models/Recruiter.model.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { uploadFileONCloudinary } from "../utils/flieupload.js";

// Blocked personal email domains
const BLOCKED_EMAIL_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "protonmail.com",
    "icloud.com"
];

// Helper function to validate email domain
const validateEmailDomain = (email) => {
    if (!email || typeof email !== "string" || email.trim() === "") {
        return false;
    }
    const emailParts = email.trim().toLowerCase().split("@");
    if (emailParts.length !== 2) {
        return false;
    }
    const domain = emailParts[1];
    return !BLOCKED_EMAIL_DOMAINS.includes(domain);
};

const registerRecruiter = asyncHandler(async (req, res) => {
    // DEBUG: Log entire request
    console.log("\n=== RECRUITER REGISTRATION REQUEST ===");
    console.log("req.body keys:", Object.keys(req.body));
    console.log("req.body:", req.body);
    console.log("req.files keys:", req.files ? Object.keys(req.files) : "No files");

    // Normalize field keys by trimming spaces (Postman sometimes adds trailing spaces)
    const normalizedBody = {};
    for (const [key, value] of Object.entries(req.body)) {
        const trimmedKey = key.trim();
        normalizedBody[trimmedKey] = typeof value === "string" ? value.trim() : value;
    }
    console.log("Normalized body:", normalizedBody);

    // Step 1: Get recruiter information from normalized body
    const {
        username,
        fullName,
        email,
        mobile,
        password,
        companyName,
        companyDescription,
        companyWebsite,
        companyEmail,
        companyPhone,
        companyAddress,
        companyCity,
        companyState,
        companyCountry,
        industry,
        companySize,
        foundedYear,
        gstNumber,
        companyRegistrationNumber,
        hrDesignation
    } = normalizedBody;

    // Validation: Check all required fields are present and not empty
    const requiredFields = {
        username,
        fullName,
        email,
        mobile,
        password,
        companyName,
        companyDescription,
        companyEmail,
        companyPhone,
        companyAddress,
        companyCity,
        companyState,
        companyCountry,
        industry,
        companySize,
        foundedYear,
        companyRegistrationNumber,
        hrDesignation
    };

    // Check for missing or empty required fields (companyWebsite is optional)
    const requiredFieldNames = [
        'username', 'fullName', 'email', 'mobile', 'password',
        'companyName', 'companyDescription', 'companyEmail', 'companyPhone',
        'companyAddress', 'companyCity', 'companyState', 'companyCountry',
        'industry', 'companySize', 'foundedYear', 'companyRegistrationNumber', 'hrDesignation'
    ];

    const missingFields = [];
    for (const fieldName of requiredFieldNames) {
        const fieldValue = requiredFields[fieldName];
        if (fieldValue === undefined || fieldValue === null) {
            missingFields.push(`${fieldName} (missing)`);
        } else if (typeof fieldValue === "string" && fieldValue.trim() === "") {
            missingFields.push(`${fieldName} (empty)`);
        }
    }

    if (missingFields.length > 0) {
        console.error("Missing fields:", missingFields);
        throw new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate company email domain
    if (!validateEmailDomain(companyEmail?.trim())) {
        throw new ApiError(400, "Please register using your official company email address.");
    }

    // Check for duplicate username - convert to lowercase safely
    const existingUser = await User.findOne({
        $or: [
            { userName: username?.trim().toLowerCase() },
            { email: email?.trim().toLowerCase() }
        ]
    });

    if (existingUser) {
        throw new ApiError(409, "Username or email already exists");
    }

    // Check for duplicate company email
    const existingRecruiter = await Recruiter.findOne({
        $or: [
            { companyEmail: companyEmail?.trim().toLowerCase() },
            { companyRegistrationNumber: companyRegistrationNumber?.trim() }
        ]
    });

    if (existingRecruiter) {
        throw new ApiError(409, "Company email or registration number already registered");
    }

    // Step 2: Upload files to cloudinary
    // With upload.fields(), files are in req.files as object with fieldname as key
    const companyLogoPath = req.files?.companyLogo?.[0]?.path;
    const gstCertificatePath = req.files?.gstCertificate?.[0]?.path;
    const registrationCertificatePath = req.files?.registrationCertificate?.[0]?.path;

    // Validate file uploads
    if (!companyLogoPath || !gstCertificatePath || !registrationCertificatePath) {
        throw new ApiError(400, "Company logo, GST certificate, and registration certificate are required");
    }

    //testing code 
    const companyLogoResponse = await uploadFileONCloudinary(companyLogoPath);
    console.log("Company Logo Response:", companyLogoResponse);

    const gstCertificateResponse = await uploadFileONCloudinary(gstCertificatePath);
    console.log("GST Response:", gstCertificateResponse);

    const registrationCertificateResponse = await uploadFileONCloudinary(registrationCertificatePath);
    console.log("Registration Response:", registrationCertificateResponse);

    if (!companyLogoResponse || !gstCertificateResponse || !registrationCertificateResponse) {
        throw new ApiError(500, "Failed to upload files. Please try again");
    }

    // Step 3: Create User document
    const user = await User.create({
        userName: username?.trim().toLowerCase(),
        fullName: fullName?.trim().toLowerCase(),
        email: email?.trim().toLowerCase(),
        mobile: mobile?.trim(),
        password,
        role: "recruiter"
    });

    // Remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User not created. Something went wrong");
    }

    // Step 4: Create RecruiterProfile document
    const recruiterProfile = await Recruiter.create({
        userId: createdUser._id,
        companyName: companyName?.trim(),
        companyDescription: companyDescription?.trim(),
        companyWebsite: companyWebsite?.trim().toLowerCase() || undefined,
        companyEmail: companyEmail?.trim().toLowerCase(),
        companyPhone: companyPhone?.trim(),
        companyAddress: companyAddress?.trim(),
        companyCity: companyCity?.trim(),
        companyState: companyState?.trim(),
        companyCountry: companyCountry?.trim(),
        industry: industry?.trim(),
        companySize: companySize?.trim(),
        foundedYear: parseInt(foundedYear),
        companyLogo: companyLogoResponse.url,
        gstNumber: gstNumber?.trim() || "",
        companyRegistrationNumber: companyRegistrationNumber?.trim(),
        hrDesignation: hrDesignation?.trim(),
        verificationDocuments: {
            gstCertificate: gstCertificateResponse.url,
            registrationCertificate: registrationCertificateResponse.url
        },
        verificationStatus: "pending"
    });

    if (!recruiterProfile) {
        throw new ApiError(500, "Recruiter profile not created. Something went wrong");
    }

    // Fetch complete recruiter data for response
    const completeRecruiterProfile = await Recruiter.findById(recruiterProfile._id).populate(
        "userId",
        "-password -refreshToken"
    );

    // Return response
    return res.status(201).json(
        new ApiResponce(
            201,
            {
                user: createdUser,
                recruiterProfile: completeRecruiterProfile
            },
            "Recruiter registered successfully. Your company profile is awaiting admin verification."
        )
    );
});

// Admin function to approve recruiter
const approveRecruiter = asyncHandler(async (req, res) => {
    const { recruiterId } = req.params;
    const adminId = req.user?._id; // Assumes admin info is in req.user

    if (!adminId) {
        throw new ApiError(401, "Unauthorized - Admin not authenticated");
    }

    if (!recruiterId) {
        throw new ApiError(400, "Recruiter ID is required");
    }

    // Find and update recruiter profile
    const recruiterProfile = await Recruiter.findByIdAndUpdate(
        recruiterId,
        {
            verificationStatus: "approved",
            verifiedBy: adminId,
            verifiedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate("userId", "-password -refreshToken");

    if (!recruiterProfile) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    return res.status(200).json(
        new ApiResponce(
            200,
            recruiterProfile,
            "Recruiter profile approved successfully"
        )
    );
});

// Admin function to reject recruiter
const rejectRecruiter = asyncHandler(async (req, res) => {
    const { recruiterId } = req.params;
    const { reason } = req.body;
    const adminId = req.user?._id; // Assumes admin info is in req.user

    if (!adminId) {
        throw new ApiError(401, "Unauthorized - Admin not authenticated");
    }

    if (!recruiterId) {
        throw new ApiError(400, "Recruiter ID is required");
    }

    if (!reason || reason.trim() === "") {
        throw new ApiError(400, "Rejection reason is required");
    }

    // Find and update recruiter profile
    const recruiterProfile = await Recruiter.findByIdAndUpdate(
        recruiterId,
        {
            verificationStatus: "rejected",
            verifiedBy: adminId,
            verifiedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate("userId", "-password -refreshToken");

    if (!recruiterProfile) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    return res.status(200).json(
        new ApiResponce(
            200,
            recruiterProfile,
            `Recruiter profile rejected. Reason: ${reason}`
        )
    );
});

// Get all pending recruiters (for admin dashboard)
const getPendingRecruiters = asyncHandler(async (req, res) => {
    const recruiters = await Recruiter.find({ verificationStatus: "pending" })
        .populate("userId", "-password -refreshToken")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponce(
            200,
            recruiters,
            `Found ${recruiters.length} pending recruiter(s)`
        )
    );
});

// Get all approved recruiters
const getApprovedRecruiters = asyncHandler(async (req, res) => {
    const recruiters = await Recruiter.find({ verificationStatus: "approved" })
        .populate("userId", "-password -refreshToken")
        .sort({ verifiedAt: -1 });

    return res.status(200).json(
        new ApiResponce(
            200,
            recruiters,
            `Found ${recruiters.length} approved recruiter(s)`
        )
    );
});

// Get all rejected recruiters
const getRejectedRecruiters = asyncHandler(async (req, res) => {
    const recruiters = await Recruiter.find({ verificationStatus: "rejected" })
        .populate("userId", "-password -refreshToken")
        .sort({ verifiedAt: -1 });

    return res.status(200).json(
        new ApiResponce(
            200,
            recruiters,
            `Found ${recruiters.length} rejected recruiter(s)`
        )
    );
});

// Get recruiter profile by ID
const getRecruiterProfile = asyncHandler(async (req, res) => {
    const { recruiterId } = req.params;

    if (!recruiterId) {
        throw new ApiError(400, "Recruiter ID is required");
    }

    const recruiterProfile = await Recruiter.findById(recruiterId)
        .populate("userId", "-password -refreshToken");

    if (!recruiterProfile) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    return res.status(200).json(
        new ApiResponce(
            200,
            recruiterProfile,
            "Recruiter profile fetched successfully"
        )
    );
});

export {
    registerRecruiter,
    approveRecruiter,
    rejectRecruiter,
    getPendingRecruiters,
    getApprovedRecruiters,
    getRejectedRecruiters,
    getRecruiterProfile
};
