// anuncios.js
import { listarAnuncios, criarAnuncio } from "../services/firestore.js";
import { uploadPDF } from "../services/storage.js";

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
    anuncio.pdfUrl
      ? `<a href="${anuncio.pdfUrl}" target="_blank" class="pdf-link">
           📄 Ver PDF
         </a>`
      : ""
  }
`;
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
  const file = document.getElementById("anuncio-pdf").files[0];

  if (!titulo || !descricao) {
    alert("Preencha título e descrição.");
    return;
  }

  salvar.disabled = true;
  salvar.textContent = "Publicando...";

  try {
    let pdfUrl = null;

    if (file) {
      pdfUrl = await uploadPDF(file);
    }

    await criarAnuncio({
      titulo,
      descricao,
      pdfUrl
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
  document.getElementById("anuncio-pdf").value = "";
}

}
