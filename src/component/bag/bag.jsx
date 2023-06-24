import React, { useState, useCallback, useEffect,memo,useContext,useRef } from 'react';
import {Box,Grid, Typography, TableContainer,Table,TableBody,TableCell,TableHead,TableRow, Paper, IconButton, TextField, Button, Tooltip, makeStyles, Card, CardContent,Select,MenuItem,InputLabel} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {Edit, Visibility, Add, Cancel,More,Shop,ClearAll,Delete,Info,Cached,MoreVert,Clear} from '@material-ui/icons';
import {ColorModeContext} from '../../store';
import { useNavigate } from "react-router-dom";
//import ReactToPrint from 'react-to-print';
//import PrintComponent from './printPage';
import ActionButtons from '../brand/actionButtons';
import default_img from '../brand/default_image.png';
import ToastErr from '../common/toastErr';
import AppModal from '../common/modal';
import { useFormik } from 'formik';
import * as yup from 'yup';
import RequestService from '../../service/requestService';
import commonStyles from '../style/commonStyle';

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

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}
  
function priceRow(qty, price) {
    let zero = 0;
    if(!isNaN(qty) && !isNaN(price)){
        let num = Number(qty) * Number(price);
        return `${num.toFixed(2)}`;
    }else{
        return `${zero.toFixed(2)}`;
    }
}
  
function subtotal(items,cust_type) {
    let num = 0;
    if(cust_type == 2){
        num = items.map((ele)=>!isNaN(ele.sp_price*ele.qty)?ele.sp_price*ele.qty:0).reduce((sum,curVal)=>sum+curVal,0);
    }else{
        num = items.map((ele)=>!isNaN(ele.price*ele.qty)?ele.price*ele.qty:0).reduce((sum,curVal)=>sum+curVal,0);
    }
    return ccyFormat(num);
}

const TextInput = (props)=> {
    const classes = commonStyles();
    return (
        <TextField style={props.pointerEvents != undefined ? {pointerEvents:props.pointerEvents} : null} {...props} size={'medium'} margin={'none'} fullWidth color={'secondary'} variant="outlined" className={classes.boxSize} inputProps={props.inputProps != undefined ? props.inputProps : {style: { paddingLeft:0,boxSizing:'inherit',paddingRight:0,textAlign:'center',fontSize:14}}} InputProps={{classes:{notchedOutline:classes.noBorder}}} />
    )
}

const BlankRow = ({title,children,isLast})=> {
    /**
     * This component will return some blank row
     * to make the invoice looks better.
     * This component also have the option to 
     * render a child component.
    */
    return(
        <>
            <TableRow>
                <TableCell style={{borderLeft:0,borderBottom:0}} />
                <TableCell style={{borderLeft:0,borderBottom:0}} />
                <TableCell style={{borderLeft:0,borderBottom:0}} />
                <TableCell style={{borderLeft:0,borderBottom:0}} />
                <TableCell style={isLast ? {borderBottom:0,paddingRight:0,paddingBottom:5,paddingTop:5}:{paddingRight:0,paddingBottom:5,paddingTop:5}} align={'center'}>{title}</TableCell>
                <TableCell style={isLast ? {borderBottom:0,paddingRight:0}:{paddingRight:0}} align={'center'}>{children}</TableCell>
            </TableRow>
        </>
    )
}

