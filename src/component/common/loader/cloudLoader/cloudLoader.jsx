import React from "react";
import {Box,Grid,Typography,makeStyles,Card,CardContent,TextField,Button,FormControlLabel,LinearProgress,RadioGroup} from '@material-ui/core';
import {Check,Clear,Done,CheckCircle,Cancel,CheckCircleOutline,Airplay,Backup} from '@material-ui/icons';
import './cloudLoader.css';

const CloudLoader = ()=> {
    const classes = Styles();
    return (
        <Box>
            <Grid container justifyContent={'center'}>
                <Box className={classes.loader}>
                    <Box className={classes.halfEgg}/>
                </Box>
                <Box className={classes.halfEggNext}>
                    <Box style={{position:'relative',left:-10}}>
                        <Airplay className={classes.iconColorSubActive}/>
                    </Box>
                    <Typography style={{marginTop:5}} variant={'subtitle2'}>Restoring...</Typography> 
                    <Box style={{position:'relative',right:-10}}>
                        <Backup className={classes.iconColorSubActive}/>
                    </Box>
                </Box>
            </Grid>
        </Box>
    )
}


const Styles = makeStyles((theme)=>({
    iconColorSubActive : {
        fontSize : '50px',
        color:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
    },
    loader : {
        width: '230px',
        height: '150px',
        borderRadius: '50%',
        animation: 'loader-rotation 2s linear infinite',
        background: `linear-gradient(90deg, ${(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main} 50%, transparent 0)`,
        backgroundSize: '20px 100%',
        //animationDirection :'reverse'
    },
    halfEgg : {
        width: '100%',
        height: '152px',
        borderRadius: '50%',
        overflow: 'hidden',
        marginTop: '5px',
        backgroundColor: theme.palette.cardBackground
    },
    halfEggNext : {
        width: '230px',
        height: '50px',
        backgroundColor: theme.palette.cardBackground,
        flexDirection:'row',
        justifyContent:'space-between',
        display:'flex',
        alignItems:'center',
        position:'absolute',
        marginTop:'40px'
    }
}))

export default CloudLoader;