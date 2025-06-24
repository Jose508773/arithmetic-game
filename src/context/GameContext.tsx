import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, GameContextType, GameAction, Achievement, ShopItem } from '../types/index';
import { getUserData, setUserData } from '../utils/userSession';

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

const initialShopItems: ShopItem[] = [
  {
    id: 'extra_life',
    name: 'Extra Life',
    description: 'Start with 4 lives instead of 3',
    price: 200,
    icon: '💖',
    category: 'powerup',
    effect: 'Start with +1 life',
    purchased: false
  },
  {
    id: 'double_points',
    name: 'Double Points',
    description: 'Earn double points for 30 seconds',
    price: 500,
    icon: '⭐',
    category: 'powerup',
    effect: '2x points for 30s',
    purchased: false
  },
  {
    id: 'time_freeze',
    name: 'Time Freeze',
    description: 'Freeze the timer for 15 seconds',
    price: 300,
    icon: '⏰',
    category: 'powerup',
    effect: 'Freeze timer 15s',
    purchased: false
  },
  {
    id: 'rainbow_theme',
    name: 'Rainbow Theme',
    description: 'Unlock a colorful rainbow theme',
    price: 800,
    icon: '🌈',
    category: 'cosmetic',
    effect: 'Rainbow colors',
    purchased: false
  },
  {
    id: 'golden_star',
    name: 'Golden Star',
    description: 'Special golden star effects',
    price: 600,
    icon: '🌟',
    category: 'cosmetic',
    effect: 'Golden effects',
    purchased: false
  },
  {
    id: 'bonus_coins',
    name: 'Bonus Coins',
    description: 'Earn 10% more total score',
    price: 1200,
    icon: '💰',
    category: 'bonus',
    effect: '+10% total score',
    purchased: false
  }
];

// Load high score from localStorage
const loadHighScore = (): number => {
  try {
    const savedHighScore = getUserData<number>('highScore');
    return savedHighScore || 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0;
  }
};

// Load total score from localStorage
const loadTotalScore = (): number => {
  try {
    const savedTotalScore = getUserData<number>('totalScore');
    return savedTotalScore || 0;
  } catch (error) {
    console.error('Error loading total score:', error);
    return 0;
  }
};

// Load shop items from localStorage
const loadShopItems = (): ShopItem[] => {
  try {
    const savedShopItems = getUserData<ShopItem[]>('shopItems');
    if (savedShopItems) {
      // Merge with initial items to ensure all items exist
      return initialShopItems.map(item => {
        const saved = savedShopItems.find((savedItem: ShopItem) => savedItem.id === item.id);
        return saved ? { ...item, ...saved } : item;
      });
    }
    return initialShopItems;
  } catch (error) {
    console.error('Error loading shop items:', error);
    return initialShopItems;
  }
};

// Save high score to localStorage
const saveHighScore = (highScore: number): void => {
  try {
    setUserData('highScore', highScore);
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

// Save total score to localStorage
const saveTotalScore = (totalScore: number): void => {
  try {
    setUserData('totalScore', totalScore);
  } catch (error) {
    console.error('Error saving total score:', error);
  }
};

// Save shop items to localStorage
const saveShopItems = (shopItems: ShopItem[]): void => {
  try {
    setUserData('shopItems', shopItems);
  } catch (error) {
    console.error('Error saving shop items:', error);
  }
};

const initialState: GameState = {
  score: 0,
  lives: 3,
  highScore: loadHighScore(),
  totalScore: loadTotalScore(),
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
  theme: 'space',
  shopItems: loadShopItems()
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export { GameContext };

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
        totalScore: state.totalScore,
        difficulty: state.difficulty,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        vibrationEnabled: state.vibrationEnabled,
        achievements: state.achievements,
        playerName: state.playerName,
        playerAvatar: state.playerAvatar,
        theme: state.theme,
        shopItems: state.shopItems
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
    case 'ADD_TO_TOTAL_SCORE': {
      const newTotalScore = state.totalScore + action.payload;
      saveTotalScore(newTotalScore);
      return {
        ...state,
        totalScore: newTotalScore
      };
    }
    case 'PURCHASE_ITEM': {
      const item = state.shopItems.find(item => item.id === action.payload);
      if (!item || item.purchased || state.totalScore < item.price) {
        return state;
      }
      
      const newTotalScore = state.totalScore - item.price;
      const updatedShopItems = state.shopItems.map(shopItem =>
        shopItem.id === action.payload
          ? { ...shopItem, purchased: true }
          : shopItem
      );
      
      saveTotalScore(newTotalScore);
      saveShopItems(updatedShopItems);
      
      return {
        ...state,
        totalScore: newTotalScore,
        shopItems: updatedShopItems
      };
    }
    case 'RESET_SHOP': {
      const resetShopItems = state.shopItems.map(item => ({ ...item, purchased: false }));
      saveShopItems(resetShopItems);
      return {
        ...state,
        shopItems: resetShopItems
      };
    }
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load player name and avatar from localStorage on mount
  useEffect(() => {
    try {
      const savedPlayerName = getUserData<string>('playerNickname');
      const savedPlayerAvatar = getUserData<string>('playerAvatar');
      
      if (savedPlayerName) {
        dispatch({ type: 'SET_PLAYER_NAME', payload: savedPlayerName });
      }
      
      if (savedPlayerAvatar) {
        dispatch({ type: 'SET_PLAYER_AVATAR', payload: savedPlayerAvatar });
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