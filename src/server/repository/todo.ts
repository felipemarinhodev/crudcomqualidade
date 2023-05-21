import {
  create,
  read,
  update,
  deleteById as dbDeleteById,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo } from "@ui/schema/todo";

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
  const { data, error, count } = await supabase.from("todos").select("*", {
    count: "exact",
  });

  if (error) throw new Error("Failed to fetch data");

  // TODO: Fix this to be properly validated by schema
  const todos = data as Todo[];
  const total = count || todos.length;
  return {
    todos,
    total,
    pages: 1,
  };

  // const ALL_TODOS = read().reverse();

  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  // const totalPages = Math.ceil(ALL_TODOS.length / limit);

  // return {
  //   todos: paginatedTodos,
  //   total: ALL_TODOS.length,
  //   pages: totalPages,
  // };
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
