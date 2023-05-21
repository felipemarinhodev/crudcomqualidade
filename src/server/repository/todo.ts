import {
  create,
  read,
  update,
  deleteById as dbDeleteById,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo, TodoSchema } from "@server/schema/todo";

// Supabase
// TODO: move to another file
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// End Supabase

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  pages: number;
  total: number;
}

async function get({
  page = 1,
  limit = 10,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit - 1;
  const { data, error, count } = await supabase
    .from("todos")
    .select("*", {
      count: "exact",
    })
    .order("date", { ascending: false })
    .range(startIndex, endIndex);

  if (error) throw new Error("Failed to fetch data");

  const parsedData = TodoSchema.array().safeParse(data);
  if (!parsedData.success) {
    // throw parsedData.error;
    throw new Error("Failed to parse TODO from database");
  }

  const todos = parsedData.data as Todo[];
  const total = count || todos.length;
  const totalPages = Math.ceil(total / limit);
  return {
    todos,
    total,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  const newTodo = await create(content);
  return newTodo;
}

async function toggleDone(id: string): Promise<Todo> {
  const ALL_TODOS = read();

  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) {
    throw new Error(`Todo with id "${id}" not found`);
  }

  const updatedTodo = await update(id, { done: !todo.done });
  return updatedTodo;
}

async function deleteById(id: string) /*: Promise<Todo>*/ {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) {
    throw new HttpNotFoundError(`Todo with id "${id}" not found`);
  }

  dbDeleteById(id);
}
export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
