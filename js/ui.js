/**
 * UI 更新模块 - 负责界面的更新和渲染
 */

// ==================== DOM 元素引用 ====================
const DOM = {
  // 主显示元素
  timeDisplay: document.getElementById("timeDisplay"),
  phaseLabel: document.getElementById("phaseLabel"),

  // 沙漏视觉元素
  timerRingContainer: document.getElementById("timerRingContainer"),
  ringProgress: document.getElementById("ringProgress"),
  ringProgressBar: document.getElementById("ringProgressBar"),

  // 控制按钮
  mainBtn: document.getElementById("mainBtn"),
  mainBtnText: document.getElementById("mainBtnText"),
  playIcon: document.getElementById("playIcon"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),
  skipBtn: document.getElementById("skipBtn"),

  // 顶部控制
  themeToggle: document.getElementById("themeToggle"),
  settingsToggle: document.getElementById("settingsToggle"),
  fullscreenToggle: document.getElementById("fullscreenToggle"),

  // 设置面板
  settingsPanel: document.getElementById("settingsPanel"),
  settingsOverlay: document.getElementById("settingsOverlay"),
  settingsClose: document.getElementById("settingsClose"),
  focusTimeInput: document.getElementById("focusTime"),
  shortBreakInput: document.getElementById("shortBreak"),
  longBreakInput: document.getElementById("longBreak"),
  resetSettingsBtn: document.getElementById("resetSettingsBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),

  // 模式切换标签
  modeTabs: document.getElementById("modeTabs"),

  // 兼容性元素（保留但可能隐藏）
  statusBadge: document.getElementById("statusBadge"),
  statusText: document.getElementById("statusText"),
  pomodoroCount: document.getElementById("pomodoroCount"),
  todayCount: document.getElementById("todayCount"),
  totalTime: document.getElementById("totalTime"),
  statsContainer: document.getElementById("statsContainer"),

  // 兼容性 ID（用户要求保留）
  timer: document.getElementById("timer"),
  startBtn: document.getElementById("startBtn"),
  settingsModal: document.getElementById("settingsModal"),
  settingsBtn: document.getElementById("settingsBtn"),
};

// ==================== UI 更新函数 ====================

/**
 * 更新时间显示和进度
 */
function updateDisplay() {
  // 更新时间显示
  DOM.timeDisplay.textContent = formatTime(AppState.timeRemaining);

  // 更新沙漏填充高度
  const progress = AppState.timeRemaining / AppState.totalTime;
  const fillHeight = `${progress * 100}%`;
  if (DOM.ringProgress) {
    DOM.ringProgress.style.height = fillHeight;
  }

  // 更新进度条
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    progressFill.style.width = `${(1 - progress) * 100}%`;
  }

  // 更新页面标题
  document.title = `${DOM.timeDisplay.textContent} | 番茄时钟`;

  // 更新兼容性元素
  if (DOM.timer) {
    DOM.timer.textContent = DOM.timeDisplay.textContent;
  }
}

/**
 * 更新阶段相关的 UI
 */
function updatePhaseUI() {
  const phaseLabels = {
    focus: "专注",
    break: "短休息",
    "long-break": "长休息",
  };

  if (DOM.phaseLabel) {
    DOM.phaseLabel.textContent = phaseLabels[AppState.phase] || "专注";
  }

  // 更新沙漏容器样式
  if (DOM.timerRingContainer) {
    DOM.timerRingContainer.className = "hourglass-visual";
    if (AppState.phase === "break") {
      DOM.timerRingContainer.classList.add("break");
    } else if (AppState.phase === "long-break") {
      DOM.timerRingContainer.classList.add("long-break");
    } else if (AppState.status === "running") {
      DOM.timerRingContainer.classList.add("focus");
    }

    // 添加阶段切换动画
    DOM.timerRingContainer.classList.add("phase-transition");
    setTimeout(() => {
      DOM.timerRingContainer.classList.remove("phase-transition");
    }, 500);
  }

  // 更新时间显示动画
  if (DOM.timeDisplay) {
    DOM.timeDisplay.classList.add("phase-change");
    setTimeout(() => {
      DOM.timeDisplay.classList.remove("phase-change");
    }, 500);
  }

  // 更新阶段指示器动画
  const phaseIndicator = document.querySelector(".phase-indicator");
  if (phaseIndicator) {
    phaseIndicator.classList.add("phase-change");
    setTimeout(() => {
      phaseIndicator.classList.remove("phase-change");
    }, 400);
  }

  // 更新模式标签
  updateModeTabs();
}

/**
 * 更新模式切换标签
 */
function updateModeTabs() {
  if (!DOM.modeTabs) return;

  const tabs = DOM.modeTabs.querySelectorAll(".mode-tab");
  tabs.forEach((tab) => {
    const mode = tab.dataset.mode;
    const wasActive = tab.classList.contains("active");

    if (mode === AppState.phase) {
      tab.classList.add("active");
      // 触发动画
      if (!wasActive) {
        tab.style.animation = "none";
        tab.offsetHeight; // 触发重排
        tab.style.animation = "";
      }
    } else {
      tab.classList.remove("active");
    }
  });
}

