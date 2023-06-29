import React, { useState, useCallback, useEffect,memo,useContext } from 'react';
import {Box,Grid, Typography, TableContainer,Table,TableBody,TableCell,TableHead,TableRow, Paper, IconButton, TextField, Button, Tooltip, makeStyles, Card, CardContent} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {Edit, Delete, Add, ShoppingBasket, Error} from '@material-ui/icons';
import ActionButtons from '../brand/actionButtons';
import default_img from '../brand/default_image.png';
import AppModal from '../common/modal';
import ToastBar from '../common/toastbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import RequestService from '../../service/requestService';
import EnhancedTable from './mytable';
import commonStyles from '../style/commonStyle';
import {ColorModeContext} from '../../store';

function priceInput(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 46 || ASCIICode > 57 || ASCIICode == 47))
        evt.preventDefault();
    return true;
}

function onlyNumber(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        evt.preventDefault();
    return true;
}

const ActionBtn = ({onDelete,onEdit,onBag}) => {
    const classes = commonStyles();
    return (
        <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:0}}>
            <Tooltip title={'Edit'}>
                <IconButton onClick={onEdit} size={'small'}>
                    <Edit className={classes.iconAddColor}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={'Delete'}>
                <IconButton onClick={onDelete} size={'small'}>
                    <Delete className={classes.iconAddColor}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={'Add to bag'}>
                <IconButton onClick={onBag} size={'small'}>
                    <ShoppingBasket className={classes.iconAddColor}/>
                </IconButton>
            </Tooltip>
        </div>
    )
};
var prdTempData = [];
function Product(props) {
    const {cartData,updateCart,typeData,brandData,productData,updateProduct,settingsData} = useContext(ColorModeContext);
    const appSettings = settingsData[0];
    const classes = commonStyles();
    const newclasses = Styles();
    const [showAddModal, setAddModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showViewModal, setViewModal] = useState(false);
    const [prdId, setPrdId] = useState(null);
    const [searchTxt,setSearchTxt] = useState('');
    const [editData, setEditData] = useState(null);
    const [showGridView, setGridView] = useState(false);
    const [showToast,setToast] = useState(false);

    useEffect(()=>{
        prdTempData = productData;
    },[]);

    const displayModal = useCallback((value,ele = null)=>{
        setAddModal(value);
        if(ele != null){
            formik.initialValues.prdName = ele.name;
            formik.initialValues.typeName = ele.type;
            formik.initialValues.brandName = ele.brand;
            formik.initialValues.modelName = ele.model;
            formik.initialValues.stock = ele.stock;
            formik.initialValues.price = ele.price;
            formik.initialValues.specialPrice = ele.sp_price;
            setEditData(ele);
            setPrdId(ele.id);
        }else{
            formik.initialValues.prdName = '';
            formik.initialValues.typeName = '';
            formik.initialValues.brandName = '';
            formik.initialValues.modelName = '';
            formik.initialValues.stock = '';
            formik.initialValues.price = '';
            formik.initialValues.specialPrice = '';   
            setPrdId(null);
            setEditData(null);
        }
    },[showAddModal]);

    const displayDeleteModal = useCallback((value,prd_id = null)=>{
        setDeleteModal(value);
        setPrdId(prd_id);
    },[showDeleteModal]);

    const displayViewModal = useCallback((value,ele = null)=>{
        setEditData(ele);
        setViewModal(value);
    },[showViewModal]);

    const changedPrdData = useCallback((value)=>{
        updateProduct(value);
        prdTempData = value;
    },[productData]);

    const changedPrdDataOnSearch = useCallback((value)=>{
        updateProduct(value);
    },[productData]);

    const updateSearch = useCallback((v)=> {
        setSearchTxt(v);
    },[searchTxt]);

    const validationSchema = yup.object({
        prdName: yup.string().notRequired(),
        typeName: yup.string().notRequired(),
        brandName: yup.string().notRequired(),
        modelName: yup.string().notRequired(),
        stock: yup.string().notRequired(),
        price: yup.string().notRequired(),
        specialPrice: yup.string().notRequired(),
    });

    const formik = useFormik({
        initialValues: {
            prdName: '',
            typeName: '',
            brandName: '',
            modelName: '',
            stock: '',
            price: '',
            specialPrice: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values,{resetForm}) => {
            if((values.prdName != '' || (values.typeName != '' && values.typeName != null)) && values.stock != '' && values.price != ''){
                if(isNaN(values.price)){
                    alert('Please check your input and try again!');
                    return false;
                }
                if(values.specialPrice != '' && isNaN(values.specialPrice)){
                    alert('Please check your input and try again!');
                    return false;
                }
                values.brandName = values.brandName == null ? '' : values.brandName;
                values.typeName = values.typeName == null ? '' : values.typeName;
                addProduct(values);
                resetForm();
                displayModal(false);
            }else{
                alert('Please check your input and try again!');
            }
            //alert(JSON.stringify(values))
        }
    });

    const addProduct = (data)=> {
        let payload = {
            req_url : 'product-create',
            data : {
                prd_id : prdId != null ? prdId : undefined,
                ...data
            }
        }
        console.log(payload);
        RequestService.addRequest(payload).then((res)=>{
            console.log(res);
            getProduct();
        }).catch((err)=>{
            console.log(err);
        });
    }

    const deleteProduct = ()=> {
        let payload = {
            req_url : 'product-delete',
            data : {id:prdId}
        }
        RequestService.addRequest(payload).then((res)=>{
            getProduct();
            displayDeleteModal(false);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const getProduct = ()=> {
        let payload = {
            req_url : 'product-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            changedPrdData(res);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const getImageByName = (name,data)=> {
        if(data == 'type'){
            let index = typeData.findIndex(ele=>ele.name == name);
            if(index != - 1 && typeData[index].image != ''){
                return typeData[index].image;
            }else{
                return default_img;
            }
        }else{
            let index = brandData.findIndex(ele=>ele.name == name);
            if(index != - 1 && brandData[index].image != ''){
                return brandData[index].image;
            }else{
                return default_img;
            }
        }
    }

    const search = (searchText)=>{
		updateSearch(searchText);
		if(prdTempData.length>0){
			let data = [...prdTempData];
			let newData = [];
			if(searchText != ''){
				newData = data.filter(function(item){
					let name = item.name.toUpperCase();
                    let type = item.type.toUpperCase();
                    let brand = item.brand.toUpperCase();
					let textData = searchText.toUpperCase().trim();
					return (name.indexOf(textData) > -1 || type.indexOf(textData) > -1 || brand.indexOf(textData) > -1)
                });
                changedPrdDataOnSearch(newData);
			}else{
                changedPrdDataOnSearch(prdTempData);
            }
		}else{
            changedPrdDataOnSearch(prdTempData);
        }
	}

    const addToBag = (ele)=> {
        let newCartData = [...cartData];
        let index = newCartData.findIndex((cart)=>cart.id == ele.id);
        let _ele = {...ele}
        if(index == -1){
            _ele['qty'] = 1;
            newCartData.unshift(_ele);
            setToast(true);
            updateCart(newCartData);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setToast(false);
    }

    const checkBorder = (arr,i)=> {
        if(i == arr.length -1){
            return {borderBottom:0}
        }else{
            return null
        }
    }

    return (
        // <EnhancedTable/>
        <Box mt={2}>
            <ToastBar handleClose={handleClose} open={showToast} title={'Item added to the bag'}/>
            <AppModal 
            title={editData != null ? 'Update product' : 'Add product'}
            children={
                <div>
                    <Box mt={3}>
                        <TextField defaultValue={editData != null ? editData.name : ''} name={'prdName'} onChange={formik.handleChange} color={'secondary'} label="Product Name" variant={'standard'} fullWidth inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                    </Box>
                    <Box mt={4}>
                        <Grid container style={{justifyContent:'space-between',alignItems:'center'}}>
                            <Autocomplete
                                style={{width:170}}
                                id="free-solo-demo"
                                freeSolo
                                closeIcon={false}
                                onChange={(e,v)=>{
                                    formik.setFieldValue('typeName',v);
                                }}
                                onInputChange={(e,v)=>{
                                    formik.setFieldValue('typeName',v);
                                }}
                                value={editData != null ? editData.type : ''}
                                options={typeData.map((option) => option.name)}
                                renderInput={(params) => <TextField {...params} color={'secondary'} label="Type" variant={'standard'} />}
                            />
                            <Autocomplete
                                style={{width:170}}
                                id="free-solo-demo2"
                                freeSolo
                                closeIcon={false}
                                onChange={(e,v)=>{
                                    formik.setFieldValue('brandName',v);
                                }}
                                onInputChange={(e,v)=>{
                                    formik.setFieldValue('brandName',v);
                                }}
                                value={editData != null ? editData.brand : ''}
                                options={brandData.map((option) => option.name)}
                                renderInput={(params) => <TextField {...params} color={'secondary'} label="Brand" variant={'standard'} />}
                            />
                            <TextField defaultValue={editData != null ? editData.model : ''} name={'modelName'} onChange={formik.handleChange} color={'secondary'} label="Model" variant={'standard'} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                        </Grid>
                    </Box>
                    <Box mt={4}>
                        <Grid container style={{justifyContent:'space-between',alignItems:'center'}}>
                            <TextField style={{width:170}} defaultValue={editData != null ? editData.stock : ''} onKeyPress={(e)=>onlyNumber(e)} name={'stock'} onChange={formik.handleChange} color={'secondary'} label="Stocks" variant={'standard'} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}} />
                            <TextField style={{width:170}} defaultValue={editData != null ? editData.price : ''} onKeyPress={(e)=>priceInput(e)} name={'price'} onChange={formik.handleChange} color={'secondary'} label="Price" variant={'standard'} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                            <TextField style={{opacity:appSettings.cust_type == 1 ? 0 : 1}} defaultValue={editData != null ? editData.sp_price : ''} onKeyPress={(e)=>priceInput(e)} name={'specialPrice'} onChange={formik.handleChange} color={'secondary'} label="Special Price" variant={'standard'} 
                            inputProps={{ 
                                inputMode: 'numeric', 
                                pattern: '[0-9]*',
                                disabled:appSettings.cust_type == 1
                            }} />
                        </Grid>
                    </Box>
                </div>
            }
            handleClose={()=>{
                formik.resetForm();
                displayModal(false);
            }} 
            handleSubmit={()=>formik.handleSubmit()}
            visible={showAddModal}/>
            <AppModal 
            dialogModal={true}
            title={'Delete product'}
            subTitle={'Are you sure you want to delete this product?'}
            handleClose={()=>displayDeleteModal(false)} 
            handleSubmit={()=>deleteProduct()}
            visible={showDeleteModal}/>
            <AppModal 
            title={'Product details'}
            width={'35%'}
            children={
                editData != null &&
                <div>
                    <Grid style={{marginTop:10}} container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box
                                component="img"
                                sx={{
                                    height: 200,
                                    width: '100%',
                                    borderRadius:6
                                }}
                                alt="Image"
                                src={getImageByName(editData.type,'type')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box
                                component="img"
                                sx={{
                                    height: 200,
                                    width: '100%',
                                    borderRadius:6
                                }}
                                alt="Image"
                                src={getImageByName(editData.brand,'brand')}
                            />
                        </Grid>
                        <table style={{marginTop:10,marginLeft:4}}>
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>:</td>
                                    <td>{editData.name}</td>
                                </tr>
                                <tr>
                                    <td>Type </td>
                                    <td>:</td>
                                    <td>{editData.type}</td>
                                </tr>
                                <tr>
                                    <td>Brand</td>
                                    <td>:</td>
                                    <td>{editData.brand}</td>
                                </tr>
                                <tr>
                                    <td>Model</td>
                                    <td>:</td>
                                    <td>{editData.model}</td>
                                </tr>
                                <tr>
                                    <td>Stocks</td>
                                    <td>:</td>
                                    <td>{editData.stock}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>:</td>
                                    <td>{editData.price.toFixed(2)}</td>
                                </tr>
                                {
                                    appSettings.cust_type === 2 && 
                                    <tr>
                                        <td>Special price</td>
                                        <td>:</td>
                                        <td>{editData.sp_price.toFixed(2)}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </Grid>
                </div>
            }
            handleClose={()=>displayViewModal(false)}
            visible={showViewModal}/>
            <Typography style={{fontFamily:'Roboto-Medium'}} variant={'h6'}>My Product</Typography>
            <Grid container style={{justifyContent:'space-between',alignItems:'center',marginTop:20}}>
                <Grid item xs={12} sm={4}>
                    <Button onClick={()=>displayModal(true)} className={classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold'}} startIcon={<Add/>}>Add New</Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField color={'secondary'} onChange={(e)=>search(e.target.value)} placeholder={'Search here...'} fullWidth inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                </Grid>
            </Grid>
            {
                (productData.length == 0) ?
                <Typography style={{fontFamily:'Roboto-Medium',textAlign:'center',marginTop:100}} variant={'h6'}>No results found</Typography>:
                <div>
                    {
                        appSettings.prd_list === 2 ?
                        <Grid style={{marginTop:20}} container spacing={2}>
                            {
                                productData.map((ele,i)=>{
                                    return (
                                        <Grid key={ele.id} item xs={12} sm={3}>
                                            <Card className={newclasses.card}>
                                                <ActionButtons onView={()=>displayViewModal(true,ele)} onEdit={()=>displayModal(true,ele)} onDelete={()=>displayDeleteModal(true,ele.id)}/>
                                                <CardContent style={{padding:12}} onClick={()=>addToBag(ele)}>
                                                    <Box style={{flexDirection:'row',justifyContent:'space-around',display:'flex'}}>
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                height: 120,
                                                                width: '50%'
                                                            }}
                                                            alt="Image"
                                                            style={{borderTopLeftRadius:6,borderBottomLeftRadius:6}}
                                                            src={getImageByName(ele.type,'type')}
                                                        />
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                height: 120,
                                                                width: '50%'
                                                            }}
                                                            alt="Image"
                                                            style={{borderTopRightRadius:6,borderBottomRightRadius:6}}
                                                            src={getImageByName(ele.brand,'brand')}
                                                        />
                                                    </Box>
                                                    <Typography noWrap className={newclasses.card_bottom_text}>{ele.name}</Typography>
                                                    <Typography noWrap className={newclasses.card_price_text}>{'₹'+ele.price.toFixed(2)}</Typography>
                                                    {
                                                        appSettings.cust_type === 2 &&
                                                        <Typography noWrap className={newclasses.card_sp_price_text}>{`(Special rate ₹${ele.sp_price.toFixed(2)})`}</Typography>
                                                    }
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>:
                        <TableContainer style={{marginTop:20}} className={classes.paperBg} component={Paper}>
                            <Table className={classes.normalBorder} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} size={'small'} aria-label="spanning table">
                                <TableHead className={classes.tableHeaderBg}>
                                    <TableRow>
                                        <TableCell align="center" style={{borderLeft:0}} width={20}>S.No</TableCell>
                                        <TableCell style={{paddingBottom:5,paddingTop:5,paddingLeft:15}}>Product Name</TableCell>
                                        <TableCell align="center">Qty</TableCell>
                                        <TableCell align="center">Type</TableCell>
                                        <TableCell align="center">Brand</TableCell>
                                        <TableCell align="center">Model</TableCell>
                                        <TableCell align="center">Price</TableCell>
                                        {
                                            appSettings.cust_type === 2 && 
                                            <TableCell align="center">SPrice</TableCell>
                                        }
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        productData.map((ele,i)=>{
                                            return (
                                                <TableRow key={ele.id}>
                                                    <TableCell align="center" style={{borderLeft:0,...checkBorder(productData,i)}}>{i+1}</TableCell>
                                                    <TableCell style={{paddingLeft:15,...checkBorder(productData,i)}}>{ele.name}</TableCell>
                                                    <TableCell align="center" style={checkBorder(productData,i)}>{ele.stock}</TableCell>
                                                    <TableCell align="center" style={checkBorder(productData,i)}>{ele.type}</TableCell>
                                                    <TableCell align="center" style={checkBorder(productData,i)}>{ele.brand}</TableCell>
                                                    <TableCell align="center" style={checkBorder(productData,i)}>{ele.model}</TableCell>
                                                    <TableCell align="center" style={checkBorder(productData,i)}>{ele.price.toFixed(2)}</TableCell>
                                                    {
                                                        appSettings.cust_type === 2 && 
                                                        <TableCell align="center" style={checkBorder(productData,i)}>{ele.sp_price.toFixed(2)}</TableCell>
                                                    }
                                                    <TableCell align="center" style={checkBorder(productData,i)}><ActionBtn onBag={()=>addToBag(ele)} onEdit={()=>displayModal(true,ele)} onDelete={()=>displayDeleteModal(true,ele.id)}/></TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </div>
            }
        </Box>
    );
}


const Styles = makeStyles((theme)=>({
    card_bottom_text : {
        fontSize : '14px',
        marginTop: '10px',
        textAlign:'center',
        ...(theme.palette.type === 'dark') ? {
            color:'#ddd'
        }:null
    },
    card_price_text : {
        fontSize : '14px',
        marginTop: '3px',
        textAlign:'center',
        fontWeight:'bold',
        color: (theme.palette.type === 'dark') ? '#ddd' : '#1E64AE'
    },
    card_sp_price_text : {
        fontSize : '10px',
        marginTop: '3px',
        textAlign:'center',
        color: (theme.palette.type === 'dark') ? '#ddd' : '#111'
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
    }
}))

export default Product;