/**
 * 音频管理模块 - 负责提示音的播放
 */

const AudioManager = {
  audioContext: null,

  /**
   * 初始化音频上下文
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
  },

  /**
   * 播放风铃声
   */
  playChime() {
    if (!this.audioContext) this.init();
    const ctx = this.audioContext;

    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        ctx.currentTime + i * 0.1 + 0.05,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + i * 0.1 + 0.8,
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 1);
    });
  },

  /**
   * 播放铃声
   */
  playBell() {
    if (!this.audioContext) this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.5);

    // 第二声
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, ctx.currentTime);

      gain2.gain.setValueAtTime(0.4, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 1);
    }, 800);
  },

  /**
   * 根据类型播放提示音
   * @param {string} type - 提示音类型: 'chime' | 'bell' | 'none'
   */
  playSound(type) {
    if (type === "chime") {
      this.playChime();
    } else if (type === "bell") {
      this.playBell();
    }
    // 'none' 不播放任何声音
  },
};

// 导出模块
window.AudioManager = AudioManager;
