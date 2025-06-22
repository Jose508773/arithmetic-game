import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    space: {
      dark: '#0B0B1F', // Deep space background
      deep: '#1A1B3D', // Darker space elements
      nebula: '#4B2E83', // Purple nebula
      star: '#FFD700', // Bright star color
      comet: '#00FFFF', // Bright comet trail
      planet: '#FF6B6B', // Planet color
      cosmic: '#9B4DCA', // Cosmic purple
    },
    game: {
      primary: '#4B2E83', // Deep space purple
      secondary: '#00FFFF', // Bright comet blue
      accent: '#FFD700', // Star gold
      success: '#00FF9D', // Bright success
      error: '#FF6B6B', // Planet red
      warning: '#FFD700', // Star gold
      info: '#00FFFF', // Comet blue
      purple: '#9B4DCA', // Cosmic purple
      pink: '#FF6B8B', // Space pink
      orange: '#FFA500', // Star orange
    },
  },
  fonts: {
    heading: '"Comic Sans MS", cursive',
    body: '"Comic Sans MS", cursive',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'xl',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
      },
      variants: {
        solid: {
          bg: 'space.nebula',
          color: 'white',
          _hover: {
            bg: 'space.cosmic',
          },
        },
        outline: {
          borderColor: 'space.comet',
          color: 'space.comet',
          _hover: {
            bg: 'space.deep',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'space.deep',
          borderRadius: 'xl',
          borderColor: 'space.nebula',
          borderWidth: '2px',
          boxShadow: '0 0 20px rgba(75, 46, 131, 0.3)',
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: 'space.dark',
        },
        filledTrack: {
          bg: 'space.comet',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'space.dark',
        color: 'white',
        backgroundImage: 'radial-gradient(circle at center, #1A1B3D 0%, #0B0B1F 100%)',
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

export default theme; 