import api from "./axios";

export const getBoards = async () => {
  try {
    const response = await api.get(`/boards`);
    return response.data;
  } catch (error) {
    console.error("Get boards failed", error);
    throw new Error("Get boards failed");
  }
};
