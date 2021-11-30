import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme(
    {
        palette: {
            background: {
                default: grey[100]
            }
        }
    }
);

export default theme;