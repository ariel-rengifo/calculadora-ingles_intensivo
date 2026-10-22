const form = document.getElementById("form-notas");
const mensajeError = document.getElementById("mensaje-error");
const resultado = document.getElementById("resultado");
const animacion = document.getElementById("animacion");
const svgCheck = document.getElementById("svg-check");
const lapizAnimo = document.getElementById("lapiz-animo");
const mensajeFinal = document.getElementById("mensaje-final");
const particulas = document.getElementById("particulas");

const CAMPOS = [
  { clave: "oral1", label: "Oral 1" },
  { clave: "oral2", label: "Oral 2" },
  { clave: "pb", label: "Progress Booklet" },
  { clave: "cbg", label: "Cambridge One" },
  { clave: "st", label: "Speaking Task" },
  { clave: "unt3", label: "Unit Test 3" },
  { clave: "unt4", label: "Unit Test 4" },
  { clave: "ctest1", label: "Competency Test 1" },
  { clave: "ctest2", label: "Competency Test 2" },
];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  mensajeError.classList.add("oculto");
  resultado.classList.add("oculto");
  animacion.classList.add("oculto");
  svgCheck.classList.add("oculto");
  lapizAnimo.classList.add("oculto");
  particulas.innerHTML = "";

  const datos = Object.fromEntries(new FormData(form).entries());

  // Validar
  const notas = {};
  for (const { clave } of CAMPOS) {
    const val = parseInt(datos[clave], 10);
    if (isNaN(val)) {
      mostrarError("Todas las notas deben ser números enteros.");
      return;
    }
    if (val < 0 || val > 100) {
      mostrarError("Las notas deben estar entre 0 y 100.");
      return;
    }
    notas[clave] = val;
  }

  // Cálculos (igual que en el backend)
  const promo1 = (notas.pb + notas.cbg + notas.st) / 3;
  const promo2 = (notas.unt3 + notas.unt4 + notas.ctest1 + notas.ctest2) / 4;
  const promtotal = Math.round((promo1 + promo2 + notas.oral1 + notas.oral2) / 4);
  const aprobado = promtotal >= 70;

  const data = {
    promo1: Math.round(promo1 * 100) / 100,
    promo2: Math.round(promo2 * 100) / 100,
    promtotal,
    aprobado,
  };

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