/**
 * 事件监听模块 - 负责绑定所有事件处理程序
 */

/**
 * 初始化所有事件监听
 */
function initEventListeners() {
  // 主按钮 - 开始/暂停
  DOM.mainBtn.addEventListener("click", toggleTimer);

  // 重置按钮
  DOM.resetBtn.addEventListener("click", resetTimer);

  // 跳过按钮
  DOM.skipBtn.addEventListener("click", skipPhase);

  // 设置面板开关
  DOM.settingsToggle.addEventListener("click", openSettings);
  DOM.settingsClose.addEventListener("click", closeSettings);
  DOM.settingsOverlay.addEventListener("click", closeSettings);

  // 主题切换
  DOM.themeToggle.addEventListener("click", handleThemeToggle);

  // 设置面板内主题切换按钮
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener("click", handleThemeToggle);
  }

  // 全屏切换
  DOM.fullscreenToggle.addEventListener("click", toggleFullscreen);

  // 模式标签切换
  if (DOM.modeTabs) {
    DOM.modeTabs.querySelectorAll(".mode-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.mode;
        handleModeSwitch(mode);
      });
    });
  }

  // 设置变更监听
  DOM.focusTimeInput.addEventListener("change", handleSettingsChange);
  DOM.shortBreakInput.addEventListener("change", handleSettingsChange);
  DOM.longBreakInput.addEventListener("change", handleSettingsChange);

  document.querySelectorAll('input[name="sound"]').forEach((radio) => {
    radio.addEventListener("change", handleSettingsChange);
  });

  // 恢复默认设置
  if (DOM.resetSettingsBtn) {
    DOM.resetSettingsBtn.addEventListener("click", resetSettings);
  }

  // 键盘快捷键
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // 页面可见性变化
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // 全屏变化监听
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);

  // 初始化音频上下文（需要用户交互后）
  initAudioOnInteraction();
}

/**
 * 处理键盘快捷键
 * @param {KeyboardEvent} e
 */
function handleKeyboardShortcuts(e) {
  // 如果焦点在输入框中，不触发快捷键
  if (e.target.tagName === "INPUT") return;

  if (e.code === "Space") {
    e.preventDefault();
    toggleTimer();
  } else if (e.code === "KeyR") {
    resetTimer();
  } else if (e.code === "KeyS") {
    skipPhase();
  } else if (e.code === "KeyF") {
    toggleFullscreen();
  }
}

/**
 * 切换全屏模式
 */
function toggleFullscreen() {
  if (!document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement) {
    // 进入全屏
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
  }
}

/**
 * 处理全屏状态变化
 */
function handleFullscreenChange() {
  const isFullscreen = !!(document.fullscreenElement ||
                         document.webkitFullscreenElement ||
                         document.mozFullScreenElement);
  document.documentElement.setAttribute("data-fullscreen", isFullscreen);
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
  if (document.hidden && AppState.status === "running") {
    // 页面隐藏时，更新标题显示剩余时间
    document.title = `${formatTime(AppState.timeRemaining)} | 番茄时钟`;
  }
}

/**
 * 用户首次交互时初始化音频上下文
 */
function initAudioOnInteraction() {
  document.addEventListener(
    "click",
    () => {
      if (!AudioManager.audioContext) {
        AudioManager.init();
      }
    },
    { once: true },
  );
}

/**
 * 处理主题切换
 */
function handleThemeToggle() {
  const newTheme = toggleTheme();
  updateThemeToggleBtn();
  StorageManager.save();
  console.log(`🎨 主题已切换为: ${newTheme === "dark" ? "深色" : "浅色"}`);
}

/**
 * 更新设置面板内主题切换按钮的显示
 */
function updateThemeToggleBtn() {
  if (DOM.themeToggleBtn) {
    const icon = DOM.themeToggleBtn.querySelector(".theme-icon");
    const text = DOM.themeToggleBtn.querySelector(".theme-text");
    if (icon) {
      icon.textContent = AppState.theme === "dark" ? "☀️" : "🌙";
    }
    if (text) {
      text.textContent = AppState.theme === "dark" ? "浅色模式" : "深色模式";
    }
  }
}

// 导出函数
window.initEventListeners = initEventListeners;
window.handleThemeToggle = handleThemeToggle;
window.updateThemeToggleBtn = updateThemeToggleBtn;
window.toggleFullscreen = toggleFullscreen;
window.handleFullscreenChange = handleFullscreenChange;
window.updateThemeToggleBtn = updateThemeToggleBtn;
window.toggleFullscreen = toggleFullscreen;
window.handleFullscreenChange = handleFullscreenChange;
