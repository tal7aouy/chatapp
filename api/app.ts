import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import ip from 'ip';
import { v4 as uuidv4 } from 'uuid';
import chatRoutes from "./routes/chatRoutes";

const fastify: FastifyInstance = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {},
    },
  },
});

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST'],
});
fastify.register(chatRoutes);

fastify.get("/", (req, res) => {
  res.send("API is running");
});

const start = async () => {
  try {
    const port = 8000;
    await fastify.listen({ host: '0.0.0.0', port });

    const io = new Server(fastify.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      }
    });

    io.on('connection', (socket) => {
      console.log('New socket.io connection');

      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });
      socket.on('authenticate', (userData) => {
        socket.data.user = userData;
        socket.emit('authenticated', { status: 'success' });
      });
      socket.on('createRoom', (roomName) => {
        const roomId = uuidv4();
        socket.join(roomId);
        io.emit('roomCreated', { roomId, roomName });
      });

      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('userLeft', socket.data.user);
      });
      const onlineUsers = new Set();

      socket.on('connect', () => {
        onlineUsers.add(socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers));
      });
      
      socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers));
      });
      
      socket.on('message', (message) => {
        const rooms = Array.from(socket.rooms);
        const currentRoomId = rooms.find(room => room !== socket.id);

        if (currentRoomId) {
          io.to(currentRoomId).emit('message', {
            timestamp: new Date().toISOString(),
            data: message,
            senderId: socket.id
          });
        } else {
          console.error('No room ID found for the socket.');
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket.io connection closed');
      });
    });

    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Server is also accessible at http://${ip.address()}:${port}`);
    console.log(fastify.printRoutes());
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();