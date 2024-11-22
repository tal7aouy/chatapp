# Real-Time Chat Application

A real-time chat application built with Vue.js, Fastify, and Socket.IO that allows users to create chat rooms and communicate in real-time.

## Features

- 🚀 Real-time messaging
- 🔒 Private chat rooms
- 🔗 Shareable room links
- 👥 User presence detection
- 🔄 Message rate limiting
- 📱 Responsive design

## Tech Stack

- **Frontend:**
  - Vue.js 3
  - Socket.IO Client
  - Tailwind CSS

- **Backend:**
  - Fastify
  - Socket.IO Server
  - TypeScript

## Prerequisites

- Node.js (v20)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tal7aouy/chatapp
cd chatapp
```

2. Install dependencies:
```bash
# Install backend dependencies
cd api
yarn install

# Install frontend dependencies
cd client
yarn install
```

## Running the Application

1. Start the backend server:
```bash
cd api
yarn dev
```
The server will start on `http://localhost:8000`

2. Start the frontend development server:
```bash
cd client
yarn dev
```
The client will be available at `http://localhost:3000`

## Usage

1. Open the application in your browser
2. You'll automatically be assigned to a new chat room or join an existing one via URL
3. Share the room link with others to invite them to the chat
4. Start chatting!

## Features in Detail

### Chat Rooms
- Automatic room creation with unique IDs
- Join existing rooms via shareable links
- Real-time message synchronization

### Message System
- Real-time message delivery
- Visual distinction between sent and received messages
- Rate limiting (10 messages per minute per user)

### User Interface
- Clean and responsive design
- Message history display
- Easy-to-use input system
- Copy-to-clipboard room sharing

## Security Features

- CORS protection
- Message rate limiting
- Automatic user authentication

## Socket Events

- `joinRoom` - Join a specific chat room
- `message` - Send/receive messages
- `authenticate` - User authentication
- `createRoom` - Create a new chat room
- `leaveRoom` - Leave current room
- `disconnect` - Handle user disconnection
