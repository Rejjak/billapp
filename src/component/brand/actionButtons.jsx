import React,{useEffect,useState, useCallback} from 'react';
import {Box,Grid,IconButton,ListItem, makeStyles,Menu} from '@material-ui/core';
import {MoreVert, Edit, Delete, Visibility} from '@material-ui/icons';
import StyledMenu from '../common/styleMenu';

const ActionButtons = ({onEdit,onDelete,onView}) => {
    const classes = Styles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [winWidth, setWinWidth] = useState(0);
    const open = Boolean(anchorEl);

    useEffect(()=>{
        window.addEventListener('resize', autoResize);
        return ()=> {
            window.removeEventListener('resize',autoResize);
            console.log('removed');
        }
    },[])
    
    const updateDeviceWidth = useCallback(()=>{
        setWinWidth(window.innerWidth);
    },[]);

    const autoResize = ()=> {
        updateDeviceWidth();
        if(winWidth != window.innerWidth){
            handleClose(null);
        }
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    },[]);

    const editClick = useCallback(() => {
        setAnchorEl(null);
        onEdit();
    });

    const deleteClick = useCallback(() => {
        setAnchorEl(null);
        onDelete();
    });

    const viewClick = useCallback(() => {
        setAnchorEl(null);
        onView();
    });

    return (
        <Grid container style={{justifyContent:'right'}}>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                >
                <ListItem style={{cursor:'pointer'}} onClick={editClick}>
                    <Edit style={{marginRight:8, fontSize:15}} />
                    Edit
                </ListItem>
                <ListItem style={{cursor:'pointer'}} onClick={deleteClick}>
                    <Delete style={{marginRight:8, fontSize:15}} />
                    Delete
                </ListItem>
                {
                    onView != undefined &&
                    <ListItem style={{cursor:'pointer'}} onClick={viewClick}>
                        <Visibility style={{marginRight:8, fontSize:15}} />
                        Details
                    </ListItem>
                }
            </StyledMenu>
            <Box className={classes.action_bar}>
                <IconButton id="demo-customized-menu" onClick={(e)=>handleClick(e)} className={classes.iconColor} size={'small'}>
                    <MoreVert style={{fontSize:12}}/>
                </IconButton>
            </Box>
        </Grid>
    )
}


const Styles = makeStyles((theme)=>({
    iconColor:{
        color : (theme.palette.type === 'dark') ? '#ccc' : 'rgba(0,0,0,0.5)',
        position:'relative',
        bottom:3
    },
    action_bar:{
        display:'none',
        justifyContent:'space-around',
        alignItems:'center',
        padding:0,
        position:'absolute'
    }
}))

export default ActionButtons;