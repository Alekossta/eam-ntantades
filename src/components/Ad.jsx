import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const days = [
    "Δευτέρα",
    "Τρίτη",
    "Τετάρτη",
    "Πέμπτη",
    "Παρασκευή",
    "Σάββατο",
    "Κυριακή"
]

const dayTranslations = {
    'Δευτέρα': 'monday',
    'Τρίτη': 'tuesday',
    'Τετάρτη': 'wednesday',
    'Πέμπτη': 'thursday',
    'Παρασκευή': 'friday',
    'Σάββατο': 'saturday',
    'Κυριακή': 'sunday',
};

export default function Ad({ad, canEdit, canShowInterest})
{
    const [ownerUser, setOwnerUser] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const getOwnerUser = async () => {
            const q = query(collection(db, "users"), where("__name__", "==", ad.owner), limit(1));
  
            try {
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                console.log(doc.data());
                setOwnerUser({ id: doc.id, ...doc.data() });
              } else {
                console.log("No document found with the specified ID.");
                return null;
              }
            } catch (error) {
              console.error("Error fetching document:", error);
              throw error;
            }
        }

        getOwnerUser();

    }, []);

    const editButtonClicked = () => {
        navigate("/sitter/ad/edit/" + ad.id);
    };

    const showInterestButtonClicked = () => {
        navigate("/parent/createInterestFor/" + ad.id);
    }

    return (<Card sx={{width:"50%", marginY:"1rem"}}>
        <CardHeader title="Αγγελία"/>
        <CardContent>
            <Typography>
                Τοποθεσία: {ad.location} 
            </Typography>
            <Typography>
                Τύπος Απασχόλησης: {ad.worktype} 
            </Typography>
            {days.map((el) => {
                if(ad[dayTranslations[el]])
                {
                    return <Typography key={el}>
                        {el}: {ad[dayTranslations[el]].startTime.toDate().toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            })} - 
                        {ad[dayTranslations[el]].endTime.toDate().toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            })}
                    </Typography>
                }
            })}

        </CardContent>
        <CardHeader title="Στοιχεία Νταντάς"/>
        {ownerUser &&        
            <CardContent>
                <Typography>
                    Ονοματεπώνυμο: {ownerUser.firstName} {ownerUser.lastName}
                </Typography>
                <Typography>
                    Τηλέφωνο: {ownerUser.phone}
                </Typography>
                <Typography>
                    Εμπειρία: {ownerUser.sitter.experience}
                </Typography>
                <Typography>
                    Σπουδές: {ownerUser.sitter.studies}
                </Typography>
            </CardContent>
        }
        {canEdit && <CardActions
        sx={{
          justifyContent: "flex-end", // Aligns the buttons to the right
        }}
        >
            <Button size="medium" variant="contained" color="secondary" onClick={editButtonClicked}>
                Edit
            </Button>
        </CardActions>}
        {canShowInterest && <CardActions
        sx={{
          justifyContent: "flex-end", // Aligns the buttons to the right
        }}
        >
            <Button size="medium" variant="contained" color="secondary" onClick={showInterestButtonClicked}>
                Show Interest
            </Button>
        </CardActions>}
    </Card>)
}