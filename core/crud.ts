import fs from'fs';
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean
}

function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    content,
    date: new Date().toISOString(),
    done: false
  }

  const todos: Array<Todo> = [
    ...read(),
    todo
  ]

  // salvar o content no sistema
  saveTodos(todos);
  return todo;
}

function saveTodos(todos: Todo[]) {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos
  }, null, 2));
}

function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}")
  if (!db.todos) {
    return [];
  }
  return db.todos;
}

function update(id: string, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo)
    }
  });
  saveTodos(todos)

  if (!updatedTodo) {
    throw new Error("Please, provide another ID!")
  }

  return updatedTodo;
}

function updateContentById(id: string, content: string): Todo {
  return update(id, { content })
}

function clearDB () {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
clearDB()
create("Primeiro TODO")
create("Primeiro TODO")
const terceiraTodo = create("Segunda TODO")
// update(terceiraTodo.id, {
//   content: "Segunda TODO com novo content!",
//   done: true
// })

updateContentById(terceiraTodo.id, "Atualizada!")

console.log(read());
