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

  const STORAGE_KEY = "reindex_groq_api_key";

  const terminalEl = document.getElementById("terminal-lines");

  function formatTerminalLine(line) {
  if (line.startsWith("mimic:")) {
    return `> ${line}`;
  }
  return line;
}
const terminalScript = [
  "REINDEX INSTITUTE // MIMIC INTERFACE",
  "Boot sequence: OK",
  "AI core: mimic",
  "Node ID: R-01 / Workstation ONLINE",
  "Operator link: VERIFIED",
  "",
  "Loading reconstruction index...",
  "  > Case registry: FOUND",
  "  > Memory shards: PENDING CLASSIFICATION",
  "  > Emotional echo map: UNSTABLE",
  "",
  "mimic: 연산자 동기화가 완료되었습니다.",
  "mimic: 첫 번째 재구성 요청을 기다리고 있습니다."
];

let termLineIndex = 0;
let termCharIndex = 0;
let termTimer = null;
let caretEl = null;

function ensureCaret() {
  if (!terminalEl) return;

  if (!caretEl || !caretEl.isConnected) {
    caretEl = document.createElement("span");
    caretEl.className = "crt-caret";
    caretEl.textContent = "_";
    terminalEl.appendChild(caretEl);
  }

  terminalEl.scrollTop = terminalEl.scrollHeight;
}

function typeNextTerminalChar() {
  if (!terminalEl) return;

  if (termLineIndex >= terminalScript.length) {
    ensureCaret();
    return;
  }

  const currentLine = formatTerminalLine(terminalScript[termLineIndex]);

  if (termCharIndex === 0) {
    const lineEl = document.createElement("div");
    lineEl.className = "crt-line";
    lineEl.dataset.lineIndex = String(termLineIndex);
    terminalEl.appendChild(lineEl);
  }

  const lineEl = terminalEl.querySelector(
    `.crt-line[data-line-index="${termLineIndex}"]`
  );

  if (!lineEl) return;

  if (caretEl && caretEl.isConnected) {
    caretEl.remove();
  }

  if (termCharIndex < currentLine.length) {
    lineEl.textContent += currentLine.charAt(termCharIndex);
    termCharIndex += 1;
    terminalEl.scrollTop = terminalEl.scrollHeight;
    ensureCaret();
    termTimer = setTimeout(typeNextTerminalChar, 24);
    return;
  }

  termLineIndex += 1;
  termCharIndex = 0;
  ensureCaret();
  termTimer = setTimeout(typeNextTerminalChar, currentLine === "" ? 220 : 100);
}

function startInstituteTerminal() {
  if (!terminalEl) return;

  if (termTimer) {
    clearTimeout(termTimer);
    termTimer = null;
  }

  terminalEl.innerHTML = "";
  termLineIndex = 0;
  termCharIndex = 0;
  caretEl = null;

  ensureCaret();
  typeNextTerminalChar();
}

window.startInstituteTerminal = startInstituteTerminal;

  const btnPlay = document.getElementById("btn-play");
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

  function refreshApiStatus() {
    const key = localStorage.getItem(STORAGE_KEY);
    if (labelApiStatus) {
      labelApiStatus.textContent =
        key && key.trim().length > 0 ? "저장된 키 있음" : "저장된 키 없음";
    }
  }

  function startGameFlow() {
    window.location.href = "/prologue";
  }

  function handlePlayClick() {
    const key = localStorage.getItem(STORAGE_KEY);

    if (key && key.trim().length > 0) {
      startGameFlow();
      return;
    }

    showOverlayById("overlay-api-warning");
  }

  if (btnPlay) {
    btnPlay.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      handlePlayClick();
    });
  }

  document.querySelectorAll(".menu-item[data-target]").forEach((button) => {
    if (button.id === "btn-play") return;

    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      if (targetId) {
        showScreen(targetId);
      }
    });
  });

  document
    .querySelectorAll("[data-target='screen-main-menu']")
    .forEach((button) => {
      button.addEventListener("click", () => {
        showScreen("screen-main-menu");
      });
    });

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

  if (btnQuitConfirm) {
    btnQuitConfirm.addEventListener("click", () => {
      try {
        window.close();
      } catch {
        alert("브라우저에서는 탭 또는 창을 직접 닫아 주세요.");
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const initialScreen = params.get("screen");

  if (initialScreen === "play") {
    showScreen("screen-play");
  }

  refreshApiStatus();
});