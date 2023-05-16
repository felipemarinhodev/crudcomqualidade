import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

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

const TodoCreateBodySchema = z.object({
  content: z.string(),
});

async function create(request: NextApiRequest, response: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(request.body);

  if (!body.success) {
    // Type Narrowing
    response.status(400).json({
      error: {
        message: "You need to provide a content to create a TODO",
        description: body.error.issues,
      },
    });
    return;
  }

  // Here we have the data!
  const createTodo = await todoRepository.createByContent(body.data.content);

  response.status(201).json({
    todo: createTodo,
  });
}

export const todoController = { get, create };
