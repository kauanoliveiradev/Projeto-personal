/*-----CAROUSEL-----*/

function iniciarCarrossel(config) {
  const trackClip = document.getElementById(config.trackClipId);
  const track = document.getElementById(config.trackId);
  const prevBtn = document.querySelector(config.prevBtn);
  const nextBtn = document.querySelector(config.nextBtn);
  const dotsContainer = document.querySelector(config.dotsContainer);

  if (!track || !trackClip) return;

  const slidesOriginais = Array.from(track.children).map(s => s.cloneNode(true));
  const total = slidesOriginais.length;

  let indiceAtual = config.visiveis;
  let animando = false;
  let modoAtual = null;
  let larguraSlide = 0;

  const isMobile = () => window.innerWidth <= 1024;

  function criarDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    slidesOriginais.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add(config.dotClass);
      if (index === 0) dot.classList.add("ativo");

      dot.addEventListener("click", () => {
        const slides = track.querySelectorAll(config.slideSelector);
        slides[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });

      dotsContainer.appendChild(dot);
    });

    // IntersectionObserver — detecta automaticamente qual slide está visível
    const slides = track.querySelectorAll(config.slideSelector);
    const dots = dotsContainer.querySelectorAll(`.${config.dotClass}`);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(slides).indexOf(entry.target);
          dots.forEach((dot, i) => dot.classList.toggle("ativo", i === index));
        }
      });
    }, {
      root: trackClip,
      threshold: 0.5
    });

    slides.forEach(slide => observer.observe(slide));
  }

  function montarSlides() {
    const mobile = isMobile();
    if (modoAtual === mobile) return;
    modoAtual = mobile;

    track.innerHTML = "";

    if (mobile) {
      // No mobile o scroll é nativo (scroll-snap), sem necessidade de clones ou transform via JS.
      slidesOriginais.forEach(s => track.appendChild(s.cloneNode(true)));
      track.style.transform = "none";
      track.style.transition = "none";
      criarDots();
      return;
    }

    // Desktop: para simular um loop infinito com translateX, os slides são clonados:
    // os últimos slides visíveis são inseridos no INÍCIO da trilha
    // os primeiros slides visíveis são inseridos no FIM da trilha
    // Assim, quando o usuário passa do fim, na verdade está visualizando
    // uma cópia do início (e vice-versa), resetando o índice sem transição.
    slidesOriginais.slice(-config.visiveis).forEach(s => track.appendChild(s.cloneNode(true)));
    slidesOriginais.forEach(s => track.appendChild(s.cloneNode(true)));
    slidesOriginais.slice(0, config.visiveis).forEach(s => track.appendChild(s.cloneNode(true)));

    indiceAtual = config.visiveis;
    atualizarLargura();
    mover(false);
  }

  function atualizarLargura() {
    const primeiroSlide = track.querySelector(config.slideSelector);
    if (!primeiroSlide) return;
    const style = window.getComputedStyle(primeiroSlide);
    larguraSlide = primeiroSlide.offsetWidth
      + (parseFloat(style.marginLeft) || 0)
      + (parseFloat(style.marginRight) || 0);
  }

  function mover(animar = true) {
    if (isMobile()) return;
    track.style.transition = animar ? "transform 0.4s ease" : "none";
    track.style.transform = `translateX(-${indiceAtual * larguraSlide}px)`;
  }

  function avancar() {
    if (animando || isMobile()) return;
    animando = true;
    indiceAtual++;
    mover();
  }

  function voltar() {
    if (animando || isMobile()) return;
    animando = true;
    indiceAtual--;
    mover();
  }

  nextBtn?.addEventListener("click", avancar);
  prevBtn?.addEventListener("click", voltar);

  // Quando a animação termina, verifica se o carrossel parou em uma área clonada.
  // Se sim, a posição é resetada (sem transição) para a posição real correspondente,
  // criando a ilusão de continuidade para o usuário.
  track.addEventListener("transitionend", () => {
    if (isMobile()) return;
    if (indiceAtual >= total + config.visiveis) {
      indiceAtual = config.visiveis;
      mover(false);
    } else if (indiceAtual < config.visiveis) {
      indiceAtual = total;
      mover(false);
    }
    animando = false;
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      modoAtual = null;
      montarSlides();
      atualizarLargura();
      if (!isMobile()) mover(false);
    }, 150);
  });

  montarSlides();
}

/*-----INICIALIZAÇÃO DOS CARROSSEIS-----*/

iniciarCarrossel({
  trackClipId: "carrosselClip",
  trackId: "carrosselTrack",
  slideSelector: ".results__slide",
  prevBtn: ".results__btn--prev",
  nextBtn: ".results__btn--next",
  dotsContainer: ".results__dots",
  dotClass: "results__dot",
  visiveis: 3,
});

iniciarCarrossel({
  trackClipId: "testimonialsClip",
  trackId: "testimonialsTrack",
  slideSelector: ".testimonials__slide",
  prevBtn: ".testimonials__btn--prev",
  nextBtn: ".testimonials__btn--next",
  dotsContainer: ".testimonials__dots",
  dotClass: "testimonials__dot",
  visiveis: 3,
});

/*-----SCROLL REVEAL-----*/

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));