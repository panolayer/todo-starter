"use client";

import { useState } from "react";
import { PRIORITIES, type CreateTodoInput, type Priority } from "@/lib/types";

interface Props {
  onAdd: (input: CreateTodoInput) => void | Promise<void>;
  /** Priority preselected for each new todo. */
  defaultPriority: Priority;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// A small controlled form. Note the client trims and drops empty titles, but
// that is only a convenience — the API is the real trust boundary and must
// validate input on its own (a direct POST bypasses this form entirely).
export function AddTodoForm({ onAdd, defaultPriority }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [dueDate, setDueDate] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await onAdd({ title: trimmed, priority, dueDate: dueDate || null });
    setTitle("");
    setPriority(defaultPriority);
    setDueDate("");
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <div className="add-field add-field-title">
        <label className="field-label" htmlFor="new-todo-title">
          Title
        </label>
        <input
          id="new-todo-title"
          className="add-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
        />
      </div>
      <div className="add-row">
        <div className="add-field">
          <label className="field-label" htmlFor="new-todo-priority">
            Priority
          </label>
          <select
            id="new-todo-priority"
            className="add-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="add-field">
          <label className="field-label" htmlFor="new-todo-due">
            Due date
          </label>
          <input
            id="new-todo-due"
            className="add-select"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button className="add-button" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
