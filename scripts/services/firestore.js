// firestore.js
// Acesso ao Firestore — Turma XI | Teologia SALT-FAP

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "./firebase.js";

console.log("firestore.js carregou");

// ===== ANÚNCIOS =====

export async function listarAnuncios() {
  const q = query(
    collection(db, "anuncios"),
    where("ativo", "==", true),
    orderBy("criadoEm", "desc")
  );

  const snapshot = await getDocs(q, { source: "server" });

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}


export async function criarAnuncio(dados, token) {
  return addDoc(
    collection(db, "anuncios"),
    {
      ...dados,
      ativo: true,
      criadoEm: serverTimestamp()
    },
    {
      params: { token }
    }
  );
}

export async function ocultarAnuncio(id, token) {
  const ref = doc(db, "anuncios", id);

  return updateDoc(
    ref,
    { ativo: false },
    { params: { token } }
  );
}