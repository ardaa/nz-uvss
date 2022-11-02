import { useState, useEffect } from 'react';
import { Box, ChakraProvider, Flex, Text, VStack, extendTheme, HStack, Grid, Image, Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot, Badge, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, useDisclosure, IconButton} from '@chakra-ui/react';
import Layout from '../layouts/layout';
import InfoBox from 'renderer/components/infoBox';
import { FcMultipleCameras, FcHighPriority, FcAutomotive, FcSelfServiceKiosk, FcClock, FcShipped, FcInfo, FcEditImage, FcCameraIdentification } from 'react-icons/fc'
import { FaEdit, FaExpand } from 'react-icons/fa'
import ReactPanZoom from 'react-image-pan-zoom-rotate';
export default function CamScreen() {
  //play 'assets/master_warn.mp3'

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenFull, onOpen: onOpenFull, onClose: onCloseFull } = useDisclosure()
  const { isOpen: isOpenView, onOpen: onOpenView, onClose: onCloseView } = useDisclosure()
  const [activeFSImage, setActiveFSImage] = useState(null);

  const [activeAlertPlateCam, setActiveAlertPlateCam] = useState(null);
  const [activeAlertPlate, setActiveAlertPlate] = useState(null);
  const [activeAlertUnderCam, setActiveAlertUnderCam] = useState(null);
  function AlertModal() {

    return (
      <>

  
        <Modal size='6xl' isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader><HStack><FcHighPriority/><Text>İhlal Tespit Edildi</Text></HStack></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
   <Image width={'100%'} height='95%' src='https://s.alicdn.com/@sc01/kf/HTB1K6F7teuSBuNjSsziq6zq8pXaU/200222482/HTB1K6F7teuSBuNjSsziq6zq8pXaU.jpg?quality=close' />
   <HStack>
   <Image width={'50%'} src='https://s.alicdn.com/@sc01/kf/HTB1z.pktXmWBuNjSspdq6zugXXaD/200222482/HTB1z.pktXmWBuNjSspdq6zugXXaD.jpg?quality=close' />
   <VStack p='4' align={'left'}>
    <Text fontSize='xl'>İhlal Tarihi: 12.05.2021</Text>
    <Text fontSize='xl'>İhlal Saati: 12:05</Text>
    <Text fontSize='xl'>Plaka:  34 NK 343 </Text>

   </VStack>
   </HStack>
   
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  function PastEventModal() {

    return (
      <>

  
        <Modal size='6xl' isCentered isOpen={isOpenView} onClose={onCloseView}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader><HStack><FcCameraIdentification/><Text>Geçiş Görüntüleri</Text></HStack></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
   <Image width={'100%'} height='95%' src='https://s.alicdn.com/@sc01/kf/HTB1K6F7teuSBuNjSsziq6zq8pXaU/200222482/HTB1K6F7teuSBuNjSsziq6zq8pXaU.jpg?quality=close' />
   <HStack>
   <Image width={'50%'} src='https://s.alicdn.com/@sc01/kf/HTB1z.pktXmWBuNjSspdq6zugXXaD/200222482/HTB1z.pktXmWBuNjSspdq6zugXXaD.jpg?quality=close' />
   <VStack p='4' align={'left'}>
    <Text fontSize='xl'>Geçiş Tarihi: 12.05.2021</Text>
    <Text fontSize='xl'>Geçiş Saati: 12:05</Text>
    <Text fontSize='xl'>Plaka:  34 NK 343 </Text>

   </VStack>
   </HStack>
   
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onCloseView}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }


  function FullScreen() {

    return (
      <>

  
        <Modal size='full' isCentered isOpen={isOpenFull} onClose={onCloseFull}>
          <ModalOverlay />
          <ModalContent>

            <ModalBody>
              <Box display='flex' justifyContent='center' w='100%' h='100%' alignItems='center'>

   <ReactPanZoom
      image={activeFSImage}
      alt="Image alt text"
    />
   </Box>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onCloseFull}>
                Kapat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
    return (
      <Layout>
    <Box>
      <AlertModal />
      <FullScreen />
      <PastEventModal />
    
            <Box w='100%' h='100%' bg='gray.300' p='6' borderRadius='md'>
                <Text fontSize='2xl'>Kameralar</Text>
                <TableContainer>
            <Table mt='3' size='md'>
              <Thead>
                <Tr>
                  <Th>İsim</Th>
                  <Th>URL</Th>
                  <Th>Aktif</Th>

                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{new Date().toLocaleString('tr-Tr')}</Td>
                  <Td>06 ABC 06</Td>
                  <Td><Badge colorScheme='green'>Aktif</Badge></Td>

                </Tr>
                <Tr>
                  <Td>{new Date().toLocaleString('tr-Tr')}</Td>
                  <Td>06 JFK 43</Td>
                  <Td><Badge colorScheme='green'>Aktif</Badge></Td>
                
                </Tr>
               
              </Tbody>
             
            </Table>
          </TableContainer>
            </Box>
            
            </Box>
      </Layout>
    );
  };
  
  