import React from 'react';
import { AppBar, Toolbar,  Box, Button, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useAppCtx } from '../appCtx';

function Header() {
  const navigate = useNavigate();
  const {user, userType} = useAppCtx();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        setAnchorEl(null);
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
                  {userType == "parent" && 
                    <Button
                      component={Link}
                      to="/parent/search"
                      color="inherit"
                    >
                      ΨΑΞΕ ΑΓΓΕΛΙΕΣ
                    </Button>
                  }
                  {userType == "sitter" && 
                    <Button
                      component={Link}
                      to="/sitter/ratings"
                      color="inherit"
                    >
                      ΑΞΙΟΛΟΓΗΣΕΙΣ
                    </Button>
                  }
                  <Button
                    component={Link}
                    to="/agreements"
                    color="inherit"
                  >
                    ΣΥΜΦΩΝΙΕΣ
                  </Button> 
                  {userType == "sitter" &&
                  <>
                    <Button
                      component={Link}
                      to="/sitter/interests"
                      color="inherit"
                    >
                      ΕΝΔΙΑΦΕΡΟΝΤΑ
                    </Button>
                    <Button
                      component={Link}
                      to="/sitter/ads"
                      color="inherit"
                    >
                      ΑΓΓΕΛΙΕΣ
                    </Button>
                  </>
                  }
                  {userType == "parent" &&
                    <>                  
                      <Button
                        component={Link}
                        to="/parent/interests"
                        color="inherit"
                      >
                        Ενδιαφεροντα
                      </Button>
                    </>
                  }
                  <Button
                    color="inherit"
                    onClick={handleClick}
                  >
                    {user.email}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem component={Link} to={userType=="sitter" ? "/sitter/edit" : "/parent/edit"}
                     onClick={handleClose}>
                      ΠΡΟΦΙΛ
                    </MenuItem>
                    <MenuItem component={Button} to="/link2" onClick={handleLogout}>
                      Αποσύνδεση
                    </MenuItem>
                  </Menu>
              </>
          ) : (
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
