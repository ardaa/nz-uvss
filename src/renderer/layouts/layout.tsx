import React, { ReactNode, useEffect, useState, useContext } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Link,
  BoxProps,
  FlexProps,
  Divider,
  Image,
  Select
} from '@chakra-ui/react';
import {
Link as LinkRoute
} from "react-router-dom";
import {
  FiHome,
  FiSettings,
  FiMenu,
  FiSearch,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import icon from '../../../assets/nexizon.png';
import logo from '../../../assets/icon.png';
import sendAsync from '../../messager/rerenderer';
import Gate from 'renderer/gateContext';




interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Ana Menü', icon: FiHome, link: '/' },
  { name: 'Arama', icon: FiSearch, link: '/search' },
  { name: 'Ayarlar', icon: FiSettings, link: '/settings' },
];

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />


      <Box ml={{ base: 0, md: 40 }} overflow='scroll' p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const [db, setDb] = useState<any>(null);
  const gate = useContext(Gate);
  const [selectedGateIndex, setSelectedGateIndex] = useState<ReactText>(0);

  const [chassis_status_bool, setChassisStatusBool] = useState<boolean>(false);
  const [plate_status_bool, setPlateStatusBool] = useState<boolean>(false);

  useEffect(() => {
    sendAsync('SELECT version();').then((res: any) => {
      console.log(res)
      setDb(res!=='error');
      sendAsync(`SELECT * 
    FROM gates`).then((result) => {
      console.log(result)
      if(result!=='error'){
      //add isselected to all elements
      result.forEach((element: any, index: number) => {
        element.isSelected = index === 0;
      });
      console.log(result)
      gate.setGate(result);
      }
         sendAsync(`SELECT chassis_status, plate_status
    FROM gates
    WHERE gate_id = ${gate.gate[selectedGateIndex]?.gate_id !== undefined ? gate.gate[selectedGateIndex]?.gate_id : 0};
    `).then((result) => {
      console.log(result)
      if(result!=='error'){
        setChassisStatusBool(result[0]?.chassis_status === 1);
        setPlateStatusBool(result[0]?.plate_status === 1);
      }
    });
    });
    });
    
    const inter = setInterval(async () => {
    sendAsync('SELECT version();').then((res: any) => {
      console.log(res)
      setDb(res!=='error');
      sendAsync(`SELECT chassis_status, plate_status
    FROM gates
    WHERE gate_id = ${gate.gate[selectedGateIndex]?.gate_id !== undefined ? gate.gate[selectedGateIndex]?.gate_id : 'gate_id'}
    LIMIT 1;
    `).then((result) => {
      console.log(result)
      if(result!=='error'){
        setChassisStatusBool(result[0]?.chassis_status === 1);
        setPlateStatusBool(result[0]?.plate_status === 1);
      }
    });
    });
    }, 10000);
  
    
    }, []);


    
  return (
    <Flex
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 40 }}
      pos="fixed"
      className='nohighlight no-drag sticky'
      
      h='full'
      justify={'space-between'}
     
      {...rest}>
        <Flex
            direction={'column'}
            justify={'space-between'}
            h={'full'}

            >

      <Flex h="20" alignItems="center" mx="2" my='0' justifyContent="space-around">
        <Image borderRadius={'10'} src={logo} alt="nexizon" w="60px" h="60px" />
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          AAGS
          </Text>
        {/* dropdown */}
      
      </Flex>
      
    <div>
    <Divider/>
      {LinkItems.map((link) => (
       <LinkRoute to={link.link}><NavItem
        
     key={link.name} icon={link.icon}>
          {link.name}
        </NavItem></LinkRoute> 
  
      ))}
       </div>
        
       <div style={{ display: 'flex',padding:'10px', width:'100%', flexDirection: 'column', alignItems: 'flex-start'}}>
        <Text fontSize="md" fontWeight="bold" color="gray.500">
        Geçit Seçin
          </Text>
          {gate?.gate.gate_id}
       <Select mb='5' mt='2' value={gate?.gate.gate_id} onChange={(e)=>gate.setGate(
          gate.gate.map((element: any) => {
            if (element.gate_id === e.target.value) {
              element.isSelected = true;
              setSelectedGateIndex(element.gate_id);
            } else {
              element.isSelected = false;
            }
            return element;
          })

       )}>

          {gate?.gate.map((gate:any)=>(
            <option value={gate.gate_id}>{gate.gate_name}</option>
          ))}
        </Select>
       <div style={{ display: 'flex',padding:'2px',  width:'90%', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
      <Text fontSize="sm">Veritabanı</Text>
      <Box  ml="2" w="3" h="3" bg={ db ? 'green.500' : 'red.500'} borderRadius="50%" />
      </div>

      <div style={{ display: 'flex',padding:'2px',  width:'90%', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
      <Text fontSize="sm">Şasi Kamera</Text>
      <Box  ml="2" w="3" h="3" bg={ chassis_status_bool ? 'green.500' : 'red.500'} borderRadius="50%" />
      </div>
      <div style={{ display: 'flex',padding:'2px',  width:'90%',  marginBottom:'10px', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
      <Text fontSize="sm">Plaka Kamera</Text>
      <Box  ml="2" w="3" h="3" bg={ plate_status_bool ? 'green.500' : 'red.500'} borderRadius="50%" />
      </div>     
       <div style={{ display: 'flex',padding:'2px', flexDirection: 'row', alignItems: 'center'}}>
                            <p style={{ color: '#ccc', marginLeft: '0px', fontSize:10 }}>Powered by </p>
                            <Image src={icon} style={{margin:0, marginLeft:'5px', marginBottom: '2px'}} alt="User" width={'50px'} height={'12px'} />
                        </div>
                        </div>
    </Flex>
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
             
      <Flex
        align="center"
        p="4"
     

        role="group"
        cursor="pointer"
        direction={'column'}
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mb="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        <Text align={'center'}>{children}</Text>
      </Flex>
      <Divider/>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [dateState, setDateState] = useState(new Date());
  
  const [totalCarCounter, setTotalCarCounter] = useState(0)


  return (
    <Flex
      ml={{ base: 0, md: 40 }}
      px={{ base: 4, md: 4 }}
      height="20"
      className='nohighlight no-drag sticky'
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-start' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

   

    </Flex>
  );
};