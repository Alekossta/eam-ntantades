import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppCtx } from "../appCtx";
import { db } from "../firebase";
import {addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";

const countSignatures = (signatures) => {
  return Object.values(signatures).filter(Boolean).length;
};

export default function Interest({interest, canEdit, showActions, fetchInterests, canSign})
{
    const navigate = useNavigate();
    const {user, userType} = useAppCtx();

    const editButtonClicked = () => {
      navigate("/parent/interest/edit/" + interest.id);
    }

    const onRejectClicked = async () => {
      const docRef = doc(db, "interests", interest.id);

      try {    
        await updateDoc(docRef, {
          state: "rejected",
        });
        fetchInterests();
      } catch (error) {
        console.error("Error adding IDs to the array:", error);
      }
    }

    const onAcceptedClicked = async () => 
    {
        const docRef = doc(db, "interests", interest.id);

        try {    
          await updateDoc(docRef, {
            state: "accepted",
          });
          fetchInterests();
        } catch (error) {
          console.error("Error adding IDs to the array:", error);
        }
    }

    const onSignClicked = async () => {
      const docRef = doc(db, "interests", interest.id);

      try {
        if(userType == "sitter")
        {
          await updateDoc(docRef, {
            "signatures.recipient": true,
          });
        }
        else if (userType == "parent")
        {
          await updateDoc(docRef, {
            "signatures.proposer": true,
          });
        }
        if(countSignatures(interest.signatures) > 1)
        {
          // create agreement
          await addDoc(collection(db, "agreements"), {
            sitter: interest.recipient,
            parent: interest.proposer,
            ad: interest.ad,
          });
          const interestRef = doc(db, "interests", interest.id);
          await deleteDoc(interestRef);

          const adRef = doc(db, "ads", interest.ad);
          await deleteDoc(adRef);
        } 
        fetchInterests();
      } catch (error) {
        console.error("Error adding IDs to the array:", error);
      }      
    }

    return <Card sx={{width: "50%"}}>
        <CardHeader title="Ενδιαφέρον"/>
        <CardContent>
            <Typography>
              Περιγραφή: {interest.description}  
            </Typography>
        </CardContent>
        {canEdit && <CardActions
        sx={{
          justifyContent: "flex-end", // Aligns the buttons to the right
        }}
        >
            <Button size="medium" variant="contained" color="secondary" onClick={editButtonClicked}>
                Edit
            </Button>
        </CardActions>}
        {showActions && <CardActions
        sx={{
          justifyContent: "flex-end", // Aligns the buttons to the right
        }}
        >
            <Button 
                size="medium"
                variant="contained"
                sx={{
                    backgroundColor: 'green', // Replace with a specific shade from MUI if needed, e.g., theme.palette.success.main
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'darkgreen', // Adjust for hover effect
                    },
                }} 
            onClick={onAcceptedClicked}>
                ΑΠΟΔΟΧΗ
            </Button>
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
                onClick={onRejectClicked}>
                  ΑΠΟΡΡΙΨΗ
            </Button>
        </CardActions>}
        {canSign && <CardActions
        sx={{
          justifyContent: "flex-end", // Aligns the buttons to the right
        }}
        >
            <Button size="medium" variant="contained" color="secondary" onClick={onSignClicked}>
                Υπόγραψε {countSignatures(interest.signatures)}/2
            </Button>
        </CardActions>}
    </Card>
}