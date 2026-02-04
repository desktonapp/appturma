import { criarDisciplina } from "../services/firestore.js";
import { carregarAvaliacoes } from "./avaliacoes.js";

export function initCriarDisciplina() {
  if (!window.isAdmin) return;

  const btn = document.getElementById("btn-criar-disciplina");
  const modal = document.getElementById("modal-disciplina");
  const input = document.getElementById("disciplina-nome");
  const salvar = document.getElementById("salvar-disciplina");
  const cancelar = document.getElementById("cancelar-disciplina");

  // Mostra botão para liderança
  btn.classList.remove("hidden");

  btn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    input.focus();
  });

  cancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    input.value = "";
  });

  salvar.addEventListener("click", async () => {
    const nome = input.value.trim();

    if (!nome) {
      alert("Informe o nome da disciplina.");
      return;
    }

    salvar.disabled = true;
    salvar.textContent = "Criando...";

    try {
      await criarDisciplina(nome);

      modal.classList.add("hidden");
      input.value = "";

      // Atualiza lista de avaliações
      await carregarAvaliacoes();

    } catch (err) {
      console.error(err);
      alert("Erro ao criar disciplina.");
    } finally {
      salvar.disabled = false;
      salvar.textContent = "Criar";
    }
  });
}
