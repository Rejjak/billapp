import React,{useContext} from 'react';
import {AppBar,Typography, Toolbar, Drawer, List,ListItem, ListItemIcon, ListItemText, Hidden,Grid} from '@material-ui/core';
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';
import {NotificationsActive, Settings, Person,Power,Dashboard,Loyalty} from '@material-ui/icons';
import {NavLink} from 'react-router-dom';
function ListItemData({handleClick}){
    const classes = commonStyles();
    const listItem = [
        {
            label : 'Dashboard',
            link : '/dashboard',
            icon : <Dashboard/>
        },
        {
            label : 'Category',
            link : '/category',
            icon : <Loyalty/>
        },
        {
            label : 'Brand',
            link : '/brand',
            icon : <Loyalty/>
        },
        {
            label : 'Product',
            link : '/product',
            icon : <Person/>
        },
        {
            label : 'Sales',
            link : '/sales',
            icon : <Person/>
        },
        {
            label : 'Settings',
            link : '/settings',
            icon : <Settings/>
        },
        {
            label : 'Logout',
            link : '/',
            icon : <Power/>
        }
    ];

    const MyNavLink = React.forwardRef((props,ref) => (
        <NavLink
            ref={ref}
            {...props}
            className={({ isActive }) => `${props.className} ${isActive ? props.activeclassname : ''}`}
        >
          {props.children}
        </NavLink>
    ));

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
                <ListItemData handleClick={(e)=>{
                    if(e.target.innerHTML == 'Logout'){
                        updateLogin(false);
                    }
                }}/>
                <div style={{height:50,width:200,position:'fixed',bottom:10,alignSelf:'center',flexDirection:'row',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Power/>
                    <Typography>Logout</Typography>
                </div>
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