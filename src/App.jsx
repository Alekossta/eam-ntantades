import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSitter from './pages/RegisterSitter';
import RegisterParent from './pages/RegisterParent';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/register/parent" element={<RegisterParent />} />
        <Route path="/register/sitter" element={<RegisterSitter />} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
