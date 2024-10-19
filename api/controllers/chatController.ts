import { FastifyRequest, FastifyReply } from "fastify";

export class ChatController {
  private chatHistory: Array<{ timestamp: string; data: string }> = [];
  async sendMessage(req: FastifyRequest, reply: FastifyReply) {
    const { message } = req.body as { message: string };

    if (!message) {
      return reply.status(400).send({ error: "Message is required" });
    }

    const chatMessage = {
      timestamp: new Date().toISOString(),
      data: message,
    };

    this.chatHistory.push(chatMessage); // Store message in chat history
    reply.send({ success: true, message: chatMessage });
  }

  async getChatHistory(req: FastifyRequest, reply: FastifyReply) {
    reply.send(this.chatHistory);
  }
}