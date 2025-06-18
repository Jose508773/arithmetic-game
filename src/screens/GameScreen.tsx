import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  HStack,
  IconButton,
  Icon
} from '@chakra-ui/react';
import { FaHome, FaHeart, FaStar, FaSmile, FaRocket } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { generateProblem, checkAnswer } from '../utils/gameLogic';
import { playSound, stopSound, setSoundEnabled, setMusicEnabled } from '../utils/soundEffects';
import { motion } from 'framer-motion';
// @ts-expect-error: No types for canvas-confetti, safe to import JS module
import confetti from 'canvas-confetti';
import { keyframes } from '@emotion/react';

// Floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  // Animation state
  const [answerStatus, setAnswerStatus] = React.useState<'idle' | 'correct' | 'wrong'>('idle');
  const [heartAnim, setHeartAnim] = React.useState(false);

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (!state.currentQuestion) return;

    const isCorrect = checkAnswer(state.currentQuestion, selectedAnswer);
    setAnswerStatus(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) setHeartAnim(true);

    if (isCorrect) {
      playSound('correct');
      dispatch({ type: 'INCREMENT_SCORE' });
      if (state.score === 0) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'first_game' });
        playSound('achievement');
      }
      if (state.score === 99) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'high_scorer' });
        playSound('achievement');
      }
      // Confetti on level up or high score
      if ((state.score + 1) % 10 === 0) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        playSound('level-up');
      }
      const newProblem = generateProblem(state.difficulty);
      setTimeout(() => {
        dispatch({ type: 'SET_QUESTION', payload: newProblem });
        setAnswerStatus('idle');
      }, 600);
    } else {
      playSound('wrong');
      dispatch({ type: 'DECREMENT_LIVES' });
      if (state.lives <= 1) {
        if (state.lives === 3) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'perfect_game' });
          playSound('achievement');
        }
        playSound('game-over');
        navigate('/game-over');
      }
      setTimeout(() => setAnswerStatus('idle'), 600);
      setTimeout(() => setHeartAnim(false), 600);
    }
  }, [state.currentQuestion, state.score, state.lives, state.difficulty, dispatch, navigate]);

  const handleExit = useCallback(() => {
    stopSound('background');
    playSound('button-click');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    // Start background music
    playSound('background');
    
    // Generate initial problem
    const initialProblem = generateProblem(state.difficulty);
    dispatch({ type: 'SET_QUESTION', payload: initialProblem });

    // Cleanup
    return () => {
      stopSound('background');
      stopSound('correct');
      stopSound('wrong');
      stopSound('achievement');
      stopSound('level-up');
      stopSound('game-over');
      stopSound('button-click');
    };
  }, [state.difficulty, dispatch]);

  // Sync sound/music toggles
  useEffect(() => {
    setSoundEnabled(state.soundEnabled);
    setMusicEnabled(state.musicEnabled);
  }, [state.soundEnabled, state.musicEnabled]);

  // Theme backgrounds
  const themeBackgrounds: Record<string, string> = {
    space: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    jungle: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    underwater: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  };

  if (!state.currentQuestion) {
    return null;
  }

  return (
    <Box
      minH="100vh"
      py={8}
      px={4}
      position="relative"
      style={{
        background: themeBackgrounds[state.theme] || themeBackgrounds['space'],
        transition: 'background 0.5s',
      }}
    >
      {/* Playful floating icons */}
      <Icon as={FaStar} color="game.accent" fontSize="6xl" position="absolute" top="40px" left="30px" opacity={0.5} animation={`${float} 4s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaSmile} color="game.pink" fontSize="5xl" position="absolute" top="120px" right="60px" opacity={0.4} animation={`${float} 5s 1s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaRocket} color="game.secondary" fontSize="7xl" position="absolute" bottom="60px" left="80px" opacity={0.4} animation={`${float} 6s 0.5s ease-in-out infinite`} zIndex={0} />
      {/* Main content */}
      <VStack spacing={8} maxW="600px" mx="auto" position="relative" zIndex={1}>
        <HStack w="full" justify="space-between">
          <IconButton
            aria-label="Exit game"
            icon={<FaHome />}
            onClick={handleExit}
            colorScheme="orange"
            bgGradient="linear(to-br, orange.300, yellow.400)"
            _hover={{ bgGradient: 'linear(to-br, orange.400, yellow.500)', boxShadow: '0 0 0 4px #fff7e6' }}
            boxShadow="0 2px 8px 0 #fbbf24"
            border="2px solid #fff7e6"
            size="lg"
          />
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Score: {state.score}
          </Text>
          <Box
            bg="yellow.300"
            px={4}
            py={1}
            borderRadius="xl"
            boxShadow="md"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="purple.600"
              fontFamily="'Comic Sans MS', cursive"
              letterSpacing="wider"
              textShadow="2px 2px 0 #fff, 4px 4px 0 #fbbf24"
            >
              {state.lives}
            </Text>
            <motion.div
              animate={heartAnim ? { scale: [1, 1.3, 0.8, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'inline-block' }}
            >
              <FaHeart color="red" size={32} style={{ filter: 'drop-shadow(2px 2px 0 #fff)' }} />
            </motion.div>
          </Box>
        </HStack>
        {/* Player avatar and name */}
        <HStack spacing={4} alignSelf="flex-start">
          {state.playerAvatar && (
            <img src={state.playerAvatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #fff', background: '#fff' }} />
          )}
          {state.playerName && (
            <Text fontSize="xl" color="white" fontFamily="'Comic Sans MS', cursive" fontWeight="bold">
              {state.playerName}
            </Text>
          )}
        </HStack>
        <Progress
          value={(state.lives / 3) * 100}
          size="lg"
          colorScheme="red"
          w="full"
          borderRadius="full"
        />
        <Box
          bgGradient="linear(to-br, game.purple, game.pink, game.accent)"
          p={10}
          borderRadius="3xl"
          boxShadow="2xl"
          w="full"
          textAlign="center"
          border="4px solid #fff"
          position="relative"
        >
          {/* Confetti or sparkles for correct answer */}
          {answerStatus === 'correct' && (
            <Box position="absolute" top="-20px" right="-20px" fontSize="4xl" color="game.accent">
              <FaStar />
            </Box>
          )}
          <Text fontSize="4xl" fontWeight="bold" mb={8} fontFamily="'Comic Sans MS', cursive" color="white" textShadow="2px 2px 0 #0002">
            {state.currentQuestion.question}
          </Text>
          <VStack spacing={4}>
            {state.currentQuestion.options.map((option: number, index: number) => (
              <motion.div
                key={index}
                animate={answerStatus === 'correct' ? { scale: [1, 1.15, 1] } : answerStatus === 'wrong' ? { x: [0, -12, 12, -12, 12, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Button
                  size="lg"
                  w="full"
                  colorScheme={answerStatus === 'correct' ? 'green' : answerStatus === 'wrong' ? 'red' : 'pink'}
                  bgGradient="linear(to-r, game.secondary, game.pink)"
                  fontFamily="'Comic Sans MS', cursive"
                  fontSize="2xl"
                  borderRadius="2xl"
                  boxShadow="xl"
                  onClick={() => handleAnswer(option)}
                  _hover={{ bgGradient: 'linear(to-r, game.accent, game.purple)', transform: 'scale(1.05) rotate(-2deg)' }}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default GameScreen; 