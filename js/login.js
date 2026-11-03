import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

const form = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarMensaje("", "");
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  try {
    const credencial = await signInWithEmailAndPassword(auth, correo, contrasena);
    const uid = credencial.user.uid;

    const usuarioDoc = await getDoc(doc(db, "usuarios", uid));
    if (!usuarioDoc.exists()) {
      mostrarMensaje("Tu cuenta no tiene un perfil asignado. Contacta al administrador.", "error");
      return;
    }

    const rol = usuarioDoc.data().rol;
    if (rol === "ejecutivo") {
      window.location.href = "dashboard.html";
    } else if (rol === "operador") {
      window.location.href = "registro.html";
    } else {
      mostrarMensaje("Rol no reconocido. Contacta al administrador.", "error");
    }
  } catch (error) {
    mostrarMensaje("Correo o contraseña incorrectos.", "error");
  }
});
const correoInput = document.getElementById("correo");
const recordarCheckbox = document.getElementById("recordar");

// Recuperar correo guardado
document.addEventListener("DOMContentLoaded", () => {
    const correoGuardado = localStorage.getItem("correoGuardado");

    if (correoGuardado) {
        correoInput.value = correoGuardado;
        recordarCheckbox.checked = true;
    }
});

// Eliminar correo si desmarca la casilla
recordarCheckbox.addEventListener("change", () => {
    if (!recordarCheckbox.checked) {
        localStorage.removeItem("correoGuardado");
    }
});
if (recordarCheckbox.checked) {
    localStorage.setItem("correoGuardado", correoInput.value);
} else {
    localStorage.removeItem("correoGuardado");
}