console.log("AVALIAÇÕES.JS NOVO CARREGADO");

import {
  listarDisciplinas,
  listarAvaliacoesPorDisciplina
} from "../services/firestore.js";

export async function carregarAvaliacoes() {
  const container = document.getElementById("avaliacoes-list");
  container.innerHTML = "<p class='empty'>Carregando avaliações...</p>";

  try {
    const disciplinas = await listarDisciplinas();

    if (disciplinas.length === 0) {
      container.innerHTML = "<p class='empty'>Nenhuma disciplina cadastrada.</p>";
      return;
    }

    container.innerHTML = "";

    for (const disciplina of disciplinas) {
      const bloco = document.createElement("div");
      bloco.className = "disciplina";

      bloco.innerHTML = `
        <div class="disciplina-header">
          <span class="disciplina-nome">${disciplina.nome}</span>
          <span class="disciplina-toggle">▶</span>
        </div>
        <div class="disciplina-conteudo hidden">
          <p class="empty">Carregando...</p>
        </div>
      `;

      const conteudo = bloco.querySelector(".disciplina-conteudo");
      const header = bloco.querySelector(".disciplina-header");
      const toggle = bloco.querySelector(".disciplina-toggle");

      header.addEventListener("click", async () => {
        const aberto = !conteudo.classList.contains("hidden");

        conteudo.classList.toggle("hidden");
        toggle.textContent = aberto ? "▶" : "▼";

        if (!aberto && conteudo.dataset.loaded !== "true") {
          const avaliacoes = await listarAvaliacoesPorDisciplina(disciplina.id);

          if (avaliacoes.length === 0) {
            conteudo.innerHTML = "<p class='empty'>Nenhuma avaliação cadastrada.</p>";
          } else {
            conteudo.innerHTML = "";

            avaliacoes.forEach(av => {
              const item = document.createElement("div");
              item.className = "avaliacao-item";

              const data = av.data?.toDate
                ? av.data.toDate().toLocaleDateString("pt-BR")
                : "";

              item.innerHTML = `
  <div class="avaliacao-resumo">
    <span class="avaliacao-tipo ${av.tipo}">
      ${av.tipo === "prova" ? "Prova" : "Trabalho"}
    </span>
    <span class="avaliacao-titulo">${av.titulo}</span>
    <span class="avaliacao-data">${data}</span>
  </div>

  <div class="avaliacao-descricao hidden">
    ${av.descricao || ""}
  </div>
`;


              item.querySelector(".avaliacao-resumo")
                .addEventListener("click", () => {
                  item.querySelector(".avaliacao-descricao")
                    .classList.toggle("hidden");
                });

              conteudo.appendChild(item);
            });
          }

          conteudo.dataset.loaded = "true";
        }
      });

      container.appendChild(bloco);
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='empty'>Erro ao carregar avaliações.</p>";
  }
}
