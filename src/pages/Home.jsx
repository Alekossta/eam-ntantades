import { Box } from "@mui/material";

export default function Home()
{
    return <Box sx={{width:"100%", height: "100vh"}}>
        <Box
            component="img"
            src="https://via.placeholder.com/500" // Replace with your image URL
            sx={{
            width: '100%',
            }}
        />
    </Box>
}