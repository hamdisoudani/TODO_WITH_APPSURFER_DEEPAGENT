export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type Priority = Todo['priority'];