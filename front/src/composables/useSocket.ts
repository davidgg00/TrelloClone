// src/composables/useSocket.ts

import { ref, onMounted, onBeforeUnmount } from "vue";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const socket = ref<Socket | null>(null);
  const clientId = ref<string | null>(null);

  const connect = (url: string) => {
    socket.value = io(url, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.value.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
      clientId.value = socket.value?.id || null;
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
    }
  };

  onMounted(() => {
    connect(import.meta.env.VITE_SOCKET_URL);
  });

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    socket,
    clientId,
  };
}
