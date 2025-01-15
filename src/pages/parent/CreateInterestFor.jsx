import { Box, Button, Card, CardContent, CardHeader, FormControl, FormHelperText, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Ad from "../../components/Ad";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Controller, useForm } from "react-hook-form";
import { useAppCtx } from "../../appCtx";

export default function CreateInterestFor()
{
    const {id} = useParams();
    const [ad, setAd] = useState();

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const {user} = useAppCtx();

    const navigate = useNavigate();

    useEffect(() => {

        const fetchAd = async () => {
            try
            {
                const fetchedAd = await getDoc(doc(db, "ads", id));
                setAd({id: fetchedAd.id, ...(fetchedAd.data())});
            }
            catch(e)
            {
                console.log(e);
            }
        }

        fetchAd();
    }, [])

    const onSubmit = async (data, isPublished) => {
        await addDoc(collection(db, "interests"), {proposer: user.uid, signatures: {proposer: false, recipient: false}, state: "standby", recipient: ad.owner, ad: ad.id,isPublished,  ...data});
        navigate("/parent/interests");
    }

    return <Box sx={{display:"flex", flexDirection: "column", alignItems: "center"}}>
        <Typography variant="h2">
            Ενδιαφέρον για:
        </Typography>
        {ad && <Ad ad={ad}/>}
        <Card sx={{width: "50%"}}>
            <CardHeader title="Δήλωση ενδιαφερόντος"/>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth margin="normal" error={!!errors.description}>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Περιγραφή είναι υποχρεωτική",}}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Περιγραφή"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    error={!!errors.family}
                                />
                            )}
                        />
                        <FormHelperText>{errors.description?.message}</FormHelperText>
                    </FormControl>
                    <Box display="flex" gap="16px" marginTop="16px">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit((data) => onSubmit(data, true))}
                        >
                            ΔΗΛΩΣΗ
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={handleSubmit((data) => onSubmit(data, false))}
                        >
                            ΑΠΟΘΗΚΕΥΣΗ
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    </Box>
}