function Bag(props) {
    const navigate = useNavigate();
    const classes = commonStyles();
    const {cartData,updateCart,bagExtraData,updateBagExtraData,defaultBagData,typeData,brandData,productData,settingsData} = useContext(ColorModeContext);
    const [showViewModal, setViewModal] = useState(false);
    const [eleData, setEleData] = useState({});
    const [showToast,setToast] = useState('');
    const [showAlert,setAlert] = useState(false);
    const appSettings = settingsData[0];
    const componentRef = useRef();

    useEffect(()=>{
        console.log(cartData);
    },[])
    const handleChange = (event) => {
        /**
         * As this system have two types of
         * price setting `special price` and `normal price`,
         * so this function is for switching the price between
         * special and normal price.
        */
        onTextChangeExtraData(event,'cust_rate');
    };

    const getPrice = (ele)=> {
        /**
         * As this system have two types of
         * price setting `special price` and `normal price`,
         * so this function is for checking the price whether it is
         * special or normal price.
         * By default this function will return normal price
        */
        if(bagExtraData.cust_rate == 2){
            return ele.sp_price
        }else{
            return ele.price;
        }
    }

    const onTextChange = (event,field,index)=> {
        /**
         * Update cart values
         * and save it via context API
        */
        let newCartData = [...cartData];
        newCartData[index][field] = event.target.value;
        updateCart(newCartData);
    }

    const onTextChangeExtraData = (event,field)=> {
        /**
         * Update extra data
         * and save it via context API
        */
        let newBagExData = {...bagExtraData};
        newBagExData[field] = event.target.value > 100 ? 100 : event.target.value;
        updateBagExtraData(newBagExData);
    }

    const onTextChangeCustomerData = (event,field)=> {
        /**
         * Customer data
        */
        let newBagExData = {...bagExtraData};
        newBagExData[field] = event.target.value;
        updateBagExtraData(newBagExData);
    }

    const clearData = ()=> {
        /**
         * Clear bag
         * and save it via context API
        */
        updateCart([]);
        updateBagExtraData(defaultBagData);
    }

    const totalPrice = (subtotal)=> {
        /**
         * Rule : subtotal -> discount -> total -> tax
         * 
         * In the argument will get the subtotal
         * of the selected elements on the go
         * 
         * If the argument is valid number,then
         * will enter inside the function and will
         * return the total amount after calculation
         * otherwise will return 0
        */

        if(!isNaN(subtotal)){
            let totalAmount = Number(subtotal);
            if(bagExtraData.discount != '' && !isNaN(bagExtraData.discount)){
                let disAmount = (Number(bagExtraData.discount)/100)*totalAmount;
                totalAmount = totalAmount - disAmount;
            }
            if(bagExtraData.tax != '' && !isNaN(bagExtraData.tax)){
                let taxAmount = (Number(bagExtraData.tax)/100)*totalAmount;
                totalAmount = totalAmount + taxAmount;
            }
            return ccyFormat(totalAmount);
        }else{
            return ccyFormat(0);
        }
    }

    const removeItem = (index)=> {
        let arr = [...cartData];
        arr.splice(index,1);
        updateCart(arr);
    }

    const displayViewModal = useCallback((value,cart_ele = null)=>{
        if(cart_ele != null){
            let prd_arr = [...productData];
            let prd_index = prd_arr.findIndex((ele)=>ele.id == cart_ele.id);
            if(prd_index != -1){
                let new_ele = {...prd_arr[prd_index]};
                setEleData(new_ele);
            }else{
                setEleData(cart_ele)
            }
        }
        setViewModal(value);
    },[showViewModal]);

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

    const resetField = (id,index)=> {
        let prd_arr = [...productData];
        let arr = [...cartData];
        let prd_index = prd_arr.findIndex((ele)=>ele.id == id);
        if(prd_index != -1){
            let new_ele = {...prd_arr[prd_index]};
            new_ele['qty'] = 1;
            arr.splice(index,1,new_ele);
            updateCart(arr);
        }else{
            let newObj = {
                id : id,
                name : '',
                qty : 1,
                price : 0,
                sp_price : 0
            }
            arr.splice(index,1,newObj);
            updateCart(arr);
        }
    }

    const addMore = ()=> {
        let arr = [...cartData];
        let newObj = {
            id : Math.random().toString(36).substring(2,7),
            name : '',
            qty : 1,
            price : 0,
            sp_price : 0
        }
        arr.push(newObj);
        updateCart(arr);
    }

    const doCheckout = ()=> {
        let newBagExData = {...bagExtraData};
        let checkCust = appSettings.cust_type === 2 ? (newBagExData.cust_rate != null && newBagExData.cust_rate != '') : true;
        if(newBagExData.biller_name != '' && (newBagExData.biller_phone != '' || newBagExData.biller_add != '') && checkCust){
            if(newBagExData.biller_phone != '' && newBagExData.biller_phone.length != 10){
                setToast('Error : Invalid phone');
                return false;
            }
            if(newBagExData.biller_add != '' && newBagExData.biller_add.length < 5){
                setToast('Error : Invalid address');
                return false;
            }
            let cart_arr = [...cartData];
            if(cart_arr.length == 0){
                setToast('Error : Invalid items');
                return false;
            }
            setAlert(true);
        }else{
            setToast('Error : Please check customer details');
        }
    }

    const finalCheckout = ()=> {
        let cart_arr = [...cartData];
        let newBagExData = {...bagExtraData};
        let amount = totalPrice(subtotal(cart_arr,newBagExData.cust_rate));
        let payload = {
            req_url : 'sales-create',
            data : {
                items : cart_arr,
                extra_items : newBagExData,
                total_amount: amount
            }
        }
        RequestService.addRequest(payload).then((res)=>{
            clearData();
            setAlert(false);
            navigateTo(res[0]);
        }).catch((err)=>{
            console.log(err,'Sale err');
        });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setToast('');
    }

    const navigateTo = (id)=> {
        navigate(`/print/${id}`);
    }

    return (
        <Box mt={2}>
            <ToastErr handleClose={handleClose} open={showToast != ''} title={showToast}/>
            <AppModal 
            dialogModal={true}
            title={'Checkout'}
            subTitle={'Are you sure you want to checkout?'}
            handleClose={()=>setAlert(false)} 
            handleSubmit={()=>finalCheckout()}
            submitTxt={'Yes, proceed'}
            visible={showAlert}/>
            <AppModal 
            title={'Product details'}
            width={'35%'}
            children={
                eleData != null &&
                <div>
                    <Grid style={{marginTop:10}} container spacing={2}>
                        {
                            eleData.type !== undefined &&
                            <Grid item xs={12} sm={6}>
                                <Box
                                    component="img"
                                    sx={{
                                        height: 200,
                                        width: '100%',
                                        borderRadius:6
                                    }}
                                    alt="Image"
                                    src={getImageByName(eleData.type,'type')}
                                />
                            </Grid>
                        }
                        {
                            eleData.brand !== undefined &&
                            <Grid item xs={12} sm={6}>
                                <Box
                                    component="img"
                                    sx={{
                                        height: 200,
                                        width: '100%',
                                        borderRadius:6
                                    }}
                                    alt="Image"
                                    src={getImageByName(eleData.brand,'brand')}
                                />
                            </Grid>
                        }
                        <table className={classes.normalTable} style={{marginTop:10,marginLeft:4}}>
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>:</td>
                                    <td>{eleData.name}</td>
                                </tr>
                                <tr>
                                    <td>Type </td>
                                    <td>:</td>
                                    <td>{eleData.type}</td>
                                </tr>
                                <tr>
                                    <td>Brand</td>
                                    <td>:</td>
                                    <td>{eleData.brand}</td>
                                </tr>
                                <tr>
                                    <td>Model</td>
                                    <td>:</td>
                                    <td>{eleData.model}</td>
                                </tr>
                                <tr>
                                    <td>Stocks</td>
                                    <td>:</td>
                                    <td>{eleData.stock}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>:</td>
                                    <td>{eleData.price}</td>
                                </tr>
                                <tr>
                                    <td>Special price</td>
                                    <td>:</td>
                                    <td>{eleData.sp_price}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Grid>
                </div>
            }
            handleClose={()=>displayViewModal(false)}
            visible={showViewModal}/>
            <Typography style={{fontFamily:'Roboto-Medium'}} variant={'h6'}>My Bag</Typography>
            <Grid container style={{justifyContent:'space-between',alignItems:'center',marginTop:20}}>
                <Grid item xs={12} sm={2}>
                    <Button onClick={()=>addMore()} className={classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold'}} startIcon={<Add/>}>Add New</Button>
                </Grid>
                {
                    appSettings.cust_type === 2 &&
                    <Grid item xs={12} sm={2}>
                        <Select
                        className={classes.selectStyle}
                        value={bagExtraData.cust_rate}
                        fullWidth
                        displayEmpty
                        onChange={handleChange}
                        color={'secondary'}
                        inputProps={{IconComponent :()=>null}}
                        renderValue={
                            bagExtraData.cust_rate !== '' ? undefined : () => <div style={{color:'#aaa'}}>Customer type</div>
                        } label="Customer type">
                            <MenuItem value={1}>Normal</MenuItem>
                            <MenuItem value={2}>Special</MenuItem>
                        </Select>
                    </Grid>
                }
                <Grid item xs={12} sm={2}>
                    <TextField onChange={(e)=>onTextChangeCustomerData(e,'biller_name')} value={bagExtraData.biller_name} size='small' placeholder={'Name'} color={'secondary'} fullWidth inputProps={{ maxLength:18 }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField  onChange={(e)=>onTextChangeCustomerData(e,'biller_phone')} onKeyPress={(e)=>onlyNumber(e)} value={bagExtraData.biller_phone} size='small' placeholder={'Phone'} color={'secondary'} fullWidth inputProps={{ inputMode: 'numeric', pattern: '[0-9]*',maxLength:10 }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField onChange={(e)=>onTextChangeCustomerData(e,'biller_add')} value={bagExtraData.biller_add} size='small' placeholder={'Address'} color={'secondary'} fullWidth inputProps={{ maxLength:100 }} />
                </Grid>
            </Grid>
            <TableContainer style={{marginTop:20}} className={classes.paperBg} component={Paper}>
                <Table className={classes.tableBorder} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}  size='small' aria-label="spanning table bag">
                    <TableHead className={classes.tableHeaderBg}>
                        <TableRow>
                            <TableCell align={'center'} style={{borderLeft:0,paddingLeft:15,paddingRight:15}} width={20}>S.No</TableCell>
                            <TableCell style={{paddingBottom:6,paddingTop:6,paddingLeft:15}} width={350}>Item description</TableCell>
                            <TableCell align={'center'} width={100}>Qty</TableCell>
                            <TableCell align={'center'} width={100}>Rate</TableCell>
                            <TableCell align={'center'} width={100}>Amount</TableCell>
                            <TableCell align={'center'} width={130}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            cartData.map((ele,i)=>{
                                return(
                                <TableRow key={ele.id}>
                                    <TableCell align={'center'} style={{borderLeft:0}}>{i+1}</TableCell>
                                    <TableCell>
                                        <TextInput
                                        onChange={(e)=>onTextChange(e,'name',i)}
                                        value={ele.name} inputProps={{style: { paddingLeft:15,boxSizing:'inherit',paddingRight:0,textAlign:'left',fontSize:14}}}/>
                                    </TableCell>
                                    <TableCell>
                                        <TextInput 
                                        inputProps={{
                                            style: { boxSizing:'inherit',textAlign:'center',fontSize:14},
                                            maxLength:6
                                        }}
                                        onKeyPress={(e)=>onlyNumber(e)} onChange={(e)=>onTextChange(e,'qty',i)} value={ele.qty}/>
                                    </TableCell>
                                    <TableCell>
                                    <TextInput 
                                        pointerEvents={(bagExtraData.cust_rate == 2 && ele.type != undefined) ? 'none' : 'auto'} 
                                        inputProps={{
                                            style: { paddingLeft:0,boxSizing:'inherit',paddingRight:0,textAlign:'center',fontSize:14},
                                            readOnly:(bagExtraData.cust_rate == 2 && ele.type != undefined ),
                                            maxLength:12
                                        }}
                                        onKeyPress={(e)=>priceInput(e)}
                                        onChange={(e)=> bagExtraData.cust_rate == 2 ? onTextChange(e,'sp_price',i) : onTextChange(e,'price',i)}
                                        value={getPrice(ele)}/>
                                    </TableCell>
                                    <TableCell>
                                        <TextInput 
                                        pointerEvents={'none'} 
                                        inputProps={{
                                            style: { paddingLeft:0,boxSizing:'inherit',paddingRight:0,textAlign:'center',fontSize:14},
                                            readOnly:true
                                        }} value={priceRow(ele.qty,getPrice(ele))}/>
                                    </TableCell>
                                    <TableCell style={{padding:0}} align={'center'}>
                                        <div style={{display:'flex',alignItems:'center',padding:0,justifyContent:'center'}}>
                                            <Tooltip title={'Remove'}>
                                                <IconButton onClick={()=>removeItem(i)} size={'small'}>
                                                    <Clear className={classes.iconAddColor}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={'Reset'}>
                                                <IconButton onClick={()=>resetField(ele.id,i)} style={{marginLeft:14,transform:'rotate(180deg)'}} size={'small'}>
                                                    <Cached className={classes.iconAddColor}/>
                                                </IconButton>
                                            </Tooltip>
                                            {
                                                ele.type != undefined ?
                                                <Tooltip title={'Details'}>
                                                    <IconButton onClick={()=>displayViewModal(true,ele)} style={{marginLeft:14,transform:'rotate(90deg)'}} size={'small'}>
                                                        <MoreVert className={classes.iconAddColor}/>
                                                    </IconButton>
                                                </Tooltip>:
                                                <IconButton disabled style={{marginLeft:14,transform:'rotate(90deg)'}} size={'small'}>
                                                    <MoreVert/>
                                                </IconButton>
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                                )
                            })
                        }
                        {
                            (appSettings.bag_tax === 1 || appSettings.bag_discount === 1) &&
                            <BlankRow title={'Subtotal'} children={subtotal(cartData,bagExtraData.cust_rate)} />
                        }
                        {
                            appSettings.bag_tax === 1 && 
                            <BlankRow title={'Tax(%)'} children={<TextInput onKeyPress={(e)=>priceInput(e)} onChange={(e)=>onTextChangeExtraData(e,'tax')} value={bagExtraData.tax}/>} />
                        }
                        {
                           appSettings.bag_discount === 1 &&
                           <BlankRow title={'Discount(%)'} children={<TextInput onKeyPress={(e)=>priceInput(e)} onChange={(e)=>onTextChangeExtraData(e,'discount')} value={bagExtraData.discount}/>} />
                        }
                        <BlankRow isLast={true} title={'Total'} children={totalPrice(subtotal(cartData,bagExtraData.cust_rate))} />
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container style={{justifyContent:'flex-end',alignItems:'center',marginTop:20}}>
                <Button onClick={()=>clearData()} className={classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold'}} startIcon={<Delete/>}>Clear All</Button>
                <Tooltip title={bagExtraData.cust_rate == 2 ? 'Go with special price' : ''}>
                    <Button onClick={()=>doCheckout()} className={bagExtraData.cust_rate == 2 ? classes.redBtn : classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold',marginLeft:10}} startIcon={<Shop/>}>Checkout</Button>
                </Tooltip>
                {/* <div>
                    <ReactToPrint
                        trigger={() => <Button className={classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold',marginLeft:10}}>Print this out!</Button>}
                        content={() => componentRef.current}
                    />
                    <div style={{display:'none'}}>
                        <PrintComponent ref={componentRef} />
                    </div>
                    </div> */}
            </Grid> 
        </Box>
    );
}

export default Bag;