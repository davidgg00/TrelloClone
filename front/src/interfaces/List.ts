import { Task } from "./Task";

export interface List {
  id: number;
  title: string;
  boardId: number;
  tasks?: Task[];
  position: number;
}
