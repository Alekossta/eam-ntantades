import { Box, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppCtx } from "../../appCtx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import RatingCard from "../../components/Rating";

export default function RatingsSitter()
{
    const [ratings, setRatings] = useState([]);
    const {user} = useAppCtx();
    const fetchRatings = async () => {
        try {
            const q = query(
              collection(db, "ratings"), // Replace "ratings" with your collection name
              where("sitter", "==", user.uid) // Replace fieldName and specificValue
            );
        
            const querySnapshot = await getDocs(q);
        
            const newRatings = [];
            querySnapshot.forEach((doc) => {
              newRatings.push({ id: doc.id, ...doc.data() });
            });
        
            setRatings(newRatings);
          } catch (error) {
            console.error("Error retrieving ratings: ", error);
        }
    }

    useEffect(() => {
        fetchRatings();
    }, [])
    return <Box sx={{display:"flex", flexDirection:"column", gap:"2rem",alignItems: "center"}}>
        {ratings.map((rat) => <RatingCard rating={rat} key={rat.id}/>)}
    </Box>
}