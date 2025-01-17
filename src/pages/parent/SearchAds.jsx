import { Box, Typography, FormControl, InputLabel, Select, MenuItem, 
    FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import Ad from "../../components/Ad";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function SearchAds() {
const [ads, setAds] = useState([]);
const [workTypeFilter, setWorkTypeFilter] = useState("");
const [selectedDays, setSelectedDays] = useState([]);

useEffect(() => {
const fetchAds = async () => {
 try {
   const collectionRef = collection(db, "ads");
   const fieldQuery = query(collectionRef, where("isPublished", "==", true));
   const querySnapshot = await getDocs(fieldQuery);
   const docs = querySnapshot.docs.map((doc) => ({
     id: doc.id,
     ...doc.data(),
   }));
   setAds(docs);
 } catch (error) {
   console.error("Error fetching documents: ", error);
 }
};
fetchAds();
}, []);

const handleDayChange = (day) => {
setSelectedDays((prev) =>
 prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
);
};

const filteredAds = ads.filter((ad) => {
// Work type filter
if (workTypeFilter && ad.worktype !== workTypeFilter) return false;

// Days filter (e.g. if user selects Monday & Tuesday, 
// ad must have 'monday' and 'tuesday' to pass)
for (const day of selectedDays) {
 if (!ad[day]) return false; 
}
return true;
});

return (
<Box sx={{ display: "flex", width: "100%", height: "100%" }}>
 {/* Sidebar */}
 <Box sx={{ maxWidth: 300, height: "100%", p: 2, borderRight: "1px solid #ccc" }}>
   <Typography variant="h6" sx={{marginY:"1rem"}} gutterBottom>Φίλτρα</Typography>
   <FormControl fullWidth sx={{ mb: 2 }}>
     <InputLabel>Τύπος Απασχόλησης</InputLabel>
     <Select
       value={workTypeFilter}
       label="Τύπος Απασχόλησης"
       onChange={(e) => setWorkTypeFilter(e.target.value)}
     >
       <MenuItem value="">Οτιδήποτε</MenuItem>
       <MenuItem value="partime">Μερική Απασχόληση</MenuItem>
       <MenuItem value="fulltime">Πλήρης Απασχόληση</MenuItem>
     </Select>
   </FormControl>
   {/* Days checkboxes */}
   <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("monday")}
         onChange={() => handleDayChange("monday")}
       />
     }
     label="Δευτέρα"
   />
   <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("tuesday")}
         onChange={() => handleDayChange("tuesday")}
       />
     }
     label="Τρίτη"
   />
    <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("wednesday")}
         onChange={() => handleDayChange("wednesday")}
       />
     }
     label="Τετάρτη"
   />
      <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("thursday")}
         onChange={() => handleDayChange("thursday")}
       />
     }
     label="Πέμπτη"
   />
      <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("friday")}
         onChange={() => handleDayChange("friday")}
       />
     }
     label="Παρασκεύη"
   />
      <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("saturday")}
         onChange={() => handleDayChange("saturday")}
       />
     }
     label="Σάββατο"
   />
      <FormControlLabel
     control={
       <Checkbox
         checked={selectedDays.includes("sunday")}
         onChange={() => handleDayChange("sunday")}
       />
     }
     label="Κυριακή"
   />
   {/* Add more days as needed */}
 </Box>

 {/* Main content */}
 <Box
   sx={{
     flex: 1,
     display:"flex",
     flexDirection: "column",
     alignItems: "center"
   }}
 >
   <Typography variant="h2" sx={{marginTop: "2rem"}}>
     Αγγελίες
   </Typography>
   {filteredAds.map((ad) => (
     <Ad ad={ad} key={ad.id} canShowInterest={true} />
   ))}
 </Box>
</Box>
);
}
