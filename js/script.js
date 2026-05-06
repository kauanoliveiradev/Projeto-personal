function iniciarCarrossel(config) {
  const track = document.getElementById(config.trackId);
  const prevBtn = document.querySelector(config.prevBtn);
  const nextBtn = document.querySelector(config.nextBtn);
  const dotsContainer = document.querySelector(config.dotsContainer);

  if (!track) return;

  const slidesOriginais = Array.from(track.children).map(slide => slide.cloneNode(true));
  const total = slidesOriginais.length;

  let indiceAtual = config.visiveis;
  let animando = false;
  let modoAtual = null;
  let larguraSlide = 0;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function montarSlides() {
    const mobile = isMobile();

    if (modoAtual === mobile) return;

    modoAtual = mobile;
    track.innerHTML = "";

    if (mobile) {
      slidesOriginais.forEach(slide => {
        track.appendChild(slide.cloneNode(true));
      });

      track.style.transform = "none";
      track.style.transition = "none";

      criarDots();
      atualizarDots();
      return;
    }

    const clonesInicio = slidesOriginais
      .slice(-config.visiveis)
      .map(slide => slide.cloneNode(true));

    const clonesFim = slidesOriginais
      .slice(0, config.visiveis)
      .map(slide => slide.cloneNode(true));

    clonesInicio.forEach(slide => track.appendChild(slide));

    slidesOriginais.forEach(slide => {
      track.appendChild(slide.cloneNode(true));
    });

    clonesFim.forEach(slide => track.appendChild(slide));

    indiceAtual = config.visiveis;
    atualizarLargura();
    mover(false);
  }

  function atualizarLargura() {
    const primeiroSlide = track.querySelector(config.slideSelector);
    if (!primeiroSlide) return;

    const style = window.getComputedStyle(primeiroSlide);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;

    larguraSlide = primeiroSlide.offsetWidth + marginLeft + marginRight;
  }

  function mover(animar = true) {
    if (isMobile()) return;

    track.style.transition = animar ? "transform 0.4s ease" : "none";
    track.style.transform = `translateX(-${indiceAtual * larguraSlide}px)`;
  }

  function criarDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    slidesOriginais.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add(config.dotClass);

      if (index === 0) {
        dot.classList.add("ativo");
      }

      dot.addEventListener("click", () => {
        const slides = track.querySelectorAll(config.slideSelector);

        slides[index].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      });

      dotsContainer.appendChild(dot);
    });
  }

  function atualizarDots() {
    if (!isMobile() || !dotsContainer) return;

    const slides = Array.from(track.querySelectorAll(config.slideSelector));
    const dots = dotsContainer.querySelectorAll(`.${config.dotClass}`);

    if (!slides.length || !dots.length) return;

    let indiceMaisProximo = 0;
    let menorDistancia = Infinity;

    slides.forEach((slide, index) => {
      const distancia = Math.abs(slide.offsetLeft - track.scrollLeft);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        indiceMaisProximo = index;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("ativo", index === indiceMaisProximo);
    });
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

  if (nextBtn) {
    nextBtn.addEventListener("click", avancar);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", voltar);
  }

  track.addEventListener("scroll", atualizarDots);

  track.addEventListener("transitionend", () => {
    if (isMobile()) return;

    if (indiceAtual >= total + config.visiveis) {
      indiceAtual = config.visiveis;
      mover(false);
    }

    if (indiceAtual < config.visiveis) {
      indiceAtual = total;
      mover(false);
    }

    animando = false;
  });

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      montarSlides();
      atualizarLargura();

      if (!isMobile()) {
        mover(false);
      } else {
        atualizarDots();
      }
    }, 150);
  });

  montarSlides();
}

iniciarCarrossel({
  trackId: "carrosselTrack",
  slideSelector: ".carrossel__slide",
  prevBtn: ".prev",
  nextBtn: ".next",
  dotsContainer: ".carrossel__dots",
  dotClass: "carrossel__dot",
  visiveis: 3
});

iniciarCarrossel({
  trackId: "testimonialsTrack",
  slideSelector: ".testimonials__card-img",
  prevBtn: ".prev--testimonials",
  nextBtn: ".next--testimonials",
  dotsContainer: ".testimonials__dots",
  dotClass: "testimonials__dot",
  visiveis: 3
});



