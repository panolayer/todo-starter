# Engineering rules for the Todo Starter

These are project-wide guidance rules. Panolayer can import them into the
**Guardian** tab (Rules → Import) so its agents follow them when editing this
codebase.

## Tooling

Use **pnpm 10.4.1** (pinned by `packageManager`); do not add npm or Yarn
lockfiles. If the global pnpm is a different version, prefix commands with
`corepack pnpm`.

| Task                 | Command                          |
| -------------------- | -------------------------------- |
| Install dependencies | `pnpm install --frozen-lockfile` |
| Development server   | `pnpm dev`                       |
| Typecheck            | `pnpm typecheck`                 |
| Unit tests           | `pnpm test`                      |
| Production build     | `pnpm build`                     |

## Rules

- **Validate input at the API boundary.** Every route handler must validate the
  request body before using it — reject missing, wrong-typed, empty, or
  oversized values with a `400` rather than passing them to the data layer.
- **Keep the layers strict.** The UI talks only to the API routes; the API
  routes talk only to `lib/todos`; only `lib/db` touches the store. Never import
  the store from a component or a route.
- **Types live in `lib/types.ts`.** Share one definition of `Todo` across the
  frontend, the API, and the data layer — do not redeclare shapes inline.
- **API responses are consistent.** Success returns the affected resource as
  JSON; errors return `{ error: string }` with an appropriate status code.
- **Localize every user-facing string.** Text shown in the UI comes from the
  catalogs in `lib/i18n.ts` (English and French); never hard-code it in a
  component. Every French entry must be an actual translation.
- **Due dates are calendar days.** Store and compare them as `YYYY-MM-DD`
  strings with the helpers in `lib/dates.ts`; never convert them to instants.
- **Helpers say what they do.** Each exported function in `lib/` documents its
  behavior in a doc comment, and the code must do exactly that. Cover helpers
  with unit tests under `tests/`.
- **No secrets in the repo.** Configuration comes from the environment, never
  hard-coded keys or tokens.
