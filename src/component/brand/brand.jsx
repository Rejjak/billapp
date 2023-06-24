import React,{useEffect,useState, useCallback, useContext} from 'react';
import {Box,Grid,Card,CardContent,Typography,makeStyles,Tooltip,IconButton,TextField,ListItem,ListItemText} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';
import AppModal from '../common/modal';
import {ColorModeContext} from '../../store';
import UploadButtons from '../common/uploadButton';
import ActionButtons from './actionButtons';
import default_img from './default_image.png';
import { useFormik } from 'formik';
import * as yup from 'yup';
import RequestService from '../../service/requestService';

const validationSchema = yup.object({
    brandName: yup.string('Product Brand').required('Product Brand is required')
});

function Brand() {
    const classes = Styles();
    const {brandData,updateBrand} = useContext(ColorModeContext);
    const [showAddModal, setAddModal] = useState(false);
    const [editOption, setEditOption] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoaded,setLoaded] = useState(false);

    useEffect(()=>{
        getBrand();
    },[])

    const openEditModal = useCallback((value)=>{
        formik.initialValues.brandName = value != null ? value.name : '';
        setEditOption(value);
        setImageUrl(value != null ? value.image : '');
        setAddModal(true);
    },[]);

    const addModal = useCallback((value)=>{
        formik.initialValues.brandName = '';
        setImageUrl('');
        openEditModal(null);
        setAddModal(value);
    },[]);

    const updateBrandData = useCallback((value)=>{
        updateBrand(value);
        setLoaded(true);
    },[])

    const formik = useFormik({
        initialValues: {
          brandName: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values,{resetForm}) => {
            addBrand(values.brandName);
            resetForm();
            addModal(false);
            setEditOption(null);
        }
    });
    

    const addBrand = (brand_name)=> {
        let payload = {
            req_url : 'brand-create',
            data : {
                name : brand_name,
                image : imageUrl,
                prd_id : editOption != null ? editOption.id : undefined
            }
        }
        console.log(payload);
        RequestService.addRequest(payload).then((res)=>{
            console.log(res,'added Brand');
            getBrand();
        }).catch((err)=>{
            console.log(err,'added Brand err');
        });
    }

    const getBrand = ()=> {
        let payload = {
            req_url : 'brand-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            console.log(res,'Brands');
            updateBrandData(res);
        }).catch((err)=>{
            console.log(err,'added Brand err');
        });
    }

    const deleteBrand = (id)=> {
        let payload = {
            req_url : 'brand-delete',
            data : {id}
        }
        RequestService.addRequest(payload).then((res)=>{
            getBrand();
        }).catch((err)=>{
            console.log(err,'added brand err');
        });
    }

    return (
        <Box mt={2}>
            <AppModal
            title={editOption != null ? editOption.label : 'Add Brand'}
            width={300}
            children={
                <form>
                    <Box mt={1}>
                        <Grid container justifyContent={'center'}>
                            <UploadButtons
                            defaultImage={imageUrl}
                            onChange={(r)=>setImageUrl(r)}
                            />
                        </Grid>
                        <TextField 
                        name={'brandName'}
                        defaultValue={editOption != null ? editOption.name : ''}
                        onChange={formik.handleChange}
                        error={formik.touched.brandName && Boolean(formik.errors.brandName)}
                        color={'secondary'} label="Product Name" variant={'standard'} fullWidth inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                    </Box>
                </form>    
            }
            handleClose={()=>{
                formik.resetForm();
                addModal(false);
            }} 
            handleSubmit={()=>formik.handleSubmit()}
            visible={showAddModal}/>
            <Grid container spacing={2}>
                {
                    isLoaded && 
                    <Grid item xs={12} sm={2}>
                        <Card className={classes.cardAdd}>
                            <CardContent style={{padding:12}} onClick={()=>addModal(true)}>
                                <Box 
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{height: 106,width: '100%'}}>
                                    <AddBox className={classes.iconAddColor} style={{fontSize:100}}/>
                                </Box>        
                                <Typography className={classes.card_bottom_text}>Add Brand</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                }
                {
                    brandData.map((ele,i)=>{
                        return (
                            <Grid key={i} item xs={12} sm={2}>
                                <Card className={classes.card}>
                                    <ActionButtons
                                    onEdit={()=>openEditModal({...ele,...{label:'Update Brand'}})}
                                    onDelete={()=>deleteBrand(ele.id)}
                                    />
                                    <CardContent style={{padding:12}}>
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 100,
                                                width: '100%',
                                                borderRadius:6
                                            }}
                                            alt="The house from the offer."
                                            src={ele.image != '' ? ele.image : default_img}
                                        />
                                        <Typography className={classes.card_bottom_text}>{ele.name}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Box>
    );
}

const Styles = makeStyles((theme)=>({
    num_count : {
        fontFamily : 'Roboto-Bold',
        fontSize : '25px',
        color:'#3399FF'
    },
    card_bottom_text : {
        fontSize : '13px',
        marginTop: '10px',
        textAlign:'center',
        ...(theme.palette.type === 'dark') ? {
            color:'#ddd'
        }:null
    },
    title_text : {
        fontSize : '18px',
        fontWeight:'bold',
        marginBottom:'10px',
        ...(theme.palette.type === 'dark') ? {
            color:'#ddd'
        }:{color:'#1E64AE'}
    },
    card:{
        borderRadius:'8px',
        cursor:'pointer',
        ...(theme.palette.type === 'dark') ? {
            border : '1px solid #1E4976',
            backgroundColor:theme.palette.cardBackground,
        }:{
            border : '1px solid #fff',
        },
        "&:hover div div":{
            display:'block'
        }
    },
    cardAdd:{
        borderRadius:'8px',
        cursor:'pointer',
        ...(theme.palette.type === 'dark') ? {
            border : '1px solid #1E4976',
            backgroundColor:theme.palette.cardBackground,
        }:{
            border : '1px solid #fff',
        }
    },
    iconAddColor:{
        color : (theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
    }
}))

export default Brand;