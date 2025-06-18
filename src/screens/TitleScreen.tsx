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
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { DifficultySelector } from '../components/DifficultySelector';
import { FaPlay, FaTrophy, FaCog, FaStar, FaHeart, FaBrain, FaUser, FaSmile, FaRocket } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

// Floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-18px); }
  100% { transform: translateY(0px); }
`;

const TitleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { highScore } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nickname, setNickname] = useState<string>('');

  useEffect(() => {
    // Load nickname from localStorage on component mount
    const savedNickname = localStorage.getItem('playerNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleStartGame = () => {
    if (!nickname.trim()) {
      onOpen(); // Open modal if no nickname is set
      return;
    }
    navigate('/game');
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      localStorage.setItem('playerNickname', nickname.trim());
      dispatch({ type: 'SET_PLAYER_NAME', payload: nickname.trim() });
      onClose();
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, #FFE66D, #FF6B8B)"
      py={10}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* Playful floating icons */}
      <Icon as={FaStar} color="game.accent" fontSize="7xl" position="absolute" top="30px" left="40px" opacity={0.5} animation={`${float} 4s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaSmile} color="game.pink" fontSize="6xl" position="absolute" top="140px" right="60px" opacity={0.4} animation={`${float} 5s 1s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaRocket} color="game.secondary" fontSize="8xl" position="absolute" bottom="80px" left="100px" opacity={0.4} animation={`${float} 6s 0.5s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaHeart} color="game.purple" fontSize="5xl" position="absolute" top="200px" left="80px" opacity={0.3} animation={`${float} 7s 0.2s ease-in-out infinite`} zIndex={0} />
      <Icon as={FaStar} color="game.orange" fontSize="6xl" position="absolute" bottom="120px" right="40px" opacity={0.4} animation={`${float} 5s 0.8s ease-in-out infinite`} zIndex={0} />
      {/* Main content */}
      <Container maxW="container.md" position="relative" zIndex={1} mx="auto" textAlign="center">
        <VStack spacing={8}>
          {/* Title Section */}
          <VStack spacing={4}>
            <motion.h1
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
              style={{
                fontSize: '3rem',
                background: 'linear-gradient(to right, #9B59B6, #FF6B8B, #FFE66D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontFamily: 'Comic Sans MS, cursive',
                letterSpacing: '0.1em',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              Math Adventure!
            </motion.h1>
            <Text
              fontSize="xl"
              color="gray.600"
              textAlign="center"
              fontFamily="'Comic Sans MS', cursive"
            >
              Let's make math fun! 🎮✨
            </Text>
            {nickname && (
              <Text
                fontSize="lg"
                color="blue.500"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <FaUser /> Welcome, {nickname}!
              </Text>
            )}
          </VStack>
          {/* Main Content Box */}
          <Box
            w="full"
            p={10}
            bgGradient="linear(to-br, game.purple, game.pink, game.accent)"
            rounded="3xl"
            shadow="2xl"
            borderWidth="4px"
            borderColor="#fff"
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

            <VStack spacing={8}>
              {/* How to Play Section */}
              <Box w="full">
                <Heading
                  size="md"
                  mb={4}
                  color="blue.500"
                  fontFamily="'Comic Sans MS', cursive"
                >
                  How to Play:
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={3}>
                    <Flex align="center" gap={2}>
                      <Icon as={FaBrain} color="purple.500" />
                      <Text>Solve fun math problems!</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={FaStar} color="yellow.500" />
                      <Text>Choose the right answer</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={FaHeart} color="red.500" />
                      <Text>Keep your hearts safe!</Text>
                    </Flex>
                  </VStack>
                  <Box
                    bg="blue.50"
                    p={4}
                    rounded="xl"
                    borderWidth="2px"
                    borderColor="blue.200"
                  >
                    <Text fontWeight="bold" color="blue.600" mb={2}>
                      Your Best Score:
                    </Text>
                    <Text fontSize="3xl" color="blue.500" fontWeight="bold">
                      {highScore} points
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Difficulty Selector */}
              <Box w="full">
                <Heading
                  size="md"
                  mb={4}
                  color="purple.500"
                  fontFamily="'Comic Sans MS', cursive"
                >
                  Choose Your Level:
                </Heading>
                <DifficultySelector />
              </Box>

              {/* Action Buttons */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                <Button
                  leftIcon={<FaPlay />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handleStartGame}
                  bgGradient="linear(to-r, blue.400, blue.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, blue.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  Start Game
                </Button>

                <Button
                  leftIcon={<FaTrophy />}
                  colorScheme="purple"
                  size="lg"
                  onClick={handleLeaderboard}
                  bgGradient="linear(to-r, purple.400, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.500, purple.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  Leaderboard
                </Button>

                <Button
                  leftIcon={<FaCog />}
                  colorScheme="teal"
                  size="lg"
                  onClick={handleSettings}
                  bgGradient="linear(to-r, teal.400, teal.500)"
                  _hover={{
                    bgGradient: "linear(to-r, teal.500, teal.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  Settings
                </Button>
              </SimpleGrid>

              {!nickname && (
                <Button
                  leftIcon={<FaUser />}
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  onClick={onOpen}
                  bgGradient="linear(to-r, purple.400, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.500, purple.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                  mt={4}
                >
                  Set Nickname
                </Button>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Nickname Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Your Nickname</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nickname</FormLabel>
              <Input
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNicknameSubmit();
                  }
                }}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              mr={3}
              mt={4}
              onClick={handleNicknameSubmit}
              isDisabled={!nickname.trim()}
            >
              Save
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TitleScreen; 