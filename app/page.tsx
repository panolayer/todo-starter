"use client";

import { useEffect, useState } from "react";
import type { CreateTodoInput, Todo } from "@/lib/types";
import { toDateKey } from "@/lib/dates";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";

// The home page is a thin client that talks to the API routes under
// /api/todos. It never imports the data layer directly — the network boundary
// keeps the frontend and backend cleanly separated.
export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const today = toDateKey(new Date());

  async function refresh() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data.todos ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addTodo(input: CreateTodoInput) {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    await refresh();
  }

  async function updateTodo(id: string, patch: Partial<Todo>) {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await refresh();
  }

  async function removeTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    await refresh();
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="container">
      <header className="header">
        <h1>Todos</h1>
        <p className="subtitle">{loading ? "Loading…" : `${remaining} remaining`}</p>
      </header>
      <AddTodoForm onAdd={addTodo} defaultPriority="medium" />
      <TodoList
        todos={todos}
        today={today}
        onToggle={(id, completed) => updateTodo(id, { completed })}
        onRename={(id, title) => updateTodo(id, { title })}
        onDelete={removeTodo}
      />
    </main>
  );
}
