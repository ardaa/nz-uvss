import { useState, useEffect } from 'react';
import {
  Box,
  ChakraProvider,
  Flex,
  Text,
  VStack,
  extendTheme,
  HStack,
  Grid,
  Image,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  IconButton,
  Input,
  PinInput,
  PinInputField
} from '@chakra-ui/react';
import Layout from '../layouts/layout';
import InfoBox from 'renderer/components/infoBox';
import {
  FcMultipleCameras,
  FcHighPriority,
  FcAutomotive,
  FcSelfServiceKiosk,
  FcClock,
  FcShipped,
  FcInfo,
  FcEditImage,
  FcCameraIdentification,
} from 'react-icons/fc';
import { FaEdit, FaExpand } from 'react-icons/fa';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import sendAsync from '../../messager/rerenderer';
import useSound from 'use-sound';

export default function MainScreen() {
  
  //play 'assets/master_warn.mp3'

  const [responses, setResponses] = useState([])

  const [boot, setBoot] = useState(true)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFull,
    onOpen: onOpenFull,
    onClose: onCloseFull,
  } = useDisclosure();
  const {
    isOpen: isOpenView,
    onOpen: onOpenView,
    onClose: onCloseView,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenEditColor,
    onOpen: onOpenEditColor,
    onClose: onCloseEditColor,
  } = useDisclosure();

  const [lastRecord, setLastRecord] = useState([{chassis_img: "",
  color: null,
  detection: null,
  front_img: "",
  id: -1,
  plate: "Yükleniyor...",
  plate_img: "",
  timestamp: 1666551186}])

  let tempRec = [{chassis_img: "",
  color: null,
  detection: null,
  front_img: "",
  id: -1,
  plate: "Yükleniyor...",
  plate_img: "",
  timestamp: 1666551186}]

  const [activeFSImage, setActiveFSImage] = useState(null);

  
  const [activeAlert, setActiveAlert] = useState(null);

  const [platePast, setPlatePast] = useState([{}])

  const [platePinInput, setPlatePinInput] = useState(true);

  const [viewData, setViewData] = useState({})

  const [cvData, setCVData] = useState([{}])
  function getPast(sid){
    sendAsync(`SELECT * 
    FROM records 
    WHERE id = ${sid};`).then((result) => {
      setViewData(result[0])
    })
    
  }

  function plateUpdate(e){
    sendAsync(`UPDATE records 
    SET plate = "${e}"
    WHERE id = ${lastRecord[0]?.id};`).then((result) => {
        console.log(result)
        sendAsync(`SELECT * 
        FROM records 
        ORDER BY id DESC 
        LIMIT 5;`).then((result) => {
          console.log(result, lastRecord)
 
            
            if(result[0]?.plate !== null){
              
          sendAsync(`SELECT *
          FROM records
          WHERE plate = "${result[0]?.plate}"
          ORDER BY id DESC`).then((past)=>{

            setPlatePast(past)
       
    
          }).catch(e=>console.log(e))
        }
            setActiveAlert(result[0])
            setLastRecord(result)
            onCloseEdit()
    
            tempRec = result;
          
    
          
        }); 
    }).catch((e)=>console.error(e))

  }


  function colorUpdate(e){
    console.log(e)
    sendAsync(`UPDATE records 
    SET color = "${e}"
    WHERE id = ${lastRecord[0]?.id};`).then((result) => {
        console.log(result)
        sendAsync(`SELECT * 
        FROM records 
        ORDER BY id DESC 
        LIMIT 5;`).then((result) => {
  
            
            if(result[0]?.plate !== null){
              
          sendAsync(`SELECT *
          FROM records
          WHERE plate = "${result[0]?.plate}"
          ORDER BY id DESC`).then((past)=>{
            setPlatePast(past)
            console.log(past)
    
          })
        }
            setActiveAlert(result[0])
            setLastRecord(result)
            onCloseEditColor()
    
            tempRec = result;
          
    
          
        }); 
    }).catch((e)=>console.error(e))

  }


  useEffect(()=>{
    let first = false;
    let intervalId = setInterval(()=>{

    
    sendAsync(`SELECT * 
    FROM records 
    ORDER BY id DESC 
    LIMIT 10;`).then((result) => {
      console.log(result, lastRecord)
      if((result[0]?.id!==tempRec[0]?.id&&result[0]?.plate_img!==null&&result[0]?.chassis_img!==null)||!first){
       
        if(result[0]?.plate !== null){
          console.log(result[0]?.plate)
        sendAsync(`SELECT *
        FROM records
        WHERE plate = "${result[0]?.plate}"
        ORDER BY id DESC`).then((past)=>{
          setPlatePast(past)
          console.log(past)
  
        }).then(()=>{
                     
      if(result[0]?.detection!==null){

   
        sendAsync(`SELECT * 
        FROM detections 
        WHERE id = ${result[0]?.detection} 
        LIMIT 1;`).then((detres) => {
          setCVData(detres[0])
        })
       
        setActiveAlert(result[0])
       
      }
 
        })
      }
                       
      if(result[0]?.detection!==null&&first){
        sendAsync('alert').then((res)=>{
          console.log(res)}).catch(e=>console.log(e))
      }
        setLastRecord(result)
        first = true;

        tempRec = result;
      }

      
    });
  }, 1000)
  return () => clearInterval(intervalId);
  },[])

  function AlertModal() {
    return (
      <>
        <Modal size="full" isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FcHighPriority />
                <Text>Karşılaştırma Tespit Edildi</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack h='90%'>
                <VStack>
              
              <Image
                width={'100%'}
                height="10%"
                image={activeAlert?.chassis_img}
              />
              <Image
                width={'100%'}
                height="10%"
                src={activeAlert?.chassis_img}
              />
             </VStack>
             <VStack>
             <Image
                  width={'100%'}
                  src={activeAlert?.front_img}
                />
                <VStack p="4" align={'left'}>
                  <Text fontSize="xl">Karşılaştırma Tarihi: {new Date(activeAlert?.timestamp * 1000).toLocaleDateString('tr-tr')}</Text>
                  <Text fontSize="xl">Karşılaştırma Saati: {new Date(activeAlert?.timestamp * 1000).toLocaleTimeString('tr-tr')}</Text>
                  <Text fontSize="xl">Plaka: {activeAlert?.plate}</Text>
                </VStack></VStack>
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Tamam
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  function EditPlate() {
  const [changePlate, setChangePlate] = useState(platePast[0]?.plate)

    return (
      <>
        <Modal size="6xl" isCentered isOpen={isOpenEdit} onClose={onCloseEdit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FcCameraIdentification />
                <Text>Plaka Değiştir</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                width={'100%'}
                height="35%"
                src={lastRecord[0]?.plate_img}
              />
              {platePinInput? <HStack mt='4' width='100%' align={'center'} justify={'center'} >
                <PinInput onChange={(e)=>{setChangePlate(e)}} value={changePlate} size={'xl'} type='alphanumeric' defaultValue={lastRecord[0]?.plate}>  
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack> : <HStack mt='4' width='100%' align={'center'} justify={'center'} >
              <Input onChange={(e)=>{setChangePlate(e.target.value)}} fontSize={'2xl'} size={'lg'} type='alphanumeric' defaultValue={lastRecord[0]?.plate} />
              </HStack>}

                <Button mt='2' onClick={()=>setPlatePinInput(!platePinInput)}>{platePinInput?'Özel Plaka':'Standart Plaka'}</Button>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" variant="ghost" mr={3} onClick={onCloseEdit}>
                İptal
              </Button>
              <Button colorScheme="blue" onClick={()=>{plateUpdate(changePlate)}}>Kaydet</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  function EditColor() {
    const [color, setColor] = useState(platePast[0]?.color!==null?platePast[0]?.color:'')
    return (
      <>
        <Modal size="6xl" isCentered isOpen={isOpenEditColor} onClose={onCloseEditColor}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FcCameraIdentification />
                <Text>Renk Düzenle</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Input onChange={(e)=>{setColor(e.target.value)}} fontSize={'2xl'} size={'lg'} type='alphanumeric' defaultValue={lastRecord[0]?.color} />

            </ModalBody>

            <ModalFooter>
            <Button colorScheme="red" variant="ghost" mr={3} onClick={onOpenEditColor}>
                İptal
              </Button>
              <Button colorScheme="blue" onClick={()=>{colorUpdate(color)}}>Kaydet</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  function PastEventModal() {
    return (
      <>
        <Modal size="6xl" isCentered isOpen={isOpenView} onClose={onCloseView}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FcCameraIdentification />
                <Text>Geçiş Görüntüleri</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack>
              <Image
                width={'50%'}
                height="50%"
                src={viewData?.chassis_img}
              />
              <VStack>
                <Image
                  width={'100%'}
                  src={viewData?.front_img}
                />
                <VStack p="4" align={'left'}>
                <Text fontSize="xl">Geçiş Tarihi: {new Date(viewData?.timestamp * 1000).toLocaleDateString('tr-tr')}</Text>
                  <Text fontSize="xl">Geçiş Saati: {new Date(viewData?.timestamp * 1000).toLocaleTimeString('tr-tr')}</Text>
                  <Text fontSize="xl">Plaka: {viewData?.plate}</Text>
                </VStack>
              </VStack></HStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onCloseView}>
                Kapat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  function FullScreen() {
    return (
      <>
        <Modal size="full" isCentered isOpen={isOpenFull} onClose={onCloseFull}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <Box
                display="flex"
                justifyContent="center"
                w="50vh"
                h="50vh"
                alignItems="center"
              >
                <ReactPanZoom image={activeFSImage}
                height='100px'
                alt="Image alt text" />
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onCloseFull}>
                Kapat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  return (
    <Layout>
      <Box>
        <AlertModal />
        <FullScreen />
        <PastEventModal />
        <EditPlate />
        <EditColor />
        <HStack w="100%">
          <InfoBox
            icon={<FcSelfServiceKiosk />}
            title={'Plaka'}
            value={lastRecord[0]?.plate}
            size={'xl'}
          />
          <InfoBox
            icon={<FcInfo />}
            title={'Renk'}
            value={lastRecord[0]?.color !== null ? lastRecord[0]?.color: '...' }
            size={'xl'}
          />

          <InfoBox
            icon={<FcShipped />}
            title={'Karşılaştırma'}
            value={lastRecord[0]?.detection!==null?'Var':'Yok'}
            size={'xl'}
          />

<Box onClick={() => onOpenEdit()}>
            <InfoBox
              icon={<FcEditImage />}
              hover
              title={'Plaka Düzenle'}
              value={''}
              size={'xl'}
              
            />
     </Box>

     <Box  onClick={() => onOpenEditColor()}>
     
            <InfoBox
              icon={<FcEditImage />}
              hover
              title={'Renk Düzenle'}
              value={''}
              size={'xl'}

            />
</Box>
        </HStack>

        <Grid mt="5" w="100%" templateColumns="repeat(2, 1fr)" gap={6}>
          <Box
            w="100%"
            h="100%"
            p="2"
            bg="gray.300"
            overflow={'hidden'}
            borderRadius="md"
          >
            <Image
              width={'100%'}
              height="90%"

              src={lastRecord[0]?.chassis_img}
            />
            <HStack mt="2" w="100%" justify={'space-between'}>
              <Text>Şasi Kamerası</Text>

              <Button
                onClick={() => {
                  setActiveFSImage(
                  lastRecord[0]?.chassis_img
                  );
                  onOpenFull();
                }}
              >
                <FaExpand />
              </Button>
            </HStack>
          </Box>

          <Box
            w="100%"
            h="100%"
            p="2"
            bg="gray.300"
            overflow={'hidden'}
            borderRadius="md"
          >
            <Image
              width={'100%'}
              src={lastRecord[0]?.front_img}
            />
            <HStack mt="2" w="100%" justify={'space-between'}>
              <Text>Plaka Kamerası</Text>

              <Button
                onClick={() => {
                  setActiveFSImage(
                    lastRecord[0]?.front_img  );
                  onOpenFull();
                }}
              >
                <FaExpand />
              </Button>
            </HStack>
          </Box>
          </Grid>
          <Box
            w="100%"
            h="100%"
            p="2"
            mt='4'
            bg="gray.300"
            overflow={'hidden'}
            borderRadius="md"
          >
            <Image
              width={'100%'}
              src={cvData?.out_img}
            />
            <HStack mt="2" w="100%" justify={'space-between'}>
              <Text>Karşılaştırma</Text>

              <Button
                onClick={() => {
                  setActiveFSImage(cvData?.out_img);
                  onOpenFull();
                }}
              >
                <FaExpand />
              </Button>
            </HStack>
          </Box> 
          <Grid mt="5" w="100%" templateColumns="repeat(2, 1fr)" gap={6}>

          <Box w="100%" h="100%" bg="gray.300" p="6" borderRadius="md">
            <Text fontSize="2xl">{lastRecord[0]?.plate} - Geçmiş Hareketler</Text>
            <TableContainer>
              <Table mt="3" size="md">
                <Thead>
                  <Tr>
                    <Th>Tarih</Th>
                    <Th>Karşılaştırma</Th>
                    <Th isNumeric>Görüntüler</Th>
                  </Tr> 
                </Thead>
                <Tbody>
                  {typeof platePast === 'object' && platePast.map((e)=>{

                      console.log(e)
                    return(
                      <Tr>
                      <Td>{new Date(e.timestamp * 1000).toLocaleString('tr-Tr')}</Td>
                      <Td>
                        <Badge colorScheme={e?.detection!==null?'red':'green'}>{e?.detection!==null?'Var':'Yok'}</Badge>
                      </Td>
                      <Td isNumeric>
                        <Button onClick={()=>{
                          
                          setViewData(e)
                          onOpenView();}}>Görüntüle</Button>
                      </Td>
                    </Tr>
                    )
                  })}
                
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box w="100%" h="100%" bg="gray.300" p="6" borderRadius="md">
            <Text fontSize="2xl">Son 10 Araç Hareketi</Text>
            <TableContainer>
              <Table mt="3" size="md">
                <Thead>
                  <Tr>
                    <Th>Tarih</Th>
                    <Th>Plaka</Th>
                    <Th>Karşılaştırma</Th>
                    <Th isNumeric>Görüntüler</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {console.log(lastRecord)}
                {typeof lastRecord === 'object' &&lastRecord.map((rec)=>{
           
                  return(
                        <Tr>
                       <Td>{new Date(rec.timestamp*1000).toLocaleString('tr-tr')}</Td>
                        <Td>{rec?.plate}</Td>
                        <Td>
                        <Badge colorScheme={rec?.detection!==null?'red':'green'}>{rec?.detection!==null?'Var':'Yok'}</Badge>

                        </Td>
                        <Td isNumeric>
                        <Button onClick={()=>{
                          setViewData(rec);
                          onOpenView();}}>Görüntüle</Button>
                        </Td>
                      </Tr>)
                  })}
               
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Box>
    </Layout>
  );
}
