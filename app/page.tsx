"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateTodoInput, Todo } from "@/lib/types";
import type { StatusFilter } from "@/lib/filters";
import type { TodoSummary } from "@/lib/stats";
import { toDateKey } from "@/lib/dates";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";
import { Toolbar } from "@/components/Toolbar";

const PAGE_SIZE = 20;
const EMPTY_SUMMARY: TodoSummary = { total: 0, active: 0, completed: 0, allDone: false };

// The home page is a thin client that talks to the API routes under
// /api/todos. It never imports the data layer directly — the network boundary
// keeps the frontend and backend cleanly separated.
export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [matched, setMatched] = useState(0);
  const [summary, setSummary] = useState<TodoSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const today = toDateKey(new Date());

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      const params = new URLSearchParams({ status, q: query, limit: String(limit) });
      const res = await fetch(`/api/todos?${params}`, { signal });
      const data = await res.json();
      setTodos(data.todos ?? []);
      setMatched(data.matched ?? 0);
      setSummary(data.summary ?? EMPTY_SUMMARY);
      setLoading(false);
    },
    [status, query, limit],
  );

  // Refetch whenever the filter, search, or page size changes. A newer request
  // aborts the previous one so a slow response can never overwrite a newer list.
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal).catch((err) => {
      if (err.name !== "AbortError") throw err;
    });
    return () => controller.abort();
  }, [refresh]);

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

  async function clearCompleted() {
    await fetch("/api/todos", { method: "DELETE" });
    await refresh();
  }

  function changeStatus(next: StatusFilter) {
    setStatus(next);
    setLimit(PAGE_SIZE);
  }

  function changeQuery(next: string) {
    setQuery(next);
    setLimit(PAGE_SIZE);
  }

  const filtered = status !== "all" || query.trim() !== "";

  return (
    <main className="container">
      <header className="header">
        <h1>Todos</h1>
        <p className="subtitle">{loading ? "Loading…" : `${summary.active} left to do`}</p>
      </header>
      {summary.allDone && (
        <p className="all-done" role="status">
          All done — nice work!
        </p>
      )}
      <AddTodoForm onAdd={addTodo} defaultPriority="medium" />
      <Toolbar
        status={status}
        query={query}
        summary={summary}
        onStatusChange={changeStatus}
        onQueryChange={changeQuery}
      />
      <TodoList
        todos={todos}
        today={today}
        emptyMessage={
          filtered ? "No todos match this view." : "Nothing here yet — add your first todo above."
        }
        onToggle={(id, completed) => updateTodo(id, { completed })}
        onRename={(id, title) => updateTodo(id, { title })}
        onDelete={removeTodo}
      />
      {todos.length < matched && (
        <button className="show-more" type="button" onClick={() => setLimit(limit + PAGE_SIZE)}>
          Show more
        </button>
      )}
      {summary.completed > 0 && (
        <footer className="list-footer">
          <button className="text-button" type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </footer>
      )}
    </main>
  );
}
