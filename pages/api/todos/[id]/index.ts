import { todoController } from "@server/controller/todos";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "DELETE") {
    await todoController.deleteById(request, response);
    return;
  }

  response.status(405).json({ error: { message: "Method not allowed" } });
}
