import { NextResponse } from "next/server";
import { listTodos } from "@/lib/todos";
import { firstTodos } from "@/lib/export";

// GET /api/todos/export — download the todos, newest first, as a JSON file.
//
// An optional `limit` query parameter exports only the newest `limit` todos.
export async function GET(req: Request) {
  const all = await listTodos();
  const todos = firstTodos(all, new URL(req.url).searchParams);
  return NextResponse.json(
    { exportedAt: new Date().toISOString(), todos },
    { headers: { "Content-Disposition": 'attachment; filename="todos.json"' } },
  );
}
