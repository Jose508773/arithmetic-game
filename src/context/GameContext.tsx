import React, { createContext, useContext, useReducer, ReactNode } from 'react';
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

const initialState: GameState = {
  score: 0,
  lives: 3,
  highScore: 0,
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
      return {
        ...state,
        score: newScore,
        highScore: Math.max(newScore, state.highScore)
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
        ...initialState,
        highScore: state.highScore,
        difficulty: state.difficulty,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        vibrationEnabled: state.vibrationEnabled,
        achievements: state.achievements
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
    case 'UPDATE_HIGH_SCORE':
      return {
        ...state,
        highScore: action.payload
      };
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
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 