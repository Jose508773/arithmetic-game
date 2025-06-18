import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaTrophy } from 'react-icons/fa';

interface Score {
  name: string;
  avatar?: string;
  score: number;
  date: string;
}

const LeaderboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem('leaderboard');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

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
          bgGradient="linear(to-r, yellow.400, orange.500)"
          bgClip="text"
          textAlign="center"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <FaTrophy />
          Leaderboard
        </Heading>

        {scores.length > 0 ? (
          <Box
            w="full"
            bg="white"
            rounded="xl"
            shadow="md"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead bg="gray.50">
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
                    <Td>
                      {score.avatar && (
                        <img src={score.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                      )}
                      {score.name}
                    </Td>
                    <Td isNumeric>{score.score}</Td>
                    <Td>{new Date(score.date).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box
            p={8}
            bg="white"
            rounded="xl"
            shadow="md"
            textAlign="center"
          >
            <Text fontSize="xl" color="gray.500">
              No scores yet. Be the first to set a high score!
            </Text>
          </Box>
        )}

        <Button
          leftIcon={<FaHome />}
          colorScheme="orange"
          size="lg"
          onClick={handleGoHome}
        >
          Back to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default LeaderboardScreen; 