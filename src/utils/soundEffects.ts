import { Howl } from 'howler';

interface SoundConfig {
  src: string[];
  volume: number;
  preload?: boolean;
}

interface SoundConfigs {
  [key: string]: SoundConfig;
}

type SoundKey = keyof typeof soundConfig;

// Optimized volume levels for coin-like sound effects
const soundConfig: SoundConfigs = {
  achievement: { src: ['/sounds/achievement.mp3'], volume: 0.8, preload: true },
  'button-click': { src: ['/sounds/button-click.mp3'], volume: 0.3, preload: true },
  'game-over': { src: ['/sounds/game-over.mp3'], volume: 0.5, preload: true },
  'level-up': { src: ['/sounds/level-up.mp3'], volume: 0.8, preload: true }
};

const sounds: Partial<Record<SoundKey, Howl>> = {};

// Audio context management for cross-browser compatibility
let audioContext: AudioContext | null = null;
let audioContextUnlocked = false;
let soundEnabled = true;

// Initialize audio context with fallbacks
const initializeAudioContext = (): void => {
  try {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContext = new window.AudioContext();
    } else if (typeof window !== 'undefined' && (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) {
      audioContext = new (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext();
    }
  } catch (error) {
    console.error('Failed to initialize AudioContext:', error);
  }
};

// Unlock audio context with user interaction
const unlockAudioContext = async (): Promise<void> => {
  if (!audioContext || audioContextUnlocked) return;

  try {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Create a silent buffer to unlock audio
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    
    audioContextUnlocked = true;
  } catch (error) {
    console.error('Failed to unlock AudioContext:', error);
  }
};

// Load sound with comprehensive error handling
const loadSound = async (key: string, config: SoundConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Howl({
        ...config,
        onload: () => {
          sounds[key as SoundKey] = sound;
          resolve();
        },
        onloaderror: (_id, error) => {
          console.error(`Failed to load sound ${key}:`, error);
          
          // Retry loading with different approach
          setTimeout(() => {
            const retrySound = new Howl({
              ...config,
              onload: () => {
                sounds[key as SoundKey] = retrySound;
                resolve();
              },
              onloaderror: (_retryId, retryError) => {
                console.error(`Failed to load sound ${key} on retry:`, retryError);
                reject(new Error(`Failed to load sound ${key}: ${retryError}`));
              }
            });
          }, 1000);
        },
        onplayerror: (_id, error) => {
          console.error(`Failed to play sound ${key}:`, error);
          
          // Handle common play errors
          if (error === 'AudioContext was not allowed to start') {
            sound.once('unlock', () => {
              sound.play();
            });
          } else {
            sound.once('unlock', () => {
              sound.play();
            });
          }
        }
      });
      
    } catch (error) {
      console.error(`Failed to initialize sound ${key}:`, error);
      reject(error);
    }
  });
};

// Initialize all sounds with proper error handling
const initializeSounds = async (): Promise<void> => {
  try {
    initializeAudioContext();
    
    // Load sounds in batches to avoid overwhelming the browser
    const soundEntries = Object.entries(soundConfig);
    const batchSize = 2;
    
    for (let i = 0; i < soundEntries.length; i += batchSize) {
      const batch = soundEntries.slice(i, i + batchSize);
      const loadPromises = batch.map(([key, config]) => {
        return loadSound(key, config).catch(error => {
          console.error(`Failed to load sound ${key}:`, error);
          return Promise.resolve();
        });
      });
      
      await Promise.allSettled(loadPromises);
      
      // Small delay between batches to prevent blocking
      if (i + batchSize < soundEntries.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  } catch (error) {
    console.error('Failed to initialize sound system:', error);
  }
};

// Lazy initialization - only initialize when needed
let soundsInitialized = false;
let initializationPromise: Promise<void> | null = null;

const ensureSoundsInitialized = async (): Promise<void> => {
  if (soundsInitialized) return;
  
  if (!initializationPromise) {
    initializationPromise = initializeSounds().then(() => {
      soundsInitialized = true;
    });
  }
  
  return initializationPromise;
};

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  if (!enabled) {
    Object.values(sounds).forEach(sound => {
      try {
        sound?.stop();
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    });
  }
};

export const playSound = async (sound: SoundKey): Promise<void> => {
  try {
    await ensureSoundsInitialized();
    await unlockAudioContext();

    const soundInstance = sounds[sound];
    if (!soundInstance) {
      console.warn(`Sound ${sound} is not available`);
      return;
    }

    if (soundEnabled) {
      soundInstance.play();
    }
  } catch (error) {
    console.error(`Error playing sound ${sound}:`, error);
  }
};

export const stopSound = (sound: SoundKey): void => {
  try {
    sounds[sound]?.stop();
  } catch (error) {
    console.error(`Error stopping sound ${sound}:`, error);
  }
};

export const setVolume = (volume: number): void => {
  Object.values(sounds).forEach(sound => {
    try {
      if (sound) {
        sound.volume(volume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  });
};

export const unlockAudio = async (): Promise<void> => {
  try {
    await unlockAudioContext();
    
    Object.values(sounds).forEach(sound => {
      if (sound) {
        sound.once('unlock', () => {
          // Sound unlocked successfully
        });
      }
    });
  } catch (error) {
    console.error('Error unlocking audio context:', error);
  }
};

export const getAudioStatus = () => {
  return {
    soundEnabled,
    audioContextUnlocked,
    soundsLoaded: Object.keys(sounds).length,
    totalSounds: Object.keys(soundConfig).length
  };
};

// Remove duplicate sound instances
export const levelUp = sounds['level-up'];
export const gameOver = sounds['game-over'];
export const buttonClick = sounds['button-click'];
export const achievement = sounds['achievement']; 