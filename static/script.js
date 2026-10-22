const form = document.getElementById("form-notas");
const mensajeError = document.getElementById("mensaje-error");
const resultado = document.getElementById("resultado");
const animacion = document.getElementById("animacion");
const svgCheck = document.getElementById("svg-check");
const lapizAnimo = document.getElementById("lapiz-animo");
const mensajeFinal = document.getElementById("mensaje-final");
const particulas = document.getElementById("particulas");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  mensajeError.classList.add("oculto");
  resultado.classList.add("oculto");
  animacion.classList.add("oculto");
  svgCheck.classList.add("oculto");
  lapizAnimo.classList.add("oculto");
  particulas.innerHTML = "";

  const datos = Object.fromEntries(new FormData(form).entries());

  let respuesta;
  try {
    respuesta = await fetch("/calcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  } catch (err) {
    mostrarError("No se pudo conectar con el servidor.");
    return;
  }

  const data = await respuesta.json();

  if (!respuesta.ok) {
    mostrarError(data.error || "Ocurrió un error inesperado.");
    return;
  }

  mostrarResultado(data);
});

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.classList.remove("oculto");
}

function mostrarResultado(data) {
  document.getElementById("promo1").textContent = data.promo1;
  document.getElementById("promo2").textContent = data.promo2;
  document.getElementById("promtotal").textContent = data.promtotal;

  resultado.classList.remove("oculto");
  animacion.classList.remove("oculto");

  // Forzar reinicio de animaciones si se calcula más de una vez
  void animacion.offsetWidth;

  if (data.aprobado) {
    mensajeFinal.textContent = "¡Felicidades, aprobaste!";
    mensajeFinal.className = "mensaje-final aprobado";
    svgCheck.classList.remove("oculto");
    lanzarParticulas();
  } else {
    mensajeFinal.textContent = "Sigue esforzándote, ¡tú puedes!";
    mensajeFinal.className = "mensaje-final reprobado";
    lapizAnimo.classList.remove("oculto");
  }

  resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function lanzarParticulas() {
  const cantidad = 30;
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("div");
    p.className = "particula";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDelay = Math.random() * 0.6 + "s";
    p.style.background = Math.random() > 0.5 ? "#E8C468" : "#F2EFE6";
    particulas.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}
