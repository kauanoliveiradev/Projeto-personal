const track = document.getElementById("carrosselTrack");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const VISIVEIS = 3;
const GAP = 24;

// 1. Clonagem dos slides
const slidesOriginais = Array.from(track.children);
const total = slidesOriginais.length;

slidesOriginais.slice(-VISIVEIS).map(s => s.cloneNode(true)).forEach(c => track.prepend(c));
slidesOriginais.slice(0, VISIVEIS).map(s => s.cloneNode(true)).forEach(c => track.append(c));

let indiceAtual = VISIVEIS;
let animando = false;


let larguraCache = 0;

function atualizarLargura() {
  larguraCache = 340 + GAP;  
}

function mover(animar = true) {
  track.style.transition = animar ? "transform 0.4s ease" : "none";
  track.style.transform = `translateX(-${indiceAtual * larguraCache}px)`;
}

function init() {
  atualizarLargura();
  mover(false);
}

// 3. Navegação
function avancar() {
  if (animando) return;
  animando = true;
  indiceAtual++;
  mover();
}

function voltar() {
  if (animando) return;
  animando = true;
  indiceAtual--;
  mover();
}

nextBtn.addEventListener("click", avancar);
prevBtn.addEventListener("click", voltar);

// 4. Loop infinito
track.addEventListener("transitionend", () => {
  if (indiceAtual >= total + VISIVEIS) {
    indiceAtual = VISIVEIS;
    mover(false);
  } else if (indiceAtual < VISIVEIS) {
    indiceAtual = total;
    mover(false);
  }
  animando = false;
});

// 5. Resize com debounce
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    atualizarLargura();
    mover(false);
  }, 150);
});

// 6. Suporte a swipe (touch)
let touchStartX = 0;

track.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener("touchend", e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) {
    delta > 0 ? avancar() : voltar();
  }
});

init();




