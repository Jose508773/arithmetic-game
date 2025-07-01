import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { GameProvider } from './context/GameContext';
import theme from './theme';

// Lazy load components for better performance
const TitleScreen = lazy(() => import('./screens/TitleScreen'));
const GameScreen = lazy(() => import('./screens/GameScreen'));
const GameOverScreen = lazy(() => import('./screens/GameOverScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));

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
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
            color: '#fff',
            fontSize: '1.2rem'
          }}>
            Loading Arithmetic Game...
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </GameProvider>
    </ChakraProvider>
  );
}

export default App; 