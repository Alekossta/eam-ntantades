import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppCtx } from '../../appCtx';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const RateSitter = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const {id} = useParams();
  const {user} = useAppCtx();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
        console.log(data);
        await addDoc(collection(db, "ratings"), {
            ...data,
            parent: user.uid,
            sitter: id,
        });
        navigate("/");
      } catch (e) {
        console.error("Error adding document: ", e);
    }
  };

  return (
    <Card
      sx={{
        width:"50%",
        boxShadow: 3,
        borderRadius: 2,
        alignSelf: "center",
        marginTop: "3rem"
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          Αξιολόγηση νταντάς
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={2}>
          <Controller
            name="rating"
            control={control}
            rules={{ required: 'Please select a rating' }}
            render={({ field }) => (
                <Box display="flex" justifyContent="center" marginBottom={2}>
                <Rating
                    {...field}
                    max={5}
                    precision={1}
                    onChange={(_, value) => field.onChange(value)}
                    sx={{ fontSize: 75 }} // Increased star size
                />
                </Box>
            )}
            />
          </Box>

          <TextField
            label="Περιγραφή"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            {...control.register('description', {
              required: 'Description is required',
              maxLength: { value: 500, message: 'Maximum 500 characters allowed' },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {/* Submit Button */}
          <Box textAlign="center" marginTop={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default RateSitter;
