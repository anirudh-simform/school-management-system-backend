import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { InvalidTokenError } from "../../errors/errors.js";
import { GetConversationsQueryParams } from "./models/conversation.model.js";
import { getPaginationParams } from "../shared/pagination.utility.js";

const prisma = new PrismaClient();

export const getAllConversationsGET = asyncHandler(
    async function getAllConversations(req: Request, res: Response) {
        if (typeof req.user == "string") {
            throw new InvalidTokenError("Access Token is invalid");
        }

        const queryParams = req.query as unknown as GetConversationsQueryParams;
        const { skip, take } = getPaginationParams(
            queryParams.pageNumber,
            queryParams.pageSize
        );

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: req.user!.id!,
                    },
                },
                schoolId: req.user!.schoolId!,
            },

            skip,
            take,

            orderBy: {
                lastMessageAt: "desc",
            },

            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                firstname: true,
                                lastname: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        sender: {
                            select: {
                                firstname: true,
                                lastname: true,
                            },
                        },
                    },
                    take: 1,
                },
            },
        });

        res.status(200).json({
            fetch: conversations,
        });
    }
);
