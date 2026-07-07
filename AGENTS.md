# Engineering rules for the Todo Starter

These are project-wide guidance rules. Panolayer can import them into the
**Guardian** tab (Rules → Import) so its agents follow them when editing this
codebase.

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
- **No secrets in the repo.** Configuration comes from the environment, never
  hard-coded keys or tokens.
