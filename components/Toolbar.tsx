import { STATUS_FILTERS, type StatusFilter } from "@/lib/filters";
import type { TodoSummary } from "@/lib/stats";
import { useT } from "./SettingsProvider";

interface Props {
  status: StatusFilter;
  query: string;
  summary: TodoSummary;
  onStatusChange: (status: StatusFilter) => void;
  onQueryChange: (query: string) => void;
}

function countFor(status: StatusFilter, summary: TodoSummary): number {
  if (status === "active") return summary.active;
  if (status === "completed") return summary.completed;
  return summary.total;
}

export function Toolbar({ status, query, summary, onStatusChange, onQueryChange }: Props) {
  const t = useT();
  return (
    <div className="toolbar">
      <input
        className="search-input"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t("toolbar.search")}
        aria-label={t("toolbar.search")}
      />
      <div className="tabs" role="group" aria-label={t("toolbar.filterBy")}>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            className={`tab ${s === status ? "active" : ""}`}
            aria-pressed={s === status}
            onClick={() => onStatusChange(s)}
          >
            {t(`status.${s}`)} <span className="tab-count">{countFor(s, summary)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
