import React from 'react';
import {
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface Score {
  name: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  scores: Score[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.600');

  if (scores.length === 0) {
    return (
      <Box
        p={8}
        bg={bgColor}
        rounded="xl"
        shadow="md"
        textAlign="center"
      >
        <Text fontSize="xl" color="gray.500">
          No scores yet. Be the first to set a high score!
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch" w="full">
      <Heading size="md">Top Scores</Heading>
      <Box
        w="full"
        bg={bgColor}
        rounded="xl"
        shadow="md"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead bg={headerBg}>
            <Tr>
              <Th>Rank</Th>
              <Th>Name</Th>
              <Th isNumeric>Score</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {scores.map((score, index) => (
              <Tr key={index}>
                <Td fontWeight="bold">#{index + 1}</Td>
                <Td>{score.name}</Td>
                <Td isNumeric>{score.score}</Td>
                <Td>{new Date(score.date).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
}; 