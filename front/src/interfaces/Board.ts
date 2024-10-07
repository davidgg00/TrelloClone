import { List } from "./List";

export interface Board {
  id: number;
  title: string;
  description?: string;
  lists?: List[];
}
