import { STATUS_FILTERS, type StatusFilter } from "@/lib/filters";
import type { TodoSummary } from "@/lib/stats";

interface Props {
  status: StatusFilter;
  query: string;
  summary: TodoSummary;
  onStatusChange: (status: StatusFilter) => void;
  onQueryChange: (query: string) => void;
}

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

function countFor(status: StatusFilter, summary: TodoSummary): number {
  if (status === "active") return summary.active;
  if (status === "completed") return summary.completed;
  return summary.total;
}

export function Toolbar({ status, query, summary, onStatusChange, onQueryChange }: Props) {
  return (
    <div className="toolbar">
      <input
        className="search-input"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search todos"
        aria-label="Search todos"
      />
      <div className="tabs" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            className={`tab ${s === status ? "active" : ""}`}
            aria-pressed={s === status}
            onClick={() => onStatusChange(s)}
          >
            {STATUS_LABELS[s]} <span className="tab-count">{countFor(s, summary)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
