import { useState, useEffect } from 'react';
import { Box, ChakraProvider, Flex, Text, VStack, extendTheme, HStack, Grid, Image, Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot, Badge, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, useDisclosure, IconButton, Input} from '@chakra-ui/react';
import Layout from '../layouts/layout';
import InfoBox from 'renderer/components/infoBox';
import { FcMultipleCameras, FcHighPriority, FcAutomotive, FcSelfServiceKiosk, FcClock, FcShipped, FcInfo, FcEditImage, FcCameraIdentification } from 'react-icons/fc'
import { FaEdit, FaExpand } from 'react-icons/fa'

export default function Settings() {
  //play 'assets/master_warn.mp3'

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenFull, onOpen: onOpenFull, onClose: onCloseFull } = useDisclosure()
  const { isOpen: isOpenView, onOpen: onOpenView, onClose: onCloseView } = useDisclosure()
  const [activeFSImage, setActiveFSImage] = useState(null);

  const [activeAlertPlateCam, setActiveAlertPlateCam] = useState(null);
  const [activeAlertPlate, setActiveAlertPlate] = useState(null);
  const [activeAlertUnderCam, setActiveAlertUnderCam] = useState(null);
 
    return (
      <Layout>
    <Box>
            <Box w='100%' h='100%' bg='gray.300' p='6' borderRadius='md'>
                <Text fontWeight='bold' fontSize='2xl'>Ayarlar</Text>
                <Text mt='5' fontSize='xl'>Dosya Dizini</Text>
                <Input mt='1' directory="" webkitdirectory="" type="file" 
                aria-label='sd'
                placeholder='Outline'
                />
            </Box>
            
            </Box>
      </Layout>
    );
  };
  
  