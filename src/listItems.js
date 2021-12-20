import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Box, ListItemButton } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';

import Link from './components/Link'

function NavItem({ href, icon, title }) {
    return (
        <ListItemButton component={Link} href={href} activeClassName="Mui-selected">
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={title} />
        </ListItemButton>
    )
}

const items = [
    { href: '/dashboard', title: '概要面板', icon: <DashboardIcon /> },
    { href: '/order', title: '订单管理', icon: <ShoppingCartIcon /> },
    { href: '/product', title: '商品管理', icon: <LayersIcon /> },
    { href: '/category', title: '分类管理', icon: <GridViewIcon /> },
    { href: '/user', title: '用户管理', icon: <PeopleIcon /> },
]

export const mainListItems = (
    <Box sx={{
        '& .Mui-selected': {
            pointerEvents: 'none'
        }
    }}>
        {items.map((item, i) => (
            <NavItem {...item} key={i} />
        ))}
    </Box>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Saved reports</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
        </ListItem>
    </div>
);