import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: 'primary.main',
        textAlign: 'center',
      }}
    >
      <Typography>
        © {new Date().getFullYear()} Ntantades.
      </Typography>
    </Box>
  );
}

export default Footer;
