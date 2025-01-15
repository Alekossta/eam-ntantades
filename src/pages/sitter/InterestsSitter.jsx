import { Box, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAppCtx } from "../../appCtx";
import Interest from "../../components/Interest";

export default function InterestsSitter()
{
    const [interests, setInterests] = useState([]);
    const {user} = useAppCtx();
    
    const fetchInterests = async () => {
        try
        {
            const snap = await getDocs(query(collection(db, "interests"), where("recipient", "==", user.uid), where("state", "!=", "rejected")));
            setInterests(snap.docs.map(doc => ({id: doc.id, ...doc.data()})));
        }
        catch(e)
        {
            console.log('error getting interests' + e);
        }
    }

    useEffect(() => {
        fetchInterests();
    }, []);

    return <Box sx={{display:"flex", flexDirection:"column", gap:"2rem",alignItems: "center"}}>
        <Typography variant="h2">
            Τα ενδιαφέροντα σου
        </Typography>
        <Typography variant="h3">
            Αποδεχούμενα
        </Typography>
        {interests.map((int) => {if(int.state=="accepted") return <Interest interest={int} key={int.id} fetchInterests={fetchInterests} canSign/>})}
        <Typography variant="h3">
            Εκρεμούν
        </Typography>
        {interests.map((int) => {if(int.state!="accepted") return <Interest interest={int} key={int.id} showActions fetchInterests={fetchInterests}/>})}
    </Box>
}