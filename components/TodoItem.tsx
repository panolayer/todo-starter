"use client";

import { useState } from "react";
import { daysUntil, isDueSoon, isOverdue } from "@/lib/dates";
import { formatDay, type Locale, type MessageKey } from "@/lib/i18n";
import type { Todo } from "@/lib/types";
import { useSettings, useT } from "./SettingsProvider";

interface Props {
  todo: Todo;
  /** Today's calendar day (YYYY-MM-DD), used for due-date badges. */
  today: string;
  onToggle: (id: string, completed: boolean) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

type Translate = (key: MessageKey, values?: Record<string, string | number>) => string;

function dueLabel(dueDate: string, today: string, locale: Locale, t: Translate): string {
  const days = daysUntil(dueDate, today);
  if (days === 0) return t("due.today");
  if (days === 1) return t("due.tomorrow");
  if (days < 0) return t("due.overdue");
  return t("due.on", { date: formatDay(locale, dueDate) });
}

export function TodoItem({ todo, today, onToggle, onRename, onDelete }: Props) {
  const { settings } = useSettings();
  const t = useT();
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
            aria-label={t("item.titleLabel")}
            maxLength={200}
            autoFocus
          />
          <button className="text-button" type="submit">
            {t("item.save")}
          </button>
          <button className="text-button" type="button" onClick={() => setEditing(false)}>
            {t("item.cancel")}
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
      <span className={`chip priority-${todo.priority}`}>{t(`priority.${todo.priority}`)}</span>
      {todo.dueDate && (
        <span className={`chip due ${dueClass}`}>
          {dueLabel(todo.dueDate, today, settings.language, t)}
        </span>
      )}
      <button
        className="text-button"
        onClick={startEditing}
        aria-label={t("item.editLabel", { title: todo.title })}
      >
        {t("item.edit")}
      </button>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        aria-label={t("item.deleteLabel", { title: todo.title })}
      >
        ×
      </button>
    </li>
  );
}
