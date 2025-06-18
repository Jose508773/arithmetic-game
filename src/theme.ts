import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    game: {
      primary: '#FF6B6B',    // Vibrant coral
      secondary: '#4ECDC4',  // Turquoise
      accent: '#FFE66D',     // Bright yellow
      success: '#7ED321',    // Bright green
      error: '#FF4B4B',      // Bright red
      background: '#F7F9FC', // Light blue-gray
      surface: '#FFFFFF',
      text: '#2C3E50',
      purple: '#9B59B6',     // Bright purple
      orange: '#FF9F43',     // Bright orange
      pink: '#FF6B8B',       // Bright pink
    }
  },
  fonts: {
    heading: '"Comic Sans MS", cursive',
    body: '"Comic Sans MS", cursive',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: '2xl',
        transition: 'all 0.2s',
        _hover: {
          transform: 'scale(1.08) rotate(-2deg)',
          boxShadow: 'lg',
        },
      },
      variants: {
        solid: {
          bg: 'game.primary',
          color: 'white',
          _hover: {
            bg: 'game.secondary',
            opacity: 0.95,
          },
        },
        outline: {
          borderColor: 'game.primary',
          color: 'game.primary',
          _hover: {
            bg: 'game.accent',
            color: 'white',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: '2xl',
          transition: 'all 0.3s',
          _hover: {
            transform: 'scale(1.03) rotate(1deg)',
            boxShadow: '3xl',
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          borderRadius: 'full',
          bg: 'game.pink',
        },
        filledTrack: {
          borderRadius: 'full',
          transition: 'all 0.3s',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'game.background',
        color: 'game.text',
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

export default theme; 