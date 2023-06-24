import React, { useState, useCallback, useEffect,memo,useContext,useRef } from 'react';
import {Box,Grid,Typography,makeStyles,Card,CardContent,TextField,Button,FormControlLabel,LinearProgress,RadioGroup} from '@material-ui/core';
import BpCheckbox from './checkbox';
import BpRadiobox from './radiobox';
import commonStyles from '../style/commonStyle';
import UploadBtn from './uploadBtn';
import CloudLoader from '../common/loader/cloudLoader';
import BackupBtn from './backupBtn';
import ToastErr from '../common/toastErr';
import ToastBar from '../common/toastbar';
import AppModal from '../common/modal';
import {Check,Clear,Done,CheckCircle,Cancel,CheckCircleOutline,Airplay,Backup} from '@material-ui/icons';
import RequestService from '../../service/requestService';
import FireStoreService from '../../service/firestore';
import {ColorModeContext} from '../../store';
import { useFormik } from 'formik';
import * as yup from 'yup';
import pkg from '../../../package.json';

const Settings = ()=> {
    const {updateLightTheme,lightTheme,mode,toggleMode,updateSettngs,settingsData,updateLicence,licenceData} = useContext(ColorModeContext);
    const [macAdd,setMacAdd] = useState('');
    const [dbSize,setDbSize] = useState('');
    const [linNo,setLinNo] = useState('');
    const [showToast,setShowToast] = useState('');
    const [successToast,setSuccessToast] = useState('');
    const [dbFile,setDbFile] = useState('');
    const [showModal,setModal] = useState(null);
    const appSettings = settingsData[0];
    const commonClass = commonStyles();
    const classes = Styles();

    useEffect(()=> {
        getSettings();
        getMacAdd()
    },[]);

    const activeApp = async(id)=> {
        FireStoreService.checkLicence(id).then((res)=>{
            console.log(res,'firestore data');
            if(res.status){
                updateLicence(res);
            }
        }).catch((err)=>{
            console.log(err);
        });
    }

    const changeTheme = (e)=>{
        updateLightTheme(e.target.value);
        if(mode == 'dark'){
            toggleMode();
        }
    }

    const getSettings = ()=> {
        let payload = {
            req_url : 'settings-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            console.log(res,'settings data');
            updateSettngs(res);
        }).catch((err)=>{
            console.log(err);
        });
    }

    //======================Shop Details Start===============================
    const validationSchemaCom = yup.object({
        com_name: yup.string().required(),
        com_add_one: yup.string().required(),
        com_add_two: yup.string().required(),
        com_add_three: yup.string().required()
    });

    const formikCom = useFormik({
        initialValues: {
            com_name: appSettings.com_name,
            com_add_one: appSettings.com_add_one,
            com_add_two: appSettings.com_add_two,
            com_add_three: appSettings.com_add_three
        },
        validationSchema: validationSchemaCom,
        onSubmit: (values,{resetForm}) => {
            console.log(values);
            let payload = {
                req_url : 'settings-update',
                data : {...values,com_status:1}
            }
            RequestService.addRequest(payload).then((res)=>{
                getSettings();
            }).catch((err)=>{
                console.log(err);
            });
        }
    });
    //======================Shop Details End===============================

    //======================Owner Details Start===============================
    const validationSchemaOwn = yup.object({
        own_name: yup.string().required(),
        own_email: yup.string().required(),
        own_wp: yup.string().required(),
        own_dp: yup.string().notRequired()
    });

    const formikOwn = useFormik({
        initialValues: {
            own_name: appSettings.own_name,
            own_email: appSettings.own_email,
            own_wp: appSettings.own_wp,
            own_dp: appSettings.own_dp
        },
        validationSchema: validationSchemaOwn,
        onSubmit: (values,{resetForm}) => {
            console.log(values);
            let payload = {
                req_url : 'settings-update',
                data : {...values,own_status:1}
            }
            RequestService.addRequest(payload).then((res)=>{
                getSettings();
            }).catch((err)=>{
                console.log(err);
            });
        }
    });
    //======================Owner Details End===============================

    //======================Password Details Start===============================
    const validationSchemaPass = yup.object({
        old_pass: yup.string().required(),
        new_pass: yup.string().required(),
        con_pass: yup.string().required().oneOf([yup.ref('new_pass'), null]),
        pass_hint: yup.string().required()
    });

    const formikPass = useFormik({
        initialValues: {
            old_pass: '',
            new_pass: '',
            con_pass: '',
            pass_hint: appSettings.pass_hint
        },
        validationSchema: validationSchemaPass,
        onSubmit: (values,{resetForm}) => {
            console.log(values.old_pass,appSettings.password)
            if(values.old_pass != appSettings.password){
                formikPass.errors.old_pass = true;
            }else{
                console.log(values);
                let payload = {
                    req_url : 'settings-update',
                    data : {
                        password : values.new_pass,
                        pass_hint : values.pass_hint
                    }
                }
                RequestService.addRequest(payload).then((res)=>{
                    getSettings();
                    resetForm();
                }).catch((err)=>{
                    console.log(err);
                });   
            }
        }
    });
    //======================Password Details End===============================


    //======================Others Settings Start=============================

    const checkBoxUpdate = (v,name)=> {
        let payload = {
            req_url : 'settings-update',
            data : {
                [name] : v ? 1 : 0,
            }
        }
        RequestService.addRequest(payload).then((res)=>{
            getSettings();
        }).catch((err)=>{
            console.log(err);
        }); 
    }

    const customerUpdate = (v,name)=> {
        let payload = {
            req_url : 'settings-update',
            data : {
                [name] : v ? 2 : 1,
            }
        }
        RequestService.addRequest(payload).then((res)=>{
            getSettings();
        }).catch((err)=>{
            console.log(err);
        }); 
    }

    const radioBoxUpdate = (e,name)=> {
        let payload = {
            req_url : 'settings-update',
            data : {
                [name] : Number(e.target.value),
            }
        }
        RequestService.addRequest(payload).then((res)=>{
            getSettings();
        }).catch((err)=>{
            console.log(err);
        }); 
    }

    const getMacAdd = ()=> {
        let payload = {
            req_url : 'macadd-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            setMacAdd(res.mac_add);
            setDbSize(res.db_size);
            activeApp(res.mac_add);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const addNewLicence = () => {
        let payload = {
            lin_no : linNo,
            mac_add : macAdd,
            customer_detail : {
                name : appSettings.own_name,
                email : appSettings.own_email,
                wp_no : appSettings.own_wp
            }
        }
        FireStoreService.newCustomer(payload).then((res)=>{
            if(res.status){
                activeApp(macAdd);
            }else{
                setShowToast(res.message);
            }
            console.log(res,'firestore data===');
        }).catch((err)=>{
            console.log(err);
        });
    }

    const renewLicence = () => {
        let payload = {
            mac_add : macAdd,
            customer_detail : {
                name : appSettings.own_name,
                email : appSettings.own_email,
                wp_no : appSettings.own_wp
            }
        }
        FireStoreService.renewCustomer(payload).then((res)=>{
            if(res.status){
                activeApp(macAdd);
            }else{
                setShowToast(res.message);
            }
        }).catch((err)=>{
            console.log(err);
        });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        if(showToast != ''){
            setShowToast('');
        }
        if(successToast != ''){
            setSuccessToast('');
        }
    }

    const getDbPercentage = (db_size)=> {
        let used = db_size;
        let total = 240;
        let per = (used/total*100)*100;
        return per;
    }

    const checkImportFile = ()=> {
        if(dbFile != ''){
            setModal({
                type:'import_confirm',
                title:'Are you sure you want to import?',
                message:'Please note, importing your old data the current data will be lost.',
                btnTxt:'Confirm',
                cancelAble:true
            });
        }else{
            setShowToast('Please select your backup file!');
        }
    }

    const doImportFile = ()=> {
        if(dbFile != ''){
            let payload = {
                req_url : 'db-file-upload',
                data : dbFile
            }
            RequestService.addRequest(payload).then(async(res)=>{
                setDbFile('');
                if(res.status){
                    let old_pass = {
                        password : appSettings.password,
                        pass_hint : appSettings.pass_hint
                    }
                    localStorage.setItem("old_passowrd", JSON.stringify(old_pass));
                    setModal({
                        type:'restart_confirm',
                        title:res.message,
                        message:'Application restart is required, please do it.',
                        btnTxt:'Restart',
                        cancelAble:false
                    });
                }
            }).catch((err)=>{
                console.log(err);
                setDbFile('');
                setShowToast('Something went wrong.');
            });
        }else{
            setShowToast('Please select your backup file!');
        }
    }

    const doDownloadFile = async()=> {
        let payload = {
            req_url : 'db-file-download',
            data : null
        }
        await RequestService.addRequest(payload);
    }

    const modalSubmit = async(data)=> {
        switch (data.type) {
            case 'import_confirm':
                doImportFile()
                break;
            case 'restart_confirm':
                await RequestService.addRequest({req_url:'restart-app',data:null});
            break;    
            default:
                setModal(null);
                break;
        }
    }

    return (
        <Box mt={2}>
            <ToastErr handleClose={handleClose} open={showToast != ''} title={showToast}/>
            <ToastBar autoHideDuration={6000} handleClose={handleClose} open={successToast != ''} title={successToast}/>
            <AppModal 
            dialogModal={true}
            title={showModal?.title}
            subTitle={showModal?.message}
            handleClose={showModal?.cancelAble ? ()=> setModal(null) : null} 
            handleSubmit={()=>modalSubmit(showModal)}
            submitTxt={showModal?.btnTxt}
            visible={showModal != null}/>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text_app}>Application Status</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>Following options are needs to be verified.</Typography>
                            <Box style={{marginLeft:5}} mt={2}>
                                <Grid alignItems='center' container spacing={2}>
                                    {
                                        appSettings.com_status === 1 ? 
                                        <CheckCircle className={classes.iconColor}/>:
                                        <Cancel className={classes.iconColorRed}/>
                                    }
                                    <Typography className={classes.status_text}>Company details</Typography>
                                </Grid>
                                <Box mt={2}>
                                    <Grid alignItems='center' container spacing={2}>
                                        {
                                            appSettings.own_status === 1 ? 
                                            <CheckCircle className={classes.iconColor}/>:
                                            <Cancel className={classes.iconColorRed}/>
                                        }
                                        <Typography className={classes.status_text}>Owner details</Typography>
                                    </Grid>
                                </Box>
                                <Box mt={2}>
                                    <Grid alignItems='center' container spacing={2}>
                                        {
                                            licenceData?.showAlert ? 
                                            <Cancel className={classes.iconColorRed}/>:
                                            <CheckCircle className={classes.iconColor}/>
                                        }
                                        <Typography className={classes.status_text}>Application activation</Typography>
                                    </Grid>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text_app}>App Version</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>You are using latest version of the app.</Typography>
                            <Box mt={5.9}>
                                <Typography className={classes.appVer} variant={'h5'}>{'0.'+pkg.version}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text_app}>Storage</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>Total storage used by the application.</Typography>
                            <Box mt={5.5}>
                                <Typography style={{fontSize:11,fontWeight:'bold'}} variant={'subtitle2'}>{dbSize} GB of 240 GB</Typography>
                                <LinearProgress className={classes.progressBar} variant="determinate" value={getDbPercentage(dbSize)}/>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid style={{marginTop:15}} container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <form onSubmit={formikCom.handleSubmit}>
                                <Typography className={classes.card_title_text}>Company Details</Typography>
                                <Typography style={{marginTop:5}} variant={'subtitle2'}>These all informations are mandatory to complete invoice setup.</Typography>
                                
                                <Box mt={2}>
                                    <TextField defaultValue={appSettings.com_name} fullWidth name={'com_name'} onChange={formikCom.handleChange} error={formikCom.touched.com_name && Boolean(formikCom.errors.com_name)} color={'secondary'} label="Shop name" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField defaultValue={appSettings.com_add_one} fullWidth name={'com_add_one'} onChange={formikCom.handleChange} error={formikCom.touched.com_name && Boolean(formikCom.errors.com_add_one)} color={'secondary'} label="Address1" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField defaultValue={appSettings.com_add_two} fullWidth name={'com_add_two'} onChange={formikCom.handleChange} error={formikCom.touched.com_name && Boolean(formikCom.errors.com_add_two)} color={'secondary'} label="Address2" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField defaultValue={appSettings.com_add_three} fullWidth name={'com_add_three'} onChange={formikCom.handleChange} error={formikCom.touched.com_name && Boolean(formikCom.errors.com_add_three)} color={'secondary'} label="Address3" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <Grid container style={{justifyContent:'flex-end'}}>
                                        <Button color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Submit</Button>
                                    </Grid>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <form onSubmit={formikOwn.handleSubmit}>
                                <Typography className={classes.card_title_text}>Owner Details</Typography>
                                <Typography style={{marginTop:5}} variant={'subtitle2'}>These all informations are mandatory to complete invoice setup except dp.</Typography>
                                <Box>
                                    <Grid container justifyContent={'center'}>
                                        <UploadBtn
                                        defaultImage={appSettings.own_dp}
                                        onChange={(r)=>formikOwn.setFieldValue('own_dp',r)}
                                        />
                                    </Grid>
                                </Box>
                                <Box>
                                    <TextField fullWidth name={'own_name'} defaultValue={appSettings.own_name} onChange={formikOwn.handleChange} error={formikOwn.touched.own_name && Boolean(formikOwn.errors.own_name)} color={'secondary'} label="Owner name" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField fullWidth name={'own_email'} defaultValue={appSettings.own_email} onChange={formikOwn.handleChange} error={formikOwn.touched.own_email && Boolean(formikOwn.errors.own_email)} color={'secondary'} label="Email" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField fullWidth name={'own_wp'} defaultValue={appSettings.own_wp} onChange={formikOwn.handleChange} error={formikOwn.touched.own_wp && Boolean(formikOwn.errors.own_wp)} color={'secondary'} label="WhatsApp" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <Grid container style={{justifyContent:'flex-end'}}>
                                        <Button color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Submit</Button>
                                    </Grid>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <form onSubmit={formikPass.handleSubmit}>
                                <Typography className={classes.card_title_text}>Change Password</Typography>
                                <Typography style={{marginTop:5}} variant={'subtitle2'}>Please provide some unique password with at least 5 characters of lenght.</Typography>
                                <Box mt={2}>
                                    <TextField type={'password'} fullWidth name={'old_pass'} onChange={formikPass.handleChange} error={formikPass.touched.old_pass || Boolean(formikPass.errors.old_pass)} color={'secondary'} label="Old password" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField type={'password'} fullWidth name={'new_pass'} onChange={formikPass.handleChange} error={formikPass.touched.new_pass && Boolean(formikPass.errors.new_pass)} color={'secondary'} label="New passowrd" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField type={'password'} fullWidth name={'con_pass'} onChange={formikPass.handleChange} error={formikPass.touched.con_pass && Boolean(formikPass.errors.con_pass)} color={'secondary'} label="Confirm password" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <TextField fullWidth name={'pass_hint'} defaultValue={appSettings.pass_hint} onChange={formikPass.handleChange} error={formikPass.touched.pass_hint && Boolean(formikPass.errors.pass_hint)} color={'secondary'} label="Password hint" variant={'standard'} />
                                </Box>
                                <Box mt={2}>
                                    <Grid container style={{justifyContent:'flex-end'}}>
                                        <Button color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Submit</Button>
                                    </Grid>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid style={{marginTop:15}} container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text}>Invoice Settings</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>These all informations are mandatory to complete your invoice setup.</Typography>
                            <Box mt={6}>
                                <FormControlLabel
                                    control={
                                        <BpCheckbox checked={appSettings.inv_watermark === 1 ? true : false} onChange={(v)=>checkBoxUpdate(v.target.checked,'inv_watermark')} name="watermark" />
                                    }
                                    label="Enable watermark"
                                />
                                <Typography style={{marginTop:3}} variant={'subtitle2'}>Enable watermark with your name in the invoice background.</Typography>
                            </Box>
                            <Box mt={4}>
                                <Typography variant={'subtitle1'}>Footer Bar</Typography>
                                <Typography style={{marginTop:3}} variant={'subtitle2'}>Deafult position is fixed, you can check other options as well.</Typography>
                                <RadioGroup
                                    value={appSettings.inv_footer_pos?.toString()}
                                    aria-labelledby="demo-customized-radioss"
                                    name="customized-radioss"
                                    >
                                        <Box>
                                            <FormControlLabel value={"1"} control={<BpRadiobox onChange={(v)=>radioBoxUpdate(v,'inv_footer_pos')}/>} label="Default" />
                                            {/* <FormControlLabel value={"2"} control={<BpRadiobox onChange={(v)=>radioBoxUpdate(v,'inv_footer_pos')}/>} label="Relative" /> */}
                                            <FormControlLabel value={"3"} control={<BpRadiobox onChange={(v)=>radioBoxUpdate(v,'inv_footer_pos')}/>} label="Hide" />
                                        </Box>
                                </RadioGroup>
                            </Box>
                            
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text}>Product Settings</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>These all informations are optional</Typography>
                            <Box mt={7}>
                                <FormControlLabel
                                    control={
                                        <BpCheckbox checked={appSettings.cust_type === 2 ? true : false } onChange={(v)=>customerUpdate(v.target.checked,'cust_type')} name="jason" />
                                    }
                                    label="Special price"
                                />
                                <Typography style={{marginTop:3}} variant={'subtitle2'}>By enabling this can be set two types of price, e.g normal and special price.</Typography>
                            </Box>
                            <Box mt={5.74}>
                                <Typography variant={'subtitle1'}>Product Display</Typography>
                                <Typography style={{marginTop:3}} variant={'subtitle2'}>Choose one to display your product with the following options</Typography>
                                <RadioGroup
                                value={appSettings.prd_list?.toString()}
                                aria-labelledby="demo-customized-radioss"
                                name="customized-radioss">
                                    <Box>
                                        <FormControlLabel value="1" control={<BpRadiobox onChange={(v)=>radioBoxUpdate(v,'prd_list')} />} label="List" />
                                        <FormControlLabel value="2" control={<BpRadiobox onChange={(v)=>radioBoxUpdate(v,'prd_list')} />} label="Grid" />
                                    </Box>
                                </RadioGroup>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text}>Bag Settings</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>These all informations are optional.</Typography>
                            <Box mt={8}>
                                <FormControlLabel
                                    control={
                                        <BpCheckbox checked={appSettings.bag_discount === 1 ? true : false} onChange={(v)=>checkBoxUpdate(v.target.checked,'bag_discount')}  name="discount" />
                                    }
                                    label="Enable discount"
                                />
                                <Typography style={{marginTop:3}} variant={'subtitle2'}>By enabling this, the "Discount" option will be display in your bag</Typography>
                            </Box>
                            <Box mt={8.24}>
                                <FormControlLabel
                                    control={
                                        <BpCheckbox checked={appSettings.bag_tax === 1 ? true : false} onChange={(v)=>checkBoxUpdate(v.target.checked,'bag_tax')} name="tax" />
                                    }
                                    label="Enable tax"
                                />
                                <Typography style={{marginTop:3}} variant={'subtitle2'}>By enabling this, the "Tax" option will be display in your bag</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid style={{marginTop:15}} container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text}>Theme Settings</Typography>
                            <Typography style={{marginTop:5}} variant={'subtitle2'}>Select your theme as per your choice.</Typography>
                            <Box mt={1.5}>
                                <RadioGroup
                                    value={mode == 'light' ? lightTheme : 'dark'}
                                    aria-labelledby="demo-customized-radios"
                                    name="customized-radios">
                                    <FormControlLabel value="dark" control={<BpRadiobox onChange={(v)=>toggleMode()} />} label="Dark" />
                                    <FormControlLabel value="navy" control={<BpRadiobox onChange={(v)=>changeTheme(v)} />} label="Navy" />
                                    <FormControlLabel value="pink" control={<BpRadiobox onChange={(v)=>changeTheme(v)} />} label="Pink" />
                                    <FormControlLabel value="teal" control={<BpRadiobox onChange={(v)=>changeTheme(v)} />} label="Teal" />
                                </RadioGroup>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    {
                        licenceData != null && 
                        <Card className={classes.card}>
                            <CardContent>
                                {
                                    licenceData.showAlert ?
                                    <>
                                        <Typography className={classes.card_title_text} style={{color:licenceData.color}}>{licenceData.alertMsg.title}</Typography>
                                        <Typography style={{marginTop:5}} variant={'subtitle2'}>{licenceData.alertMsg.message}</Typography>
                                        <Box mt={3.9}>
                                            <TextField
                                            onChange={(e)=>setLinNo(e.target.value)}
                                            placeholder='Licence here...' fullWidth color={'secondary'} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*',maxLength:12,style:{fontSize:17}}} />
                                        </Box>
                                        <Box mt={4}>
                                            <Grid container style={{justifyContent:'flex-end'}}>
                                                {
                                                    licenceData.renewRequired &&
                                                    <Button onClick={()=>renewLicence()} color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Renew</Button>
                                                }
                                                <Button onClick={()=>addNewLicence()} color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">{licenceData.renewRequired ? 'Add New' : 'Submit'}</Button>
                                            </Grid>
                                        </Box>
                                    </>:
                                    <Box mt={4.5} style={{textAlign:'center'}}>
                                        <CheckCircleOutline className={licenceData.renewRequired ? classes.iconColorSubRenew : classes.iconColorSubActive}/>
                                        <Typography className={classes.card_title_text} style={{color:(mode === 'light') ? licenceData.color : null}}>{licenceData.alertMsg.title}</Typography>
                                        <Typography style={{marginTop:5}} variant={'subtitle2'}>{licenceData.alertMsg.message}</Typography>
                                        <Typography style={{marginTop:13,fontWeight:'bold'}} variant={'subtitle2'}>{`(Licence No : ${licenceData.licence_no})`}</Typography>
                                    </Box>
                                }
                            </CardContent>
                        </Card>
                    }
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.card_title_text}>Backup</Typography>
                                <Typography style={{marginTop:5}} variant={'subtitle2'}>{'Export / import of your database.'}</Typography>
                                <Box mt={2.7}>
                                    <Grid container justifyContent={'center'}>
                                        <BackupBtn
                                        defaultValue={dbFile != '' ? dbFile.orignalName : ''}
                                        onChange={(r)=>setDbFile(r)}/>
                                    </Grid>
                                </Box>
                                <Box mt={2}>
                                    <Grid container style={{justifyContent:'flex-end'}}>
                                        <Button onClick={()=>doDownloadFile()} color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Export</Button>
                                        <Button onClick={()=>checkImportFile()} color={'default'} className={commonClass.colorBtn} style={{fontWeight:'bold',marginLeft:10}} type="submit">Import</Button>
                                    </Grid>
                                </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>    
        </Box>
    )
}

