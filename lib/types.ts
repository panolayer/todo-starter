// Domain types for the todo app. Kept in one place so the frontend, the API
// routes, and the data layer all speak the same shapes.

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  /** ISO-8601 timestamp of when the todo was created. */
  createdAt: string;
}

/** Fields accepted when creating a todo. */
export interface CreateTodoInput {
  title: string;
}

/** Fields accepted when updating a todo (all optional). */
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}
