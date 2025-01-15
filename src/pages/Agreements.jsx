import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Agreement from "../components/Agreement";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAppCtx } from "../appCtx";

export default function Agreements()
{
    const [agreements, setAgreements] = useState([]);
    const {user, userType} = useAppCtx();
    const fetchAgreements = async () => {
        try
        {
            let q;
            if(userType == "sitter")
            {
                q = query(collection(db, "agreements"), where("sitter", "==", user.uid));
            }
            else if (userType == "parent")
            {
                q = query(collection(db, "agreements"), where("parent", "==", user.uid));
            }

            if(userType != "not_logged_in")
            {
                const querySnapshot = await getDocs(q);
                const agreementsTemp = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAgreements(agreementsTemp);
            }

        }
        catch(e)
        {
            console.log(e);
        }
    }
    useEffect(() => {
       

        if(user)
        {
            fetchAgreements();
        }
    }, [user, userType]);
    return <Box sx={{display:"flex", gap: "2rem", flexDirection: "column",alignItems: "center"}}>
        <Typography variant="h2">
            Οι συμφωνίες σου
        </Typography>
        {agreements.map((el) => <Agreement key={el.id} agreement={el} fetchAgreements={fetchAgreements} canEnd={userType == "parent"}/>)}
    </Box>
}