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

// Enhanced 3D floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) translateZ(0px) rotate(0deg) scale(1); }
  25% { transform: translateY(-15px) translateZ(10px) rotate(2deg) scale(1.05); }
  50% { transform: translateY(-25px) translateZ(20px) rotate(5deg) scale(1.1); }
  75% { transform: translateY(-15px) translateZ(10px) rotate(2deg) scale(1.05); }
  100% { transform: translateY(0px) translateZ(0px) rotate(0deg) scale(1); }
`;

const twinkle = keyframes`
  0% { opacity: 0.2; transform: scale(1) rotate(0deg); }
  25% { opacity: 0.8; transform: scale(1.2) rotate(90deg); }
  50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
  75% { opacity: 0.8; transform: scale(1.2) rotate(270deg); }
  100% { opacity: 0.2; transform: scale(1) rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 0.6; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(0px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
`;

const nebula = keyframes`
  0% { background-position: 0% 50%; opacity: 0.3; }
  50% { background-position: 100% 50%; opacity: 0.7; }
  100% { background-position: 0% 50%; opacity: 0.3; }
`;

const meteor = keyframes`
  0% { transform: translateX(-100px) translateY(-100px) rotate(45deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(calc(100vw + 100px)) translateY(calc(100vh + 100px)) rotate(45deg); opacity: 0; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(155, 77, 202, 0.3); }
  50% { box-shadow: 0 0 20px rgba(155, 77, 202, 0.8), 0 0 30px rgba(0, 255, 255, 0.6); }
  100% { box-shadow: 0 0 5px rgba(155, 77, 202, 0.3); }
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
      bg="space.dark"
      position="relative"
      overflow="auto"
      py={4}
      px={4}
    >
      {/* Enhanced 3D animated stars background */}
      {[...Array(40)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          left={`${Math.random() * 100}%`}
          top={`${Math.random() * 100}%`}
          w={`${2 + Math.random() * 3}px`}
          h={`${2 + Math.random() * 3}px`}
          bg={`hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 40}%)`}
          borderRadius="full"
          animation={`${twinkle} ${2 + Math.random() * 4}s infinite`}
          zIndex={0}
          filter="blur(0.5px)"
          boxShadow={`0 0 ${4 + Math.random() * 6}px currentColor`}
        />
      ))}

      {/* Nebula background effects */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="radial-gradient(ellipse at 20% 30%, rgba(155, 77, 202, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)"
        animation={`${nebula} 8s ease-in-out infinite`}
        zIndex={0}
        pointerEvents="none"
      />

      {/* Enhanced floating space elements with 3D effects */}
      <Icon 
        as={FaRocket} 
        color="space.comet" 
        fontSize="7xl" 
        position="absolute" 
        top="30px" 
        left="40px" 
        opacity={0.8} 
        animation={`${float} 4s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaSpaceShuttle} 
        color="space.planet" 
        fontSize="6xl" 
        position="absolute" 
        top="140px" 
        right="60px" 
        opacity={0.7} 
        animation={`${float} 5s 1s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 8px rgba(155, 77, 202, 0.5))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaStar} 
        color="space.star" 
        fontSize="8xl" 
        position="absolute" 
        bottom="80px" 
        left="100px" 
        opacity={0.6} 
        animation={`${pulse} 6s 0.5s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaMoon} 
        color="space.cosmic" 
        fontSize="5xl" 
        position="absolute" 
        top="200px" 
        left="80px" 
        opacity={0.7} 
        animation={`${orbit} 7s 0.2s linear infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 6px rgba(155, 77, 202, 0.4))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaSun} 
        color="space.accent" 
        fontSize="6xl" 
        position="absolute" 
        bottom="120px" 
        right="40px" 
        opacity={0.6} 
        animation={`${pulse} 5s 0.8s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 12px rgba(255, 165, 0, 0.5))"
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Meteor effects */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={`meteor-${i}`}
          position="absolute"
          top="0"
          left="0"
          w="2px"
          h="2px"
          bg="linear-gradient(45deg, rgba(255, 255, 255, 0.8), rgba(0, 255, 255, 0.6))"
          borderRadius="full"
          animation={`${meteor} ${8 + i * 2}s ${i * 3}s linear infinite`}
          zIndex={0}
          filter="blur(1px)"
          boxShadow="0 0 10px rgba(0, 255, 255, 0.8)"
          style={{
            transformOrigin: 'center',
            transform: `translateX(${Math.random() * 100}px) translateY(${Math.random() * 100}px)`
          }}
        />
      ))}

      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={`orbit-${i}`}
          position="absolute"
          top="50%"
          left="50%"
          w="1px"
          h="1px"
          bg={`hsl(${200 + i * 45}, 70%, 60%)`}
          borderRadius="full"
          animation={`${orbit} ${4 + i}s linear infinite`}
          zIndex={0}
          filter="blur(0.5px)"
          boxShadow="0 0 4px currentColor"
          style={{
            transformOrigin: 'center',
            transform: `translateX(${20 + i * 5}px) translateY(${20 + i * 5}px)`
          }}
        />
      ))}

      {/* Additional floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`shape-${i}`}
          position="absolute"
          left={`${10 + i * 15}%`}
          top={`${20 + i * 12}%`}
          w={`${8 + i * 2}px`}
          h={`${8 + i * 2}px`}
          bg={`hsla(${180 + i * 60}, 70%, 60%, 0.3)`}
          borderRadius={i % 2 === 0 ? "full" : "md"}
          animation={`${pulse} ${3 + i}s ease-in-out infinite`}
          zIndex={0}
          filter="blur(1px)"
          boxShadow={`0 0 ${6 + i * 2}px hsla(${180 + i * 60}, 70%, 60%, 0.5)`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateZ(${i * 45}deg)`
          }}
        />
      ))}

      {/* Energy field effects */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        w="100px"
        h="100px"
        borderRadius="full"
        background="radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)"
        animation={`${pulse} 4s ease-in-out infinite`}
        zIndex={0}
        filter="blur(2px)"
        style={{
          transformStyle: 'preserve-3d'
        }}
      />
      <Box
        position="absolute"
        bottom="15%"
        left="15%"
        w="80px"
        h="80px"
        borderRadius="full"
        background="radial-gradient(circle, rgba(155, 77, 202, 0.1) 0%, transparent 70%)"
        animation={`${pulse} 5s ease-in-out infinite 1s`}
        zIndex={0}
        filter="blur(2px)"
        style={{
          transformStyle: 'preserve-3d'
        }}
      />

      {/* Main content */}
      <VStack spacing={6} maxW="600px" mx="auto" position="relative" zIndex={1} w="full">
        <HStack w="full" justify="space-between">
          <IconButton
            aria-label="Exit game"
            icon={<FaHome />}
            onClick={handleExit}
            colorScheme="purple"
            bgGradient="linear(to-r, space.nebula, space.cosmic)"
            _hover={{ 
              bgGradient: 'linear(to-r, space.cosmic, space.nebula)', 
              transform: 'translateY(-2px) scale(1.05)',
              boxShadow: '0 8px 20px rgba(155, 77, 202, 0.4), 0 0 15px rgba(0, 255, 255, 0.3)'
            }}
            _active={{
              transform: 'translateY(0px) scale(0.98)'
            }}
            boxShadow="0 4px 15px rgba(155, 77, 202, 0.3)"
            border="2px solid rgba(155, 77, 202, 0.3)"
            size="md"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          />
          <Text fontSize="xl" fontWeight="bold" color="space.star">
            Score: {state.score}
          </Text>
          <Box
            bg="space.deep"
            px={3}
            py={1}
            borderRadius="xl"
            boxShadow="xl"
            borderWidth="2px"
            borderColor="space.nebula"
            display="flex"
            alignItems="center"
            gap={2}
            animation={`${glow} 4s ease-in-out infinite 1s`}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
              borderRadius: 'xl',
              zIndex: 0,
              animation: `${nebula} 8s ease-in-out infinite 1s`
            }}
            _after={{
              content: '""',
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              right: '-1px',
              bottom: '-1px',
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(155, 77, 202, 0.3))',
              borderRadius: 'xl',
              zIndex: -1,
              filter: 'blur(4px)',
              opacity: 0.4
            }}
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
          animation={`${glow} 3s ease-in-out infinite`}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(155, 77, 202, 0.15) 0%, transparent 70%)',
            zIndex: 0,
            animation: `${nebula} 6s ease-in-out infinite`
          }}
          _after={{
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, rgba(155, 77, 202, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 215, 0, 0.3))',
            borderRadius: '3xl',
            zIndex: -1,
            filter: 'blur(8px)',
            opacity: 0.5
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
                    transform: 'translateY(-3px) scale(1.05) rotate(-2deg)',
                    boxShadow: '0 8px 25px rgba(155, 77, 202, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)'
                  }}
                  _active={{
                    bgGradient: 'linear(to-r, space.planet, space.cosmic)',
                    transform: 'translateY(-1px) scale(0.98)'
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
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