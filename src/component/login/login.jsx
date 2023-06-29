import React,{useContext,useEffect,useState} from "react";
import {Box,Grid,Typography,makeStyles,Card,CardContent,TextField,Button} from '@material-ui/core';
import {useNavigate} from 'react-router-dom'
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';
import ToastErr from '../common/toastErr';
import RequestService from '../../service/requestService';

const Login = ()=> {
    const {settingsData,updateSettngs,updateLogin} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const classes = Styles();
    const commonClass = commonStyles();
    const appSettings = settingsData[0];
    const [showHint,setHint] = useState(0);
    const [pass,setPass] = useState('');
    const [showToast,setShowToast] = useState('');

    const getSettings = ()=> {
        let payload = {
            req_url : 'settings-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            updateSettngs(res);
            console.log(res)
        }).catch((err)=>{
            console.log(err);
        });
    }

    useEffect(()=>{
        getSettings();
        RequestService.onRequest('update-progress',()=>{});
    },[]);

    const doLogin = (event) => {
        event.preventDefault();
        if(appSettings.password == pass){
            setHint(0);
            updateLogin(true);
            navigate('/dashboard');
        }else{
            setHint((prevState)=>prevState+1);
            if(showHint > 99){
                setShowToast('Your password is: '+appSettings.password);
            }else{
                setShowToast('Invalid password');
            }
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        if(showToast != ''){
            setShowToast('');
        }
    }

    return (
        <Grid container justifyContent="center">
            <ToastErr handleClose={handleClose} open={showToast != ''} title={showToast}/>
            <Grid item xs={12} sm={4}>
                <Card className={classes.card}>
                    <Box className={classes.card_title_header}>
                        <Typography className={classes.card_title_text}>Login</Typography>
                    </Box>
                    <CardContent>
                        <form onSubmit={doLogin}>
                            <Box mt={4}>
                                <TextField type={'text'} color={'secondary'} placeholder={'Password'} onChange={(e)=>setPass(e.target.value)} fullWidth inputProps={{style:{fontSize:17}}} />
                                {
                                    showHint > 2 && 
                                    <Box mt={1}>
                                        <span style={{color:'red',fontSize:15}}>{'Your password hint is : '+appSettings.pass_hint}</span>
                                    </Box>
                                }
                            </Box>
                            <Box mt={2}>
                                <Grid container style={{justifyContent:'flex-end'}}>
                                    <Button color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Login</Button>
                                </Grid>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

const Styles = makeStyles((theme)=>({
    card_title_header : {
        height:'40px',
        backgroundColor:theme.palette.primary.main,
        alignItems:'center',
        display:'flex',
        paddingLeft:'16px'
    },
    card_title_text : {
        fontSize : '15px',
        fontWeight:'bold',
        fontFamily:'Verdana, Geneva, Tahoma, sans-serif',
        color:'#FFFFFF'
    },
    card_title_text_app : {
        fontSize : '20px',
        marginTop: '10px',
        fontWeight:'bold',
        fontFamily:'Verdana, Geneva, Tahoma, sans-serif'
    },
    card_title_text_app_act : {
        fontSize : '20px',
        marginTop: '10px',
        fontWeight:'bold',
        fontFamily:'Verdana, Geneva, Tahoma, sans-serif',
        color:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
    },
    card:{
        marginTop:'30%',
        borderRadius:'8px',
        ...(theme.palette.type === 'dark') ? {
            border : '1px solid #1E4976',
            backgroundColor:theme.palette.cardBackground,
        }:{
            border : '1px solid #fff',
        }
    }
}))


export default Login;