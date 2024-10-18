// src/composables/useSocket.ts

import { ref, onBeforeUnmount } from "vue";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const socket = ref<Socket | null>(null);
  const clientId = ref<string | null>(null);

  const connect = (url: string, boardId: string) => {
    socket.value = io(url, {
      transports: ["websocket"],
      query: {
        boardId,
      },
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

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    socket,
    clientId,
    connect,
  };
}
