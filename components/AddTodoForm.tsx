"use client";

import { useState } from "react";

interface Props {
  onAdd: (title: string) => void | Promise<void>;
}

// A small controlled form. Note the client trims and drops empty titles, but
// that is only a convenience — the API is the real trust boundary and must
// validate input on its own (a direct POST bypasses this form entirely).
export function AddTodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await onAdd(trimmed);
    setTitle("");
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        className="add-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo title"
      />
      <button className="add-button" type="submit">
        Add
      </button>
    </form>
  );
}
