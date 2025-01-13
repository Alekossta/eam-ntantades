import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSitter from './pages/sitter/RegisterSitter';
import RegisterParent from './pages/parent/RegisterParent';
import EditSitter from './pages/sitter/EditSitter';
import EditParent from './pages/parent/EditParent';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { AppContext } from './appCtx';
import Error from './pages/Error';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import AdCreate from './pages/sitter/ad/AdCreate';
import Ads from './pages/sitter/ad/Ads';
import AdEdit from './pages/sitter/ad/AdEdit';
import SearchAds from './pages/parent/SearchAds';

const UserType = {
  SITTER: "sitter",
  PARENT: "parent",
  NOT_LOGGED_IN: "not_logged_in",
};

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(UserType.NOT_LOGGED_IN)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const foundUser = await getDoc(doc(db,"users", currentUser.uid));
      if(foundUser)
      {
        if(foundUser.data().parent)
        {
          setUserType(UserType.PARENT);
        }
        else if(foundUser.data().sitter)
        {
          setUserType(UserType.SITTER);
        }
      }
      else
      {
        setUserType(UserType.NOT_LOGGED_IN);
      }


    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppContext.Provider value={{user, userType}}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user && <>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/parent/register" element={<RegisterParent />} />
            <Route path="/sitter/register" element={<RegisterSitter />} />  
          </>}
          {
            userType == "sitter" &&
            <>
              <Route path="/sitter/edit" element={<EditSitter/>}/>
              <Route path="/sitter/ad-create" element={<AdCreate/>}/>
              <Route path="/sitter/ads" element={<Ads/>}/>
              <Route path="/sitter/ad/edit/:id" element={<AdEdit/>}/>
            </>
          }
          {
            userType == "parent" &&
            <>
              <Route path="/parent/edit" element={<EditParent/>}/>
              <Route path="/parent/search" element={<SearchAds/>}/>
            </>
          }
          <Route path="*" element={<Error/>} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </Box>
  );
}

export default App;
