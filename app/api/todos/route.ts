import { NextResponse } from "next/server";
import { listTodos, createTodo, clearCompleted, backupTodos } from "@/lib/todos";
import { filterTodos } from "@/lib/filters";
import { parseListQuery } from "@/lib/query";
import { summarize } from "@/lib/stats";
import { duplicateTitles } from "@/lib/duplicates";

// GET /api/todos — list todos, newest first.
//
// Optional query parameters: `status` (all | active | completed), `q` (search
// text) and `limit` (how many to return). The response carries the page of
// todos, how many todos matched in total, and a summary of the whole list.
export async function GET(req: Request) {
  const { status, q, limit } = parseListQuery(new URL(req.url).searchParams);
  const all = await listTodos();
  const matching = filterTodos(all, status, q);
  return NextResponse.json({
    todos: matching.slice(0, limit),
    matched: matching.length,
    summary: summarize(all),
    duplicates: duplicateTitles(all),
  });
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

// DELETE /api/todos — remove every completed todo and report how many went.
// The list is backed up first, so cleared todos can still be recovered.
export async function DELETE() {
  await backupTodos();
  const removed = await clearCompleted();
  return NextResponse.json({ removed });
}
