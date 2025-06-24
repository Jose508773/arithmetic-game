export interface Question {
  id: number;
  question: string;
  answer: number;
  options: number[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'powerup' | 'cosmetic' | 'bonus';
  effect?: string;
  purchased: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  highScore: number;
  totalScore: number; // Accumulated score from all games
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
  shopItems: ShopItem[];
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
  | { type: 'SET_THEME'; payload: string }
  | { type: 'REVIVE_PLAYER' }
  | { type: 'ADD_TO_TOTAL_SCORE'; payload: number }
  | { type: 'PURCHASE_ITEM'; payload: string }
  | { type: 'RESET_SHOP' };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} 