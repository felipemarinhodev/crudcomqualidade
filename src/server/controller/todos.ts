import { read } from "@db-crud-todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(_: NextApiRequest, response: NextApiResponse) {
  const todos = read();
  response.status(200).json({
    todos,
  });
}

export const todoController = { get };
