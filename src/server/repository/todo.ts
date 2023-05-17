import {
  create,
  read,
  update,
  deleteById as dbDeleteById,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo } from "@ui/schema/todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  pages: number;
  total: number;
}

function get({
  page = 1,
  limit = 10,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const ALL_TODOS = read().reverse();

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / limit);

  return {
    todos: paginatedTodos,
    total: ALL_TODOS.length,
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
