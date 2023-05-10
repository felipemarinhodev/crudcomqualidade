import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";

const bg = "bg.avif";

const todos = [
  {
    id: "808ef14b-0ec1-4d67-81b1-51d4f27e11a7",
    content: "Primeiro TODO",
    date: "2023-05-10T03:32:06.841Z",
    done: false,
  },
  {
    id: "7f449b61-6887-42ea-8708-052af494bd82",
    content: "Extra TODO",
    date: "2023-05-10T03:32:06.842Z",
    done: false,
  },
  {
    id: "90b8b00e-3f0c-4851-8018-0ec3d4130ee6",
    content: "Atualizada!",
    date: "2023-05-10T03:32:06.842Z",
    done: false,
  },
];

export default function HomePage() {
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
        <form>
          <input type="text" placeholder="Correr, Estudar..." />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input type="text" placeholder="Filtrar lista atual, ex: Dentista" />
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
            {todos.map((currentTodo) => {
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
            {/* 
            <tr>
              <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                Carregando...
              </td>
            </tr>

            <tr>
              <td colSpan={4} align="center">
                Nenhum item encontrado
              </td>
            </tr>

            <tr>
              <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                <button data-type="load-more">
                  Carregar mais{" "}
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
            </tr> */}
          </tbody>
        </table>
      </section>
    </main>
  );
}
