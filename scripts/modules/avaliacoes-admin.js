import { criarAvaliacao } from "../services/firestore.js";
import { carregarAvaliacoes } from "./avaliacoes.js";

export function initCriarAvaliacao() {
  if (!window.isAdmin) return;

  const modal = document.getElementById("modal-avaliacao");

  const tipo = document.getElementById("avaliacao-tipo");
  const titulo = document.getElementById("avaliacao-titulo");
  const data = document.getElementById("avaliacao-data");
  const descricao = document.getElementById("avaliacao-descricao");

  const salvar = document.getElementById("salvar-avaliacao");
  const cancelar = document.getElementById("cancelar-avaliacao");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-nova-avaliacao");
    if (!btn) return;

    modal.dataset.disciplinaId = btn.dataset.disciplinaId;
    modal.classList.remove("hidden");
  });

  cancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    limpar();
  });

  salvar.addEventListener("click", async () => {
    if (!modal.dataset.disciplinaId) return;

    if (!titulo.value || !data.value) {
      alert("Informe título e data.");
      return;
    }

    salvar.disabled = true;
    salvar.textContent = "Criando...";

    try {
      await criarAvaliacao({
        disciplinaId: modal.dataset.disciplinaId,
        tipo: tipo.value,
        titulo: titulo.value.trim(),
        descricao: descricao.value.trim(),
        data: new Date(data.value)
      });

      modal.classList.add("hidden");
      limpar();
      await carregarAvaliacoes();

    } catch (err) {
      console.error(err);
      alert("Erro ao criar avaliação.");
    } finally {
      salvar.disabled = false;
      salvar.textContent = "Criar";
    }
  });

  function limpar() {
    tipo.value = "prova";
    titulo.value = "";
    data.value = "";
    descricao.value = "";
    delete modal.dataset.disciplinaId;
  }
}
