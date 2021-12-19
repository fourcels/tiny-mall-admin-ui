import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <MuiLink color="inherit" href="https://fourcels.com/">
                fourcels
            </MuiLink>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}