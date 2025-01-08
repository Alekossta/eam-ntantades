import { Box, Typography } from "@mui/material";

export default function Home()
{
    return <Box sx={{width:"100%", height: "100%"}}>
        <Box
            sx={{
                width: '100%', // Adjust the width as needed
                height: '100vh', // Adjust the height as needed
                backgroundImage: `url('homeWallpaper.png')`, // Replace with your image URL
                backgroundSize: 'cover', // Makes sure the image covers the box
                backgroundPosition: 'center', // Centers the image
                backgroundRepeat: 'no-repeat', // Prevents the image from repeating
                padding: "2rem"
            }}
        >
            <Box
                sx={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    marginTop: "2rem"
                }}
            
            >
                <Typography variant="h1">
                    ΝΤΑΝΤΑΔΕΣ
                </Typography>
            </Box>
        </Box>
    </Box>
}