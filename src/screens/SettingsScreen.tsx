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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaHome, FaCog } from 'react-icons/fa';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { state, dispatch } = useGame();
  const { soundEnabled, musicEnabled } = state;

  const handleToggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
    toast({
      title: soundEnabled ? 'Sound Disabled' : 'Sound Enabled',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleToggleMusic = () => {
    dispatch({ type: 'TOGGLE_MUSIC' });
    toast({
      title: musicEnabled ? 'Music Disabled' : 'Music Enabled',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      py={10}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={8} maxW="container.md" w="full">
        <Heading
          size="2xl"
          bgGradient="linear(to-r, teal.400, blue.500)"
          bgClip="text"
          textAlign="center"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <FaCog />
          Settings
        </Heading>

        <Box
          w="full"
          p={8}
          bg="white"
          rounded="xl"
          shadow="md"
        >
          <VStack spacing={6} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel htmlFor="sound-toggle" mb="0">
                Sound Effects
              </FormLabel>
              <Switch
                id="sound-toggle"
                isChecked={soundEnabled}
                onChange={handleToggleSound}
                colorScheme="blue"
                size="lg"
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel htmlFor="music-toggle" mb="0">
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
          colorScheme="blue"
          size="lg"
          onClick={handleGoHome}
        >
          Back to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default SettingsScreen; 