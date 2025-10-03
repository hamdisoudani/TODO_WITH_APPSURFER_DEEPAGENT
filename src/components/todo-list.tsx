'use client';

import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TodoItem } from './todo-item';
import { AddTodo } from './add-todo';
import { useTodos } from '@/hooks/use-todos';
import { Todo } from '@/types/todo';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';

export function TodoList() {
  const { todos, categories, reorderTodos } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'manual' | 'priority' | 'dueDate' | 'createdAt'>('manual');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && sortBy === 'manual') {
      const oldIndex = filteredTodos.findIndex(todo => todo.id === active.id);
      const newIndex = filteredTodos.findIndex(todo => todo.id === over.id);
      
      reorderTodos(oldIndex, newIndex);
    }
  };

  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
      const matchesCompleted = showCompleted || !todo.completed;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.order - b.order;
      }
    });

  const handleEdit = (todo: Todo) => {
    // For now, we'll just open the add dialog (edit functionality to be implemented)
    console.log('Edit todo:', todo);
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-800/50">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/50">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50 dark:border-green-800/50">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/50 dark:border-red-800/50">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/50 backdrop-blur-sm"
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: 'manual' | 'priority' | 'dueDate' | 'createdAt') => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="completed"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="completed" className="text-sm cursor-pointer">
              Show completed
            </label>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Todo List */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-3'}>
        {filteredTodos.length === 0 ? (
          <Card className="p-8 text-center bg-card/50 backdrop-blur-sm">
            <div className="text-muted-foreground">
              {todos.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">No todos yet</h3>
                  <p className="text-sm">Click &quot;Add Todo&quot; to get started!</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">No todos found</h3>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </Card>
        ) : sortBy === 'manual' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={handleEdit}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Add Todo Dialog */}
      <AddTodo 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}