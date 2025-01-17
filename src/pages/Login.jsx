import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Snackbar,
  Alert
} from "@mui/material";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    try
    {
        const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);
        console.log(userCredentials.user);
        navigate("/");
    }
    catch (error)
    {
        setErrorMessage(error.message);
        setSnackbarOpen(true);
    }
  };

  return (
    <>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
            <Alert onClose={handleCloseSnackbar} severity="error">
                {errorMessage}
            </Alert>
        </Snackbar>
        <Card style={{ maxWidth: 700, margin: "20px auto", padding: "10px" }}>
        <CardHeader title="Login" />
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal" error={!!errors.email}>
                <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: "Email is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                    },
                }}
                render={({ field }) => (
                    <TextField {...field} label="Email" variant="outlined" />
                )}
                />
                <FormHelperText>{errors.email?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.password}>
                <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                }}
                render={({ field }) => (
                    <TextField
                    {...field}
                    label="Password"
                    type="password"
                    variant="outlined"
                    />
                )}
                />
                <FormHelperText>{errors.password?.message}</FormHelperText>
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
            >
                Submit
            </Button>
            </form>
        </CardContent>
        </Card>
    </>
  );
};

export default Login;
