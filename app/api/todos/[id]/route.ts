import { NextResponse } from "next/server";
import { updateTodo, deleteTodo } from "@/lib/todos";
import { parseDueDate } from "@/lib/dates";
import { isPriority, type UpdateTodoInput } from "@/lib/types";

const MAX_TITLE_LENGTH = 200;

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

// PATCH /api/todos/:id — toggle completion, rename, reprioritize, or change the
// due date of a todo. Only the fields present in the body are changed.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const patch: UpdateTodoInput = {};

  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return badRequest("title must be a non-empty string");
    if (title.length > MAX_TITLE_LENGTH) {
      return badRequest(`title must be at most ${MAX_TITLE_LENGTH} characters`);
    }
    patch.title = title;
  }
  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") return badRequest("completed must be a boolean");
    patch.completed = body.completed;
  }
  if (body.priority !== undefined) {
    if (!isPriority(body.priority)) return badRequest("priority must be low, medium, or high");
    patch.priority = body.priority;
  }
  if (body.dueDate !== undefined) {
    const dueDate = parseDueDate(body.dueDate);
    if (dueDate === undefined) return badRequest("dueDate must be a YYYY-MM-DD date or null");
    patch.dueDate = dueDate;
  }

  const todo = await updateTodo(params.id, patch);
  if (!todo) return NextResponse.json({ error: "todo not found" }, { status: 404 });
  return NextResponse.json({ todo });
}

// DELETE /api/todos/:id — remove a todo.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteTodo(params.id);
  if (!ok) return NextResponse.json({ error: "todo not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
