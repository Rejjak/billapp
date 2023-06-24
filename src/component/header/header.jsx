import React,{useContext} from 'react';
import {AppBar,Typography, Toolbar, Hidden, IconButton} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import HeaderIcon from './headerIcon';
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';

function HeaderComponent({handleClick,isLogin}) {
    const {settingsData} = useContext(ColorModeContext);
    const classes = commonStyles();
    const appSettings = settingsData[0];
    return (
        <AppBar elevation={0} position={'fixed'}>
            <Toolbar className={classes.toolbar}>
                <Typography style={{
                    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                    fontWeight:'bold',
                }} variant={'h6'}>{appSettings?.com_name}</Typography>
                {
                    isLogin &&
                    <Hidden smDown>
                        <HeaderIcon/>
                    </Hidden>
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