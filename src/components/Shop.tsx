import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaStore, FaCoins, FaCheck, FaLock } from 'react-icons/fa';
import { useGame } from '../context/useGame';
import { ShopItem } from '../types/index';
import { playSound } from '../utils/soundEffects';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useGame();
  const toast = useToast();

  const handlePurchase = async (item: ShopItem) => {
    if (item.purchased) {
      toast({
        title: 'Already Purchased!',
        description: 'You already own this item.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (state.totalScore < item.price) {
      toast({
        title: 'Not Enough Coins!',
        description: `You need ${item.price - state.totalScore} more coins to buy this item.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await playSound('button-click');
    dispatch({ type: 'PURCHASE_ITEM', payload: item.id });
    
    toast({
      title: 'Purchase Successful!',
      description: `You bought ${item.name}!`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'powerup': return 'green';
      case 'cosmetic': return 'purple';
      case 'bonus': return 'blue';
      default: return 'gray';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'powerup': return 'Power-Up';
      case 'cosmetic': return 'Cosmetic';
      case 'bonus': return 'Bonus';
      default: return 'Other';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg="space.deep"
        borderWidth="2px"
        borderColor="space.nebula"
        rounded="3xl"
        maxH="80vh"
        overflow="hidden"
        position="relative"
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
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={3}
        >
          <Icon as={FaStore} color="space.accent" />
          Space Shop
        </ModalHeader>
        <ModalCloseButton color="space.star" />
        
        <ModalBody pb={6} position="relative" zIndex={1}>
          {/* Total Score Display */}
          <Box
            bg="space.dark"
            p={4}
            borderRadius="xl"
            mb={4}
            borderWidth="2px"
            borderColor="space.nebula"
            textAlign="center"
          >
            <HStack justify="center" spacing={2} mb={2}>
              <Icon as={FaCoins} color="space.accent" />
              <Text fontSize="xl" fontWeight="bold" color="space.star">
                Total Score: {state.totalScore}
              </Text>
            </HStack>
            <Text fontSize="sm" color="space.comet">
              Earn points by playing games to buy items!
            </Text>
          </Box>

          <Divider borderColor="space.nebula" mb={4} />

          {/* Shop Items */}
          <VStack spacing={4} maxH="50vh" overflowY="auto">
            {state.shopItems.map((item) => (
              <Box
                key={item.id}
                bg="space.dark"
                p={4}
                borderRadius="xl"
                w="full"
                borderWidth="2px"
                borderColor={item.purchased ? "green.400" : "space.nebula"}
                position="relative"
                _hover={{
                  borderColor: item.purchased ? "green.300" : "space.accent",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(155, 77, 202, 0.2)",
                }}
                transition="all 0.2s"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontSize="2xl">{item.icon}</Text>
                      <VStack align="start" spacing={0}>
                        <HStack spacing={2}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="space.star"
                            fontFamily="'Comic Sans MS', cursive"
                          >
                            {item.name}
                          </Text>
                          {item.purchased && (
                            <Badge colorScheme="green" size="sm">
                              <Icon as={FaCheck} mr={1} />
                              Owned
                            </Badge>
                          )}
                        </HStack>
                        <Badge colorScheme={getCategoryColor(item.category)} size="sm">
                          {getCategoryName(item.category)}
                        </Badge>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="space.comet" mt={2}>
                      {item.description}
                    </Text>
                    {item.effect && (
                      <Text fontSize="xs" color="space.accent" fontStyle="italic">
                        Effect: {item.effect}
                      </Text>
                    )}
                  </VStack>
                  
                  <VStack align="end" spacing={2}>
                    <HStack spacing={1}>
                      <Icon as={FaCoins} color="space.accent" />
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={state.totalScore >= item.price ? "space.star" : "red.400"}
                      >
                        {item.price}
                      </Text>
                    </HStack>
                    
                    <Button
                      size="sm"
                      colorScheme={item.purchased ? "green" : "purple"}
                      bgGradient={item.purchased 
                        ? "linear(to-r, green.400, green.500)"
                        : "linear(to-r, space.nebula, space.cosmic)"
                      }
                      _hover={{
                        bgGradient: item.purchased
                          ? "linear(to-r, green.500, green.400)"
                          : "linear(to-r, space.cosmic, space.nebula)",
                        transform: "scale(1.05)",
                      }}
                      onClick={() => handlePurchase(item)}
                      isDisabled={item.purchased}
                      leftIcon={item.purchased ? <FaCheck /> : <FaLock />}
                      fontFamily="'Comic Sans MS', cursive"
                    >
                      {item.purchased ? "Owned" : "Buy"}
                    </Button>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 