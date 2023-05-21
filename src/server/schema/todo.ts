import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string().uuid(),
  content: z.string().nonempty(),
  date: z.string().transform((date) => {
    return new Date(date).toISOString();
  }),
  done: z.string().transform((done) => {
    if (done === "true") return true;
    return false;
  }),
});

export type Todo = z.infer<typeof TodoSchema>;
