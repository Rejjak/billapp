import React,{useContext,useEffect,useState} from "react";
import {Box,Grid,Typography,makeStyles,Card,CardContent,TextField,Button,Avatar} from '@material-ui/core';
import {useNavigate} from 'react-router-dom'
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';
import ToastErr from '../common/toastErr';
import RequestService from '../../service/requestService';

const Login = ()=> {
    const {settingsData,updateSettngs,updateLogin,mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const classes = Styles();
    const commonClass = commonStyles();
    const appSettings = settingsData[0];
    const [showHint,setHint] = useState(0);
    const [pass,setPass] = useState('');
    const [showToast,setShowToast] = useState('');
    const [newPass,setNewPass] = useState('');
    const [conPass,setConPass] = useState('');
    const [passHint,setPassHint] = useState('');

    const getSettings = ()=> {
        let payload = {
            req_url : 'settings-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            updateSettngs(res);
            console.log(res[0].pass_created)
        }).catch((err)=>{
            console.log(err);
        });
    }

    useEffect(()=>{
        getSettings();
        RequestService.onRequest('update-progress',()=>{});
    },[]);

    const finalLogin = ()=> {
        localStorage.setItem('last_login',new Date().toISOString())
        setHint(0);
        updateLogin(true);
        navigate('/dashboard');
    }

    const doLogin = (event) => {
        event.preventDefault();
        if(appSettings.password == pass){
            finalLogin();
        }else{
            setHint((prevState)=>prevState+1);
            if(showHint > 99){
                setShowToast('Your password is: '+appSettings.password);
            }else{
                setShowToast('Invalid password');
            }
        }
    }

    const createPassword = (event)=> {
        event.preventDefault();
        if(newPass != ''){
            if(newPass === conPass){
                let payload = {
                    req_url : 'settings-update',
                    data : {
                        password : newPass,
                        pass_hint : passHint,
                        pass_created : 1
                    }
                }
                RequestService.addRequest(payload).then((res)=>{
                    finalLogin();
                }).catch((err)=>{
                    console.log(err);
                }); 
            }else{
                setShowToast('Password missmatch!');
            }
        }else{
            setShowToast('Password should be at least 5 characters of lenght!');
        }
    }

    const handleClose = React.useCallback((event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        if(showToast != ''){
            setShowToast('');
        }
    },[showToast])

    return (
        <Grid container justifyContent="center">
            <ToastErr handleClose={handleClose} open={showToast != ''} title={showToast}/>
            {
                appSettings != undefined &&
                <Grid item xs={12} sm={3}>
                {
                    (appSettings?.pass_created && Number(appSettings.pass_created) === 1) ?
                    <Card className={classes.card}>
                        <Box className={classes.card_title_header} style={{backgroundColor:mode === 'dark' ? '#1E64AE' : null}}>
                            <Typography className={classes.card_title_text}>Login</Typography>
                        </Box>
                        <CardContent>
                            {
                                appSettings?.own_dp != '' &&
                                <Box mt={2} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Avatar style={{height:60,width:60,borderRadius:30}} src={appSettings?.own_dp}/>
                                </Box>
                            }
                            {
                                appSettings?.own_name != '' &&
                                <Typography className={classes.card_title_text_app_act}>{String(appSettings?.own_name).split(' ')[0]}</Typography>
                            }
                            <form onSubmit={doLogin}>
                                <Box mt={4}>
                                    <TextField type={'password'} color={'secondary'} placeholder={'Password'} onChange={(e)=>setPass(e.target.value)} fullWidth inputProps={{style:{fontSize: 17}}} />
                                    {
                                        showHint > 2 && 
                                        <Box mt={1}>
                                            <span style={{color:'red',fontSize:15}}>{'Your password hint is : '+appSettings.pass_hint}</span>
                                        </Box>
                                    }
                                </Box>
                                <Box mt={2}>
                                    <Grid container style={{justifyContent:'flex-end'}}>
                                        <Button color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Submit</Button>
                                    </Grid>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>:
                    <Card className={classes.card}>
                        <Box className={classes.card_title_header} style={{backgroundColor:mode === 'dark' ? '#1E64AE' : null}}>
                            <Typography className={classes.card_title_text}>Create password</Typography>
                        </Box>
                        <CardContent>
                            <form onSubmit={createPassword}>
                                <Box mt={2}>
                                    <TextField type={'password'} color={'secondary'} label={'New password'} onChange={(e)=>setNewPass(e.target.value)} fullWidth inputProps={{style:{fontSize:17}}} />
                                </Box>
                                <Box mt={2}>
                                    <TextField type={'password'} color={'secondary'} label={'Confirm password'} onChange={(e)=>setConPass(e.target.value)} fullWidth inputProps={{style:{fontSize:17}}} />
                                </Box>
                                <Box mt={2}>
                                    <TextField type={'text'} color={'secondary'} label={'Password hint'} onChange={(e)=>setPassHint(e.target.value)} fullWidth inputProps={{style:{fontSize:17}}} />
                                </Box>
                                <Box mt={2}>
                                    <Grid container style={{justifyContent:'flex-end'}}>
                                        <Button color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Submit</Button>
                                    </Grid>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                }
            </Grid>
            }
            <Box style={{position:'absolute',height:60,width:'100%',bottom:0,alignItems:'center',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <Typography variant={'caption'} color="inherit">
                Copyright &copy; {new Date().getFullYear()} Binamate
                </Typography>
                <Typography variant="caption" color="inherit">
                Maintained & developed by Rejjak Ali
                </Typography>
            </Box>
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
        marginTop: '15px',
        fontWeight:'bold',
        fontFamily:'Verdana, Geneva, Tahoma, sans-serif',
        textAlign:'center',
        color:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
    },
    card:{
        marginTop:'5%',
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