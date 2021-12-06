import { AppBar, Box, IconButton, Toolbar, Typography, Container, Breadcrumbs } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/router';

export default function PageLayout(props) {
    const router = useRouter()
    const {
        title,
        children
    } = props
    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{ mr: 2 }}
                        onClick={() => router.back()}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{ p: 3 }}>
                <Toolbar />
                {children}
            </Container>
        </Box>
    )
}