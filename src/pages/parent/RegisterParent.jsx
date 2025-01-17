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
  Typography,
  FormHelperText,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  Box,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // Import Firebase modules
import { setDoc, doc } from "firebase/firestore";
import { DatePicker } from "@mui/x-date-pickers";
import { useDropzone } from 'react-dropzone';
import { useNavigate } from "react-router-dom";

const RegisterParent = () => {
const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    } = useForm();

    // States for the two drag-and-drop fields
    const profilePhoto = watch("profilePhoto", null); // Profile photo

    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate();

    // Handlers for drop zones
    const onDropProfilePhoto = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Only one file for profile photo
        setValue("profilePhoto", file); // Update form state
    };

    const profilePhotoDropzone = useDropzone({
        onDrop: onDropProfilePhoto,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"], // Only allow images
        },
        maxFiles: 1, // Allow only one file
    });

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const onSubmit = async (data) => {
        console.log(data);
        // Process form submission
        try {
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )
            const user = userCredentials.user;

            // Convert dateBirth to a Firestore-compatible format (Date object or ISO string)
            const formattedDateBirth = data.dateBirth
            ? new Date(data.dateBirth) // Convert to Date object
            : null;

            const formattedExpireDate = data.expirationDate
            ? new Date(data.expirationDate) // Convert to Date object
            : null;
            
            // Save additional user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                phone: data.phone || "",
                dateBirth: formattedDateBirth,
                email: data.email,
                gender: data.gender || "",
                afm: data.afm || "",
                parent:
                {
                    family: data.family || "",
                },
                paymentInfo:
                {
                    voucher: data.voucher,
                    cardNumber: data.cardNumber,
                    cardCvv: data.cvv,
                    expirationDate: formattedExpireDate
                }
            });

            navigate("/");
        } catch (error) {
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
        <Card style={{ width: "40%", margin: "20px auto", padding: "10px" }}>
            <CardHeader title="Πληροφορίες Γονέα" />
            <CardContent sx={{display:"flex", flexDirection: "column", gap: "1rem"}}>
                <Typography variant="h6">
                    Εγγραφή στην πλατφόρμα
                </Typography>
                <Typography>
                    Για να εγραφείτε στην πλατφόρμα το μόνο που έχετε να κάνετε είναι να συμπληρώστε όλα τα πεδία
                    στην παρακάτω φόρμα
                </Typography>
                <Typography variant="h6">
                    Λειτουργίες που προσφέρονται σε γονείς
                </Typography>
                <List sx={{padding: 0}}>
                    <ListItem sx={{padding: 0}}>
                        <ListItemText primary="- Αναζήτηση αγγελιών" />
                    </ListItem>
                    <ListItem sx={{padding: 0}}>
                        <ListItemText primary="- Δήλωση ενδιαφέροντος σε αγγελία" />
                    </ListItem>
                    <ListItem sx={{padding: 0}}>
                        <ListItemText primary="- Υπογραφή συμφωνητικού (εφόσον υπογράφει και η νταντά)" />
                    </ListItem>
                    <ListItem sx={{padding: 0}}>
                        <ListItemText primary="- Μηνιαία αυτόματη πληρωμή" />
                    </ListItem>
                    <ListItem sx={{padding: 0}}>
                        <ListItemText primary="- Λήξη συνεργασίας και αξιολόγηση νταντάς" />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
        <Card style={{ width: "40%", margin: "20px auto", padding: "10px" }}>
        <CardHeader title="Εγγραφή Γονέα" />
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth margin="normal" error={!!errors.profilePhoto}>
                    <Typography variant="subtitle1" gutterBottom>
                        Ανέβασε φωτογραφία προφίλ
                    </Typography>
                    <Controller
                        name="profilePhoto"
                        control={control}
                        defaultValue={null}
                        rules={{
                        required: "Η φωτογραφία είναι υποχρεωτική",
                        }}
                        render={({ field }) => (
                        <Box
                            {...profilePhotoDropzone.getRootProps()}
                            sx={{
                            border: "2px dashed",
                            borderColor: profilePhotoDropzone.isDragActive
                                ? "primary.main"
                                : "grey.500",
                            borderRadius: 1,
                            padding: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            bgcolor: profilePhotoDropzone.isDragActive
                                ? "grey.100"
                                : "background.paper",
                            }}
                        >
                            <input {...profilePhotoDropzone.getInputProps()} />
                            <Typography>
                            {profilePhoto
                                ? `Επιλεγμένο αρχείο: ${profilePhoto.name}`
                                : "Ανέβασε φωτογραφία (JPG, PNG)"}
                            </Typography>
                        </Box>
                        )}
                    />
                    <FormHelperText>{errors.profilePhoto?.message}</FormHelperText>
                </FormControl>
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
                                format="DD/MM/YYYY"
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
                            <MenuItem value="male">Άνδρας</MenuItem>
                            <MenuItem value="female">Γυναίκα</MenuItem>
                            <MenuItem value="other">Άλλο</MenuItem>
                        </Select>
                    )}
                    />
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.family}>
                    <Controller
                    name="family"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Περιγραφή οικογενείας είναι υποχρεωτική",}}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        label="Περιγραφή οικογενείας"
                        variant="outlined"
                        multiline
                        rows={4}
                        error={!!errors.family}
                    />
                    )}
                    />
                    <FormHelperText>{errors.family?.message}</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.voucher}>
                    <Controller
                        name="voucher"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                        <TextField
                            {...field}
                            label="Voucher"
                            variant="outlined"
                            error={!!errors.voucher}
                        />
                        )}
                    />
                    <FormHelperText>{errors.voucher?.message}</FormHelperText>
                </FormControl>

                    {/* Card Number Input */}
                    <FormControl fullWidth margin="normal" error={!!errors.cardNumber}>
                    <Controller
                    name="cardNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Το νούμερο κάρτας είναι υποχρεωτικό",
                        pattern: {
                            value: /^[0-9]*$/,
                            message: "Επιτρέπονται μόνο αριθμοι",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field} 
                            type="number" 
                            label="Νούμερο πιστωτικής κάρτας" 
                            variant="outlined" 
                            error={!!errors.cardNumber}
                        />
                    )}
                    />
                    <FormHelperText>{errors.cardNumber?.message}</FormHelperText>
                </FormControl>

                    {/* CVV Input */}
                    <FormControl fullWidth margin="normal" error={!!errors.cvv}>
                    <Controller
                    name="cvv"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Το CVV είναι υποχρεωτικό",
                        pattern: {
                            value: /^[0-9]*$/,
                            message: "Επιτρέπονται μόνο αριθμοι",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field} 
                            type="number" 
                            label="CVV πιστωτικής κάρτας" 
                            variant="outlined" 
                            error={!!errors.cvv}
                        />
                    )}
                    />
                    <FormHelperText>{errors.cvv?.message}</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.expirationDate}>
                    <Controller
                        name="expirationDate"
                        control={control}
                        rules={{ required: "Expiration date is required" }}
                        render={({ field }) => (
                        <DatePicker
                            {...field}
                            onChange={(date) => field.onChange(date)}
                            value={field.value}
                            label="Ημερομήνια λήξης πιστωτικής κάρτας"
                            format="MM/YYYY"
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                error={!!errors.expirationDate}
                                helperText={errors.expirationDate?.message || ""}
                                variant="outlined"
                            />
                            )}
                        />
                        )}
                    />
                    <FormHelperText>{errors.expirationDate?.message}</FormHelperText>
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

export default RegisterParent;
