import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import RegisterSitter from './pages/RegisterSitter';

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
      <Container component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register-sitter" element={<RegisterSitter/>}/>
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
