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
import { playSound, unlockAudio } from '../utils/soundEffects';

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
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          position="fixed"
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
      <Icon as={FaRocket} color="space.comet" fontSize="7xl" position="fixed" top="30px" left="40px" opacity={0.6} animation={`${float} 4s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaSpaceShuttle} color="space.planet" fontSize="6xl" position="fixed" top="140px" right="60px" opacity={0.5} animation={`${float} 5s 1s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaStar} color="space.star" fontSize="8xl" position="fixed" bottom="80px" left="100px" opacity={0.4} animation={`${float} 6s 0.5s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaMoon} color="space.cosmic" fontSize="5xl" position="fixed" top="200px" left="80px" opacity={0.5} animation={`${float} 7s 0.2s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaSun} color="space.accent" fontSize="6xl" position="fixed" bottom="120px" right="40px" opacity={0.4} animation={`${float} 5s 0.8s ease-in-out infinite`} zIndex={0} />

      {/* Main content */}
      <Container maxW="container.md" position="relative" zIndex={1} mx="auto" textAlign="center" py={2}>
        <VStack spacing={4}>
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
                fontFamily: 'Comic Sans MS, cursive',
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
              fontFamily="'Comic Sans MS', cursive"
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
                fontFamily="'Comic Sans MS', cursive"
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
                  fontFamily="'Comic Sans MS', cursive"
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
                  fontFamily="'Comic Sans MS', cursive"
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
                    transform: "translateY(-2px)",
                    boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
                  }}
                  transition="all 0.2s"
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
                    transform: "translateY(-2px)",
                    boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
                  }}
                  transition="all 0.2s"
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
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
                }}
                transition="all 0.2s"
                w="full"
                maxW="300px"
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
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
                }}
                transition="all 0.2s"
                w="full"
                maxW="300px"
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
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
                w="full"
                maxW="200px"
              >
                {audioUnlocked ? 'Test Sounds 🔊' : 'Enable Sounds 🔊'}
              </Button>
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
            fontFamily="'Comic Sans MS', cursive"
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
                fontFamily="'Comic Sans MS', cursive"
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