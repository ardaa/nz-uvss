import { Box, ChakraProvider, Flex, Text, VStack, extendTheme} from '@chakra-ui/react';
import Layout from '../layouts/layout';

export default function InfoBox({title, value, icon, size, hover}) {
    return (
      <Box display={'flex'} p='6' w={size==='xl'?'30vw':'18vw'} h={size==='xl'?'100px':'30px'} alignItems={'center'} justifyContent={'space-between'} dir='row' bg='gray.300' _hover={hover&&{backgroundColor:'gray.200'}} _active={hover&&{backgroundColor:'gray.500'}}  borderBottom={'1px #051C6B solid'}>
      <Text fontSize={size==='xl'?'5xl':'3xl'}>{icon}</Text>
        <Text padding='1' fontSize={size==='xl'?'xl':'md'}>{title}</Text>
        <Text noOfLines={1} fontSize={size==='xl'?'2xl':(size==='xs'?'xl':'2xl')}>{value}</Text>

        </Box>
    );
  };
  
  