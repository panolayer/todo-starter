# Todo Starter

A small, clean **Next.js (App Router) todolist with an API backend** — used as a
starter/tutorial project for [Panolayer](https://panolayer.com).

Todos have a priority and an optional due date, the list can be searched and
filtered by status, and the interface is available in English and French with
light and dark themes. It is deliberately small but properly layered, so it
reads clearly in Panolayer's **Architecture** view:

```
app/
  page.tsx              # the UI (a client component that calls the API)
  layout.tsx
  globals.css
  api/
    todos/
      route.ts          # GET (list, filter, search) + POST (create) + DELETE (clear completed)
      [id]/route.ts     # PATCH (toggle/rename/reprioritize/reschedule) + DELETE
      complete/route.ts # POST (complete every open todo)
      export/route.ts   # GET (download the list as JSON)
components/
  AddTodoForm.tsx        # new-todo form (title, priority, due date)
  Toolbar.tsx            # search box + status tabs
  TodoList.tsx           # renders the list
  TodoItem.tsx           # one row, with inline renaming
  SettingsPanel.tsx      # theme, language, default priority
  SettingsProvider.tsx   # settings + translation context for the page
lib/
  types.ts               # shared domain types
  db.ts                  # JSON-file-backed store (a stand-in for a database)
  todos.ts               # data-access layer (the API's only door to storage)
  filters.ts             # status tabs and search matching
  query.ts               # parsing for the GET /api/todos query string
  stats.ts               # list summary for the header and tabs
  dates.ts               # calendar-day helpers for due dates
  validation.ts          # request-body checks shared by the API routes
  titles.ts              # looking todos up by title
  duplicates.ts          # titles that appear on more than one todo
  export.ts              # the JSON download behind the Export link
  backup.ts              # snapshots written before clearing completed todos
  settings.ts            # persisted preferences (localStorage)
  i18n.ts                # English and French UI text
tests/                   # Vitest unit tests for lib/
```

The layers are strict: the **UI** talks only to the **API routes**, and the API
routes talk only to the **data-access layer** (`lib/todos`), which is the only
code that touches the **store** (`lib/db`). The other `lib/` modules are pure
helpers shared by both sides.

## Run it

Use **pnpm 12.9.1** (pinned by `packageManager` in `package.json`; `corepack pnpm`
selects it if your global pnpm differs) and Node.js 24 or newer.

```bash
pnpm install --frozen-lockfile
pnpm dev
# open http://localhost:3000
```

Data is persisted to `.data/todos.json` (gitignored); it is seeded on first run.
Settings are saved per browser in `localStorage`.

## Checks

```bash
pnpm typecheck   # tsc --noEmit
pnpm test        # Vitest unit tests
pnpm build       # production build
pnpm check       # all three, in that order
```

## API

| Method & path              | Does                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| `GET /api/todos`           | List todos, newest first. Optional `status`, `q` and `limit` params; also returns `duplicates`. |
| `POST /api/todos`          | Create a todo from `{ title, priority?, dueDate? }`.                 |
| `DELETE /api/todos`        | Back up the list to `.data/backups`, then remove every completed todo; returns `{ removed }`. |
| `POST /api/todos/complete` | Mark every open todo as completed; returns `{ completed }`.          |
| `GET /api/todos/export`    | Download the todos as `todos.json`. Optional `limit` param.          |
| `PATCH /api/todos/:id`     | Change any of `title`, `completed`, `priority`, `dueDate`; `409` if the new title is taken. |
| `DELETE /api/todos/:id`    | Remove one todo.                                                     |

`priority` is `low`, `medium` or `high`; `dueDate` is a `YYYY-MM-DD` day or `null`.

## The guided tutorial

The create-todo endpoint (`POST /api/todos`) does not validate its body yet: it
trusts `body.title` and writes whatever it is given — including an empty
string, a missing field, or a huge blob. Panolayer's guided tutorial uses it for
its "author a rule, watch it fail, then fix it" exercise.
