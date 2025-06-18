class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    this.sounds = {
      correct: new Audio('/sounds/correct.mp3'),
      incorrect: new Audio('/sounds/incorrect.mp3'),
      gameOver: new Audio('/sounds/game-over.mp3'),
      levelUp: new Audio('/sounds/level-up.mp3'),
      achievement: new Audio('/sounds/achievement.mp3'),
    };
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public play(soundName: keyof typeof this.sounds) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }

  public stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

export const soundManager = new SoundManager(); 