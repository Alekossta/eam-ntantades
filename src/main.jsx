import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import theme from './theme.js'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <App />
            </ThemeProvider>
        </LocalizationProvider>
    </BrowserRouter>
)
