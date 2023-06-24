import React,{useContext} from 'react';
import {Box, IconButton, Badge, Button, Avatar, Menu, MenuItem, List, ListItem, ListItemIcon, ListItemText,Tooltip} from '@material-ui/core';
import {NotificationsActive, Settings, Person,Power,WbSunnyOutlined,NightsStayOutlined,ShoppingBasket} from '@material-ui/icons';
import user_img from './Rejjak-Ali.png';
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';
import {NavLink} from 'react-router-dom';
function BadgeIcon(){
    const {mode,cartData} = useContext(ColorModeContext);
    return (
        <Box>
            <Tooltip title={'My bag'}>
                <NavLink to={'/bag'}>
                    <IconButton
                    color={'inherit'}>
                        <Badge overlap={'rectangular'} color={'error'} badgeContent={cartData.length}>
                            <ShoppingBasket style={{color : mode === 'light' ? '#ffffff':'#99CCF3'}}/>
                        </Badge>
                    </IconButton>
                </NavLink>
            </Tooltip>
        </Box>
    )
}


function Profile(){
    const {settingsData} = useContext(ColorModeContext);
    const classes = commonStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <Box>
            <Tooltip title={'My account'}>
                <NavLink to={'/settings'}>
                    <IconButton>
                        <Avatar className={classes.user_img} src={settingsData[0]?.own_dp}/>
                    </IconButton>
                </NavLink>
            </Tooltip>
            {/* <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            >
                <List className={classes.navList}>
                    <ListItem>
                        <ListItemText>{'My Account'}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>{'Logout'}</ListItemText>
                    </ListItem>
                </List>
            </Menu> */}
        </Box>
    )
}

function LightDarkMode(){
    const {toggleMode,mode} = useContext(ColorModeContext);
    return (
        <Box>
            <Tooltip title={mode === 'light' ? 'Turn off the light':'Turn on the light'}>
                <IconButton onClick={()=>toggleMode()}>
                    {
                        mode === 'light' ?
                        <NightsStayOutlined style={{color:'#fff'}}/>:
                        <WbSunnyOutlined style={{color:'#99CCF3'}}/>
                    }
                </IconButton>
            </Tooltip>
        </Box>
    )
}

function HeaderIcon() {
    const classes = commonStyles();
    return (
        <Box style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <BadgeIcon/>
            <Profile/>
            <LightDarkMode/>
        </Box>
    );
}

export default HeaderIcon;