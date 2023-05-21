import { HttpNotFoundError } from "@server/infra/errors";
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
  const output = await todoRepository.get({ page, limit });

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
const TodoIdQuerySchema = z.object({
  id: z.string().uuid().nonempty(),
});

async function toggleDone(request: NextApiRequest, response: NextApiResponse) {
  const todoId = TodoIdQuerySchema.safeParse(request.query);

  if (!todoId.success) {
    response.status(400).json({
      error: {
        message: "You must to provide a string ID",
        description: todoId.error.issues,
      },
    });
    return;
  }
  try {
    const updatedTodo = await todoRepository.toggleDone(todoId.data.id);

    return response.status(200).json({ todo: updatedTodo });
  } catch (error) {
    if (error instanceof Error) {
      response.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}

async function deleteById(request: NextApiRequest, response: NextApiResponse) {
  const todoId = TodoIdQuerySchema.safeParse(request.query);

  if (!todoId.success) {
    response.status(400).json({
      error: {
        message: "You must to provide a string ID",
        description: todoId.error.issues,
      },
    });
    return;
  }

  const { id } = todoId.data;
  try {
    await todoRepository.deleteById(id);

    return response.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      response.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }

    if (error instanceof Error) {
      response.status(400).json({
        error: {
          message: `Failed to delete resource with id ${id}`,
        },
      });
    }
  }
}

export const todoController = { get, create, toggleDone, deleteById };
