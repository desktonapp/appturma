// anuncios.js
import { listarAnuncios } from "../services/firestore.js";
import { carregarAnuncios } from "./anuncios.js";

export async function carregarAnuncios() {
  const container = document.getElementById("anuncios-list");
  container.innerHTML = "<p class='empty'>Carregando...</p>";

  try {
    const anuncios = await listarAnuncios();

    if (anuncios.length === 0) {
      container.innerHTML = "<p class='empty'>Nenhum anúncio publicado.</p>";
      return;
    }

    container.innerHTML = "";

    anuncios.forEach(anuncio => {
      const card = document.createElement("div");
      card.className = "anuncio-item";

      card.innerHTML = `
        <strong>${anuncio.titulo}</strong>
        <p>${anuncio.descricao}</p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='empty'>Erro ao carregar anúncios.</p>";
  }
}

import { criarAnuncio } from "../services/firestore.js";

export function initCriarAnuncio() {
  if (!window.isAdmin) return;

  const btnCriar = document.querySelector(
    ".card button.admin-only"
  );

  const modal = document.getElementById("modal-anuncio");
  const cancelar = document.getElementById("cancelar-anuncio");
  const salvar = document.getElementById("salvar-anuncio");

  const inputTitulo = document.getElementById("anuncio-titulo");
  const inputDescricao = document.getElementById("anuncio-descricao");

  btnCriar.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    limpar();
  });

  salvar.addEventListener("click", async () => {
    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();

    if (!titulo || !descricao) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      await criarAnuncio({ titulo, descricao }, token);

      modal.classList.add("hidden");
      limpar();
      carregarAnuncios(); // 🔥 atualiza na hora

    } catch (err) {
      console.error(err);
      alert("Erro ao criar anúncio.");
    }
  });

  function limpar() {
    inputTitulo.value = "";
    inputDescricao.value = "";
  }
}
