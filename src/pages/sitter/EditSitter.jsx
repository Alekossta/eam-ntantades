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
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { DatePicker } from "@mui/x-date-pickers";
import { useDropzone } from 'react-dropzone';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppCtx } from "../../appCtx";
import dayjs from "dayjs";

const EditSitter = () => {
const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    } = useForm();

    // States for the two drag-and-drop fields
    const profilePhoto = watch("profilePhoto", null); // Profile photo
    const referenceFiles = watch("referenceFiles", []); // Reference letters

    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate();

    const {user} = useAppCtx();

    // Handlers for drop zones
    const onDropProfilePhoto = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Only one file for profile photo
        setValue("profilePhoto", file); // Update form state
    };

    const onDropReferenceFiles = (acceptedFiles) => {
    const updatedFiles = referenceFiles.concat(acceptedFiles); // Merge with existing files
        setValue("referenceFiles", updatedFiles); // Update form state
    };

    const profilePhotoDropzone = useDropzone({
        onDrop: onDropProfilePhoto,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"], // Only allow images
        },
        maxFiles: 1, // Allow only one file
    });

    const referenceFilesDropzone = useDropzone({
        onDrop: onDropReferenceFiles,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"], // Allow images
            "application/pdf": [".pdf"], // Allow PDFs
        },
    });

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const getUser = async () => 
        {
            try 
            {
                // Reference the document in Firestore
                const sitterDocRef = doc(db, "users", user.uid);
            
                // Fetch the document
                const sitterDoc = await getDoc(sitterDocRef);
            
                if (sitterDoc.exists()) {
                    // Document data
                    const data = sitterDoc.data();
                    setValue("firstName", data.firstName);
                    setValue("lastName", data.lastName);
                    setValue("afm", data.afm);
                    setValue("phone", data.phone);

                    // Convert to milliseconds
                    const milliseconds = data.dateBirth.seconds * 1000;
                    // Create a Day.js object
                    const dayjsObject = dayjs(milliseconds);
                    setValue("dateBirth", dayjsObject);

                    setValue("gender", data.gender);
                    setValue("studies", data.sitter.studies);
                    setValue("experience", data.sitter.experience);

                    return data;
                } else {
                    console.log("No such document!");
                    return null;
                }
            } 
            catch (error) 
            {
                console.error("Error fetching document:", error);
                throw error;
            }
        }

        getUser();
    }, [])

    const onSubmit = async (data) => {
        try {
            // Convert dateBirth to a Firestore-compatible format (Date object or ISO string)
            const formattedDateBirth = data.dateBirth
            ? new Date(data.dateBirth) // Convert to Date object
            : null;

            const referenceFileCount = data.referenceFiles?.length || 0;
            
            // Save additional user info in Firestore
            await updateDoc(doc(db, "users", user.uid), {
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                phone: data.phone || "",
                dateBirth: formattedDateBirth,
                gender: data.gender || "",
                studies: data.studies || "",
                experience: data.experience || "",
                afm: data.afm || "",
                referenceFiles: referenceFileCount,
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
        <Card style={{ maxWidth: 600, margin: "20px auto", padding: "10px" }}>
        <CardHeader title="Ενήμερωση Προφίλ Νταντάς" />
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth margin="normal" error={!!errors.profilePhoto}>
                    <Typography variant="subtitle1" gutterBottom>
                        Ανέβασε νεα φωτογραφία προφίλ
                    </Typography>
                    <Controller
                        name="profilePhoto"
                        control={control}
                        defaultValue={null}
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
                            <MenuItem value="highSchool">Λύκειο</MenuItem>
                            <MenuItem value="underGraduate">Προπτυχιακό</MenuItem>
                            <MenuItem value="postGraduate">Μεταπτυχιακό</MenuItem>
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
                        <TextField
                        {...field}
                        label="Περιγραφή εμπειρίας"
                        variant="outlined"
                        multiline
                        rows={4}
                        error={!!errors.experience}
                    />
                    )}
                    />
                    <FormHelperText>{errors.experience?.message}</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <Typography variant="subtitle1" gutterBottom>
                        Ανέβασε συστατικές επιστολές
                    </Typography>
                    <Controller
                        name="referenceFiles"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                        <Box
                            {...referenceFilesDropzone.getRootProps()}
                            sx={{
                            border: "2px dashed",
                            borderColor: referenceFilesDropzone.isDragActive
                                ? "primary.main"
                                : "grey.500",
                            borderRadius: 1,
                            padding: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            bgcolor: referenceFilesDropzone.isDragActive
                                ? "grey.100"
                                : "background.paper",
                            }}
                        >
                            <input {...referenceFilesDropzone.getInputProps()} />
                            <Typography>
                            {referenceFiles.length > 0
                                ? `${referenceFiles.length} αρχεία επιλεγμένα`
                                : "Ανέβασε ή σείρε αρχεία εδώ (JPG, PNG, PDF)"}
                            </Typography>
                        </Box>
                        )}
                    />
                    <List>
                        {referenceFiles.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={file.name} />
                        </ListItem>
                        ))}
                    </List>
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "16px" }}
                >
                    Update
                </Button>
            </form>
        </CardContent>
        </Card>
    </>
  );
};

export default EditSitter;
