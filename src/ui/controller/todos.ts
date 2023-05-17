import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z } from "zod";

interface TodoControllerGetParams {
  page: number;
}

async function get({ page }: TodoControllerGetParams) {
  return todoRepository.get({
    page: page || 1,
    limit: 2,
  });
}

function filterTodos<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Todo[] {
  const homeTodos = todos.filter((todo) => {
    const contentNormalized = todo.content.toLocaleUpperCase();
    const searchNormalized = search.toLocaleUpperCase();
    return contentNormalized.includes(searchNormalized);
  });
  return homeTodos;
}

interface TodoControllerCreateParams {
  content: string;
  onError: () => void;
  onSuccess: (todo: Todo) => void;
}

async function create({
  content,
  onError,
  onSuccess,
}: TodoControllerCreateParams) {
  const parsedParams = z.string().nonempty().safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerToggleDoneParams {
  todoId: string;
  updateTodoOnScreen: () => void;
  onError: () => void;
}

async function toggleDone({
  todoId,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams) {
  // optimistic Update
  // updateTodoOnScreen();
  todoRepository
    .toggleDone(todoId)
    .then(() => {
      //update real
      updateTodoOnScreen();
    })
    .catch(() => {
      onError();
    });
}

export const todoController = {
  get,
  filterTodosByContent: filterTodos,
  create,
  toggleDone,
};
