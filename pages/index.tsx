import React, { useEffect, useRef, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todos";

const bg = "bg.avif";

interface HomeTodo {
  id: string;
  content: string;
}

export default function HomePage() {
  const initialLoadComplete = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState("");

  const homeTodos = todoController.filterTodosByContent<HomeTodo>(
    search,
    todos
  );

  const hasMorePage = totalPages > page;
  const hasNoTodos = homeTodos.length === 0 && !isLoading;

  // Load infos onload
  useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(() => [...todos]);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles themeName="coolGrey" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSuccess(todo: HomeTodo) {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
                setNewTodoContent("");
              },
              onError() {
                alert("Você precisa ter um conteúdo para criar uma TODO!");
              },
            });
          }}
        >
          <input
            type="text"
            placeholder="Correr, Estudar..."
            onChange={function newTodoHandler(event) {
              setNewTodoContent(event.target.value);
            }}
            value={newTodoContent}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function handleSearch(event) {
              const { value } = event.target;
              setSearch(value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {homeTodos.map((currentTodo) => {
              return (
                <tr key={currentTodo.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{currentTodo.id.substring(0, 4)}</td>
                  <td>{currentTodo.content}</td>
                  <td align="right">
                    <button data-type="delete">Apagar</button>
                  </td>
                </tr>
              );
            })}
            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}
            {hasMorePage && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);
                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => setIsLoading(false));
                    }}
                  >
                    Página {page} Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
