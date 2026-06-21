import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { application } from "express";

const registerUser = asyncHandler(async (req, res) => {

    //get  the user innformation 

    const { username, fullName, email, mobile, password } = req.body
    console.log(username, fullName, email, mobile, password);

    //validation for all things  
    if (
        [username, fullName, email, mobile, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "username already existx")

    }

    //email mobile varification with the otp by node mailer
    //crate the user obj 

    const user = await User.create({
        userName: username.toLowerCase(),
        fullName: fullName.toLowerCase(),
        email,
        mobile,
        password
    })

    //remove pass and rfresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"

    )
    // check for the user creation 

    if (!createdUser) {
        throw new ApiError(500, "user not crated somting went worong")

    }

    //return responce

    return res.status(201).json(
        new ApiResponce(200, createdUser, "user registerd successfully")
    )

})

export { registerUser }