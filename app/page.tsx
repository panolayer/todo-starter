"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateTodoInput, Todo } from "@/lib/types";
import type { StatusFilter } from "@/lib/filters";
import type { TodoSummary } from "@/lib/stats";
import { toDateKey } from "@/lib/dates";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";
import { Toolbar } from "@/components/Toolbar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useSettings, useT } from "@/components/SettingsProvider";

const PAGE_SIZE = 20;
const EMPTY_SUMMARY: TodoSummary = { total: 0, active: 0, completed: 0, allDone: false };

// The home page is a thin client that talks to the API routes under
// /api/todos. It never imports the data layer directly — the network boundary
// keeps the frontend and backend cleanly separated.
export default function HomePage() {
  const { settings } = useSettings();
  const t = useT();
  const [showSettings, setShowSettings] = useState(false);
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

  // Send the changed fields to PATCH /api/todos/:id, then reload the list.
  async function patchTodo(id: string, patch: Partial<Todo>) {
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

  async function completeAll() {
    await fetch("/api/todos/complete", { method: "POST" });
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
        <div>
          <h1>{t("app.title")}</h1>
          <p className="subtitle">
            {loading ? t("app.loading") : t("app.leftToDo", { count: summary.active })}
          </p>
        </div>
        <div className="header-actions">
          <a className="text-button" href="/api/todos/export" download="todos.json">
            {t("app.export")}
          </a>
          <button
            className="text-button"
            type="button"
            aria-expanded={showSettings}
            onClick={() => setShowSettings(!showSettings)}
          >
            {t("app.settings")}
          </button>
        </div>
      </header>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {summary.allDone && (
        <p className="all-done" role="status">
          {t("app.allDone")}
        </p>
      )}
      {/* Keyed so the form picks up a new default priority right away. */}
      <AddTodoForm
        key={settings.defaultPriority}
        onAdd={addTodo}
        defaultPriority={settings.defaultPriority}
      />
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
        emptyMessage={filtered ? t("list.noMatches") : t("list.empty")}
        onToggle={(id, completed) => patchTodo(id, { completed })}
        onRename={(id, title) => patchTodo(id, { title })}
        onDelete={removeTodo}
      />
      {todos.length < matched && (
        <button className="show-more" type="button" onClick={() => setLimit(limit + PAGE_SIZE)}>
          {t("list.showMore")}
        </button>
      )}
      {(summary.active > 0 || summary.completed > 0) && (
        <footer className="list-footer">
          {summary.active > 0 && (
            <button className="text-button" type="button" onClick={completeAll}>
              {t("list.completeAll")}
            </button>
          )}
          {summary.completed > 0 && (
            <button className="text-button" type="button" onClick={clearCompleted}>
              {t("list.clearCompleted")}
            </button>
          )}
        </footer>
      )}
    </main>
  );
}
