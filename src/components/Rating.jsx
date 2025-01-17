import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const RatingCard = ({ rating }) => {
  const [parent, setParent] = useState();

  useEffect(() => {
    const fetchParent = async () => {
      const q = query(collection(db, "users"), where("__name__", "==", rating.parent), limit(1));
  
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setParent({ id: doc.id, ...doc.data() });
        } else {
          console.log("No document found with the specified ID.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        throw error;
      }
    }

    fetchParent();
  }, []);

  return (
    <Card
      sx={{
        width: "50%",
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {parent && <Typography variant="h6" align="center" gutterBottom>
        {parent.firstName} {parent.lastName}
        </Typography>}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Rating value={rating.rating} readOnly size="large" />
        </Box>
        <Typography variant="body1" align="center">
          {rating.description || "No description provided"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RatingCard;
