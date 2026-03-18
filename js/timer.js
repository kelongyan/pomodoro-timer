/**
 * 计时器逻辑模块 - 负责计时器的核心功能
 */

/**
 * 启动计时器
 */
function startTimer() {
  if (AppState.timerInterval) return;

  AppState.status = "running";
  updateStatusUI();

  AppState.timerInterval = setInterval(() => {
    if (isStopwatchMode()) {
      // 正向计时模式：时间递增
      AppState.timeElapsed++;
      updateDisplay();
    } else {
      // 倒计时模式：时间递减
      AppState.timeRemaining--;

      if (AppState.timeRemaining <= 0) {
        timerComplete();
      } else {
        updateDisplay();
      }
    }
  }, 1000);
}

/**
 * 暂停计时器
 */
function pauseTimer() {
  if (AppState.timerInterval) {
    clearInterval(AppState.timerInterval);
    AppState.timerInterval = null;
  }
  AppState.status = "paused";
  updateStatusUI();
}

/**
 * 重置计时器
 */
function resetTimer() {
  pauseTimer();
  AppState.status = "ready";
  
  if (isStopwatchMode()) {
    // 正向计时模式：重置已计时时间为0
    AppState.timeElapsed = 0;
  } else {
    setPhaseTime();
  }
  
  updateDisplay();
  updateStatusUI();
}

/**
 * 计时器完成处理
 */
function timerComplete() {
  pauseTimer();

  // 播放提示音
  if (AppState.settings.sound !== "none") {
    AudioManager.playSound(AppState.settings.sound);
  }

  // 根据当前阶段处理完成逻辑
  if (AppState.phase === "focus") {
    // 专注阶段完成
    NotificationManager.sendFocusComplete();

    AppState.pomodorosCompleted++;
    AppState.pomodorosInSet++;
    AppState.todayPomodoros++;
    AppState.todayFocusMinutes += AppState.settings.focusTime;

    // 检查是否需要长休息
    if (AppState.pomodorosInSet >= 4) {
      AppState.pomodorosInSet = 0;
      switchPhase("long-break");
    } else {
      switchPhase("break");
    }
  } else {
    // 休息阶段完成
    NotificationManager.sendBreakComplete();
    switchPhase("focus");
  }

  // 保存数据
  AppState.lastActiveDate = new Date().toDateString();
  StorageManager.save();

  // 更新 UI
  updatePomodoroDots();
  updateStats();
  updatePhaseUI();
  updateDisplay();

  // 自动开始下一阶段
  AppState.status = "ready";
  updateStatusUI();

  // 延迟自动开始
  setTimeout(() => {
    startTimer();
  }, 1000);
}

/**
 * 跳过当前阶段
 */
function skipPhase() {
  // 正向计时模式下，跳过等同于重置
  if (isStopwatchMode()) {
    resetTimer();
    return;
  }

  // 如果在专注中跳过，不计入完成
  if (AppState.phase === "focus" && AppState.status === "running") {
    AppState.pomodorosInSet = 0;
  }

  pauseTimer();

  if (AppState.phase === "focus") {
    if (AppState.pomodorosInSet >= 4) {
      switchPhase("long-break");
    } else {
      switchPhase("break");
    }
  } else {
    switchPhase("focus");
  }

  AppState.status = "ready";
  updatePhaseUI();
  updateDisplay();
  updateStatusUI();
  updatePomodoroDots();
}

/**
 * 切换计时器状态（开始/暂停）
 */
function toggleTimer() {
  if (AppState.status === "running") {
    pauseTimer();
  } else {
    startTimer();
  }
}

// 导出函数
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.timerComplete = timerComplete;
window.skipPhase = skipPhase;
window.toggleTimer = toggleTimer;
