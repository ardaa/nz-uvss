import React, { ReactNode, useState } from 'react';
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
  Image
} from '@chakra-ui/react';
import {
Link as LinkRoute
} from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiCamera,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import InfoBox from 'renderer/components/infoBox';
import { FcMultipleCameras, FcHighPriority, FcAutomotive, FcSelfServiceKiosk, FcClock } from 'react-icons/fc'
import icon from '../../../assets/nexizon.png';
import logo from '../../../assets/icon.png';
interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Ana Menü', icon: FiHome, link: '/' },
  { name: 'Kameralar', icon: FiCamera, link: '/cameras' },
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
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
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
          AGSS
          </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
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
       <div style={{ display: 'flex',padding:'10px', flexDirection: 'row', alignItems: 'center'}}>
                            <p style={{ color: '#ccc', marginLeft: '0px', fontSize:10 }}>Powered by </p>
                            <Image src={icon} style={{margin:0, marginLeft:'5px', marginBottom: '2px'}} alt="User" width={'50px'} height={'12px'} />
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
  React.useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

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

   

      <HStack spacing={{ base: '0', md: '6' }}>

      <InfoBox icon={<FcClock/>} size='xs' title={dateState.toLocaleString('tr-tr')}/>
      <InfoBox icon={<FcMultipleCameras/>} title={'Aktif Kamera Sayısı'} value={6}/>
       

       <InfoBox icon={<FcHighPriority/>} title={'Alarm Sayısı'} value={2}/>
       <InfoBox icon={<FcAutomotive/>} title={'Araç Sayısı'} value={309}/>

        
      </HStack>
    </Flex>
  );
};