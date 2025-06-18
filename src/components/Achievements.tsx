import React from 'react';
import {
  VStack,
  Heading,
  SimpleGrid,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useGame } from '../context/GameContext';

export const Achievements: React.FC = () => {
  const { state } = useGame();
  const { achievements } = state;

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (achievements.length === 0) {
    return null;
  }

  return (
    <VStack spacing={4} align="stretch" w="full">
      <Heading size="md">Achievements</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {achievements.map((achievement) => (
          <Box
            key={achievement.id}
            p={4}
            bg={bgColor}
            rounded="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Text fontSize="2xl" mb={2}>
              {/* Remove the icon rendering */}
            </Text>
            <Text fontWeight="bold">{achievement.title}</Text>
            <Text fontSize="sm" color="gray.500">
              {achievement.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}; 