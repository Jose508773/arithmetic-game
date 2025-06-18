import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Input,
  HStack,
  Image,
  Select
} from '@chakra-ui/react';
import { FaPlay, FaStar } from 'react-icons/fa';
import { useGame } from '../context/GameContext';

interface Theme {
  value: string;
  label: string;
}

const avatars: string[] = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

const themes: Theme[] = [
  { value: 'space', label: 'Space' },
  { value: 'jungle', label: 'Jungle' },
  { value: 'underwater', label: 'Underwater' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const { dispatch } = useGame();

  const [playerName, setPlayerName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatars[0]);
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0].value);

  const handleStart = () => {
    if (!playerName.trim()) return;
    
    dispatch({ type: 'SET_PLAYER_NAME', payload: playerName.trim() });
    dispatch({ type: 'SET_PLAYER_AVATAR', payload: selectedAvatar });
    dispatch({ type: 'SET_THEME', payload: selectedTheme });
    navigate('/game');
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
  };

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="center" textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, green.400, blue.500)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Math Adventure
          </Heading>
          
          <Text fontSize="xl" color={textColor} maxW="2xl">
            Challenge your math skills with this exciting arithmetic game! 
            Solve problems, earn points, and climb the leaderboard.
          </Text>

          {/* Player Name Input */}
          <Box w="full" maxW="md" bg="white" p={6} rounded="xl" shadow="md">
            <VStack spacing={4}>
              <Input
                placeholder="Enter your name..."
                value={playerName}
                onChange={handleNameChange}
                fontFamily="'Comic Sans MS', cursive"
                fontSize="lg"
                textAlign="center"
                bg="yellow.50"
              />

              {/* Avatar Selection */}
              <Text fontWeight="bold">Choose your avatar:</Text>
              <HStack spacing={4} justify="center">
                {avatars.map((avatar: string, idx: number) => (
                  <Box
                    key={avatar}
                    border={selectedAvatar === avatar ? '3px solid #4FD1C5' : '2px solid #E2E8F0'}
                    borderRadius="full"
                    p={1}
                    cursor="pointer"
                    onClick={() => setSelectedAvatar(avatar)}
                    bg={selectedAvatar === avatar ? 'teal.100' : 'transparent'}
                  >
                    <Image 
                      src={avatar} 
                      alt={`Avatar ${idx + 1}`} 
                      boxSize="56px" 
                      borderRadius="full"
                      onError={(e) => {
                        console.error(`Failed to load avatar: ${avatar}`);
                        e.currentTarget.src = '/avatars/avatar1.png';
                      }}
                    />
                  </Box>
                ))}
              </HStack>

              {/* Theme Selection */}
              <Text fontWeight="bold">Choose your theme:</Text>
              <Select value={selectedTheme} onChange={handleThemeChange}>
                {themes.map((theme: Theme) => (
                  <option key={theme.value} value={theme.value}>{theme.label}</option>
                ))}
              </Select>

              <Button
                leftIcon={<FaPlay />}
                colorScheme="green"
                size="lg"
                w="full"
                onClick={handleStart}
                isDisabled={!playerName.trim()}
                fontFamily="'Comic Sans MS', cursive"
              >
                Start Game
              </Button>
            </VStack>
          </Box>

          <VStack spacing={4} align="start" w="full" maxW="md" mt={8}>
            <Box display="flex" alignItems="center" gap={2}>
              <FaStar color="gold" />
              <Text>Multiple difficulty levels</Text>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <FaStar color="gold" />
              <Text>Earn achievements and badges</Text>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <FaStar color="gold" />
              <Text>Track your progress</Text>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage; 