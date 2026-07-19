import asyncHandler from "../middleware/asyncHandler.js";

import saleService from "../services/saleService.js";

import ApiResponse from "../utils/ApiResponse.js";

export const createSale = asyncHandler(async (req, res) => {

    const sale = await saleService.createSale({

        userId: req.body.userId,

        commissionAmount: req.body.commissionAmount

    });

    res.status(201).json(
        new ApiResponse(
            201,
            "Sale created successfully",
            sale
        )
    );

});

export const getSales = asyncHandler(async (req, res) => {

    const sales = await saleService.getSales();

    res.status(200).json(
        new ApiResponse(
            200,
            "Sales fetched successfully",
            sales
        )
    );

});

export const getSaleById = asyncHandler(async (req, res) => {

    const sale = await saleService.getSaleById(
        req.params.saleId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Sale fetched successfully",
            sale
        )
    );

});

export const confirmSale = asyncHandler(async (req, res) => {

    const sale = await saleService.confirmSale(
        req.params.saleId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Sale confirmed successfully",
            sale
        )
    );

});

export const rejectSale = asyncHandler(async (req, res) => {

    const sale = await saleService.rejectSale(
        req.params.saleId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Sale rejected successfully",
            sale
        )
    );

});