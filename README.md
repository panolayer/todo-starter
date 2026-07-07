# Todo Starter

A small, clean **Next.js (App Router) todolist with an API backend** — used as a
starter/tutorial project for [Panolayer](https://panolayer.com).

It is deliberately simple but properly layered, so it reads clearly in
Panolayer's **Architecture** view:

```
app/
  page.tsx              # the UI (a client component that calls the API)
  layout.tsx
  globals.css
  api/
    todos/
      route.ts          # GET (list) + POST (create)
      [id]/route.ts     # PATCH (toggle/rename) + DELETE
components/
  AddTodoForm.tsx        # new-todo form
  TodoList.tsx           # renders the list
  TodoItem.tsx           # one row
lib/
  types.ts               # shared domain types
  db.ts                  # JSON-file-backed store (a stand-in for a database)
  todos.ts               # data-access layer (the API's only door to storage)
```

The layers are strict: the **UI** talks only to the **API routes**, and the API
routes talk only to the **data-access layer** (`lib/todos`), which is the only
code that touches the **store** (`lib/db`).

## Run it

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Data is persisted to `.data/todos.json` (gitignored); it is seeded on first run.

## A note for the tutorial

This starter ships with one small, intentional weakness: the **create-todo API
(`POST /api/todos`) does not validate its input**. It trusts `body.title` and
writes whatever it is given — including an empty string, a missing field, or a
huge blob. Panolayer's guided tutorial uses this as the "author a rule, watch it
fail, then fix it" exercise. Everything else is meant to be a clean example of a
well-structured little app.
