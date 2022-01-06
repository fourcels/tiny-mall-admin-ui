import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

export default function Loading(props) {
    const {
        size = 40,
        ...rest
    } = props
    return (
        <Box textAlign="center" {...rest}>
            <CircularProgress size={size} />
        </Box>
    )
}