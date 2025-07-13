import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { CreateConversationDto } from "./models/conversation.model.js";

const prisma = new PrismaClient();

export const createConversationPOST = asyncHandler(
    async function createConversation(
        req: Request<{}, {}, CreateConversationDto>,
        res: Response
    ) {
        if (req.user && typeof req.user !== "string") {
            const { name, participantIds, isGroup } = req.body;
            if (!req.user.id) {
                throw new Error("User not authenticated");
            }
            const participants = [...new Set([...participantIds, req.user.id])];
            const participantsList = participants.map((id) => ({ id }));

            const inclusionsInResponse = {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                email: true,
                            },
                        },
                    },
                },
            };

            const createdConversation = await prisma.conversation.create({
                data: {
                    ...(name && { name }),
                    isGroup: isGroup || false,
                    participants: {
                        create: participantsList.map((participant) => ({
                            user: {
                                connect: participant,
                            },
                        })),
                    },
                },

                include: {
                    ...inclusionsInResponse,
                },
            });

            res.status(201).json({
                created: createdConversation,
            });
        }
    }
);
