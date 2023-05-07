import fs from'fs';
const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

interface Todo {
  content: string;
  date: string;
  done: boolean
}

function create(content: string) {
  const todo: Todo = {
    content,
    date: new Date().toISOString(),
    done: false
  }

  const todos: Array<Todo> = [
    ...read(),
    todo
  ]

  // salvar o content no sistema
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos
  }, null, 2));
  return todo;
}

function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}")
  if (!db.todos) {
    return [];
  }
  return db.todos;
}

function clearDB () {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
clearDB()
create("Primeiro TODO")
create("Segunda TODO")
console.log(read());
