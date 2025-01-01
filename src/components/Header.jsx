import React from 'react';
import { AppBar, Toolbar,  Box, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar disableGutters>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{
            height: 75,
            width: 75,
            margin: "0.75rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />
        <Box sx={{marginLeft: "auto"}}>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>       
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
