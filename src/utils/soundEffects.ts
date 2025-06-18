import { Howl } from 'howler';

interface SoundConfig {
  src: string[];
  volume: number;
  loop?: boolean;
}

interface SoundConfigs {
  [key: string]: SoundConfig;
}

type SoundKey = keyof typeof soundConfig;

const soundConfig: SoundConfigs = {
  correct: { src: ['/sounds/correct.mp3'], volume: 0.7 },
  wrong: { src: ['/sounds/wrong.mp3'], volume: 0.7 },
  background: { src: ['/sounds/background.mp3'], volume: 0.5, loop: true },
  achievement: { src: ['/sounds/achievement.mp3'], volume: 0.7 },
  'button-click': { src: ['/sounds/button-click.mp3'], volume: 0.4 },
  'game-over': { src: ['/sounds/game-over.mp3'], volume: 0.6 },
  'level-up': { src: ['/sounds/level-up.mp3'], volume: 0.8 }
};

const sounds: Partial<Record<SoundKey, Howl>> = {};

// Initialize sounds with error handling
Object.entries(soundConfig).forEach(([key, config]) => {
  try {
    const sound = new Howl({
      ...config,
      onloaderror: (id, error) => {
        console.warn(`Failed to load sound ${key}:`, error);
        // Don't store failed sounds
        delete sounds[key as SoundKey];
      },
      onplayerror: (id, error) => {
        console.warn(`Failed to play sound ${key}:`, error);
      }
    });
    
    // Only store successfully loaded sounds
    if (sound.state() === 'loaded') {
      sounds[key as SoundKey] = sound;
    }
  } catch (error) {
    console.warn(`Failed to initialize sound ${key}:`, error);
  }
});

let soundEnabled = true;
let musicEnabled = true;

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  if (!enabled) {
    // Stop all non-background sounds
    Object.entries(sounds).forEach(([key, sound]) => {
      if (key !== 'background') {
        sound?.stop();
      }
    });
  }
};

export const setMusicEnabled = (enabled: boolean): void => {
  musicEnabled = enabled;
  if (!enabled) {
    sounds.background?.stop();
  } else if (soundEnabled) {
    sounds.background?.play();
  }
};

export const playSound = (sound: SoundKey): void => {
  try {
    const soundInstance = sounds[sound];
    if (!soundInstance) {
      console.warn(`Sound ${sound} is not available`);
      return;
    }

    if (sound === 'background') {
      if (musicEnabled) {
        soundInstance.play();
      }
    } else {
      if (soundEnabled) {
        soundInstance.play();
      }
    }
  } catch (error) {
    console.warn(`Error playing sound ${sound}:`, error);
  }
};

export const stopSound = (sound: SoundKey): void => {
  try {
    sounds[sound]?.stop();
  } catch (error) {
    console.warn(`Error stopping sound ${sound}:`, error);
  }
};

export const setVolume = (volume: number): void => {
  Object.values(sounds).forEach(sound => {
    try {
      sound?.volume(volume);
    } catch (error) {
      console.warn('Error setting volume:', error);
    }
  });
};

// Remove duplicate sound instances
export const levelUp = sounds['level-up'];
export const gameOver = sounds['game-over'];
export const buttonClick = sounds['button-click'];
export const achievement = sounds['achievement']; 