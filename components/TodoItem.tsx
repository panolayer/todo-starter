import type { Todo } from "@/lib/types";

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
        />
        <span className="todo-title">{todo.title}</span>
      </label>
      <button className="todo-delete" onClick={() => onDelete(todo.id)} aria-label="Delete todo">
        ×
      </button>
    </li>
  );
}
