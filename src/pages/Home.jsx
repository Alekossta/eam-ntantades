import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppCtx } from "../appCtx";

export default function Home()
{
    const {user, userType} = useAppCtx();
    return <Box sx={{width:"100%", height: "100%"}}>
        <Box
            sx={{
                width: '100%',
                height: '100vh', 
                backgroundImage: `url('homeWallpaper.png')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: "2rem",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    marginTop: "2rem",
                    width: "60%",
                    minHeight: "40vh",
                    maxHeight: "55vh",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "1rem"
                }}
            >
                <Typography variant="h1" color="white" sx={{marginY: "2rem"}}>
                    ΝΤΑΝΤΑΔΕΣ
                </Typography>
                <Typography color="white" fontSize={"2em"} textAlign={"center"}>
                    Η πλατφόρμα που ταιριάζει τον καταλληλο γονέα στην κατάληλλη νταντά
                </Typography>
                <Box sx={{width:"100%", height: "5vh", display: "flex", justifyContent: "space-around", marginTop: "3rem"}}>
                    {
                        userType == "not_logged_in" &&
                        <>
                            <Button
                                component={Link}
                                to="/parent/register"
                                color="secondary"
                                variant="contained"
                                size="large"
                            >
                                Είμαι Γονέας
                            </Button>
                            <Button
                                component={Link}
                                to="/sitter/register"
                                color="secondary"
                                variant="contained"
                                size="large"
                            >
                                Είμαι Νταντά
                            </Button>
                        </>
                    }
                    {
                        userType == "sitter" &&
                        <Button
                            component={Link}
                            to="/sitter/ad-create"
                            color="secondary"
                            variant="contained"
                            size="large"
                        >
                            Φτιάξε αγγελία
                        </Button>
                    }
                    {
                        userType == "parent" &&
                        <Button
                            component={Link}
                            to="/parent/search"
                            color="secondary"
                            variant="contained"
                            size="large"
                        >
                            Ψάξε αγγελίες
                        </Button>
                    }
                </Box>
            </Box>
        </Box>
    </Box>
}