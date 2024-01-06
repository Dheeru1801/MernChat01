import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import ChatProvider from './Context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));//see here for error
root.render(
  <BrowserRouter>
  <ChatProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ChatProvider>
    </BrowserRouter>,
  // document.getElementById('root')
);

