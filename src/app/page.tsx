'use client';

import { Header } from '@/components/header';
import { TodoList } from '@/components/todo-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TodoList />
      </main>
    </div>
  );
}