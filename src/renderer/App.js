import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

import { Box, ChakraProvider, Flex, Text, VStack, extendTheme} from '@chakra-ui/react';

import {FiLink, FiRefreshCcw} from 'react-icons/fi'

import MainScreen from './screens/Main.js';

const theme = extendTheme({

  styles: {
    global: (props) => ({
    
      ':not(.chakra-dont-set-collapse) > .chakra-collapse': {
        overflow: 'initial !important',
      },
    
      body: {
        bg: 'gray.900',
      },
    }),
  },
  colors: {
    gray:{
      900: '#080912',
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
})

export default function App() {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
      </Routes>
    </Router>
    </ChakraProvider>
  );
}
