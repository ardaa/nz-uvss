import { useState, useEffect } from 'react';
import { Box, ChakraProvider, Flex, Text, VStack, extendTheme, HStack, Grid, Image, Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot, Badge, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, useDisclosure, IconButton, Input} from '@chakra-ui/react';
import Layout from '../layouts/layout';
import InfoBox from 'renderer/components/infoBox';
import { FcMultipleCameras, FcHighPriority, FcAutomotive, FcSelfServiceKiosk, FcClock, FcShipped, FcInfo, FcEditImage, FcCameraIdentification } from 'react-icons/fc'
import { FaEdit, FaExpand } from 'react-icons/fa'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';
import { FiSearch } from 'react-icons/fi';
import sendAsync from '../../messager/rerenderer';
import ReactPanZoom from 'react-image-pan-zoom-rotate';

registerLocale('tr', tr)
export default function Search() {
  //play 'assets/master_warn.mp3'


  const [date, setDate] = useState(new Date().setHours(0,0,0));
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(23,59,59)))
  const [plate, setPlate] = useState('')
  const [color, setColor] = useState('')

  const [queryRes, setQueryRes] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeFSImage, setActiveFSImage] = useState(null);

  const [ouut, setOutt] = useState(null)
  const {
    isOpen: isOpenFull,
    onOpen: onOpenFull,
    onClose: onCloseFull,
  } = useDisclosure();

  
  useEffect(() => {
   if(queryRes[activeIndex]?.detection !== undefined && queryRes[activeIndex]?.detection !== null) {
      sendAsync(`SELECT out_img FROM detections WHERE id = ${queryRes[activeIndex]?.detection}`).then(res => {
        console.log(res)
        setOutt(res[0]?.out_img)
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
      WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)}`).then((res)=>{

        setQueryRes(res)
        setActiveIndex(0)

    })

  }
  else if(plate===''&&color!==''){
    sendAsync(`SELECT *
    FROM records
    WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} AND color = '${color}'`).then((res)=>{
      
      setQueryRes(res)
      
  })

}
else if(plate!==''&&color===''){
  sendAsync(`SELECT *
  FROM records
  WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} AND plate = '${plate}'`).then((res)=>{
    
    setQueryRes(res)
    
})

}
else if(plate!==''&&color!==''){
  sendAsync(`SELECT *
  FROM records
  WHERE timestamp > ${date /1000} AND timestamp < ${(endDate /1000)} AND plate = '${plate}' AND color = '${color}'`).then((res)=>{
    
    setQueryRes(res)
    
})

}


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
        <FullScreen />
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
                  <input value={color} onChange={(e)=>setColor(e.target.value)}/>
                </VStack>
                <Button my='5' size='lg' fontSize={'xl'} colorScheme='blue' onClick={()=>{getQuery()}}><Box pr='3'> <FiSearch/></Box> Ara<Box pr='3'></Box></Button>
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
              height="90%"

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
                                      <Td><Badge colorScheme={item?.detection!==null?'red':'green'}>{item?.detection!==null?'Var':'Yok'}</Badge></Td>

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
      </Layout>
    );
  };
  
  