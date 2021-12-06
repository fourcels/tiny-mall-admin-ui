import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { zhCN } from '@mui/material/locale';

// Create a theme instance.
const theme = createTheme(
    {
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    },
    zhCN,
);

export default theme;