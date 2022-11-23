import { Box, ChakraProvider, Flex, Text, VStack, extendTheme} from '@chakra-ui/react';

export default function InfoBox({title, value, icon, size, hover, onClick}) {
    return (
      <Box display={'flex'} p='6' visibility={size!='xl'&&{base:'hidden', md:'hidden', lg:'visible'}} minW={size==='xl'?{base:'0vw', md:'16vw'}:{base:'0vw', md:'15vw', lg:'25vw'}} h={size==='xl'?'100px':'30px'} alignItems={'center'} justifyContent={'space-between'} dir='row' bg='gray.300' _hover={hover&&{backgroundColor:'gray.200'}} _active={hover&&{backgroundColor:'gray.500'}}  borderBottom={'1px #051C6B solid'}>
      <Text fontSize={size==='xl'?'5xl':'3xl'}>{icon}</Text>
        <Text noOfLines={1}  padding='1px' fontSize={size==='xl'?'xl':{base:'0', lg:'sm'}}>{title}</Text>
        <Text noOfLines={1} fontWeight='bold' fontSize={size==='xl'?'xl':(size==='xs'?'xl':'xl')}>{value}</Text>

        </Box>
    );
  };
  
  