import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  HStack,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { FaHome, FaHeart, FaStar, FaRocket, FaSpaceShuttle, FaMoon, FaSun, FaPlay } from 'react-icons/fa';
import { useGame } from '../context/useGame';
import { generateProblem, checkAnswer } from '../utils/gameLogic';
import { playSound, stopSound, setSoundEnabled } from '../utils/soundEffects';
import { motion } from 'framer-motion';
// @ts-expect-error: No types for canvas-confetti, safe to import JS module
import confetti from 'canvas-confetti';
import { keyframes } from '@emotion/react';
import { adService } from '../utils/adService';

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

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [heartAnim, setHeartAnim] = useState(false);
  const [isRevivalModalOpen, setIsRevivalModalOpen] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const toast = useToast();

  const handleAnswer = useCallback(async (selectedAnswer: number) => {
    if (!state.currentQuestion) return;

    const isCorrect = checkAnswer(state.currentQuestion, selectedAnswer);
    setAnswerStatus(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) setHeartAnim(true);

    if (isCorrect) {
      dispatch({ type: 'INCREMENT_SCORE' });
      
      // Play sound for every correct answer
      await playSound('button-click');
      
      // Fun congratulatory messages based on score
      const messages = [
        '🎉 Awesome job!',
        '🌟 Brilliant!',
        '🚀 You are on fire!',
        '⭐ Super smart!',
        '💫 Amazing work!',
        '🎊 Fantastic!',
        '🔥 You are unstoppable!',
        '✨ Perfect answer!',
        '🎯 Bullseye!',
        '💎 Diamond thinking!'
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      // Special messages for milestones
      let specialMessage = '';
      if (state.score === 0) {
        specialMessage = '🎉 First correct answer! You are getting started!';
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'first_game' });
        await playSound('achievement');
      } else if (state.score === 9) {
        specialMessage = '🎊 Double digits! You are becoming a math wizard!';
      } else if (state.score === 24) {
        specialMessage = '🏆 Quarter century! You are absolutely crushing it!';
      } else if (state.score === 49) {
        specialMessage = '🌟 Halfway to 100! You are a math genius!';
      } else if (state.score === 99) {
        specialMessage = '🎊 Almost at 100! You are incredible!';
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'high_scorer' });
        await playSound('achievement');
      } else if ((state.score + 1) % 10 === 0) {
        specialMessage = `🎉 Level ${Math.floor((state.score + 1) / 10)} complete! You are leveling up!`;
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        await playSound('level-up');
      }
      
      // Show congratulatory message
      toast({
        title: specialMessage || randomMessage,
        description: `Score: ${state.score + 1}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
        colorScheme: 'purple',
      });
      
      const newProblem = generateProblem(state.difficulty);
      setTimeout(() => {
        dispatch({ type: 'SET_QUESTION', payload: newProblem });
        setAnswerStatus('idle');
      }, 600);
    } else {
      dispatch({ type: 'DECREMENT_LIVES' });
      if (state.lives <= 1) {
        if (state.lives === 3) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'perfect_game' });
          await playSound('achievement');
        }
        // Show revival modal instead of going to game over
        setIsRevivalModalOpen(true);
      }
      setTimeout(() => setAnswerStatus('idle'), 600);
      setTimeout(() => setHeartAnim(false), 600);
    }
  }, [state.currentQuestion, state.score, state.lives, state.difficulty, dispatch, toast]);

  const handleRevival = async () => {
    setIsAdLoading(true);
    setAdError(null);

    try {
      const success = await adService.showRewardedAd({
        onAdLoaded: () => {
          console.log('✅ Ad loaded successfully');
        },
        onAdFailed: (error) => {
          console.error('❌ Ad failed:', error);
          setAdError('Ad failed to load. Please try again.');
          setIsAdLoading(false);
        },
        onAdClosed: () => {
          console.log('✅ Ad closed');
        },
        onRewarded: () => {
          console.log('🎁 User earned revival!');
          dispatch({ type: 'REVIVE_PLAYER' });
          setIsRevivalModalOpen(false);
          setIsAdLoading(false);
          setAdError(null);
        }
      });

      if (!success) {
        setAdError('Ad not available. Please try again later.');
        setIsAdLoading(false);
      }
    } catch (error) {
      console.error('❌ Error showing ad:', error);
      setAdError('Something went wrong. Please try again.');
      setIsAdLoading(false);
    }
  };

  const handleGameOver = () => {
    setIsRevivalModalOpen(false);
    // Add current score to total score before game over
    if (state.score > 0) {
      dispatch({ type: 'ADD_TO_TOTAL_SCORE', payload: state.score });
    }
    playSound('game-over');
    navigate('/game-over');
  };

  const handleExit = useCallback(async () => {
    await playSound('button-click');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    // Generate initial problem
    const initialProblem = generateProblem(state.difficulty);
    dispatch({ type: 'SET_QUESTION', payload: initialProblem });

    // Preload ad for better user experience
    adService.preloadAd();

    // Cleanup
    return () => {
      stopSound('achievement');
      stopSound('level-up');
      stopSound('game-over');
      stopSound('button-click');
    };
  }, [state.difficulty, dispatch]);

  // Sync sound toggles
  useEffect(() => {
    setSoundEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  if (!state.currentQuestion) {
    return null;
  }

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

      {/* Main content */}
      <VStack spacing={6} maxW="600px" mx="auto" position="relative" zIndex={1} w="full">
        <HStack w="full" justify="space-between">
          <IconButton
            aria-label="Exit game"
            icon={<FaHome />}
            onClick={handleExit}
            colorScheme="purple"
            bgGradient="linear(to-r, space.nebula, space.cosmic)"
            _hover={{ bgGradient: 'linear(to-r, space.cosmic, space.nebula)', boxShadow: '0 0 0 4px rgba(155, 77, 202, 0.2)' }}
            boxShadow="0 2px 8px 0 rgba(155, 77, 202, 0.3)"
            border="2px solid rgba(155, 77, 202, 0.3)"
            size="md"
          />
          <Text fontSize="xl" fontWeight="bold" color="space.star">
            Score: {state.score}
          </Text>
          <Box
            bg="space.deep"
            px={3}
            py={1}
            borderRadius="xl"
            boxShadow="md"
            borderWidth="2px"
            borderColor="space.nebula"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="space.star"
              fontFamily="'Comic Sans MS', cursive"
              letterSpacing="wider"
              textShadow="2px 2px 0 rgba(155, 77, 202, 0.3)"
            >
              {state.lives}
            </Text>
            <motion.div
              animate={heartAnim ? { scale: [1, 1.3, 0.8, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'inline-block' }}
            >
              <FaHeart color="#FF6B6B" size={24} style={{ filter: 'drop-shadow(2px 2px 0 rgba(155, 77, 202, 0.3))' }} />
            </motion.div>
          </Box>
        </HStack>

        {/* Player avatar and name */}
        <HStack spacing={3} alignSelf="flex-start">
          {state.playerAvatar && (
            <img src={state.playerAvatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid space.nebula', background: 'space.deep' }} />
          )}
          {state.playerName && (
            <Text fontSize="lg" color="space.star" fontFamily="'Comic Sans MS', cursive" fontWeight="bold">
              {state.playerName}
            </Text>
          )}
        </HStack>

        <Progress
          value={(state.lives / 3) * 100}
          size="md"
          colorScheme="purple"
          w="full"
          borderRadius="full"
          bg="space.dark"
          sx={{
            '& > div': {
              background: 'linear-gradient(to right, space.nebula, space.cosmic)',
            },
          }}
        />

        <Box
          bg="space.deep"
          p={6}
          borderRadius="3xl"
          boxShadow="2xl"
          w="full"
          textAlign="center"
          borderWidth="2px"
          borderColor="space.nebula"
          position="relative"
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
          {/* Confetti or sparkles for correct answer */}
          {answerStatus === 'correct' && (
            <Box position="absolute" top="-20px" right="-20px" fontSize="4xl" color="space.star">
              <FaStar />
            </Box>
          )}
          <Text fontSize="3xl" fontWeight="bold" mb={6} fontFamily="'Comic Sans MS', cursive" color="space.star" textShadow="2px 2px 0 rgba(155, 77, 202, 0.3)">
            {state.currentQuestion.question}
          </Text>
          <VStack spacing={3}>
            {state.currentQuestion.options.map((option: number, index: number) => (
              <motion.div
                key={index}
                animate={answerStatus === 'correct' ? { scale: [1, 1.15, 1] } : answerStatus === 'wrong' ? { x: [0, -12, 12, -12, 12, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Button
                  size="md"
                  w="full"
                  colorScheme="purple"
                  bgGradient="linear(to-r, space.nebula, space.cosmic)"
                  fontFamily="'Comic Sans MS', cursive"
                  fontSize="xl"
                  borderRadius="2xl"
                  boxShadow="xl"
                  onClick={() => handleAnswer(option)}
                  _hover={{ 
                    bgGradient: 'linear(to-r, space.cosmic, space.nebula)', 
                    transform: 'scale(1.05) rotate(-2deg)',
                    boxShadow: '0 0 15px rgba(155, 77, 202, 0.3)'
                  }}
                  _active={{
                    bgGradient: 'linear(to-r, space.planet, space.cosmic)',
                    transform: 'scale(0.95)'
                  }}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </VStack>
        </Box>
      </VStack>

      {/* Revival Modal */}
      <Modal isOpen={isRevivalModalOpen} onClose={handleGameOver} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg="space.deep"
          borderWidth="2px"
          borderColor="space.nebula"
          rounded="3xl"
          p={6}
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
          <ModalHeader
            color="space.star"
            fontFamily="'Comic Sans MS', cursive"
            textAlign="center"
            fontSize="2xl"
            textShadow="0 0 10px rgba(155, 77, 202, 0.5)"
          >
            🚀 Continue Your Adventure?
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Text color="space.comet" textAlign="center" fontSize="lg">
                Watch a short ad to revive and continue playing with your current score!
              </Text>
              <Box textAlign="center">
                <Text fontSize="xl" color="space.star" fontWeight="bold">
                  Current Score: {state.score}
                </Text>
                <Text fontSize="md" color="space.comet">
                  You'll get 3 lives back! 💖
                </Text>
              </Box>
              {adError && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {adError}
                </Alert>
              )}
              {isAdLoading && (
                <VStack spacing={2}>
                  <Spinner size="lg" color="space.star" />
                  <Text color="space.comet" fontSize="sm">
                    Loading ad...
                  </Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center" gap={3}>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleRevival}
              isDisabled={isAdLoading}
              bgGradient="linear(to-r, space.nebula, space.cosmic)"
              _hover={{
                bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                transform: "translateY(-2px)",
                boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
              }}
              transition="all 0.2s"
              leftIcon={<FaPlay />}
            >
              {isAdLoading ? 'Loading...' : 'Watch Ad & Revive'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleGameOver}
              color="space.comet"
              borderColor="space.nebula"
              _hover={{
                bg: "space.dark",
                borderColor: "space.star"
              }}
            >
              End Game
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GameScreen; 