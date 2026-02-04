import {
  listarDisciplinas,
  listarAvaliacoesPorDisciplina,
  editarDisciplina,
  ocultarDisciplina
} from "../services/firestore.js";

console.log("AVALIAÇÕES.JS NOVO CARREGADO");

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

    ${
      window.isAdmin
        ? `
      <div class="disciplina-actions">
        <button class="btn-icon editar">✏️</button>
        <button class="btn-icon ocultar">👁️</button>
      </div>
      `
        : ""
    }

    <span class="disciplina-toggle">▶</span>
  </div>

<div class="disciplina-conteudo hidden">

  ${
    window.isAdmin
      ? `
    <button
      class="btn btn-nova-avaliacao admin-only"
      data-disciplina-id="${disciplina.id}"
    >
      + Nova avaliação
    </button>
    `
      : ""
  }

  <div class="avaliacoes-container">
    <p class="empty">Carregando...</p>
  </div>
</div>

`;


      const conteudo = bloco.querySelector(".disciplina-conteudo");
      const avaliacoesContainer =
  conteudo.querySelector(".avaliacoes-container");

      const header = bloco.querySelector(".disciplina-header");
      const toggle = bloco.querySelector(".disciplina-toggle");

if (window.isAdmin) {
  const btnOcultar = bloco.querySelector(".btn-icon.ocultar");
  const btnEditar = bloco.querySelector(".btn-icon.editar");

  btnOcultar.addEventListener("click", async (e) => {
    e.stopPropagation();

    const confirmar = confirm(
      `Deseja ocultar a disciplina "${disciplina.nome}"?\n\nEssa ação é definitiva.`
    );

    if (!confirmar) return;

    try {
      await ocultarDisciplina(disciplina.id);
      await carregarAvaliacoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao ocultar disciplina.");
    }
  });

  btnEditar.addEventListener("click", (e) => {
    e.stopPropagation();

    const modal = document.getElementById("modal-disciplina");
    const input = document.getElementById("disciplina-nome");
    const salvar = document.getElementById("salvar-disciplina");

    modal.dataset.editando = disciplina.id;
    input.value = disciplina.nome;

    salvar.textContent = "Salvar";
    modal.classList.remove("hidden");
  });
}

        header.addEventListener("click", async () => {
        const aberto = !conteudo.classList.contains("hidden");

        conteudo.classList.toggle("hidden");
        toggle.textContent = aberto ? "▶" : "▼";

        if (!aberto && conteudo.dataset.loaded !== "true") {
          try {
            const avaliacoes = await listarAvaliacoesPorDisciplina(disciplina.id);

            if (avaliacoes.length === 0) {
              avaliacoesContainer.innerHTML =
                "<p class='empty'>Nenhuma avaliação cadastrada.</p>";
            } else {
              avaliacoesContainer.innerHTML = "";

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

                    <span class="avaliacao-titulo">
                      ${av.titulo}
                    </span>

                    <span class="avaliacao-data">
                      ${data}
                    </span>
                  </div>

                  <div class="avaliacao-descricao hidden">
                    ${av.descricao || ""}
                  </div>
                `;

                item
                  .querySelector(".avaliacao-resumo")
                  .addEventListener("click", () => {
                    item
                      .querySelector(".avaliacao-descricao")
                      .classList.toggle("hidden");
                  });

                avaliacoesContainer.appendChild(item);
              });
            }

            conteudo.dataset.loaded = "true";

          } catch (err) {
            console.error(
              "Erro ao carregar avaliações da disciplina:",
              err
            );
            avaliacoesContainer.innerHTML =
              "<p class='empty'>Erro ao carregar avaliações.</p>";
          }
        }
      });

      container.appendChild(bloco);
    }

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p class='empty'>Erro ao carregar avaliações.</p>";
  }
}

