import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React, { useEffect } from 'react';
import { mainListItems, secondaryListItems } from './listItems';
import Image from 'next/image'
import { useMediaQuery } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main')(
    ({ theme, }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1, 0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

export default function Layout({ children, title }) {
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        matches ? handleDrawerOpen() : handleDrawerClose()
    }, [matches])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" open={matches}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(matches && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant={matches ? 'permanent' : 'temporary'}
                anchor="left"
                open={open}
                onClose={handleDrawerClose}
            >
                <DrawerHeader>
                    <Image src="/logo.svg" height={40} width={40} />
                </DrawerHeader>
                <Divider />
                {mainListItems}
                <Divider />
                {secondaryListItems}
            </Drawer>
            <Main>
                <DrawerHeader />
                {children}
            </Main>
        </Box>
    );
}