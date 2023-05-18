/* eslint-disable no-console */
import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

type UUID = string;

interface Todo {
  id: UUID;
  content: string;
  date: string;
  done: boolean;
}

export function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    content,
    date: new Date().toISOString(),
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  // salvar o content no sistema
  saveTodos(todos);
  return todo;
}

function saveTodos(todos: Todo[]) {
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");
  if (!db.todos) {
    return [];
  }
  return db.todos;
}

export function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });
  saveTodos(todos);

  if (!updatedTodo) {
    throw new Error("Please, provide another ID!");
  }

  return updatedTodo;
}

export function updateContentById(id: UUID, content: string): Todo {
  return update(id, { content });
}

export function deleteById(id: UUID) {
  const todos = read();
  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }
    return true;
  });

  saveTodos(todosWithoutOne);
}

function clearDB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
clearDB();
create("Primeiro TODO");
create("Segunda TODO");
create("Terceiro TODO");
create("Quarto TODO");
create("Quinto TODO");
// const secondTodo = create("Segunda TODO");
// create("Extra TODO");
// deleteById(secondTodo.id);
// const thirdTodo = create("Terceira TODO");
// update(thirdTodo.id, {
//   content: "Segunda TODO com novo content!",
//   done: true
// })

// updateContentById(thirdTodo.id, "Atualizada!");

// console.log(read());
