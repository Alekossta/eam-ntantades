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
  Alert,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { DatePicker } from "@mui/x-date-pickers";

const RegisterSitter = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try
    {
        const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);
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
        <Card style={{ maxWidth: 600, margin: "20px auto", padding: "10px" }}>
        <CardHeader title="Register Sitter" />
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
                    <TextField {...field} label="Email" variant="outlined" error={!!errors.email}
                    />
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
                    error={!!errors.password}
                    />
                )}
                />
                <FormHelperText>{errors.password?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.firstName}>
                <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: "Όνομα είναι υποχρεωτικό",}}
                render={({ field }) => (
                    <TextField {...field} label="Όνομα" variant="outlined" error={!!errors.firstName}/>
                )}
                />
                <FormHelperText>{errors.firstName?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.lastName}>
                <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: "Επίθετο είναι υποχρεωτικό",}}
                render={({ field }) => (
                    <TextField {...field} label="Επίθετο" variant="outlined" error={!!errors.lastName}/>
                )}
                />
                <FormHelperText>{errors.lastName?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.afm}>
                <Controller
                name="afm"
                control={control}
                defaultValue=""
                rules={{
                    required: "Το ΑΦΜ είναι υποχρεωτικό",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Επιτρέπονται μόνο αριθμοι",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field} 
                        type="number" 
                        label="ΑΦΜ" 
                        variant="outlined" 
                        error={!!errors.afm}
                    />
                )}
                />
                <FormHelperText>{errors.afm?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.phone}>
                <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{
                    required: "Το τηλέφωνο είναι υποχρεωτικό",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Επιτρέπονται μόνο αριθμοι",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field} 
                        type="number" 
                        label="Τηλέφωνο" 
                        variant="outlined" 
                        error={!!errors.phone}
                    />
                )}
                />
                <FormHelperText>{errors.phone?.message}</FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="normal" error={!!errors.dateBirth}>
                <Controller
                    control={control}
                    rules={{
                        required: "Η ημερομηνία γέννησης είναι υποχρεωτική",
                    }}
                    name='dateBirth'
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            onChange={(date) => field.onChange(date)}
                            value={field.value}
                            label="Ημερομηνία Γέννησης"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={!!errors.dateBirth} // Pass the error prop
                                    helperText={errors.dateBirth?.message || ""} // Pass the helper text
                                    variant="outlined"
                                />
                            )}
                        />
                    )}
                />
                <FormHelperText>{errors.dateBirth?.message}</FormHelperText>
            </FormControl>


            <FormControl fullWidth margin="normal" error={!!errors.gender}>
                <InputLabel>Φύλο</InputLabel>
                <Controller
                control={control}
                name="gender"
                rules={{
                    required: "Το φύλο είναι υποχρεωτικό",
                }}
                render={({ field: { onChange, value } }) => (
                    <Select
                    labelId="option-select-label"
                    value={value || ""}
                    onChange={onChange}
                    label="Φύλο"
                    >
                        <MenuItem value="option1">Άνδρας</MenuItem>
                        <MenuItem value="option2">Γυναίκα</MenuItem>
                        <MenuItem value="option3">Άλλο</MenuItem>
                    </Select>
                )}
                />
                <FormHelperText>{errors.gender?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.studies}>
                <InputLabel>Σπουδές</InputLabel>
                <Controller
                control={control}
                name="studies"
                rules={{
                    required: "Οι σπουδές είναι υποχρεωτικές",
                }}
                render={({ field: { onChange, value } }) => (
                    <Select
                    labelId="option-select-label"
                    value={value || ""}
                    onChange={onChange}
                    label="Σπουδές"
                    >
                        <MenuItem value="option1">Λύκειο</MenuItem>
                        <MenuItem value="option2">Προπτυχιακό</MenuItem>
                        <MenuItem value="option3">Μεταπτυχιακό</MenuItem>
                    </Select>
                )}
                />
                <FormHelperText>{errors.studies?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.experience}>
                <Controller
                name="experience"
                control={control}
                defaultValue=""
                rules={{ required: "Περιγραφή εμπειρίας είναι υποχρεωτική",}}
                render={({ field }) => (
                    <TextField {...field} label="Περιγραφή εμπειρίας" variant="outlined" error={!!errors.experience}/>
                )}
                />
                <FormHelperText>{errors.experience?.message}</FormHelperText>
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

export default RegisterSitter;
