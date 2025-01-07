import React from 'react';
import { AppBar, Toolbar,  Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Tracks if the user is logged in

  useEffect(() => {
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });

      // Cleanup the listener on component unmount
      return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate("/");
    } catch (error) {
        console.error("Error logging out:", error);
    }
  };
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
        <Box sx={{marginLeft: "auto", marginRight:"2rem",
           display: "flex", justifyContent: "center", "alignItems": "center"}}>
          {user ? (
              // If the user is logged in
              <>
                  <Typography variant="body1" sx={{ marginRight: 2 }}>
                      {user.email || "User"}
                  </Typography>
                  <Button
                      color="inherit"
                      onClick={handleLogout}
                  >
                      Logout
                  </Button>
              </>
          ) : (
              // If the user is not logged in
              <>
                  <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                  >
                      Login
                  </Button>
                  <Button
                      color="inherit"
                      component={Link}
                      to="/register"
                  >
                      Register
                  </Button>
              </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
