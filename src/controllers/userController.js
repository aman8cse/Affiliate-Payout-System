import asyncHandler from "../middleware/asyncHandler.js";

import userService from "../services/userService.js";

import ApiResponse from "../utils/ApiResponse.js";

export const createUser = asyncHandler(async (req, res) => {

    const user = await userService.createUser(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "User created successfully",
            user
        )
    );

});

export const getUserById = asyncHandler(async (req, res) => {

    const user = await userService.getUserById(
        req.params.userId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully",
            user
        )
    );

});