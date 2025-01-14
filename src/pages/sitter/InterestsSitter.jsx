import { Box } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAppCtx } from "../../appCtx";
import Interest from "../../components/Interest";

export default function InterestsSitter()
{
    const [interests, setInterests] = useState([]);
    const {user} = useAppCtx();

    useEffect(() => {
        const fetchInterests = async () => {
            try
            {
                const snap =await getDocs(query(collection(db, "interests"), where("recipient", "==", user.uid)));
                setInterests(snap.docs.map(doc => ({id: doc.id, ...doc.data()})))
            }
            catch(e)
            {
                console.log('error getting interests' + e);
            }
        }

        fetchInterests();
    }, []);

    return <Box>
        {interests.map((int) => <Interest interest={int} key={int.id}/>)}
    </Box>
}