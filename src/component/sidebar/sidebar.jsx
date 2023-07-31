import React,{useContext} from 'react';
import {AppBar,Typography, Toolbar, Drawer, List,ListItem, ListItemIcon, ListItemText, Hidden,Grid, Box} from '@material-ui/core';
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';
import {NotificationsActive, Settings, Person,Power,Dashboard,Loyalty,PowerSettingsNew, Category, Receipt, Dvr, Layers} from '@material-ui/icons';
import {NavLink} from 'react-router-dom';

const MyNavLink = React.forwardRef((props,ref) => (
    <NavLink
        ref={ref}
        {...props}
        className={({ isActive }) => `${props.className} ${isActive ? props.activeclassname : ''}`}
    >
      {props.children}
    </NavLink>
));

function ListItemData({handleClick}){
    const classes = commonStyles();
    const listItem = [
        {
            label : 'Dashboard',
            link : '/dashboard',
            icon : <Dashboard/>
        },
        {
            label : 'Products',
            link : '/product',
            icon : <Layers/>
        },
        {
            label : 'Categories',
            link : '/category',
            icon : <Category/>
        },
        {
            label : 'Brands',
            link : '/brand',
            icon : <Loyalty/>
        },
        {
            label : 'Sales',
            link : '/sales',
            icon : <Receipt/>
        },
        {
            label : 'Settings',
            link : '/settings',
            icon : <Settings/>
        }
    ];

    return (
        <List>
            {
                listItem.map((ele,i)=>{
                    return (
                        <ListItem 
                        activeclassname={classes.navLinkActive}
                        onClick={handleClick}
                        end={true}
                        component={MyNavLink}
                        to={ele.link}
                        className={classes.navLink}
                        key={i}>
                            <ListItemIcon>
                                {ele.icon}
                            </ListItemIcon>
                            <ListItemText>
                                {ele.label}
                            </ListItemText>
                        </ListItem>
                    )
                })
            }
        </List>
    )
}

function Sidebar({showMobileMenu,handleClick}) {
    const {updateLogin} = useContext(ColorModeContext);
    const classes = commonStyles();
    return (
        <nav arial-label='mailbox folders'>
            <Hidden smDown implementation={'css'}>
                <Drawer
                classes={{paper:classes.drawerPaper}}
                variant={'persistent'}
                open={true}
                // onClose={}
                >
                <ListItemData/>
                <Box className={classes.logoutContainer}>
                    <ListItem 
                    activeclassname={classes.navLinkActive}
                    onClick={()=>updateLogin(false)}
                    end={true}
                    component={MyNavLink}
                    to={''}
                    className={classes.navLink}>
                        <PowerSettingsNew className={classes.logoutIconColor}/>
                        <Typography className={classes.logout}>Logout</Typography>
                    </ListItem>
                </Box>
                </Drawer>
                
            </Hidden>
            <Hidden mdUp>
                <Drawer
                classes={{paper:classes.drawerPaperMobile}}
                varient={'parmanent'}
                open={showMobileMenu}
                anchor={'left'}
                ModalProps={{
                    keepMounted:true,
                }}
                onClose={handleClick}
                >
                <ListItemData handleClick={handleClick}/>
                </Drawer>
            </Hidden>
        </nav>
    );
}

export default Sidebar;