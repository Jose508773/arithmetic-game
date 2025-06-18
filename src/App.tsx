import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { GameProvider } from './context/GameContext';
import theme from './theme';

// Screens
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitleScreen />
  },
  {
    path: '/game',
    element: <GameScreen />
  },
  {
    path: '/game-over',
    element: <GameOverScreen />
  },
  {
    path: '/leaderboard',
    element: <LeaderboardScreen />
  },
  {
    path: '/settings',
    element: <SettingsScreen />
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
});

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </ChakraProvider>
  );
};

export default App; 