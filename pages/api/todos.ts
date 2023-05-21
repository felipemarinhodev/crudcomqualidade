import { todoController } from "@server/controller/todos";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    await todoController.get(request, response);

    return;
  }
  if (request.method === "POST") {
    await todoController.create(request, response);

    return;
  }

  response.status(405).json({ error: { message: "Method not allowed" } });
}
