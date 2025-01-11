import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect } from "react";

const days = [
    "Δευτέρα",
    "Τρίτη",
    "Τετάρτη",
    "Πέμπτη",
    "Παρασκευή",
    "Σάββατο",
    "Κυριακή"
]

const dayTranslations = {
    'Δευτέρα': 'monday',
    'Τρίτη': 'tuesday',
    'Τετάρτη': 'wednesday',
    'Πέμπτη': 'thursday',
    'Παρασκευή': 'friday',
    'Σάββατο': 'saturday',
    'Κυριακή': 'sunday',
};

export default function Ad({ad})
{
    // useEffect(async () => {}, []);
    return (<Card sx={{width:"75%", marginY:"1rem"}}>
        <CardHeader title="Αγγελία"/>
        <CardContent>
            <Typography>
                Τοποθεσία: {ad.location} 
            </Typography>
            {days.map((el) => {
                if(ad[dayTranslations[el]])
                {
                    console.log(ad[dayTranslations[el]].endTime);
                    return <Typography>
                        {el}: {ad[dayTranslations[el]].startTime.toDate().toLocaleString()} - 
                        {ad[dayTranslations[el]].endTime.toDate().toLocaleString()}
                    </Typography>
                }
            })}
        </CardContent>
    </Card>)
}