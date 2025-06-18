import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Container,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaHome, FaRedo, FaTrophy } from 'react-icons/fa';
import { playSound } from '../utils/soundEffects';

const GameOverScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { score, highScore, playerName, playerAvatar } = state;

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handlePlayAgain = () => {
    playSound('button-click');
    dispatch({ type: 'RESET_GAME' });
    navigate('/game');
  };

  const handleGoHome = () => {
    playSound('button-click');
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };

  const handleLeaderboard = () => {
    playSound('button-click');
    navigate('/leaderboard');
  };

  useEffect(() => {
    // Save score to leaderboard if it's a new high score
    if (score > 0) {
      const savedScores = localStorage.getItem('leaderboard');
      let scores = savedScores ? JSON.parse(savedScores) : [];
      scores.push({ name: playerName, avatar: playerAvatar, score, date: new Date().toISOString() });
      scores = scores.sort((a: { score: number }, b: { score: number }) => b.score - a.score).slice(0, 10); // keep top 10
      localStorage.setItem('leaderboard', JSON.stringify(scores));
    }
  }, [score, playerName, playerAvatar]);

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, blue.50, purple.50)"
      py={10}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="container.md">
        <VStack spacing={8}>
          {/* Game Over Title */}
          <VStack spacing={4}>
            <Heading
              size="3xl"
              bgGradient="linear(to-r, red.400, purple.500)"
              bgClip="text"
              textAlign="center"
              fontFamily="'Comic Sans MS', cursive"
            >
              Game Over!
            </Heading>
            <Text
              fontSize="xl"
              color="gray.600"
              textAlign="center"
              fontFamily="'Comic Sans MS', cursive"
            >
              Don't worry, you can try again! 🎮✨
            </Text>
          </VStack>

          {/* Score Display */}
          <Box
            w="full"
            p={8}
            bg={bgColor}
            rounded="2xl"
            shadow="xl"
            borderWidth="2px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-20px"
              right="-20px"
              fontSize="6xl"
              color="yellow.400"
              transform="rotate(15deg)"
            >
              <Icon as={FaTrophy} />
            </Box>

            <VStack spacing={6}>
              <Box textAlign="center">
                <Text fontSize="2xl" color="gray.600" mb={2}>
                  Your Score
                </Text>
                <Text fontSize="5xl" fontWeight="bold" color="blue.500">
                  {score}
                </Text>
              </Box>

              <Box textAlign="center">
                <Text fontSize="2xl" color="gray.600" mb={2}>
                  High Score
                </Text>
                <Text fontSize="5xl" fontWeight="bold" color="purple.500">
                  {highScore}
                </Text>
              </Box>

              {/* Action Buttons */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                w="full"
                justify="center"
              >
                <Button
                  leftIcon={<FaRedo />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handlePlayAgain}
                  bgGradient="linear(to-r, blue.400, blue.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, blue.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  Play Again
                </Button>
                <Button
                  leftIcon={<FaHome />}
                  colorScheme="purple"
                  size="lg"
                  onClick={handleGoHome}
                  bgGradient="linear(to-r, purple.400, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.500, purple.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  Home
                </Button>
                <Button
                  leftIcon={<FaTrophy />}
                  colorScheme="teal"
                  size="lg"
                  onClick={handleLeaderboard}
                  bgGradient="linear(to-r, teal.400, teal.500)"
                  _hover={{
                    bgGradient: "linear(to-r, teal.500, teal.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  Leaderboard
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