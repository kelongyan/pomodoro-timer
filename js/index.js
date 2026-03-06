/**
 * 番茄时钟 - 主入口文件
 * 负责初始化整个应用程序
 */

// ==================== 加载顺序很重要 ====================
// 1. state.js - 定义应用状态
// 2. audio.js - 音频管理
// 3. notification.js - 通知管理
// 4. storage.js - 存储管理
// 5. timer.js - 计时器逻辑（依赖 state, audio, notification, storage）
// 6. ui.js - UI 更新（依赖 state, timer）
// 7. events.js - 事件监听（依赖 timer, ui）
// 8. index.js - 主入口

/**
 * 初始化应用程序
 */
function init() {
  // 1. 加载存储的数据
  StorageManager.load();

  // 2. 应用主题
  applyTheme();

  // 3. 更新设置 UI
  updateSettingsUI();
  if (typeof updateThemeToggleBtn === "function") {
    updateThemeToggleBtn();
  }

  // 4. 设置初始时间
  setPhaseTime();

  // 5. 更新所有 UI
  updateDisplay();
  updatePhaseUI();
  updateStatusUI();
  updatePomodoroDots();
  updateStats();

  // 6. 初始化事件监听
  initEventListeners();

  // 7. 请求通知权限
  NotificationManager.requestPermission();

  console.log("🍅 番茄时钟已初始化");
}

// ==================== 启动应用 ====================
document.addEventListener("DOMContentLoaded", init);