const Styles = makeStyles((theme)=>({
    card_title_text : {
        fontSize : '15px',
        marginTop: '10px',
        fontWeight:'bold',
        fontFamily:'Verdana, Geneva, Tahoma, sans-serif'
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
        borderRadius:'8px',
        ...(theme.palette.type === 'dark') ? {
            border : '1px solid #1E4976',
            backgroundColor:theme.palette.cardBackground,
        }:{
            border : '1px solid #fff',
        }
    },
    status_text:{
        fontSize: '14px',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: '400',
        lineHeight: "1.5",
        letterSpacing: "0.00938em",
        marginLeft:'5px'
    },
    iconColor : {
        fontSize : '20px',
        color:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
    },
    iconColorSubActive : {
        fontSize : '50px',
        color:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
    },
    iconColorSubRenew : {
        fontSize : '50px',
        color:(theme.palette.type === 'dark') ? '#99CCF3' : 'orange'
    },
    iconColorRed : {
        fontSize : '20px',
        color: theme.palette.error.main
    },
    appVer : {
        color:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main,
        textAlign:'center',
        fontWeight:'bold'
    },
    memBar:{
        height:'64px',
        width:'64px',
        borderRadius:'32px',
        justifyContent:'center',
        alignItems:'center',
        display:'flex',
        backgroundColor:(theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main,
        alignSlef:'center',
        color:(theme.palette.type === 'dark') ? '#000' : '#fff'
    },
    progressBar:{
        height: '14px',
        borderRadius: '7px',
        marginTop:'4px',
        "&.MuiLinearProgress-colorPrimary":{
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 400 : 800],
        },
        "& .MuiLinearProgress-bar":{
            backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : '#99CCF3',
        }
    }
}))

export default Settings;