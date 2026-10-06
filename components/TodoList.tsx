import type { Todo } from "@/lib/types";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  today: string;
  /** Shown instead of the list when there is nothing to show. */
  emptyMessage: string;
  onToggle: (id: string, completed: boolean) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, today, emptyMessage, onToggle, onRename, onDelete }: Props) {
  if (todos.length === 0) {
    return <p className="empty">{emptyMessage}</p>;
  }
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          today={today}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
