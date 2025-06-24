// User Session Management
// This ensures each user has their own isolated progress

const SESSION_KEY = 'arithmetic_game_session_id';
const USER_DATA_PREFIX = 'arithmetic_game_user_';

// Generate a unique session ID for each user
const generateSessionId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create a session ID for the current user
export const getSessionId = (): string => {
  try {
    if (typeof window === 'undefined') return 'default';
    
    let sessionId = localStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, sessionId);
      console.log('🆕 Created new user session:', sessionId);
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error getting session ID:', error);
    return 'default';
  }
};

// Get user-specific data with session ID
export const getUserData = <T>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const sessionId = getSessionId();
    const userKey = `${USER_DATA_PREFIX}${sessionId}_${key}`;
    const data = localStorage.getItem(userKey);
    
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Set user-specific data with session ID
export const setUserData = <T>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return;
    
    const sessionId = getSessionId();
    const userKey = `${USER_DATA_PREFIX}${sessionId}_${key}`;
    localStorage.setItem(userKey, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

// Clear all data for the current user
export const clearUserData = (): void => {
  try {
    if (typeof window === 'undefined') return;
    
    const sessionId = getSessionId();
    const keysToRemove: string[] = [];
    
    // Find all keys for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${USER_DATA_PREFIX}${sessionId}_`)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all user-specific keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Generate new session ID
    const newSessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, newSessionId);
    
    console.log('🔄 User data cleared, new session created:', newSessionId);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Get user statistics
export const getUserStats = () => {
  const sessionId = getSessionId();
  const totalScore = getUserData<number>('totalScore') || 0;
  const highScore = getUserData<number>('highScore') || 0;
  const shopItems = getUserData<Array<{ purchased: boolean }>>('shopItems') || [];
  const achievements = getUserData<Array<{ unlocked: boolean }>>('achievements') || [];
  
  return {
    sessionId,
    totalScore,
    highScore,
    purchasedItems: shopItems.filter((item) => item.purchased).length,
    totalItems: shopItems.length,
    unlockedAchievements: achievements.filter((achievement) => achievement.unlocked).length,
    totalAchievements: achievements.length
  };
}; 