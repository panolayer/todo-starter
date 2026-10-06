"use client";

import { useState } from "react";
import { daysUntil, isDueSoon, isOverdue } from "@/lib/dates";
import type { Todo } from "@/lib/types";

interface Props {
  todo: Todo;
  /** Today's calendar day (YYYY-MM-DD), used for due-date badges. */
  today: string;
  onToggle: (id: string, completed: boolean) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

function dueLabel(todo: Todo, today: string): string {
  if (todo.dueDate === null) return "";
  const days = daysUntil(todo.dueDate, today);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 0) return "Overdue";
  return `Due ${todo.dueDate}`;
}

export function TodoItem({ todo, today, onToggle, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function startEditing() {
    setDraft(todo.title);
    setEditing(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (title && title !== todo.title) onRename(todo.id, title);
    setEditing(false);
  }

  const dueClass = isOverdue(todo, today) ? "overdue" : isDueSoon(todo, today) ? "soon" : "";

  if (editing) {
    return (
      <li className="todo-item editing">
        <form className="edit-form" onSubmit={save}>
          <input
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            aria-label="Todo title"
            maxLength={200}
            autoFocus
          />
          <button className="text-button" type="submit">
            Save
          </button>
          <button className="text-button" type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

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
      <span className={`chip priority-${todo.priority}`}>{todo.priority}</span>
      {todo.dueDate && <span className={`chip due ${dueClass}`}>{dueLabel(todo, today)}</span>}
      <button className="text-button" onClick={startEditing} aria-label={`Edit "${todo.title}"`}>
        Edit
      </button>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
      >
        ×
      </button>
    </li>
  );
}
