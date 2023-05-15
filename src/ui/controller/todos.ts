import { todoRepository } from "@ui/repository/todo";

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

export const todoController = {
  get,
  filterTodosByContent: filterTodos,
};
