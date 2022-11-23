import { useState, useEffect, useContext } from 'react';
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
  PinInputField,
  Select
} from '@chakra-ui/react';
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


import Gate from 'renderer/gateContext';
import Fs from 'renderer/components/Fullscreen';


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
  detection_id: null,
  front_img: "",
  id: -1,
  plate: "Yükleniyor...",
  plate_img: "",
  timestamp: 1666551186}])

  let tempRec = [{chassis_img: "",
  color: null,
  detection_id: null,
  front_img: "",
  id: -1,
  plate: "Yükleniyor...",
  plate_img: "",
  timestamp: 1666551186}]

  //gate
  const gate = useContext(Gate);

  console.log(gate)
  

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
    e = e.toUpperCase()
    sendAsync(`UPDATE records 
    SET plate = '${e}'
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
          WHERE plate = '${result[0]?.plate}'
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
    SET color = '${e}'
    WHERE id = ${lastRecord[0]?.id};`).then((result) => {
        console.log(result)
        sendAsync(`SELECT * 
        FROM records 
        ORDER BY id DESC 
        LIMIT 5;`).then((result) => {
  
            
            if(result[0]?.plate !== null){
              
          sendAsync(`SELECT *
          FROM records
          WHERE plate = '${result[0]?.plate}'
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

    //get id of active gate
    let activeGate = gate.gate.filter((g)=>g.isSelected === true)?.gate_id
    console.log(activeGate)
    
    sendAsync(`SELECT * 
    FROM records 
    WHERE gate_id = ${activeGate !== undefined ? activeGate : 'gate_id'}
    ORDER BY id DESC 
    LIMIT 100;`).then((result) => {
      console.log(result, lastRecord)
      
      
      if((result!==[]&&(result[0]?.id!==tempRec[0]?.id)||!first)||result[0]?.detection_id!==tempRec[0].detection_id){
        //play mp3
        
       
        if(result[0]?.plate !== null){
          console.log(result[0]?.plate)
        sendAsync(`SELECT *
        FROM records
        WHERE plate = '${result[0]?.plate}'
        ORDER BY id DESC`).then((past)=>{
          setPlatePast(past)
          console.log(past)
  
        }).then(()=>{
                     
      if(result[0]?.detection_id!==null){

   
        sendAsync(`SELECT * 
        FROM detections 
        WHERE id = ${result[0]?.detection_id} 
        LIMIT 1;`).then((detres) => {
          if(detres!==undefined){
            console.log(detres)
          setCVData(detres[0])
          }
        })
       
        setActiveAlert(result[0])
       
      }
 
        })
      }
                       
    if(first&&result[0]?.detection_id!==null){
        sendAsync(`alert`).then((past)=>{
          console.log(past)
        })
        onOpen()
        
      }

        setLastRecord(result)
        first = true;

        tempRec = result;
      }else if((result[0]?.detection_id !== tempRec[0]?.detection_id)&&first&&result[0]?.detection_id!==null&&result[0]?.detection_id!==undefined){
        

          sendAsync(`SELECT * 
          FROM detections 
          WHERE id = ${result[0]?.detection_id} 
          LIMIT 1;`).then((detres) => {
            if(detres!==undefined){
              console.log(detres)
            setCVData(detres[0])
            setLastRecord(result)
            }
          })
         
         
        
        setActiveAlert(result[0])
        sendAsync(`alert`).then((past)=>{
          console.log(past)
        })
        onOpen()
        tempRec = result;
        
      }
      else if(result[0]?.plate_img!==tempRec[0]?.plate_img||result[0]?.chassis_img!==tempRec[0]?.chassis_img||result[0]?.front_img!==tempRec[0]?.front_img){
        
        tempRec = result;
        setLastRecord(result)
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
               
              
              <Image
                width={'100%'}
                height="40%"
                src={cvData?.output_img}
              />
              
       
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
    const [color, setColor] = useState(platePast[0]?.color!==null?platePast[0]?.color?.toLocaleUpperCase('tr-tr'):'')
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
            <Select onChange={(e)=>{setColor(e.target.value)}} value={color} placeholder="Renk Seçiniz" size={'lg'} fontSize='2xl' width={'100%'}>
              <option value="BEYAZ">BEYAZ</option>
              <option value="SİYAH">SİYAH</option>
              <option value="KIRMIZI">KIRMIZI</option>
              <option value="YEŞİL">YEŞİL</option>
              <option value="MAVİ">MAVİ</option>
              <option value="SARI">SARI</option>
              <option value="TURUNCU">TURUNCU</option>
              <option value="GRI">GRI</option>
              <option value="TURKUAZ">TURKUAZ</option>
              <option value="PEMBE">PEMBE</option>
              <option value="MOR">MOR</option>
              <option value="BILINMEYEN">DIGER / BILINMEYEN</option>
              </Select>



  
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
             
     
                <Fs sourceURI={activeFSImage}/>
   
            </ModalBody>

            <ModalFooter>
              <Text fontSize="xl" mr='4'>Alan seçerek büyütmek için Shift tuşuna basılı tutarak fareyi kullanın.</Text>
         
            <Button mr={3}><a href={activeFSImage} download={activeFSImage?.split('\\').reverse()[0]}>Kaydet</a></Button>
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
          value={lastRecord[0]?.detection_id!==null?'Var':'Yok'}
          size={'xl'}
        />

<Box onClick={() => 

onOpenEdit()}>
          <InfoBox
            icon={<FcEditImage />}
            hover
            title={'Plaka Düzenle'}
            value={''}
            size={'xl'}
            
          />
   </Box>

   <Box  onClick={() => {onOpenEditColor()}}>
   
          <InfoBox
            icon={<FcEditImage />}
            hover
            title={'Renk Düzenle'}
            value={''}
            size={'xl'}

          />
</Box>
      </HStack>
      <Box
          w="100%"
          h="100%"
          p="2"
          mt='3'
          bg="gray.300"
          overflow={'hidden'}
          borderRadius="md"
        >
          <Image
            width={'100%'}
            height="40vh"

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
      <Grid mt="5" w="100%" templateColumns="repeat(2, 1fr)" gap={6}>
        <Box
          w="100%"
          h="100%"
          p="2"
          pb="4"
          bg="gray.300"
          overflow={'hidden'}
          borderRadius="md"
        >
          <Image
            width={'100%'}
            height="80%"

            src={lastRecord[0]?.plate_img}
          />
          <HStack mt="2" w="100%" justify={'space-between'}>
            <Text>Plaka</Text>

            <Button
              onClick={() => {
                setActiveFSImage(
                lastRecord[0]?.plate_img
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
          <Text fontSize="xl" fontWeight="bold" mb="2">
          </Text>
          <Image
            width={'100%'}
            src={cvData?.output_img}
          />
          <HStack mt="2" w="100%" justify={'space-between'}>
            <Text>Karşılaştırma</Text>

            <Button
              onClick={() => {
                setActiveFSImage(cvData?.output_img);
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

       
                  return(
                    <Tr>
                    <Td>{new Date(e.timestamp * 1000).toLocaleString('tr-Tr')}</Td>
                    <Td>
                      <Badge colorScheme={e?.detection_id!==null?'red':'green'}>{e?.detection_id!==null?'Var':'Yok'}</Badge>
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
          <Text fontSize="2xl">Son 100 Araç Hareketi</Text>
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
              {typeof lastRecord === 'object' && lastRecord.map((rec)=>{
         
                return(
                      <Tr>
                     <Td>{new Date(rec.timestamp*1000).toLocaleString('tr-tr')}</Td>
                      <Td>{rec?.plate}</Td>
                      <Td>
                      <Badge colorScheme={rec?.detection_id!==null?'red':'green'}>{rec?.detection_id!==null?'Var':'Yok'}</Badge>

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

);
}
