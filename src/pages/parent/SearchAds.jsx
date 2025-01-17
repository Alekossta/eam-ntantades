import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Ad from "../../components/Ad";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function SearchAds()
{
    const [ads, setAds] = useState([]);
    useEffect(() => {
        const fetchAds = async () => {
            const collectionRef = collection(db, "ads");
            try {
                const fieldQuery = query(collectionRef, where("isPublished", "==", true));
                const querySnapshot = await getDocs(fieldQuery);
                const docs = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAds(docs);
            } catch (error) {
                console.error("Error fetching documents: ", error);
            }
        };
    
        fetchAds();
    }, [])

    return <Box
        sx={{
            display:"flex",
            flexDirection: "column",
            alignItems: "center"
        }}
    >
        <Typography variant="h2" sx={{marginTop: "2rem"}}>
            Αγγελίες
        </Typography>
        {ads.map((ad) => {
            return <Ad ad={ad} key={ad.id} canShowInterest={true}/>
        })}
    </Box>
}