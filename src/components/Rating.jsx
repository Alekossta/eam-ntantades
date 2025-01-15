import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import Rating from '@mui/material/Rating';

const RatingCard = ({ rating }) => {
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
        <Typography variant="h6" align="center" gutterBottom>
          User Rating
        </Typography>
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
