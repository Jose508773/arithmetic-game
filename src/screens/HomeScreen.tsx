import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DifficultySelector } from '../components/DifficultySelector';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl">
          Arithmetic Game
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Test your math skills with this fun arithmetic game!
        </Text>

        <DifficultySelector />

        <VStack spacing={4} width="100%">
          <Button
            colorScheme="green"
            size="lg"
            width="full"
            onClick={() => navigate('/game')}
          >
            Start Game
          </Button>
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            width="full"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
        </VStack>

        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </VStack>
    </Container>
  );
}; 