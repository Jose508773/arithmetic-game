export interface Question {
  id: number;
  question: string;
  answer: number;
  options: number[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  highScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  currentQuestion: Question | null;
  level: number;
  isGameOver: boolean;
  achievements: Achievement[];
  playerName: string;
  playerAvatar: string;
  theme: string;
}

export type GameAction =
  | { type: 'INCREMENT_SCORE' }
  | { type: 'DECREMENT_LIVES' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'medium' | 'hard' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'TOGGLE_VIBRATION' }
  | { type: 'SET_QUESTION'; payload: Question }
  | { type: 'INCREMENT_LEVEL' }
  | { type: 'UPDATE_HIGH_SCORE'; payload: number }
  | { type: 'SET_GAME_OVER' }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'SET_PLAYER_AVATAR'; payload: string }
  | { type: 'SET_THEME'; payload: string };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} 