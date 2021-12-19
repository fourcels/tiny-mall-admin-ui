import { Box, CircularProgress } from '@mui/material'

export default function Loading(props) {
    const {
        ...rest
    } = props
    return (
        <Box display="flex" alignItems="center" justifyContent="center" {...rest}>
            <CircularProgress />
        </Box>
    )
}