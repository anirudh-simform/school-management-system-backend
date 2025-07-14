import { PrismaClient } from "../../../generated/prisma/index.js";
import { JwtPayload } from "jsonwebtoken";
import { MessageDto } from "./models/messages.model.js";
import { Socket } from "socket.io";

const prisma = new PrismaClient();
export async function onMessage(
    socket: Socket,
    user: JwtPayload,
    messageDto: MessageDto
) {
    const createdMessage = await prisma.message.create({
        data: {
            content: messageDto.content,
            conversation: {
                connect: {
                    id: messageDto.conversationId,
                },
            },
            sender: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    return createdMessage;
}
