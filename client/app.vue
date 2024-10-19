<template>
  <div class="container mx-auto p-4 flex flex-col h-screen">
    <h1 class="text-2xl font-bold mb-4">Chat Application</h1>

    <div class="mt-4 h-64 overflow-y-auto border p-2 flex-grow">
      <div v-for="(msg, index) in messages" :key="index" class="mb-2" :class="{'bg-blue-200': msg.sender === 'receiver', 'bg-white': msg.sender === 'sender', 'text-right': msg.sender === 'sender', 'text-left': msg.sender === 'receiver'}">
        <strong>{{ formatDate(msg.timestamp) }}:</strong> {{ msg.data }}
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        class="w-full p-2 border rounded"
      />
    </div>
    <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 rounded">
      Send
    </button>
    
    <div v-if="roomId" class="mt-4">
      <p>Your Room ID: <strong>{{ roomId }}</strong></p>
      <p>
        Share this link: 
        <a :href="shareableLink" target="_blank">{{ shareableLink }}</a>
      </p>
      <button @click="copyLink" class="bg-green-500 text-white px-4 py-2 rounded">
        Copy Link
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const socket = ref(null);
const message = ref('');
const messages = ref([]);
const roomId = ref('');
const shareableLink = ref('');

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
}

onMounted(() => {
  if (process.client) {
    connectSocket();
  }
});

function connectSocket() {
  socket.value = io('http://localhost:8000');

  socket.value.on('connect', () => {
    console.log('Socket.io connected');

    const urlParams = new URLSearchParams(window.location.search);
    const existingRoomId = urlParams.get('roomId');

    if (existingRoomId) {
      roomId.value = existingRoomId;
      shareableLink.value = `${window.location.origin}/chat?roomId=${roomId.value}`;
      socket.value.emit('joinRoom', roomId.value);
    } else {
      const newRoomId = uuidv4();
      roomId.value = newRoomId;
      shareableLink.value = `${window.location.origin}/chat?roomId=${roomId.value}`;
      socket.value.emit('joinRoom', roomId.value);
    }
  });

  socket.value.on('message', (msg) => {
    console.log('Received message:', msg);
    messages.value.push(msg);
  });

  socket.value.on('disconnect', () => {
    console.log('Socket.io disconnected');
  });
}

function sendMessage() {
  if (message.value.trim() && socket.value && socket.value.connected) {
    socket.value.emit('message', message.value);
    message.value = '';
  }
}

function copyLink() {
  navigator.clipboard.writeText(shareableLink.value).then(() => {
    alert('Link copied to clipboard!');
  });
}

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>