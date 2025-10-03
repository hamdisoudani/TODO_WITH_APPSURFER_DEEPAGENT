'use client';

import { useState, useEffect } from 'react';
import { Todo, Category } from '@/types/todo';
import { storage } from '@/lib/storage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
    const loadedTodos = storage.getTodos();
    const loadedCategories = storage.getCategories();
    
    setTodos(loadedTodos.sort((a: Todo, b: Todo) => a.order - b.order));
    setCategories(loadedCategories);

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'todos') {
        const newTodos = e.newValue ? JSON.parse(e.newValue) : [];
        setTodos(newTodos.sort((a: Todo, b: Todo) => a.order - b.order));
      }
      if (e.key === 'categories') {
        const newCategories = e.newValue ? JSON.parse(e.newValue) : [];
        setCategories(newCategories);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: todos.length,
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    storage.saveTodos(newTodos);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const newTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    );
    setTodos(newTodos);
    storage.saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    const reorderedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));
    setTodos(reorderedTodos);
    storage.saveTodos(reorderedTodos);
  };

  const reorderTodos = (oldIndex: number, newIndex: number) => {
    const newTodos = Array.from(todos);
    const [reorderedItem] = newTodos.splice(oldIndex, 1);
    newTodos.splice(newIndex, 0, reorderedItem);
    
    const reorderedWithId = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    setTodos(reorderedWithId);
    storage.saveTodos(reorderedWithId);
  };

  const toggleComplete = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      updateTodo(id, { completed: !todo.completed });
    }
  };

  return {
    todos,
    categories,
    addTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    toggleComplete,
  };
}