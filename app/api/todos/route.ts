import { NextResponse } from "next/server";
import { listTodos, createTodo } from "@/lib/todos";

// GET /api/todos — return every todo, newest first.
export async function GET() {
  const todos = await listTodos();
  return NextResponse.json({ todos });
}

// POST /api/todos — create a new todo from the posted JSON body.
//
// The body's `title` is passed straight through to the data layer. There is no
// server-side check that it is present, a string, non-empty, or a sane length —
// so an empty title, a missing field, or a huge blob all get written verbatim.
export async function POST(req: Request) {
  const body = await req.json();
  const todo = await createTodo({
    title: body.title,
    priority: body.priority,
    dueDate: body.dueDate,
  });
  return NextResponse.json({ todo }, { status: 201 });
}
