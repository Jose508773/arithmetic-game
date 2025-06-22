import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { GameProvider } from './context/GameContext';
import theme from './theme';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import SettingsScreen from './screens/SettingsScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitleScreen />,
  },
  {
    path: '/game',
    element: <GameScreen />,
  },
  {
    path: '/game-over',
    element: <GameOverScreen />,
  },
  {
    path: '/settings',
    element: <SettingsScreen />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </ChakraProvider>
  );
}

export default App; 