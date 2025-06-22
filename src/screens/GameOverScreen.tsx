import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaHome, FaRedo, FaTrophy, FaStar, FaRocket, FaSpaceShuttle, FaMoon, FaSun } from 'react-icons/fa';
import { playSound } from '../utils/soundEffects';
import { keyframes } from '@emotion/react';

// Floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const GameOverScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { score, highScore } = state;

  const handlePlayAgain = async () => {
    try {
      await playSound('button-click');
      dispatch({ type: 'RESET_GAME' });
      navigate('/game');
    } catch (error) {
      console.error('❌ Error in handlePlayAgain:', error);
      // Continue with navigation even if sound fails
      dispatch({ type: 'RESET_GAME' });
      navigate('/game');
    }
  };

  const handleGoHome = async () => {
    try {
      await playSound('button-click');
      dispatch({ type: 'RESET_GAME' });
      navigate('/');
    } catch (error) {
      console.error('❌ Error in handleGoHome:', error);
      // Continue with navigation even if sound fails
      dispatch({ type: 'RESET_GAME' });
      navigate('/');
    }
  };

  return (
    <Box
      minH="100vh"
      bg="space.dark"
      position="relative"
      overflow="auto"
      py={4}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Animated stars background */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          left={`${Math.random() * 100}%`}
          top={`${Math.random() * 100}%`}
          w="2px"
          h="2px"
          bg="space.star"
          borderRadius="full"
          animation={`${twinkle} ${2 + Math.random() * 3}s infinite`}
          zIndex={0}
        />
      ))}

      {/* Floating space elements */}
      <Icon as={FaRocket} color="space.comet" fontSize="7xl" position="absolute" top="30px" left="40px" opacity={0.6} animation={`${float} 4s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaSpaceShuttle} color="space.planet" fontSize="6xl" position="absolute" top="140px" right="60px" opacity={0.5} animation={`${float} 5s 1s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaStar} color="space.star" fontSize="8xl" position="absolute" bottom="80px" left="100px" opacity={0.4} animation={`${float} 6s 0.5s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaMoon} color="space.cosmic" fontSize="5xl" position="absolute" top="200px" left="80px" opacity={0.5} animation={`${float} 7s 0.2s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaSun} color="space.accent" fontSize="6xl" position="absolute" bottom="120px" right="40px" opacity={0.4} animation={`${float} 5s 0.8s ease-in-out infinite`} zIndex={0} />

      <Container maxW="container.md" position="relative" zIndex={1}>
        <VStack spacing={6}>
          {/* Game Over Title */}
          <VStack spacing={3}>
            <Heading
              size="2xl"
              bgGradient="linear(to-r, space.nebula, space.comet, space.star)"
              bgClip="text"
              textAlign="center"
              fontFamily="'Comic Sans MS', cursive"
              textShadow="0 0 10px rgba(155, 77, 202, 0.5)"
            >
              Game Over!
            </Heading>
            <Text
              fontSize="lg"
              color="space.comet"
              textAlign="center"
              fontFamily="'Comic Sans MS', cursive"
            >
              Don't worry, you can try again! 🚀✨
            </Text>
          </VStack>

          {/* Score Display */}
          <Box
            w="full"
            p={6}
            bg="space.deep"
            rounded="3xl"
            shadow="2xl"
            borderWidth="2px"
            borderColor="space.nebula"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(155, 77, 202, 0.1) 0%, transparent 70%)',
              zIndex: 0,
            }}
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-20px"
              right="-20px"
              fontSize="6xl"
              color="space.star"
              transform="rotate(15deg)"
              opacity={0.7}
            >
              <Icon as={FaTrophy} />
            </Box>

            <VStack spacing={4}>
              <Box textAlign="center">
                <Text fontSize="xl" color="space.comet" mb={2}>
                  Your Score
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="space.star">
                  {score}
                </Text>
              </Box>

              <Box textAlign="center">
                <Text fontSize="xl" color="space.comet" mb={2}>
                  High Score
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="space.star">
                  {highScore}
                </Text>
              </Box>

              {/* Action Buttons */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={3}
                w="full"
                justify="center"
              >
                <Button
                  leftIcon={<FaRedo />}
                  colorScheme="purple"
                  size="md"
                  onClick={handlePlayAgain}
                  bgGradient="linear(to-r, space.nebula, space.cosmic)"
                  _hover={{
                    bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
                  }}
                  transition="all 0.2s"
                >
                  Play Again
                </Button>
                <Button
                  leftIcon={<FaHome />}
                  colorScheme="purple"
                  size="md"
                  onClick={handleGoHome}
                  bgGradient="linear(to-r, space.comet, space.star)"
                  _hover={{
                    bgGradient: "linear(to-r, space.star, space.comet)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
                  }}
                  transition="all 0.2s"
                >
                  Home
                </Button>
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GameOverScreen; 