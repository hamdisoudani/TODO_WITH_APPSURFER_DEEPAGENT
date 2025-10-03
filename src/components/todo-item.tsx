'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Calendar } from 'lucide-react';
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/use-todos';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { toggleComplete, deleteTodo, categories } = useTodos();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const category = categories.find(cat => cat.id === todo.category);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': 
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium': 
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low': 
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(todo.id);
    }, 300);
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`
        p-4 cursor-move transition-all duration-300 hover:shadow-lg
        ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
        ${isDeleting ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        ${todo.completed ? 'opacity-75' : ''}
        relative overflow-hidden
        bg-card/50 backdrop-blur-sm border-0
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-blue-500/5 before:pointer-events-none
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleComplete(todo.id)}
          className="mt-1 shrink-0 data-[state=checked]:bg-purple-600"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-medium truncate ${
              todo.completed 
                ? 'line-through text-muted-foreground' 
                : 'text-foreground'
            }`}>
              {todo.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit(todo)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {todo.description && (
            <p className={`text-sm text-muted-foreground mb-3 ${
              todo.completed ? 'line-through' : ''
            }`}>
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant="secondary" 
              className={getPriorityColor(todo.priority)}
            >
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </Badge>

            {category && (
              <Badge 
                variant="secondary"
                className="gap-1"
                style={{ 
                  backgroundColor: `${category.color}20`, 
                  borderColor: category.color,
                  color: category.color 
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </Badge>
            )}

            {todo.dueDate && (
              <Badge 
                variant="outline" 
                className={`gap-1 ${isOverdue ? 'border-red-500 text-red-600 dark:text-red-400' : ''}`}
              >
                <Calendar className="h-3 w-3" />
                {format(new Date(todo.dueDate), 'MMM d')}
                {isOverdue && ' (Overdue)'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}