/**
 * 处理模式切换
 * @param {string} mode - 目标模式
 */
function handleModeSwitch(mode) {
  if (mode === AppState.phase) return;

  pauseTimer();
  switchPhase(mode);
  AppState.status = "ready";
  updatePhaseUI();
  updateDisplay();
  updateStatusUI();
}

/**
 * 更新状态相关的 UI
 */
function updateStatusUI() {
  const statusTexts = {
    ready: "准备就绪",
    running: AppState.phase === "focus" ? "专注中" : "休息中",
    paused: "已暂停",
  };

  // 更新隐藏的状态标签（兼容性）
  if (DOM.statusText) {
    DOM.statusText.textContent = statusTexts[AppState.status];
  }
  if (DOM.statusBadge) {
    DOM.statusBadge.className = "status-badge";
    if (AppState.status === "running") {
      DOM.statusBadge.classList.add(AppState.phase);
    }
  }

  // 更新主按钮图标
  const mainBtnSvg = DOM.mainBtn?.querySelector("svg");
  if (mainBtnSvg && DOM.playIcon) {
    if (AppState.status === "running") {
      // 显示暂停图标
      mainBtnSvg.innerHTML =
        '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>';
    } else {
      // 显示播放图标
      mainBtnSvg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
  }
}

/**
 * 更新番茄计数点（兼容性）
 */
function updatePomodoroDots() {
  if (DOM.pomodoroCount) {
    const dots = DOM.pomodoroCount.querySelectorAll(".pomodoro-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("completed", index < AppState.pomodorosInSet);
    });
  }
}

/**
 * 更新统计信息（兼容性）
 */
function updateStats() {
  if (DOM.todayCount) {
    DOM.todayCount.textContent = AppState.todayPomodoros;
  }
  if (DOM.totalTime) {
    DOM.totalTime.textContent = AppState.todayFocusMinutes;
  }
}

/**
 * 更新设置面板 UI
 */
function updateSettingsUI() {
  if (DOM.focusTimeInput) {
    DOM.focusTimeInput.value = AppState.settings.focusTime;
  }
  if (DOM.shortBreakInput) {
    DOM.shortBreakInput.value = AppState.settings.shortBreak;
  }
  if (DOM.longBreakInput) {
    DOM.longBreakInput.value = AppState.settings.longBreak;
  }

  const soundRadio = document.querySelector(
    `input[name="sound"][value="${AppState.settings.sound}"]`,
  );
  if (soundRadio) soundRadio.checked = true;
}

// ==================== 设置面板控制 ====================

/**
 * 打开设置面板
 */
function openSettings() {
  if (DOM.settingsPanel) {
    DOM.settingsPanel.classList.add("open");
  }
  if (DOM.settingsOverlay) {
    DOM.settingsOverlay.classList.add("open");
  }

  // 兼容性：同时更新 settingsModal
  if (DOM.settingsModal) {
    DOM.settingsModal.classList.add("open");
  }
}

/**
 * 关闭设置面板
 */
function closeSettings() {
  if (DOM.settingsPanel) {
    DOM.settingsPanel.classList.remove("open");
  }
  if (DOM.settingsOverlay) {
    DOM.settingsOverlay.classList.remove("open");
  }

  // 兼容性：同时更新 settingsModal
  if (DOM.settingsModal) {
    DOM.settingsModal.classList.remove("open");
  }
}

/**
 * 处理设置变更
 */
function handleSettingsChange() {
  AppState.settings.focusTime = parseInt(DOM.focusTimeInput?.value) || 25;
  AppState.settings.shortBreak = parseInt(DOM.shortBreakInput?.value) || 5;
  AppState.settings.longBreak = parseInt(DOM.longBreakInput?.value) || 15;

  const selectedSound = document.querySelector('input[name="sound"]:checked');
  if (selectedSound) {
    AppState.settings.sound = selectedSound.value;
  }

  // 如果计时器未运行，更新时间
  if (AppState.status === "ready") {
    setPhaseTime();
    updateDisplay();
  }

  StorageManager.save();
}

/**
 * 恢复默认设置
 */
function resetSettings() {
  AppState.settings = {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sound: "chime",
  };

  updateSettingsUI();

  if (AppState.status === "ready") {
    setPhaseTime();
    updateDisplay();
  }

  StorageManager.save();
}

// 导出函数
window.DOM = DOM;
window.updateDisplay = updateDisplay;
window.updatePhaseUI = updatePhaseUI;
window.updateStatusUI = updateStatusUI;
window.updatePomodoroDots = updatePomodoroDots;
window.updateStats = updateStats;
window.updateSettingsUI = updateSettingsUI;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.handleSettingsChange = handleSettingsChange;
window.handleModeSwitch = handleModeSwitch;
window.resetSettings = resetSettings;
