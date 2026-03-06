/**
 * 存储管理模块 - 负责本地数据持久化
 */

const StorageManager = {
  STORAGE_KEY: "pomodoroTimer",

  /**
   * 保存数据到 localStorage
   */
  save() {
    const data = {
      settings: AppState.settings,
      theme: AppState.theme,
      todayPomodoros: AppState.todayPomodoros,
      todayFocusMinutes: AppState.todayFocusMinutes,
      lastActiveDate: AppState.lastActiveDate,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * 从 localStorage 加载数据
   */
  load() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      AppState.settings = { ...AppState.settings, ...parsed.settings };
      AppState.lastActiveDate = parsed.lastActiveDate;

      // 加载主题设置
      if (parsed.theme) {
        AppState.theme = parsed.theme;
      }

      // 检查是否是同一天
      const today = new Date().toDateString();
      if (parsed.lastActiveDate === today) {
        AppState.todayPomodoros = parsed.todayPomodoros || 0;
        AppState.todayFocusMinutes = parsed.todayFocusMinutes || 0;
      } else {
        AppState.todayPomodoros = 0;
        AppState.todayFocusMinutes = 0;
      }
    }
  },

  /**
   * 清除所有存储数据
   */
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  },
};

// 导出模块
window.StorageManager = StorageManager;
