import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, GameContextType, GameAction, Achievement } from '../types/index';

const initialAchievements: Achievement[] = [
  {
    id: 'first_game',
    title: 'First Game',
    description: 'Complete your first game',
    unlocked: false
  },
  {
    id: 'high_scorer',
    title: 'High Scorer',
    description: 'Score 100 points in a single game',
    unlocked: false
  },
  {
    id: 'perfect_game',
    title: 'Perfect Game',
    description: 'Complete a game without losing any lives',
    unlocked: false
  }
];

// Load high score from localStorage
const loadHighScore = (): number => {
  try {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('gameHighScore');
      return savedHighScore ? parseInt(savedHighScore, 10) : 0;
    }
    return 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0;
  }
};

// Save high score to localStorage
const saveHighScore = (highScore: number): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gameHighScore', highScore.toString());
    }
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

const initialState: GameState = {
  score: 0,
  lives: 3,
  highScore: loadHighScore(),
  difficulty: 'easy',
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  currentQuestion: null,
  level: 1,
  isGameOver: false,
  achievements: initialAchievements,
  playerName: '',
  playerAvatar: '',
  theme: 'space'
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INCREMENT_SCORE': {
      const newScore = state.score + 1;
      const newHighScore = Math.max(newScore, state.highScore);
      
      // Save high score to localStorage if it's been updated
      if (newHighScore > state.highScore) {
        saveHighScore(newHighScore);
      }
      
      return {
        ...state,
        score: newScore,
        highScore: newHighScore
      };
    }
    case 'DECREMENT_LIVES': {
      const newLives = state.lives - 1;
      return {
        ...state,
        lives: newLives,
        isGameOver: newLives <= 0
      };
    }
    case 'RESET_GAME':
      return {
        ...state,
        score: 0,
        lives: 3,
        currentQuestion: null,
        level: 1,
        isGameOver: false,
        // Preserve these values
        highScore: state.highScore,
        difficulty: state.difficulty,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        vibrationEnabled: state.vibrationEnabled,
        achievements: state.achievements,
        playerName: state.playerName,
        playerAvatar: state.playerAvatar,
        theme: state.theme
      };
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload
      };
    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled
      };
    case 'TOGGLE_MUSIC':
      return {
        ...state,
        musicEnabled: !state.musicEnabled
      };
    case 'TOGGLE_VIBRATION':
      return {
        ...state,
        vibrationEnabled: !state.vibrationEnabled
      };
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload
      };
    case 'INCREMENT_LEVEL':
      return {
        ...state,
        level: state.level + 1
      };
    case 'UPDATE_HIGH_SCORE': {
      const newHighScore = action.payload;
      saveHighScore(newHighScore);
      return {
        ...state,
        highScore: newHighScore
      };
    }
    case 'SET_GAME_OVER':
      return {
        ...state,
        isGameOver: true
      };
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map((achievement: Achievement) =>
          achievement.id === action.payload
            ? { ...achievement, unlocked: true }
            : achievement
        )
      };
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
    case 'SET_PLAYER_AVATAR':
      return { ...state, playerAvatar: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'REVIVE_PLAYER':
      return {
        ...state,
        lives: 3,
        isGameOver: false
      };
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load player name and avatar from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedPlayerName = localStorage.getItem('playerNickname');
        const savedPlayerAvatar = localStorage.getItem('playerAvatar');
        
        if (savedPlayerName) {
          dispatch({ type: 'SET_PLAYER_NAME', payload: savedPlayerName });
        }
        
        if (savedPlayerAvatar) {
          dispatch({ type: 'SET_PLAYER_AVATAR', payload: savedPlayerAvatar });
        }
      }
    } catch (error) {
      console.error('Error loading player data:', error);
    }
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 