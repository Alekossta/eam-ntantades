import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppCtx } from "../../appCtx";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Ad from "../../components/Ad";
import { db } from "../../firebase";

export default function Ads()
{
    const [ads, setAds] = useState([]);
    const {user} = useAppCtx();
    useEffect(() => {

        const fetchAds = async () => {
            try {
                const collectionRef = collection(db, "ads");
                const q = query(collectionRef, where("owner", "==", user.uid));
                const querySnapshot = await getDocs(q);
    
                const documents = [];
                querySnapshot.forEach((doc) => {
                    documents.push({ id: doc.id, ...doc.data() });
                });
                
                setAds(documents);
            } catch (error) {
                console.error("Error fetching documents:", error);
                throw error;
            }
        }

        fetchAds();

    }, [])

    return <Box sx={{display:"flex", flexDirection: "column", justifyContent:"center", alignItems: "center"}}>
        <Typography variant="h2" sx={{marginY: "2rem"}}>
            Οι αγγελίες σου
        </Typography>
        {ads.map((el) => {
            return <Ad key={el.id} ad={el}/>
        })}
    </Box>
}