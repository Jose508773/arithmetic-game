import React, { useEffect } from 'react';
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useGame } from '../context/useGame';
import { FaHome, FaCog, FaStar, FaRocket, FaSpaceShuttle, FaMoon, FaSun, FaTrash } from 'react-icons/fa';
import { playSound, setSoundEnabled } from '../utils/soundEffects';
import { clearUserData } from '../utils/userSession';
import { keyframes } from '@emotion/react';

// Enhanced 3D floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) translateZ(0px) rotate(0deg) scale(1); }
  25% { transform: translateY(-15px) translateZ(10px) rotate(2deg) scale(1.05); }
  50% { transform: translateY(-25px) translateZ(20px) rotate(5deg) scale(1.1); }
  75% { transform: translateY(-15px) translateZ(10px) rotate(2deg) scale(1.05); }
  100% { transform: translateY(0px) translateZ(0px) rotate(0deg) scale(1); }
`;

const twinkle = keyframes`
  0% { opacity: 0.2; transform: scale(1) rotate(0deg); }
  25% { opacity: 0.8; transform: scale(1.2) rotate(90deg); }
  50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
  75% { opacity: 0.8; transform: scale(1.2) rotate(270deg); }
  100% { opacity: 0.2; transform: scale(1) rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 0.6; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(0px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
`;

const nebula = keyframes`
  0% { background-position: 0% 50%; opacity: 0.3; }
  50% { background-position: 100% 50%; opacity: 0.7; }
  100% { background-position: 0% 50%; opacity: 0.3; }
`;

const meteor = keyframes`
  0% { transform: translateX(-100px) translateY(-100px) rotate(45deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(calc(100vw + 100px)) translateY(calc(100vh + 100px)) rotate(45deg); opacity: 0; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(155, 77, 202, 0.3); }
  50% { box-shadow: 0 0 20px rgba(155, 77, 202, 0.8), 0 0 30px rgba(0, 255, 255, 0.6); }
  100% { box-shadow: 0 0 5px rgba(155, 77, 202, 0.3); }
`;

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { state, dispatch } = useGame();
  const { soundEnabled, musicEnabled } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Sync sound toggles with sound effects module
  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

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

  const handleResetProgress = () => {
    playSound('button-click');
    onOpen();
  };

  const confirmResetProgress = () => {
    try {
      clearUserData();
      
      // Reset game state
      dispatch({ type: 'RESET_GAME' });
      
      toast({
        title: 'Progress Reset!',
        description: 'All your progress has been cleared. You can start fresh!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset progress. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="space.dark"
      position="relative"
      overflow="auto"
      py={10}
      px={4}
    >
      {/* Enhanced 3D animated stars background */}
      {[...Array(40)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          left={`${Math.random() * 100}%`}
          top={`${Math.random() * 100}%`}
          w={`${2 + Math.random() * 3}px`}
          h={`${2 + Math.random() * 3}px`}
          bg={`hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 40}%)`}
          borderRadius="full"
          animation={`${twinkle} ${2 + Math.random() * 4}s infinite`}
          zIndex={0}
          filter="blur(0.5px)"
          boxShadow={`0 0 ${4 + Math.random() * 6}px currentColor`}
        />
      ))}

      {/* Nebula background effects */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="radial-gradient(ellipse at 20% 30%, rgba(155, 77, 202, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)"
        animation={`${nebula} 8s ease-in-out infinite`}
        zIndex={0}
        pointerEvents="none"
      />

      {/* Enhanced floating space elements with 3D effects */}
      <Icon 
        as={FaRocket} 
        color="space.comet" 
        fontSize="7xl" 
        position="absolute" 
        top="30px" 
        left="40px" 
        opacity={0.8} 
        animation={`${float} 4s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaSpaceShuttle} 
        color="space.planet" 
        fontSize="6xl" 
        position="absolute" 
        top="140px" 
        right="60px" 
        opacity={0.7} 
        animation={`${float} 5s 1s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 8px rgba(155, 77, 202, 0.5))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaStar} 
        color="space.star" 
        fontSize="8xl" 
        position="absolute" 
        bottom="80px" 
        left="100px" 
        opacity={0.6} 
        animation={`${pulse} 6s 0.5s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaMoon} 
        color="space.cosmic" 
        fontSize="5xl" 
        position="absolute" 
        top="200px" 
        left="80px" 
        opacity={0.7} 
        animation={`${orbit} 7s 0.2s linear infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 6px rgba(155, 77, 202, 0.4))"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <Icon 
        as={FaSun} 
        color="space.accent" 
        fontSize="6xl" 
        position="absolute" 
        bottom="120px" 
        right="40px" 
        opacity={0.6} 
        animation={`${pulse} 5s 0.8s ease-in-out infinite`} 
        zIndex={1}
        filter="drop-shadow(0 0 12px rgba(255, 165, 0, 0.5))"
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Meteor effects */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={`meteor-${i}`}
          position="absolute"
          top="0"
          left="0"
          w="2px"
          h="2px"
          bg="linear-gradient(45deg, rgba(255, 255, 255, 0.8), rgba(0, 255, 255, 0.6))"
          borderRadius="full"
          animation={`${meteor} ${8 + i * 2}s ${i * 3}s linear infinite`}
          zIndex={0}
          filter="blur(1px)"
          boxShadow="0 0 10px rgba(0, 255, 255, 0.8)"
          style={{
            transformOrigin: 'center',
            transform: `translateX(${Math.random() * 100}px) translateY(${Math.random() * 100}px)`
          }}
        />
      ))}

      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={`orbit-${i}`}
          position="absolute"
          top="50%"
          left="50%"
          w="1px"
          h="1px"
          bg={`hsl(${200 + i * 45}, 70%, 60%)`}
          borderRadius="full"
          animation={`${orbit} ${4 + i}s linear infinite`}
          zIndex={0}
          filter="blur(0.5px)"
          boxShadow="0 0 4px currentColor"
          style={{
            transformOrigin: 'center',
            transform: `translateX(${20 + i * 5}px) translateY(${20 + i * 5}px)`
          }}
        />
      ))}

      {/* Additional floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`shape-${i}`}
          position="absolute"
          left={`${10 + i * 15}%`}
          top={`${20 + i * 12}%`}
          w={`${8 + i * 2}px`}
          h={`${8 + i * 2}px`}
          bg={`hsla(${180 + i * 60}, 70%, 60%, 0.3)`}
          borderRadius={i % 2 === 0 ? "full" : "md"}
          animation={`${pulse} ${3 + i}s ease-in-out infinite`}
          zIndex={0}
          filter="blur(1px)"
          boxShadow={`0 0 ${6 + i * 2}px hsla(${180 + i * 60}, 70%, 60%, 0.5)`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateZ(${i * 45}deg)`
          }}
        />
      ))}

      {/* Energy field effects */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        w="100px"
        h="100px"
        borderRadius="full"
        background="radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)"
        animation={`${pulse} 4s ease-in-out infinite`}
        zIndex={0}
        filter="blur(2px)"
        style={{
          transformStyle: 'preserve-3d'
        }}
      />
      <Box
        position="absolute"
        bottom="15%"
        left="15%"
        w="80px"
        h="80px"
        borderRadius="full"
        background="radial-gradient(circle, rgba(155, 77, 202, 0.1) 0%, transparent 70%)"
        animation={`${pulse} 5s ease-in-out infinite 1s`}
        zIndex={0}
        filter="blur(2px)"
        style={{
          transformStyle: 'preserve-3d'
        }}
      />

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
            animation={`${glow} 3s ease-in-out infinite`}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(155, 77, 202, 0.15) 0%, transparent 70%)',
              zIndex: 0,
              animation: `${nebula} 6s ease-in-out infinite`
            }}
            _after={{
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(45deg, rgba(155, 77, 202, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 215, 0, 0.3))',
              borderRadius: '3xl',
              zIndex: -1,
              filter: 'blur(8px)',
              opacity: 0.5
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

          <VStack spacing={4} w="full">
            <Button
              leftIcon={<FaHome />}
              colorScheme="purple"
              size="lg"
              onClick={handleGoHome}
              bgGradient="linear(to-r, space.nebula, space.cosmic)"
              _hover={{
                bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: "0 8px 25px rgba(155, 77, 202, 0.4), 0 0 20px rgba(0, 255, 255, 0.3)"
              }}
              _active={{
                transform: "translateY(-1px) scale(0.98)"
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              w="full"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              boxShadow="0 4px 15px rgba(155, 77, 202, 0.2)"
            >
              Back to Home
            </Button>

            <Button
              leftIcon={<FaTrash />}
              colorScheme="red"
              size="lg"
              onClick={handleResetProgress}
              bgGradient="linear(to-r, red.500, red.600)"
              _hover={{
                bgGradient: "linear(to-r, red.600, red.500)",
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: "0 8px 25px rgba(220, 38, 38, 0.4), 0 0 20px rgba(255, 0, 0, 0.3)"
              }}
              _active={{
                transform: "translateY(-1px) scale(0.98)"
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              w="full"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              boxShadow="0 4px 15px rgba(220, 38, 38, 0.2)"
            >
              Reset All Progress
            </Button>
          </VStack>
        </VStack>
      </Container>

      {/* Reset Progress Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            bg="space.deep"
            borderWidth="2px"
            borderColor="space.nebula"
            rounded="3xl"
          >
            <AlertDialogHeader
              color="space.star"
              fontFamily="'Comic Sans MS', cursive"
            >
              Reset All Progress?
            </AlertDialogHeader>

            <AlertDialogBody color="space.comet">
              This will permanently delete all your:
              <br />• Total score
              <br />• High score
              <br />• Purchased shop items
              <br />• Achievements
              <br />• Player nickname
              <br /><br />
              This action cannot be undone!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                colorScheme="purple"
                bgGradient="linear(to-r, space.nebula, space.cosmic)"
                _hover={{
                  bgGradient: "linear(to-r, space.cosmic, space.nebula)",
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmResetProgress}
                ml={3}
                bgGradient="linear(to-r, red.500, red.600)"
                _hover={{
                  bgGradient: "linear(to-r, red.600, red.500)",
                }}
              >
                Reset Everything
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default SettingsScreen; 