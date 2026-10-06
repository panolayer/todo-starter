import type { Todo } from "@/lib/types";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  today: string;
  onToggle: (id: string, completed: boolean) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, today, onToggle, onRename, onDelete }: Props) {
  if (todos.length === 0) {
    return <p className="empty">Nothing here yet — add your first todo above.</p>;
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
