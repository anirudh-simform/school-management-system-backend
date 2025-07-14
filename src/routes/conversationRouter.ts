import { Router } from "express";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { createConversationPOST } from "../controllers/conversation/createConversationPOST.js";
import { getAllConversationsGET } from "../controllers/conversation/getAllConversationsGET.js";
import { getAllMessagesGET } from "../controllers/messages/getAllMessagesGET.js";
import { getAllUsersAndConversationsGET } from "../controllers/conversation/getAllUsersAndConversationsGET.js";

export const conversationRouter = Router();

conversationRouter.post("/", verifyAccessToken, createConversationPOST);
conversationRouter.get("/", verifyAccessToken, getAllConversationsGET);
conversationRouter.get("/:id/messages", verifyAccessToken, getAllMessagesGET);
conversationRouter.get(
    "/search",
    verifyAccessToken,
    getAllUsersAndConversationsGET
);
