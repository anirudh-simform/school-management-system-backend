import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { InvalidTokenError } from "../../errors/errors.js";
import {
    GetMessageQueryParams,
    GetMessageRouteParams,
} from "./models/messages.model.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

export const getAllMessagesGET = asyncHandler(async function getAllMessages(
    req: Request<GetMessageRouteParams, {}, {}>,
    res: Response
) {
    if (typeof req.user !== "string") {
        throw new InvalidTokenError("Invalid Access Token");
    }

    const queryParams = req.query as unknown as GetMessageQueryParams;

    const { skip, take } = getPaginationParams(
        queryParams.pageNumber,
        queryParams.pageSize
    );

    const messages = await prisma.message.findMany({
        where: {
            conversationId: req.params.conversationId,
        },

        skip,
        take,
        orderBy: {
            createdAt: "desc",
        },
    });

    res.status(200).json({
        fetch: messages,
    });
});
