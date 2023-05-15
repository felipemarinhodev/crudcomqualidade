import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

async function get(request: NextApiRequest, response: NextApiResponse) {
  const query = request.query;
  const page = Number(query.page);
  const limit = Number(query.limit);
  if (query.page && isNaN(page)) {
    response.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });
  }
  if (query.limit && isNaN(limit)) {
    response.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });
  }
  const output = todoRepository.get({ page, limit });

  response.status(200).json({
    total: output.total,
    todos: output.todos,
    pages: output.pages,
  });
}

async function create(request: NextApiRequest, response: NextApiResponse) {
  const { content } = request.body;

  const createTodo = await todoRepository.createByContent(content);

  response.status(201).json({
    todo: createTodo,
  });
}

export const todoController = { get, create };
