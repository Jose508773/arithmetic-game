import React from 'react';
import {
  VStack,
  Text,
  Radio,
  RadioGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { useGame } from '../context/GameContext';
import { Difficulty } from '../types';

export const DifficultySelector: React.FC = () => {
  const { state, dispatch } = useGame();
  const { difficulty } = state;

  const handleDifficultyChange = (value: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: value });
  };

  const radioBg = useColorModeValue('white', 'gray.700');
  const radioBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <VStack spacing={4} align="stretch" w="full">
      <Text fontSize="lg" fontWeight="bold">
        Select Difficulty
      </Text>
      <RadioGroup
        value={difficulty}
        onChange={handleDifficultyChange}
        colorScheme="blue"
      >
        <VStack spacing={3} align="stretch">
          <Radio
            value="easy"
            bg={radioBg}
            borderColor={radioBorder}
            p={3}
            rounded="md"
            shadow="sm"
          >
            Easy - Perfect for beginners
          </Radio>
          <Radio
            value="medium"
            bg={radioBg}
            borderColor={radioBorder}
            p={3}
            rounded="md"
            shadow="sm"
          >
            Medium - For experienced players
          </Radio>
          <Radio
            value="hard"
            bg={radioBg}
            borderColor={radioBorder}
            p={3}
            rounded="md"
            shadow="sm"
          >
            Hard - For arithmetic masters
          </Radio>
        </VStack>
      </RadioGroup>
    </VStack>
  );
}; 