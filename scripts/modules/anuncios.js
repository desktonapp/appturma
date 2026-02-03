// anuncios.js
import { listarAnuncios } from "../services/firestore.js";

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
