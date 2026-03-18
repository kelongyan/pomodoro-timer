/**
 * 状态管理模块 - 负责应用状态的定义和管理
 */

const AppState = {
  // 计时器状态
  phase: "focus", // 'focus' | 'break' | 'long-break' | 'stopwatch'
  status: "ready", // 'ready' | 'running' | 'paused'
  timeRemaining: 25 * 60, // 秒（倒计时模式）
  totalTime: 25 * 60,
  timeElapsed: 0, // 秒（正向计时模式已计时时间）

  // 番茄计数
  pomodorosCompleted: 0,
  pomodorosInSet: 0, // 当前周期内的番茄数（0-3）

  // 统计
  todayPomodoros: 0,
  todayFocusMinutes: 0,
  lastActiveDate: null,

  // 主题
  theme: "light", // 'light' | 'dark'

  // 设置
  settings: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sound: "chime",
  },

  // 计时器引用
  timerInterval: null,
};

/**
 * 判断是否为正向计时模式
 */
function isStopwatchMode() {
  return AppState.phase === "stopwatch";
}

/**
 * 获取当前的阶段标签文本
 */
function getPhaseLabel() {
  const phaseLabels = {
    focus: "专注",
    break: "短休息",
    "long-break": "长休息",
    stopwatch: "正向计时",
  };
  return phaseLabels[AppState.phase];
}

/**
 * 获取当前状态文本
 */
function getStatusText() {
  const statusTexts = {
    ready: "准备就绪",
    running: AppState.phase === "focus" ? "专注中" : (AppState.phase === "stopwatch" ? "计时中" : "休息中"),
    paused: "已暂停",
  };
  return statusTexts[AppState.status];
}

/**
 * 获取当前阶段的时间（秒）
 */
function getPhaseTime() {
  const times = {
    focus: AppState.settings.focusTime * 60,
    break: AppState.settings.shortBreak * 60,
    "long-break": AppState.settings.longBreak * 60,
    stopwatch: 0, // 正向计时模式不需要预设时间
  };
  return times[AppState.phase];
}

/**
 * 设置当前阶段的时间
 */
function setPhaseTime() {
  if (isStopwatchMode()) {
    // 正向计时模式：使用已计时时间
    AppState.totalTime = 0;
    AppState.timeRemaining = 0;
    // timeElapsed 保持不变或重置为0（根据状态）
  } else {
    AppState.totalTime = getPhaseTime();
    AppState.timeRemaining = AppState.totalTime;
  }
}

/**
 * 切换到指定阶段
 */
function switchPhase(newPhase) {
  AppState.phase = newPhase;
  setPhaseTime();
}

/**
 * 格式化时间显示
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * 切换主题
 */
function toggleTheme() {
  AppState.theme = AppState.theme === "light" ? "dark" : "light";
  applyTheme();
  return AppState.theme;
}

/**
 * 应用主题到文档
 */
function applyTheme() {
  if (AppState.theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

/**
 * 设置指定主题
 */
function setTheme(theme) {
  AppState.theme = theme === "dark" ? "dark" : "light";
  applyTheme();
}

// 导出模块
window.AppState = AppState;
window.isStopwatchMode = isStopwatchMode;
window.getPhaseLabel = getPhaseLabel;
window.getStatusText = getStatusText;
window.getPhaseTime = getPhaseTime;
window.setPhaseTime = setPhaseTime;
window.switchPhase = switchPhase;
window.formatTime = formatTime;
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
window.setTheme = setTheme;
