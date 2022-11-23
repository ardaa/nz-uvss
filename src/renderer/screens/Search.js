import { useState, useEffect, useContext } from 'react';
import { Box, ChakraProvider, Flex, Text, VStack, PinInput, PinInputField, extendTheme, HStack, Grid, Image, Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot, Badge, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, useDisclosure, IconButton, Input, Select} from '@chakra-ui/react';
import Layout from '../layouts/layout';
import InfoBox from 'renderer/components/infoBox';
import { FcMultipleCameras, FcHighPriority, FcAutomotive, FcSelfServiceKiosk, FcClock, FcShipped, FcInfo, FcEditImage, FcCameraIdentification } from 'react-icons/fc'
import { FaEdit, FaExpand } from 'react-icons/fa'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';
import { FiSave, FiSearch } from 'react-icons/fi';
import sendAsync from '../../messager/rerenderer';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import Gate from 'renderer/gateContext';
import Fs from 'renderer/components/Fullscreen';
const XLSX = require('xlsx');

registerLocale('tr', tr)
export default function Search() {
  //play 'assets/master_warn.mp3'

  const gate = useContext(Gate);
  const [selectedGateIndex, setSelectedGateIndex] = useState(0);

  const [date, setDate] = useState(new Date().setHours(0,0,0));
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(23,59,59)))
  const [plate, setPlate] = useState('')
  const [color, setColor] = useState('')
  const [platePinInput, setPlatePinInput] = useState(true);

  const [queryRes, setQueryRes] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeFSImage, setActiveFSImage] = useState(null);

  

  const [ouut, setOutt] = useState(null)
  const {
    isOpen: isOpenFull,
    onOpen: onOpenFull,
    onClose: onCloseFull,
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

  useEffect(() => {
   if(queryRes[activeIndex]?.detection_id !== undefined && queryRes[activeIndex]?.detection_id !== null) {
      sendAsync(`SELECT output_img FROM detections WHERE id = ${queryRes[activeIndex]?.detection_id}`).then(res => {
        console.log(res)
        setOutt(res[0]?.output_img)
      })
    }
    else{
      setOutt(null)
    }
  }, [activeIndex, queryRes])

  useEffect(() => {
    getQuery()
    
  }, [])

  function getQuery(){
    if(plate===''&&color===''){
      sendAsync(`SELECT *
      FROM records
      WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} ORDER BY timestamp DESC`).then((res)=>{

        setQueryRes(res)
        setActiveIndex(0)

    })

  }
  else if(plate===''&&color!==''){
    sendAsync(`SELECT *
    FROM records
    WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} AND color like '%${color.toLocaleUpperCase('tr-tr')}%' ORDER BY timestamp DESC`).then((res)=>{
      
      setQueryRes(res)
      
  })

}
else if(plate!==''&&color===''){
  sendAsync(`SELECT *
  FROM records
  WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} AND plate like '%${plate.toLocaleUpperCase('tr-tr')}%' ORDER BY timestamp DESC`).then((res)=>{
    
    setQueryRes(res)
    
})

}
else if(plate!==''&&color!==''){
  sendAsync(`SELECT *
  FROM records
  WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} AND plate like '%${plate.toLocaleUpperCase('tr-tr')}%' AND color like '%${color.toLocaleUpperCase('tr-tr')}%' ORDER BY timestamp DESC`).then((res)=>{
    
    setQueryRes(res)
    
})

}


  }

  function EditPlate() {
    const [changePlate, setChangePlate] = useState(queryRes[activeIndex]?.plate)
  
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
                  src={queryRes[activeIndex]?.plate_img}
                />
                {platePinInput? <HStack mt='4' width='100%' align={'center'} justify={'center'} >
                  <PinInput onChange={(e)=>{setChangePlate(e)}} value={changePlate} size={'xl'} type='alphanumeric' defaultValue={queryRes[activeIndex]?.plate}>  
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
                <Input onChange={(e)=>{setChangePlate(e.target.value)}} fontSize={'2xl'} size={'lg'} type='alphanumeric' defaultValue={queryRes[activeIndex]?.plate} />
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
      const [color, setColor] = useState(queryRes[activeIndex]?.color!==null?queryRes[activeIndex]?.color?.toLocaleUpperCase('tr-tr'):'')
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
              <Select onChange={(e)=>{setColor(e.target.value)}} value={color} placeholder="Renk Seçiniz" size={'sm'} fontSize='sm' width={'100%'}>
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

//queryRes[activeIndex]

function plateUpdate(e){
  e = e.toUpperCase()
  sendAsync(`UPDATE records 
  SET plate = '${e}'
  WHERE id = ${queryRes[activeIndex]?.id};`).then((result) => {
    queryRes[activeIndex].plate = e
    setQueryRes(queryRes)
      
  }).catch((e)=>console.error(e))

}


function colorUpdate(e){
  console.log(e)
  sendAsync(`UPDATE records 
  SET color = '${e}'
  WHERE id = ${queryRes[activeIndex]?.id};`).then((result) => {
    queryRes[activeIndex].color = e
    setQueryRes(queryRes)
          

  }).catch((e)=>console.error(e))

}
function saveQuery(){
  //save queryRes as xlsx file
  let queryResCopy = queryRes
  if(queryResCopy.length>0){
  queryResCopy.forEach((e)=>{
    //timestamp to human readable date
    e.timestamp = new Date(e.timestamp * 1000).toLocaleString('tr-tr')
  })
  }


  const ws = XLSX.utils.json_to_sheet(queryResCopy);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sayfa 1")
  //filename timestamp
  const filename = `arama_${new Date(date).toLocaleDateString('tr-tr')}_${new Date(endDate).toLocaleDateString('tr-tr')}.xlsx`
  XLSX.writeFile(wb, filename);


}




    return ( 
      <>
        <FullScreen />
        <EditPlate />
        <EditColor />
        <Box>
            <Box w='100%' h='100%' bg='gray.300' p='6' borderRadius='md'>
                <Text fontSize='2xl'>Kameralar</Text>
                <HStack>
                <VStack align='flex-start'>
                <Text align='left'>Başlangıç Tarihi</Text>

                <Text align='left'>Bitiş Tarihi</Text>
                </VStack>
                <VStack>
                
                <ReactDatePicker
                              
                                selected={date}
                                onChange={(date) => {
                                    setDate(date)
                                }}
                                locale='tr'
                                showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Saat"
                            dateFormat="dd/MM/yyyy HH:mm"
                            customInput={<input /> }
                                 /> 

                <ReactDatePicker
                              
                              selected={endDate}
                              onChange={(date) => {
                                  setEndDate(date)
                              }}
                              locale='tr'
                              showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Saat"
                          dateFormat="dd/MM/yyyy HH:mm"

                               /> 
            </VStack>
            <VStack align='flex-start'>
                <Text align='left'>Plaka</Text>

                <Text align='left'>Renk</Text>
                </VStack>
                <VStack align='flex-start'>
                  <input value={plate} onChange={(e)=>setPlate(e.target.value)}/>
                  <Select onChange={(e)=>{setColor(e.target.value)}} value={color} placeholder="Renk Seçiniz" size={'sm'} fontSize='sm' width={'100%'}>
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
                </VStack>
                <VStack align='flex-start'>
            
           <Text align='left'>Geçit</Text>
          <Select size='sm' variant='filled' marginBlock='0' value={gate?.gate.gate_id} onChange={(e)=>gate.setGate(gate.gate.map((element) => {
            if (element.gate_id === e.target.value) {
              element.isSelected = true;
              setSelectedGateIndex(element.gate_id);
            } else {
              element.isSelected = false;
            }
            return element;
          })

       )}>
        <option value={0}>Tüm Geçitler</option>
          {gate?.gate.map((gate)=>(
            <option value={gate.gate_id}>{gate.gate_name}</option>
          ))}
        </Select>
        </VStack>
                <VStack>
                <Button size='md' fontSize={'xl'} colorScheme='green' onClick={()=>{saveQuery()}}><Box pr='3'> <FiSave/></Box> Kaydet<Box pr='3'></Box></Button>

                <Button  size='lg' fontSize={'xl'} colorScheme='blue' onClick={()=>{getQuery()}}><Box pr='5'> <FiSearch/></Box> Ara<Box pr='5'></Box></Button>
           
           </VStack>
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
            
            </Box>
            
            
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
              height="40vh"

              src={queryRes[activeIndex]?.chassis_img}
            />
            <HStack mt="2" w="100%" justify={'space-between'}>
              <Text>Şasi Kamerası</Text>

              <Button
                onClick={() => {
                  setActiveFSImage(
                  queryRes[activeIndex]?.chassis_img
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
              src={queryRes[activeIndex]?.front_img}
            />
            <HStack mt="2" w="100%" justify={'space-between'}>
              <Text>Plaka Kamerası</Text>

              <Button
                onClick={() => {
                  setActiveFSImage(
                    queryRes[activeIndex]?.front_img  );
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
            {ouut}
            <Image
              width={'100%'}
              src={ouut}
            />
            <HStack mt="2" w="100%" justify={'space-between'}>
              <Text>Karşılaştırma</Text>

              <Button
                onClick={() => {
                  setActiveFSImage(ouut);
                  onOpenFull();
                }}
              >
                <FaExpand />
              </Button>
            </HStack> 
          </Box> 

            {/* data table */}
            <Box w='100%' h='100%' bg='gray.300' p='6' borderRadius='md' mt='6'>
                <Text fontSize='2xl'>Arama Sonuçları</Text>
                <TableContainer>
                <Table variant="simple">
                              
                              <Thead>
                                <Tr>
                                  <Th>Plaka</Th>
                                  <Th>Tarih</Th>
                                  <Th>Renk</Th>
                                  <Th>Karşılaştırma</Th>
                                  <Th isNumeric>İncele</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {typeof queryRes === 'object' && queryRes.map((item, index)=>{
                                  return(
                                    <Tr key={index} bg={activeIndex===index?'gray.500':''} onClick={()=>{setActiveIndex(index)}}>
                                      <Td>{item.plate}</Td>
                                      <Td>{new Date(item.timestamp*1000).toLocaleString('tr-tr')}</Td>
                                      <Td>{item.color}</Td>
                                      <Td><Badge colorScheme={item?.detection_id!==null?'red':'green'}>{item?.detection_id!==null?'Var':'Yok'}</Badge></Td>

                                      <Td isNumeric><Button colorScheme='blue' onClick={()=>{setActiveIndex(index)}}><FaExpand/></Button></Td>
                                    </Tr>
                                  )
                                }
                                )}
                              </Tbody>
                            </Table>
                </TableContainer>
</Box>
            </Box>
      </>
    );
  };
  
  