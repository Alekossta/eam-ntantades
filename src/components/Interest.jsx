import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Interest({interest, canEdit})
{
    const navigate = useNavigate();

    const editButtonClicked = () => {
        navigate("/parent/interest/edit/" + interest.id);
    }

    return <Card sx={{width: "50%"}}>
        <CardHeader title="Ενδιαφέρον"/>
        <CardContent>
            <Typography>
              Περιγραφή: {interest.description}  
            </Typography>
        </CardContent>
        {canEdit && <CardActions
        sx={{
          justifyContent: "flex-end", // Aligns the buttons to the right
        }}
        >
            <Button size="medium" variant="contained" color="secondary" onClick={editButtonClicked}>
                Edit
            </Button>
        </CardActions>}
    </Card>
}