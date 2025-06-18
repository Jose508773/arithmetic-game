import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { GameProvider } from './src/context/GameContext';
import LandingPage from './src/screens/LandingPage';
import { GameScreen } from './src/screens/GameScreen';

// Extend the theme to include custom colors, fonts, etc
const theme = {
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'green',
      },
    },
  },
};

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<GameScreen />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </GameProvider>
    </ChakraProvider>
  );
} 