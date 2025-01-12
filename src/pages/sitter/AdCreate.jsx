import {
    Box,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    FormHelperText,
    Select,
    MenuItem,
    Button,
    TextField,
    FormLabel,
    Snackbar,
    Alert
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from "react";
import { db } from "../../firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useAppCtx } from "../../appCtx";
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

function processWorkSchedule(schedule) {
    // Mapping Greek keys to their English counterparts
    const dayTranslations = {
      'Δευτέρα': 'monday',
      'Τρίτη': 'tuesday',
      'Τετάρτη': 'wednesday',
      'Πέμπτη': 'thursday',
      'Παρασκευή': 'friday',
      'Σάββατο': 'saturday',
      'Κυριακή': 'sunday',
    };
  
    const translatedSchedule = {};
  
    // Loop through the keys of the input object
    for (const [key, value] of Object.entries(schedule)) {
      if (dayTranslations[key]) {
        // Check if startTime and endTime are defined
        if (value.startTime !== undefined && value.endTime !== undefined) {
          // Translate the day key and retain the values
          translatedSchedule[dayTranslations[key]] = value;
        }
      } else {
        // For non-day keys, just copy them as-is
        translatedSchedule[key.toLowerCase()] = value;
      }
    }
  
    return translatedSchedule;
}

export default function AdCreate()
{
    const {user} = useAppCtx();

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try
        {
            const processedData = processWorkSchedule(data);
    
            // Check if the processed object contains any days
            const dayKeys = Object.keys(processedData).filter((key) =>
                ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(key)
            );
        
            if (dayKeys.length === 0) {
                setErrorMessage("You must fill out at least one day's schedule.");
                setSnackbarOpen(true);
                return; // Prevent form submission
            }
        
            for (const day in processedData) {
                if (processedData[day].startTime && processedData[day].endTime) {
                    processedData[day].startTime = Timestamp.fromDate(processedData[day].startTime.toDate()); // Assuming you're using dayjs or moment
                    processedData[day].endTime = Timestamp.fromDate(processedData[day].endTime.toDate());
                }
            }
    
            await addDoc(collection(db, "ads"), {owner: user.uid, ...processedData});

            navigate("/sitter/ads");
        } 
        catch(e)
        {
            console.log(e);
        }
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return <Box>
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
            <CardHeader title="Δημιούργησε Αγγελία" />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth margin="normal" error={!!errors.workType}>
                        <InputLabel>Τύπος Απασχόλησης</InputLabel>
                        <Controller
                            control={control}
                            name="workType"
                            rules={{
                                required: "Ο τύπος απασχόλησης είναι υποχρεωτικός",
                            }}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                labelId="option-select-label"
                                value={value || ""}
                                onChange={onChange}
                                label="Τύπος Απασχόλησης"
                                >
                                    <MenuItem value="partime">Μερική</MenuItem>
                                    <MenuItem value="fulltime">Πλήρης</MenuItem>
                                </Select>
                            )}
                        />
                        <FormHelperText>{errors.workType?.message}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth margin="normal" error={!!errors.location}>
                        <Controller
                            name="location"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Τοποθεσία είναι υποχρεωτική",}}
                            render={({ field }) => (
                                <TextField {...field} label="Τοποθεσία" variant="outlined" error={!!errors.location}
                                />
                            )}
                        />
                        <FormHelperText>{errors.location?.message}</FormHelperText>
                    </FormControl>
                    
                    {days.map((el) => {
                        return (
                            <FormControl fullWidth margin="normal" key={el} error={!!errors[el]?.startTime ||
                                !!errors[el]?.endTime
                            }>
                                <FormLabel component="legend">{el}</FormLabel>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: 0,
                                        marginY: 2,
                                    }}
                                >
                                    {/* Start Time Controller */}
                                    <Controller
                                        name={`${el}.startTime`}
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                const endTime = getValues(`${el}.endTime`);
                                                if (!value || !endTime) return true; // Skip validation if any field is empty
                                                return value.isBefore(endTime) || 'Start time must be before end time';
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TimePicker
                                            {...field}
                                            renderInput={(params) => (
                                              <TextField {...params} error={!!errors[el]?.startTime} helperText={errors[el]?.startTime?.messsage} />
                                            )}
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                          />
                                        )}
                                    />

                                    {/* End Time Controller */}
                                    <Controller
                                        name={`${el}.endTime`}
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                const startTime = getValues(`${el}.startTime`);
                                                if (!value || !startTime) return true; // Skip validation if any field is empty
                                                return startTime.isBefore(value) || 'End time must be after start time';
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <TimePicker
                                                    {...field}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    label="Τέλος"
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={!!errors?.[day]?.endTime}
                                                            helperText={errors?.[day]?.endTime?.message}
                                                        />
                                                    )}
                                                />
                                            </>
                                        )}
                                    />
                                </Box>
                                <FormHelperText>{errors[el]?.startTime?.message}</FormHelperText>
                            </FormControl>
                        );
                    })}

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
    </Box>
}