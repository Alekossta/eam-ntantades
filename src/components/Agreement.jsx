import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppCtx } from "../appCtx";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Agreement({agreement, fetchAgreements, canEnd})
{
    const {userType} = useAppCtx();
    const [sitter, setSitter] = useState();
    const [parent, setParent] = useState();
    
    const navigate = useNavigate();

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
        const agreementRef = doc(db, "agreements", agreement.id);
        await deleteDoc(agreementRef);
        await fetchAgreements();
        navigate("/parent/rate/" + agreement.sitter);
    };
    
    return <Card sx={{width: "50%"}}>
        <CardHeader title="Συμφωνία με:"/>
        <CardContent sx={{display:"flex", flexDirection: "column", gap: "1rem"}}>
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
                Ξεκίνησε: {agreement.startedAt.toDate().toLocaleDateString('en-GB')}
            </Typography>
            <Typography>
                Επόμενη {userType == "parent" ? "αυτόματη" : ""} πληρωμή: {new Date(agreement.startedAt.toDate().setMonth(agreement.startedAt.toDate().getMonth() + 1)).toLocaleDateString('en-GB')}
            </Typography>
        </CardContent>
        {canEnd && <CardActions
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
        </CardActions>}
    </Card>
}