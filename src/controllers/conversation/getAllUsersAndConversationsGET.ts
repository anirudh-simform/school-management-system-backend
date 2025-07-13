import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { Request, Response } from "express";
import { BaseQueryParams } from "../../models/types.js";
import { InvalidTokenError } from "../../errors/errors.js";
import { getPaginationParams } from "../shared/pagination.utility.js";
import { getMessagingUserSearchResults } from "../../../generated/prisma/sql/getMessagingUserSearchResults.js";

const prisma = new PrismaClient();

export const getAllUsersAndConversationsGET = asyncHandler(
    async function getAllUsersAndConversations(req: Request, res: Response) {
        if (typeof req.user == "string") {
            throw new InvalidTokenError("Invalid Token");
        }

        const queryParams = req.query as unknown as BaseQueryParams;

        const { skip, take } = getPaginationParams(
            queryParams.pageNumber,
            queryParams.pageSize
        );

        const { offset, limit } = { offset: skip, limit: take };

        if ((req.user && !req.user.id) || !req.user?.schoolId) {
            throw new Error("Unauthorized access");
        }

        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const searchResult = await prisma.$queryRawTyped(
            getMessagingUserSearchResults(
                userId,
                schoolId,
                queryParams.query,
                limit,
                offset
            )
        );

        res.status(200).json({
            fetch: searchResult,
        });
    }
);
