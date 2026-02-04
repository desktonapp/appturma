// anuncios.js
import { listarAnuncios, criarAnuncio, ocultarAnuncio } from "../services/firestore.js";

console.log("anuncios.js carregou");

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

  ${
    window.isAdmin
      ? `<button class="btn btn-small btn-danger" data-id="${anuncio.id}">
           Ocultar
         </button>`
      : ""
  }
`;

if (window.isAdmin) {
  const btnOcultar = card.querySelector("button[data-id]");
  btnOcultar.addEventListener("click", async () => {
    const confirmar = confirm("Deseja ocultar este anúncio?");
    if (!confirmar) return;

    try {
      await ocultarAnuncio(anuncio.id);
      carregarAnuncios(); // atualiza lista
    } catch (err) {
      console.error(err);
      alert("Erro ao ocultar anúncio.");
    }
  });
}

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='empty'>Erro ao carregar anúncios.</p>";
  }
}

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
    alert("Preencha título e descrição.");
    return;
  }

  salvar.disabled = true;
  salvar.textContent = "Publicando...";

  try {
    await criarAnuncio({
      titulo,
      descricao
    });

    modal.classList.add("hidden");
    limpar();
    carregarAnuncios();

  } catch (err) {
    console.error(err);
    alert("Erro ao criar anúncio.");
  } finally {
    salvar.disabled = false;
    salvar.textContent = "Publicar";
  }
});



function limpar() {
  inputTitulo.value = "";
  inputDescricao.value = "";
}

}
