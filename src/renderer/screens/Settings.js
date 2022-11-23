import { useState, useEffect, useContext } from 'react';
import { Box, ChakraProvider, Flex, Text, VStack, extendTheme, HStack, Grid, Image, Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot, Badge, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, useDisclosure, IconButton, Input, Checkbox} from '@chakra-ui/react';
import InfoBox from 'renderer/components/infoBox';
import { FcMultipleCameras, FcHighPriority, FcAutomotive, FcSelfServiceKiosk, FcClock, FcShipped, FcInfo, FcEditImage, FcCameraIdentification } from 'react-icons/fc'
import { FaEdit, FaExpand } from 'react-icons/fa'
import sendAsync from '../../messager/rerenderer';
import Alarm from 'renderer/alarmContext';

export default function Settings() {
  //play 'assets/master_warn.mp3'
  const [ip, setIP] = useState('');
  useEffect(() => {
    sendAsync('getIP').then((res) => {
      setIP(res);
      }).catch((err) => {
        console.log(err);
      });
      }, []);

  const [activeFSImage, setActiveFSImage] = useState(null);

  const [activeAlertPlateCam, setActiveAlertPlateCam] = useState(null);
  const [activeAlertPlate, setActiveAlertPlate] = useState(null);
  const [activeAlertUnderCam, setActiveAlertUnderCam] = useState(null);

  const [restorePath, setRestorePath] = useState(null);
  //alarm context
  const alarm = useContext(Alarm);
 
    return (

    <Box>
            <Box w='100%' h='100%' bg='gray.300' p='6' borderRadius='md'>
                <Text fontWeight='bold' fontSize='2xl'>Ayarlar</Text>
                <Text mt='5' fontSize='xl'>Sunucu Adresi</Text>
                

                    <Input mt='2' placeholder="Sunucu Adresi" value={ip} onChange={(e) => setIP(e.target.value)} />
            <Button mt='2' colorScheme="blue" onClick={()=>sendAsync('changeIP:'+ip).then(e=>console.log(e)).catch((e)=>console.warn(e))}>Sunucu Adresini Değiştir</Button>

          <Text mt='5' fontSize='xl'>Alarm Ayarları</Text>

            <Checkbox isChecked={alarm.alarm} onChange={(e)=>alarm.setAlarm(e.target.checked)}>Alarmı Aç/Kapat</Checkbox>
            

          <Text mt='5' fontSize='xl'>Yedekleme</Text>

            <Button mt='2' colorScheme="blue" onClick={()=>sendAsync('backup').then(e=>alert('Yedekleme Başarılı')).catch((e)=>console.warn(e))}>Yedekle</Button>

          <Text mt='5' fontSize='xl'>Geri Yükleme</Text>

          {/* select path to file */}
          <Input mt='1' type="file" 
                aria-label='Yedek Dosyası Seç'
                placeholder='Outline'
                onChange={(e)=>setRestorePath(e.target.files[0].path)} />
                
            <Button mt='2' colorScheme="blue" onClick={()=>{
              //select path
              if(restorePath){
              sendAsync('restore:'+restorePath).then(e=>alert('Başarıyla Geri Yüklendi')).catch((e)=>console.warn(e))
              }
              else{
                alert('Yedek Dosyası Seçilmedi')
              }
            }}>Geri Yükle</Button>




            </Box>
            
            </Box>

    );
  };
  
  