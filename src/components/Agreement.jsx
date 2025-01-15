import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppCtx } from "../appCtx";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Agreement({agreement})
{
    const {userType} = useAppCtx();
    const [sitter, setSitter] = useState();
    const [parent, setParent] = useState();

    const fetchOtherParty = async () => {
        if(userType == "sitter")
        {
            // get parent
            const usersRef = doc(db, "users", agreement.parent);
            const docRes = await getDoc(usersRef);
            setParent({id: docRes.id, ...docRes.data()});
        }
        else if (userType == "parent")
        {
            // get sitter
            const usersRef = doc(db, "users", agreement.sitter);
            const docRes = await getDoc(usersRef);
            setSitter({id: docRes.id, ...docRes.data()});
        }
    }

    useEffect(() => {
        fetchOtherParty();
    }, []);

    const onEndClicked = async () => {
        console.log(agreement);
    };
    
    return <Card sx={{width: "50%"}}>
        <CardHeader title="Συμφωνία με:"/>
        <CardContent>
            {parent && 
                <Box>
                    <Typography>
                        {parent.firstName} {parent.lastName}
                    </Typography>
                </Box>
            }
            {sitter &&
                <Box>
                    <Typography>
                        {sitter.firstName} {sitter.lastName}
                    </Typography>
                </Box>
            }
            <Typography>
                Ξεκίνησε: {agreement.startedAt.toDate().toLocaleString()}
            </Typography>
        </CardContent>
        <CardActions
            sx={{
                justifyContent: "flex-end", // Aligns the buttons to the right
            }}
        >
            <Button
                size="medium"
                variant="contained"
                sx={{
                    backgroundColor: 'red', // Replace with a specific shade from MUI if needed, e.g., theme.palette.success.main
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'darkred', // Adjust for hover effect
                    },
                }} 
                onClick={onEndClicked}
            >
                ΛΗΞΗ
            </Button>
        </CardActions>
    </Card>
}