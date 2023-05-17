import { Todo, TodoSchema } from "@ui/schema/todo";
import { z } from "zod";
interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  pages: number;
  total: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
    async (responseServer) => {
      const todosString = await responseServer.text();
      const responseParsed = parseTodosFromServer(JSON.parse(todosString));

      return {
        todos: responseParsed.todos,
        total: responseParsed.total,
        pages: responseParsed.pages,
      };
    }
  );
}

export async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (response.ok) {
    const serverResponse = await response.json();
    const serverResponseSchema = z.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error("Failed to create TODO");
    }
    return serverResponseParsed.data.todo;
  }

  throw new Error("Failed to create TODO");
}

export async function toggleDone(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}/toggle-done`, {
    method: "PUT",
  });

  if (response.ok) {
    const serverResponse = await response.json();
    const serverResponseSchema = z.object({
      todo: TodoSchema,
    });

    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error(`Failed to update TODO with id ${id}`);
    }

    const updatedTodo = serverResponseParsed.data.todo;
    return updatedTodo;
  }

  throw new Error("Server Error");
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
};

function parseTodosFromServer(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Array<Todo>;
} {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    "total" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
      todos: responseBody.todos.map((todo: unknown) => {
        if (todo === null && typeof todo !== "object") {
          throw new Error("Invalid todo from API");
        }
        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          date,
          done: String(done).toLocaleLowerCase() === "true",
        };
      }),
    };
  }
  return {
    todos: [],
    pages: 1,
    total: 0,
  };
}
