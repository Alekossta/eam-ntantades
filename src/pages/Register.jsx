import { Box, Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export default function Register()
{
    return <Box sx={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
     alignItems:"center", marginTop: "3rem"}}>
        <Typography variant="h1" align="center">
            Τι είσαι?
        </Typography>
        <Box sx={{width:"30%", display: "flex", justifyContent: "space-between", marginTop: "3rem"}}>
            <Button
                component={Link} // Makes the button act as a link
                to="/parent/register" // Specify the route
                color="secondary" // Secondary color
                variant="contained" // Contained style
                size="large"
            >
                Είμαι Γονέας
            </Button>
            <Button
                component={Link} // Makes the button act as a link
                to="/sitter/register" // Specify the route
                color="secondary" // Secondary color
                variant="contained" // Contained style
                size="large"
            >
                Είμαι Νταντά
            </Button>
        </Box>
    </Box>
}