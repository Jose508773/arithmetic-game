import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Container,
  Flex,
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/useGame';
import { DifficultySelector } from '../components/DifficultySelector';
import { Shop } from '../components/Shop';
import { FaPlay, FaCog, FaStar, FaHeart, FaBrain, FaUserAstronaut, FaRocket, FaMoon, FaSun, FaSpaceShuttle, FaStore, FaCoins } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { playSound, unlockAudio, setSoundEnabled } from '../utils/soundEffects';

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

const TitleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { highScore, playerName, totalScore } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isShopOpen, onOpen: onShopOpen, onClose: onShopClose } = useDisclosure();
  const [nickname, setNickname] = useState<string>(playerName || '');
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Initialize audio context on component mount
  useEffect(() => {
    console.log('🎵 Initializing audio context...');
    unlockAudio();
  }, []);

  // Sync sound toggles with sound effects module
  useEffect(() => {
    setSoundEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  // Function to unlock audio with user interaction
  const unlockAudioWithInteraction = async () => {
    console.log('🔓 Unlocking audio with user interaction...');
    setAudioUnlocked(true);
    
    try {
      await unlockAudio();
      
      // Test sound immediately after user interaction
      setTimeout(async () => {
        console.log('🔊 Testing sound after user interaction...');
        await playSound('button-click');
      }, 100);
    } catch (error) {
      console.error('❌ Error unlocking audio:', error);
    }
  };

  const handleStartGame = async () => {
    console.log('🎮 Starting game...');
    if (!audioUnlocked) {
      await unlockAudioWithInteraction();
    }
    await playSound('button-click');
    if (!playerName) {
      onOpen(); // Open modal if no nickname is set
      return;
    }
    navigate('/game');
  };

  const handleSettings = async () => {
    console.log('⚙️ Opening settings...');
    if (!audioUnlocked) {
      await unlockAudioWithInteraction();
    }
    await playSound('button-click');
    navigate('/settings');
  };

  const handleNicknameSubmit = async () => {
    if (nickname.trim()) {
      console.log('👤 Setting nickname...');
      if (!audioUnlocked) {
        await unlockAudioWithInteraction();
      }
      await playSound('button-click');
      dispatch({ type: 'SET_PLAYER_NAME', payload: nickname.trim() });
      onClose();
      setNickname('');
    }
  };

  const handleOpenModal = async () => {
    console.log('📝 Opening nickname modal...');
    if (!audioUnlocked) {
      await unlockAudioWithInteraction();
    }
    await playSound('button-click');
    onOpen();
  };

  const handleTestSounds = async () => {
    console.log('🔊 Testing all sounds...');
    if (!audioUnlocked) {
      await unlockAudioWithInteraction();
    }
    
    // Test sounds with delays
    await playSound('button-click');
    setTimeout(async () => await playSound('achievement'), 500);
    setTimeout(async () => await playSound('level-up'), 1000);
  };

  const handleShop = async () => {
    console.log('🛒 Opening shop...');
    if (!audioUnlocked) {
      await unlockAudioWithInteraction();
    }
    await playSound('button-click');
    onShopOpen();
  };

  useEffect(() => {
    // Load nickname from localStorage on component mount
    const savedNickname = localStorage.getItem('playerNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

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
          position="fixed"
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
        position="fixed"
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
        position="fixed" 
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
        position="fixed" 
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
        position="fixed" 
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
        position="fixed" 
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
        position="fixed" 
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
          position="fixed"
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
          position="fixed"
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
          position="fixed"
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
        position="fixed"
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
        position="fixed"
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
      <Container maxW="container.md" position="relative" zIndex={1} mx="auto" textAlign="center" py={8}>
        <VStack spacing={6} justify="flex-start">
          {/* Title Section */}
          <VStack spacing={2}>
            <motion.h1
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
              style={{
                fontSize: '2rem',
                background: 'linear-gradient(to right, #9B4DCA, #00FFFF, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '0.1em',
                fontWeight: 'bold',
                margin: 0,
                textShadow: '0 0 10px rgba(155, 77, 202, 0.5)',
              }}
            >
              Math Adventure!
            </motion.h1>
            <Text
              fontSize="md"
              color="space.comet"
              textAlign="center"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            >
              Let's explore the universe of numbers! 🚀✨
            </Text>
            {playerName && (
              <Text
                fontSize="sm"
                color="space.star"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <FaUserAstronaut /> Welcome, {playerName}!
              </Text>
            )}
            {!audioUnlocked && (
              <Text
                fontSize="xs"
                color="space.comet"
                textAlign="center"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                bg="space.deep"
                p={1}
                rounded="md"
                borderWidth="1px"
                borderColor="space.nebula"
              >
                🔊 Click any button to enable sound effects!
              </Text>
            )}
          </VStack>

          {/* Main Content Box */}
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
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-20px"
              right="-20px"
              fontSize="6xl"
              color="yellow.400"
              transform="rotate(15deg)"
              opacity={0.7}
            >
              <Icon as={FaStar} />
            </Box>
            <Box
              position="absolute"
              bottom="-20px"
              left="-20px"
              fontSize="6xl"
              color="red.400"
              transform="rotate(-15deg)"
              opacity={0.7}
            >
              <Icon as={FaHeart} />
            </Box>

            <VStack spacing={4}>
              {/* How to Play Section */}
              <Box w="full">
                <Heading
                  size="sm"
                  mb={2}
                  color="space.comet"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                >
                  How to Play:
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <VStack align="start" spacing={1}>
                    <Flex align="center" gap={2}>
                      <Icon as={FaBrain} color="space.cosmic" />
                      <Text color="space.star" fontSize="xs">Solve fun math problems!</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={FaStar} color="space.star" />
                      <Text color="space.star" fontSize="xs">Choose the right answer</Text>
                    </Flex>
                    <Flex align="flex-start" gap={2}>
                      <Icon as={FaHeart} color="space.planet" mt={1} />
                      <Text color="space.star" fontSize="xs">You have 3 lives - 3 wrong answers and it's game over!</Text>
                    </Flex>
                  </VStack>
                  <Box
                    bg="space.deep"
                    p={2}
                    rounded="xl"
                    borderWidth="2px"
                    borderColor="space.nebula"
                    boxShadow="0 0 15px rgba(155, 77, 202, 0.2)"
                  >
                    <Text fontWeight="bold" color="space.comet" mb={1} fontSize="xs">
                      Your Best Score:
                    </Text>
                    <Text fontSize="xl" color="space.star" fontWeight="bold">
                      {highScore} points
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Total Score Display */}
              <Box
                bg="space.deep"
                p={3}
                rounded="xl"
                borderWidth="2px"
                borderColor="space.nebula"
                boxShadow="0 0 15px rgba(155, 77, 202, 0.2)"
                w="full"
              >
                <HStack justify="center" spacing={2} mb={1}>
                  <Icon as={FaCoins} color="space.accent" />
                  <Text fontWeight="bold" color="space.comet" fontSize="sm">
                    Total Score:
                  </Text>
                </HStack>
                <Text fontSize="2xl" color="space.star" fontWeight="bold" textAlign="center">
                  {totalScore} points
                </Text>
                <Text fontSize="xs" color="space.comet" textAlign="center">
                  Use these points to buy items in the shop!
                </Text>
              </Box>

              {/* Difficulty Selector */}
              <Box w="full">
                <Heading
                  size="sm"
                  mb={2}
                  color="space.comet"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                >
                  Choose Your Level:
                </Heading>
                <DifficultySelector />
              </Box>

              {/* Action Buttons */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} w="full">
                <Button
                  leftIcon={<FaPlay />}
                  colorScheme="purple"
                  size="sm"
                  onClick={handleStartGame}
                  bgGradient="linear(to-r, space.nebula, space.cosmic)"
                  _hover={{
                    bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                    transform: "translateY(-3px) scale(1.05)",
                    boxShadow: "0 8px 25px rgba(155, 77, 202, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)"
                  }}
                  _active={{
                    transform: "translateY(-1px) scale(0.98)"
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                  boxShadow="0 4px 15px rgba(155, 77, 202, 0.2)"
                >
                  Start Game
                </Button>
                <Button
                  leftIcon={<FaStore />}
                  colorScheme="purple"
                  size="sm"
                  onClick={handleShop}
                  bgGradient="linear(to-r, space.nebula, space.cosmic)"
                  _hover={{
                    bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                    transform: "translateY(-3px) scale(1.05)",
                    boxShadow: "0 8px 25px rgba(155, 77, 202, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)"
                  }}
                  _active={{
                    transform: "translateY(-1px) scale(0.98)"
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                  boxShadow="0 4px 15px rgba(155, 77, 202, 0.2)"
                >
                  Shop
                </Button>
              </SimpleGrid>

              {/* Settings Button */}
              <Button
                leftIcon={<FaCog />}
                colorScheme="purple"
                size="sm"
                onClick={handleSettings}
                bgGradient="linear(to-r, space.planet, space.cosmic)"
                _hover={{
                  bgGradient: "linear(to-r, space.cosmic, space.planet)",
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: "0 8px 25px rgba(155, 77, 202, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)"
                }}
                _active={{
                  transform: "translateY(-1px) scale(0.98)"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                w="full"
                maxW="300px"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                boxShadow="0 4px 15px rgba(155, 77, 202, 0.2)"
              >
                Settings
              </Button>

              {/* Nickname Button */}
              <Button
                leftIcon={<FaUserAstronaut />}
                colorScheme="purple"
                size="sm"
                onClick={handleOpenModal}
                bgGradient="linear(to-r, space.nebula, space.cosmic)"
                _hover={{
                  bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: "0 8px 25px rgba(155, 77, 202, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)"
                }}
                _active={{
                  transform: "translateY(-1px) scale(0.98)"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                w="full"
                maxW="300px"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                boxShadow="0 4px 15px rgba(155, 77, 202, 0.2)"
              >
                {playerName ? `Change Nickname: ${playerName}` : 'Set Your Nickname'}
              </Button>

              {/* Test Sound Button (for debugging) */}
              <Button
                colorScheme="teal"
                size="xs"
                onClick={handleTestSounds}
                bgGradient="linear(to-r, teal.400, teal.600)"
                _hover={{
                  bgGradient: "linear(to-r, teal.600, teal.400)",
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: "0 8px 25px rgba(0, 128, 128, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)"
                }}
                _active={{
                  transform: "translateY(-1px) scale(0.98)"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                w="full"
                maxW="200px"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                boxShadow="0 4px 15px rgba(0, 128, 128, 0.2)"
              >
                {audioUnlocked ? 'Test Sounds 🔊' : 'Enable Sounds 🔊'}
              </Button>
            </VStack>
          </Box>

          {/* Additional Game Information */}
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
              background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
              zIndex: 0,
              animation: `${nebula} 8s ease-in-out infinite 1s`
            }}
            _after={{
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(155, 77, 202, 0.3), rgba(255, 215, 0, 0.3))',
              borderRadius: '3xl',
              zIndex: -1,
              filter: 'blur(8px)',
              opacity: 0.4
            }}
          >
            <VStack spacing={4} position="relative" zIndex={1}>
              <Heading
                size="md"
                color="space.star"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                textShadow="0 0 10px rgba(155, 77, 202, 0.5)"
              >
                🚀 Game Features
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <VStack align="start" spacing={3}>
                  <Box>
                    <Text color="space.comet" fontWeight="bold" fontSize="sm" mb={1}>
                      🎯 Multiple Difficulties
                    </Text>
                    <Text color="space.star" fontSize="xs">
                      Choose from Easy, Medium, and Hard modes to challenge yourself!
                    </Text>
                  </Box>
                  <Box>
                    <Text color="space.comet" fontWeight="bold" fontSize="sm" mb={1}>
                      🏆 Achievements
                    </Text>
                    <Text color="space.star" fontSize="xs">
                      Unlock special achievements as you progress through the game!
                    </Text>
                  </Box>
                  <Box>
                    <Text color="space.comet" fontWeight="bold" fontSize="sm" mb={1}>
                      🎵 Sound Effects
                    </Text>
                    <Text color="space.star" fontSize="xs">
                      Immersive audio experience with customizable sound settings!
                    </Text>
                  </Box>
                </VStack>
                
                <VStack align="start" spacing={3}>
                  <Box>
                    <Text color="space.comet" fontWeight="bold" fontSize="sm" mb={1}>
                      🛒 Shop System
                    </Text>
                    <Text color="space.star" fontSize="xs">
                      Spend your points on power-ups and cosmetic items!
                    </Text>
                  </Box>
                  <Box>
                    <Text color="space.comet" fontWeight="bold" fontSize="sm" mb={1}>
                      📊 Progress Tracking
                    </Text>
                    <Text color="space.star" fontSize="xs">
                      Keep track of your high scores and total progress!
                    </Text>
                  </Box>
                  <Box>
                    <Text color="space.comet" fontWeight="bold" fontSize="sm" mb={1}>
                      🎨 Beautiful Design
                    </Text>
                    <Text color="space.star" fontSize="xs">
                      Enjoy a stunning space-themed interface with animations!
                    </Text>
                  </Box>
                </VStack>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Tips Section */}
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
            animation={`${glow} 5s ease-in-out infinite 2s`}
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
              zIndex: 0,
              animation: `${nebula} 10s ease-in-out infinite 2s`
            }}
            _after={{
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(155, 77, 202, 0.3), rgba(0, 255, 255, 0.3))',
              borderRadius: '3xl',
              zIndex: -1,
              filter: 'blur(8px)',
              opacity: 0.4
            }}
          >
            <VStack spacing={4} position="relative" zIndex={1}>
              <Heading
                size="md"
                color="space.star"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                textShadow="0 0 10px rgba(155, 77, 202, 0.5)"
              >
                💡 Pro Tips
              </Heading>
              
              <VStack spacing={3} align="start" w="full">
                <Flex align="center" gap={3}>
                  <Icon as={FaStar} color="space.accent" />
                  <Text color="space.star" fontSize="sm">
                    Start with Easy mode to get familiar with the game mechanics
                  </Text>
                </Flex>
                <Flex align="center" gap={3}>
                  <Icon as={FaStar} color="space.accent" />
                  <Text color="space.star" fontSize="sm">
                    Use your points wisely in the shop - power-ups can help you score higher!
                  </Text>
                </Flex>
                <Flex align="center" gap={3}>
                  <Icon as={FaStar} color="space.accent" />
                  <Text color="space.star" fontSize="sm">
                    Take your time with each question - accuracy is more important than speed
                  </Text>
                </Flex>
                <Flex align="center" gap={3}>
                  <Icon as={FaStar} color="space.accent" />
                  <Text color="space.star" fontSize="sm">
                    Check the settings to customize your gaming experience
                  </Text>
                </Flex>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Nickname Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            textAlign="center"
            fontSize="2xl"
            textShadow="0 0 10px rgba(155, 77, 202, 0.5)"
          >
            {playerName ? 'Change Your Nickname' : 'Choose Your Nickname'}
          </ModalHeader>
          <ModalCloseButton color="space.comet" />
          <ModalBody>
            <VStack spacing={6}>
              <Text color="space.comet" textAlign="center" fontSize="lg">
                {playerName 
                  ? "Enter a new nickname to continue your space adventure!"
                  : "Enter your nickname to start your space adventure!"}
              </Text>
              <Input
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                size="lg"
                bg="space.dark"
                borderColor="space.nebula"
                color="space.star"
                _hover={{ borderColor: "space.comet" }}
                _focus={{ borderColor: "space.star", boxShadow: "0 0 0 1px var(--chakra-colors-space-star)" }}
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
              />
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleNicknameSubmit}
              isDisabled={!nickname.trim()}
              bgGradient="linear(to-r, space.nebula, space.cosmic)"
              _hover={{
                bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                transform: "translateY(-2px)",
                boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
              }}
              transition="all 0.2s"
            >
              {playerName ? 'Update Nickname' : 'Start Adventure'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Shop Modal */}
      <Shop isOpen={isShopOpen} onClose={onShopClose} />
    </Box>
  );
};

export default TitleScreen; 