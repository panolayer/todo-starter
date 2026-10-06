import { NextResponse } from "next/server";
import { listTodos, completeAll } from "@/lib/todos";

// POST /api/todos/complete — mark every open todo as completed and report how
// many were changed.
export async function POST() {
  const open = (await listTodos()).filter((todo) => !todo.completed);
  const completed = await completeAll(open.map((todo) => todo.id));
  return NextResponse.json({ completed });
}
