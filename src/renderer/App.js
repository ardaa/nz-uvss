import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.png';
import './App.css';

import { Box, ChakraProvider, Flex, Text, VStack, extendTheme} from '@chakra-ui/react';

import {FiLink, FiRefreshCcw} from 'react-icons/fi'

import MainScreen from './screens/Main.js';
import Search from './screens/Search';
import Settings from './screens/Settings';

const theme = extendTheme({
  components:{
    PinInput:{
      baseStyle:{
       fontWeight:'bold',
        fontSize:'5xl',
      },
      sizes: {
        xl: {
          h: '90px',
          w: '70px',
          
        },
      },
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
})

export default function App() {
  return (
    <ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<MainScreen />} />

      </Routes>
    </Router>
    </ChakraProvider>
  );
}
