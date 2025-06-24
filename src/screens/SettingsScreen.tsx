import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Container,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/useGame';
import { FaHome, FaCog, FaStar, FaRocket, FaSpaceShuttle, FaMoon, FaSun } from 'react-icons/fa';
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

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { state, dispatch } = useGame();
  const { soundEnabled, musicEnabled } = state;

  const handleToggleSound = () => {
    playSound('button-click');
    dispatch({ type: 'TOGGLE_SOUND' });
    toast({
      title: soundEnabled ? 'Sound Disabled' : 'Sound Enabled',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleToggleMusic = () => {
    playSound('button-click');
    dispatch({ type: 'TOGGLE_MUSIC' });
    toast({
      title: musicEnabled ? 'Music Disabled' : 'Music Enabled',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleGoHome = () => {
    playSound('button-click');
    navigate('/');
  };

  return (
    <Box
      minH="100vh"
      bg="space.dark"
      position="relative"
      overflow="hidden"
      py={10}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Animated stars background */}
      {[...Array(20)].map((_, i) => (
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
        <VStack spacing={8}>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, space.nebula, space.comet, space.star)"
            bgClip="text"
            textAlign="center"
            display="flex"
            alignItems="center"
            gap={2}
            fontFamily="'Comic Sans MS', cursive"
            textShadow="0 0 10px rgba(155, 77, 202, 0.5)"
          >
            <FaCog />
            Settings
          </Heading>

          <Box
            w="full"
            p={8}
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
            <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel htmlFor="sound-toggle" mb="0" color="space.star" fontFamily="'Comic Sans MS', cursive">
                  Sound Effects
                </FormLabel>
                <Switch
                  id="sound-toggle"
                  isChecked={soundEnabled}
                  onChange={handleToggleSound}
                  colorScheme="purple"
                  size="lg"
                />
              </FormControl>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel htmlFor="music-toggle" mb="0" color="space.star" fontFamily="'Comic Sans MS', cursive">
                  Background Music
                </FormLabel>
                <Switch
                  id="music-toggle"
                  isChecked={musicEnabled}
                  onChange={handleToggleMusic}
                  colorScheme="purple"
                  size="lg"
                />
              </FormControl>
            </VStack>
          </Box>

          <Button
            leftIcon={<FaHome />}
            colorScheme="purple"
            size="lg"
            onClick={handleGoHome}
            bgGradient="linear(to-r, space.nebula, space.cosmic)"
            _hover={{
              bgGradient: "linear(to-r, space.cosmic, space.nebula)",
              transform: "translateY(-2px)",
              boxShadow: "0 0 15px rgba(155, 77, 202, 0.3)"
            }}
            transition="all 0.2s"
          >
            Back to Home
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default SettingsScreen; 