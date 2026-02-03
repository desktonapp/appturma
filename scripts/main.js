// main.js
// Inicialização geral do app

import { db, storage } from "./services/firebase.js";
import { carregarAnuncios } from "./modules/anuncios.js";


document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] Turma XI | Teologia SALT-FAP iniciado');

  initApp();
});

function initApp() {
  initState();
  initUI();
  carregarAnuncios();
}


/**
 * Estado inicial do app
 */
function initState() {
  window.appState = {
  isAdmin: window.isAdmin === true
};

  if (window.appState.isAdmin) {
    console.log('[App] Modo liderança ativo');
  } else {
    console.log('[App] Modo público');
  }
}

/**
 * Inicialização da interface
 */
function initUI() {
  bindButtons();
}

/**
 * Liga eventos básicos dos botões
 * (por enquanto sem lógica real)
 */
function bindButtons() {
  // Botões de criação (liderança)
  document.querySelectorAll('.admin-only').forEach(button => {
    button.addEventListener('click', () => {
      alert('Ação disponível apenas no modo liderança.\n(Funcionalidade será implementada em breve)');
    });
  });

  // Botão de enviar dúvida
  const duvidaBtn = document.querySelector('button:not(.admin-only)');
  if (duvidaBtn) {
    duvidaBtn.addEventListener('click', () => {
      alert('Envio de dúvidas será implementado em breve.');
    });
  }
}
