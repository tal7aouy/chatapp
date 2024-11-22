<template>
  <div class="container mx-auto p-4 flex flex-col h-screen">
    <h1 class="text-2xl font-bold mb-4">Chat Application</h1>

    <div class="mt-4 h-64 overflow-y-auto border p-2 flex-grow">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="mb-2 rounded pr-1 pl-1"
        :class="{
          'bg-blue-200 ml-auto w-1/6 p-2': msg.isOwnMessage,
          'bg-gray-200 mr-auto w-1/6 p-2': !msg.isOwnMessage,
          'text-center pl-5': msg.isOwnMessage,
          'text-center pr-5': !msg.isOwnMessage,
        }"
      >
        <strong>{{ msg.data }}</strong>
      </div>
    </div>

    <div class="my-4">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        class="w-full p-2 border rounded"
      />
    </div>
    <button
      @click="sendMessage"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Send
    </button>

    <div v-if="roomId" class="mt-4">
      <p>
        Your Room ID: <strong>{{ roomId }}</strong>
      </p>
      <button
        @click="copyLink"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Copy Link
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"

const socket = ref(null)
const message = ref("")
const messages = ref([])
const roomId = ref("")
const shareableLink = ref("")

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

onMounted(() => {
  if (process.client) {
    connectSocket()
  }
})

function connectSocket() {
  socket.value = io("http://localhost:8000")

  socket.value.on("connect", () => {
    console.log("Socket.io connected")

    const urlParams = new URLSearchParams(window.location.search)
    const existingRoomId = urlParams.get("roomId")

    if (existingRoomId) {
      roomId.value = existingRoomId
      shareableLink.value = `${window.location.origin}/chat?roomId=${roomId.value}`
      socket.value.emit("joinRoom", roomId.value)
    } else {
      const newRoomId = uuidv4()
      roomId.value = newRoomId
      shareableLink.value = `${window.location.origin}/chat?roomId=${roomId.value}`
      socket.value.emit("joinRoom", roomId.value)
    }
  })

  socket.value.on("message", (msg) => {
    console.log("Received message:", msg)
    messages.value.push({
      ...msg,
      sender: msg.isOwnMessage ? "You" : "Other",
    })
  })

  socket.value.on("disconnect", () => {
    console.log("Socket.io disconnected")
  })
}

function sendMessage() {
  if (message.value.trim() && socket.value && socket.value.connected) {
    socket.value.emit("message", message.value)
    message.value = ""
  }
}

function copyLink() {
  navigator.clipboard.writeText(shareableLink.value).then(() => {
    alert("Link copied to clipboard!")
  })
}

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>
