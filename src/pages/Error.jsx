import React from 'react';
import { Box } from '@mui/material';

const Error = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Box
                component="img"
                src="error.png"
                sx={{
                    width: '30vh', // Adjust width
                    height: '30vh', // Maintain aspect ratio
                }}
            />
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
        </div>
    );
};

export default Error;
