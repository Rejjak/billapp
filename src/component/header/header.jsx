import React,{useContext,useState,useEffect} from 'react';
import {AppBar,Typography, Toolbar, Hidden, IconButton} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import HeaderIcon from './headerIcon';
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';

function HeaderComponent({handleClick,isLogin}) {
    const {settingsData,mode} = useContext(ColorModeContext);
    const [lastLogin,setLastLogin] = useState(null);
    const classes = commonStyles();
    const appSettings = settingsData[0];
    
    const checkLastLogin = ()=> {
        const login_date = localStorage.getItem('last_login');
        if(login_date != null){
            const formattedDateTime = new Date(login_date).toLocaleString('en-US', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
            setLastLogin(formattedDateTime); 
        }
    }

    useEffect(()=> {
        checkLastLogin();
    },[]);

    return (
        <AppBar elevation={0} position={'fixed'} style={{backgroundColor:(mode == 'dark' && !isLogin) ? '#1E64AE' : null}}>
            <Toolbar className={classes.toolbar}>
                <Typography style={{
                    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                    fontWeight:'bold',
                }} variant={'h6'}>{appSettings?.com_name}</Typography>
                {
                    isLogin ?
                    <Hidden smDown>
                        <HeaderIcon/>
                    </Hidden>:
                    lastLogin != null ?
                    <Typography variant={'caption'}>Last Login : {lastLogin}</Typography>:null
                }
                <Hidden mdUp>
                    <IconButton onClick={handleClick} color={'inherit'}>
                        <Menu/>
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderComponent;