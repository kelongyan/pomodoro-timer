/**
 * 通知管理模块 - 负责浏览器通知
 */

const NotificationManager = {
  /**
   * 请求通知权限
   */
  async requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  },

  /**
   * 发送浏览器通知
   * @param {string} title - 通知标题
   * @param {string} body - 通知内容
   */
  send(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>',
        badge:
          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>',
      });
    }
  },

  /**
   * 发送专注完成通知
   */
  sendFocusComplete() {
    this.send("专注完成！", "休息一下吧 ~");
  },

  /**
   * 发送休息结束通知
   */
  sendBreakComplete() {
    this.send("休息结束！", "开始新的专注吧 ~");
  },
};

// 导出模块
window.NotificationManager = NotificationManager;
