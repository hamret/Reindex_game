function showScreen(targetId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => screen.classList.remove("active"));

  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add("active");

    if (targetId === "screen-play" && window.startInstituteTerminal) {
      window.startInstituteTerminal();
    }
  }
}

function hideOverlayById(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove("visible");
  }
}

function showOverlayById(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add("visible");
  }
}

function requestFullscreen() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(() => {});
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

async function checkBackendHealth() {
  const statusEl = document.getElementById("status-connection");
  if (!statusEl) return;

  statusEl.textContent = "백엔드 연결: 확인 중...";

  try {
    const response = await fetch("/health", { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "ok") {
      statusEl.textContent = "백엔드 연결: 정상";
    } else {
      statusEl.textContent = "백엔드 연결: 응답 이상";
    }
  } catch (error) {
    statusEl.textContent = "백엔드 연결: 실패";
  }
}

function initDustBackground() {
  const canvas = document.getElementById("dust-layer");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const particles = [];
  const particleCount = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.5,
      vx: (Math.random() - 0.5) * 0.06,
      vy: Math.random() * 0.16 + 0.03,
      alpha: Math.random() * 0.18 + 0.03,
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

      if (p.y > height + 8) {
        p.y = -8;
        p.x = Math.random() * width;
      }

      if (p.x < -8) p.x = width + 8;
      if (p.x > width + 8) p.x = -8;

      ctx.beginPath();
      ctx.fillStyle = `rgba(215, 230, 238, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  resize();
  seedParticles();
  animate();

  window.addEventListener("resize", resize);
}

document.addEventListener("DOMContentLoaded", () => {
  initDustBackground();
  checkBackendHealth();

  const fadeLayer = document.getElementById("screen-fade");
  const STORAGE_KEY = "reindex_groq_api_key";

  function playFadeAndShow(targetId) {
    if (!fadeLayer) {
      showScreen(targetId);
      return;
    }

    fadeLayer.classList.add("visible");

    setTimeout(() => {
      showScreen(targetId);

      setTimeout(() => {
        fadeLayer.classList.remove("visible");
      }, 260);
    }, 260);
  }

  const terminalEl = document.getElementById("terminal-lines");
  const terminalScript = [
    "REINDEX INSTITUTE // Cognitive Archive Interface",
    "Boot sequence: OK",
    "Node ID: R-01 / Workstation ONLINE",
    "Operator link: VERIFIED",
    "",
    "Loading reconstruction index...",
    "  › Case registry: FOUND",
    "  › Memory shards: PENDING CLASSIFICATION",
    "",
    "Awaiting first reconstruction request from operator."
  ];

  let termLineIndex = 0;
  let termCharIndex = 0;
  let termStarted = false;
  let termTimer = null;

  function typeNextTerminalChar() {
    if (!terminalEl) return;

    if (termLineIndex >= terminalScript.length) {
      const caret = document.createElement("span");
      caret.className = "crt-caret";
      terminalEl.appendChild(caret);
      return;
    }

    const currentLine = terminalScript[termLineIndex];

    if (termCharIndex === 0) {
      const lineEl = document.createElement("div");
      lineEl.className = "crt-line";
      lineEl.dataset.lineIndex = String(termLineIndex);
      terminalEl.appendChild(lineEl);
      terminalEl.scrollTop = terminalEl.scrollHeight;
    }

    const lineEl = terminalEl.querySelector(
      `.crt-line[data-line-index="${termLineIndex}"]`
    );
    if (!lineEl) return;

    if (termCharIndex < currentLine.length) {
      lineEl.textContent += currentLine.charAt(termCharIndex);
      termCharIndex += 1;
      terminalEl.scrollTop = terminalEl.scrollHeight;
      termTimer = setTimeout(typeNextTerminalChar, 26);
    } else {
      termLineIndex += 1;
      termCharIndex = 0;
      termTimer = setTimeout(typeNextTerminalChar, currentLine === "" ? 260 : 120);
    }
  }

  function startInstituteTerminal() {
    if (termStarted) return;
    termStarted = true;

    if (!terminalEl) return;
    terminalEl.innerHTML = "";
    termLineIndex = 0;
    termCharIndex = 0;

    if (termTimer) {
      clearTimeout(termTimer);
      termTimer = null;
    }

    typeNextTerminalChar();
  }

  window.startInstituteTerminal = startInstituteTerminal;

  function startGameFlow() {
    playFadeAndShow("screen-play");
  }

  function handlePlayClick() {
    const key = localStorage.getItem(STORAGE_KEY);

    if (key && key.trim().length > 0) {
      startGameFlow();
      return;
    }

    showOverlayById("overlay-api-warning");
  }

  document.querySelectorAll(".menu-item").forEach((button) => {
    const targetId = button.getAttribute("data-target");

    if (targetId === "screen-play") {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        handlePlayClick();
      });
    } else {
      button.addEventListener("click", () => {
        if (targetId) {
          showScreen(targetId);
        }
      });
    }
  });

  document
    .querySelectorAll("[data-target='screen-main-menu']")
    .forEach((button) => {
      button.addEventListener("click", () => {
        showScreen("screen-main-menu");
      });
    });

  const btnEnterFullscreen = document.getElementById("btn-enter-fullscreen");
  const btnSkipFullscreen = document.getElementById("btn-skip-fullscreen");
  const btnOpenApiSettings = document.getElementById("btn-open-api-settings");
  const btnDevPlay = document.getElementById("btn-dev-play");
  const btnCloseApiWarning = document.getElementById("btn-close-api-warning");
  const btnSaveApiKey = document.getElementById("btn-save-api-key");
  const btnClearApiKey = document.getElementById("btn-clear-api-key");
  const inputApiKey = document.getElementById("input-api-key");
  const labelApiStatus = document.getElementById("label-api-status");
  const btnQuitConfirm = document.getElementById("btn-quit-confirm");

  if (btnEnterFullscreen) {
    btnEnterFullscreen.addEventListener("click", () => {
      requestFullscreen();
      hideOverlayById("overlay-fullscreen");
    });
  }

  if (btnSkipFullscreen) {
    btnSkipFullscreen.addEventListener("click", () => {
      hideOverlayById("overlay-fullscreen");
    });
  }

  if (btnOpenApiSettings) {
    btnOpenApiSettings.addEventListener("click", () => {
      hideOverlayById("overlay-api-warning");
      showScreen("screen-api-key");
    });
  }

  if (btnDevPlay) {
    btnDevPlay.addEventListener("click", () => {
      hideOverlayById("overlay-api-warning");
      startGameFlow();
    });
  }

  if (btnCloseApiWarning) {
    btnCloseApiWarning.addEventListener("click", () => {
      hideOverlayById("overlay-api-warning");
    });
  }

  function refreshApiStatus() {
    const key = localStorage.getItem(STORAGE_KEY);
    if (labelApiStatus) {
      labelApiStatus.textContent =
        key && key.length > 0 ? "저장된 키 있음" : "저장된 키 없음";
    }
  }

  if (btnSaveApiKey && inputApiKey) {
    btnSaveApiKey.addEventListener("click", () => {
      const value = inputApiKey.value.trim();
      if (!value) {
        alert("API 키를 입력해 주세요.");
        return;
      }

      localStorage.setItem(STORAGE_KEY, value);
      inputApiKey.value = "";
      refreshApiStatus();
      alert("API 키가 저장되었습니다. (로컬 브라우저 저장)");
    });
  }

  if (btnClearApiKey) {
    btnClearApiKey.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      refreshApiStatus();
      alert("저장된 API 키가 삭제되었습니다.");
    });
  }

  refreshApiStatus();

  if (btnQuitConfirm) {
    btnQuitConfirm.addEventListener("click", () => {
      try {
        window.close();
      } catch {
        alert("브라우저에서는 탭 또는 창을 직접 닫아 주세요.");
      }
    });
  }
});