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

export const createBoard = async ({
  title,
  is_public,
}: {
  title: string;
  is_public: boolean;
}) => {
  try {
    const response = await api.post(`/boards`, {
      title,
      is_public,
    });
    return response.data;
  } catch (error) {
    console.error("Create board failed", error);
    throw new Error("Create board failed");
  }
};

export const getListsAndTasks = async (boardId: number) => {
  try {
    const response = await api.get(`/boards/${boardId}/lists`);
    return response.data;
  } catch (error) {
    console.error("Get lists and tasks failed", error);
    throw new Error("Get lists and tasks failed");
  }
};
