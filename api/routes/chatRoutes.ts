import { FastifyInstance } from "fastify";
import { ChatController } from "../controllers/ChatController";

const chatController = new ChatController();

export default async function chatRoutes(fastify: FastifyInstance) {
  fastify.post("/chat/send", chatController.sendMessage);
  fastify.get("/chat/history", chatController.getChatHistory);
}