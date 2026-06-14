function initDustBackground() {
  const oldCanvas = document.getElementById("dust-layer");
  if (!oldCanvas) return;

  const ctx = oldCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  const particles = [];
  const particleCount = 160;

  function resize() {
    width = oldCanvas.width = window.innerWidth;
    height = oldCanvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.5,
      vx: (Math.random() - 0.5) * 0.08,
      vy: Math.random() * 0.22 + 0.05,
      alpha: Math.random() * 0.28 + 0.1,
    };
  }

  function seedParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(createParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y > height + 10) {
        p.y = -10;
        p.x = Math.random() * width;
      }

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(220, 232, 238, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  resize();
  seedParticles();
  animate();

  window.addEventListener("resize", () => {
    resize();
    seedParticles();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initDustBackground();

  const textEl = document.getElementById("prologue-story");
  const nextBtn = document.getElementById("btn-prologue-next");
  const skipBtn = document.getElementById("btn-prologue-skip");

  if (!textEl || !nextBtn || !skipBtn) return;

  let paragraphs = [];

  try {
    const res = await fetch("/data/story/prologue.json");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.paragraphs)) {
        paragraphs = data.paragraphs;
      }
    }
  } catch {
    paragraphs = [
      "프롤로그 데이터를 불러오지 못했습니다. data/story/prologue.json을 확인하세요.",
    ];
  }

  if (paragraphs.length === 0) {
    paragraphs = ["프롤로그 데이터가 비어 있습니다."];
  }

  let paragraphIndex = 0;
  let charIndex = 0;
  let isTyping = false;
  let waitingForClick = false;
  let isFinished = false;
  let typingTimer = null;
  let currentP = null;

  function updateButtons() {
    if (isFinished) {
      nextBtn.disabled = false;
      nextBtn.textContent = "다음으로";
      skipBtn.textContent = "전체 표시";
      return;
    }

    nextBtn.disabled = true;

    if (isTyping) {
      skipBtn.textContent = "현재 문장 즉시 표시";
    } else if (waitingForClick) {
      skipBtn.textContent = "전체 표시";
    }
  }

  function goNext() {
    window.location.href = "/chapter/1";
  }

  function finishAll() {
    isTyping = false;
    waitingForClick = false;
    isFinished = true;
    updateButtons();
  }

  function startParagraph() {
    if (paragraphIndex >= paragraphs.length) {
      finishAll();
      return;
    }

    isTyping = true;
    waitingForClick = false;
    charIndex = 0;

    currentP = document.createElement("p");
    currentP.className = "prologue-paragraph";
    textEl.appendChild(currentP);
    textEl.scrollTop = textEl.scrollHeight;

    updateButtons();
    typeNextChar();
  }

  function completeCurrentParagraph() {
    clearTimeout(typingTimer);

    if (!currentP) return;

    currentP.textContent = paragraphs[paragraphIndex];
    textEl.scrollTop = textEl.scrollHeight;

    isTyping = false;
    waitingForClick = true;
    updateButtons();
  }

  function typeNextChar() {
    if (paragraphIndex >= paragraphs.length) {
      finishAll();
      return;
    }

    const currentText = paragraphs[paragraphIndex];

    if (charIndex < currentText.length) {
      currentP.textContent += currentText.charAt(charIndex);
      charIndex += 1;
      textEl.scrollTop = textEl.scrollHeight;
      typingTimer = setTimeout(typeNextChar, 22);
    } else {
      isTyping = false;
      waitingForClick = true;
      updateButtons();
    }
  }

  function showAllText() {
    clearTimeout(typingTimer);
    textEl.innerHTML = "";

    paragraphs.forEach((paragraph) => {
      const p = document.createElement("p");
      p.className = "prologue-paragraph";
      p.textContent = paragraph;
      textEl.appendChild(p);
    });

    textEl.scrollTop = textEl.scrollHeight;
    finishAll();
  }

  function advanceOneStep() {
    if (isFinished) {
      goNext();
      return;
    }

    if (isTyping) {
      completeCurrentParagraph();
      return;
    }

    if (waitingForClick) {
      paragraphIndex += 1;

      if (paragraphIndex >= paragraphs.length) {
        finishAll();
        return;
      }

      startParagraph();
    }
  }

  skipBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isFinished) {
      goNext();
      return;
    }

    if (isTyping) {
      completeCurrentParagraph();
      return;
    }

    if (waitingForClick) {
      showAllText();
    }
  });

  nextBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (isFinished) {
      goNext();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedButton = event.target.closest("button");
    if (clickedButton) return;
    advanceOneStep();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advanceOneStep();
    }
  });

  startParagraph();
});