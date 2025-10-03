import { Todo, Category } from '@/types/todo';

const TODOS_KEY = 'todos';
const CATEGORIES_KEY = 'categories';

export const storage = {
  getTodos: (): Todo[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(TODOS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTodos: (todos: Todo[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  },

  getCategories: (): Category[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : getDefaultCategories();
  },

  saveCategories: (categories: Category[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },
};

function getDefaultCategories(): Category[] {
  return [
    { id: 'personal', name: 'Personal', color: '#3b82f6' },
    { id: 'work', name: 'Work', color: '#10b981' },
    { id: 'shopping', name: 'Shopping', color: '#f59e0b' },
    { id: 'health', name: 'Health', color: '#ef4444' },
  ];
}