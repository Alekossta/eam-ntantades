import { Box, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAppCtx } from "../../appCtx";
import Interest from "../../components/Interest";

export default function InterestsParent()
{
    const [interests, setInterests] = useState([]);

    const {user} = useAppCtx();

    useEffect(() => {
        const fetchInterests = async () => {
            try
            {
                const q = query(collection(db, "interests"), where("proposer", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const interestsTemp = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setInterests(interestsTemp);
            }
            catch(e)
            {
                console.log(e);
            }
        }

        fetchInterests();
    }, []);
    return <Box sx={{display: "flex", gap: "3rem", flexDirection: "column", alignItems: "center"}}>
        <Typography variant="h2">
            Τα ενδιαφέροντα σου
        </Typography>
        <Typography variant="h3">
            Δηλωμένα
        </Typography>
        {interests.map((int) => {if(int.isPublished) return <Interest interest={int} key={int.id}/>})}
        <Typography variant="h3">
            Αποθηκευμένα
        </Typography>
        {interests.map((int) => {if(!(int.isPublished)) return <Interest interest={int} key={int.id} canEdit/>})}
    </Box>
}