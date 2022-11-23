import { MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import icon from '../../assets/icon.png';
import './App.css';
import React from 'react';
import { Box, ChakraProvider, Flex, Text, VStack, extendTheme} from '@chakra-ui/react';

import {FiLink, FiRefreshCcw} from 'react-icons/fi'

import MainScreen from './screens/Main.js';
import Search from './screens/Search';
import Settings from './screens/Settings';
import Layout from './layouts/layout';
import Gate from './gateContext';
import Alarm from './alarmContext';

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
  const [gate, setGate] = React.useState([]);
  const [alarm, setAlarm] = React.useState(true);
  return (
    <ChakraProvider theme={theme}>
      <Gate.Provider value={{gate, setGate}}>
        <Alarm.Provider value={{alarm, setAlarm}}>
    <Router>
      <Layout>
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<MainScreen />} />

      </Routes>
      </Layout>
    </Router>
    </Alarm.Provider>
    </Gate.Provider>
    </ChakraProvider>
  );
}
