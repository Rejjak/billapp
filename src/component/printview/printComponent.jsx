import React, { useState, useCallback, useEffect,memo,useContext,useRef, forwardRef } from 'react';
import {Box,Grid, Typography, TableContainer,Table,TableBody,TableCell,TableHead,TableRow, Paper, IconButton, TextField, Button, Tooltip, makeStyles, Card, CardContent,Select,MenuItem,InputLabel} from '@material-ui/core';
import printStyles from './printStyle';
import cornerImg from './trn.png';
import cornerImgD from './trnd.png';
import { ToWords } from 'to-words';
import {ColorModeContext} from '../../store';

const toWords = new ToWords();
function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

function formatDate(date_obj){
    var date = new Date(date_obj);
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    if(day<10){
        day = '0'+day;
    }
    if(month<10){
        month = '0'+month;
    }
    var curDate = day+'/'+month+'/'+year;
    return curDate;
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

const calculatedValue = (subtotal,value,type,discountValue = null)=> {
    let totalAmount = Number(subtotal);
    if(type == 'discount' && value != '' && !isNaN(value)){
        let disAmount = (Number(value)/100)*totalAmount;
        return ccyFormat(disAmount);
    }

    if(type == 'tax' && value != '' && !isNaN(value)){
        if(discountValue != null && discountValue != ''){
            let disAmount = (Number(discountValue)/100)*totalAmount;
            totalAmount = totalAmount - disAmount;
        }
        let taxAmount = (Number(value)/100)*totalAmount;
        return ccyFormat(taxAmount);
        //totalAmount = totalAmount + taxAmount;
    }
}

 
function sub_total(items,cust_type) {
    let num = 0;
    if(cust_type == 2){
        num = items.map((ele)=>!isNaN(ele.sp_price*ele.qty)?ele.sp_price*ele.qty:0).reduce((sum,curVal)=>sum+curVal,0);
    }else{
        num = items.map((ele)=>!isNaN(ele.price*ele.qty)?ele.price*ele.qty:0).reduce((sum,curVal)=>sum+curVal,0);
    }
    return ccyFormat(num);
}

const BlankRow = ({title,children,isLast})=> {
  return(
      <>
          <TableRow>
              <TableCell style={{borderLeft:0,borderBottom:0}} />
              <TableCell style={{borderLeft:0,borderBottom:0}} />
              <TableCell style={{borderLeft:0,borderBottom:0}} />
              <TableCell style={isLast ? {borderBottom:0,paddingRight:0,paddingBottom:5,paddingTop:5}:{paddingRight:0,paddingBottom:5,paddingTop:5}} align={'center'}>{title}</TableCell>
              <TableCell style={isLast ? {borderBottom:0,paddingRight:0}:{paddingRight:0}} align={'center'}>{children}</TableCell>
          </TableRow>
      </>
  )
}

const PrintComponent = forwardRef((props, ref) => {
    const isDisplay = props.isDisplay;
    const invData = props.data[0];
    const classes = printStyles();
    const itemsData = JSON.parse(invData.items);
    const buyerData = JSON.parse(invData.bag_extra);
    const [subtotal,setSubTotal] = useState();
    const {settingsData} = useContext(ColorModeContext);
    const mySettings = settingsData[0];

    const getPrice = (ele)=> {
        if(buyerData.cust_rate == 2){
            return ele.sp_price
        }else{
            return ele.price;
        }
    }

    useEffect(()=>{
        setSubTotal(sub_total(itemsData,buyerData.cust_rate));
    },[])
    
    return (
      <div style={{backgroundColor:'#ffffff'}} ref={ref}>
        <div style={{position:'relative',padding:45}}>
            <Grid container style={{justifyContent:'space-between'}}>
                <Grid style={{paddingRight:20}} item xs={12} sm={6}>
                    <Typography style={{position:'relative',bottom:8}} className={classes.shopName}>{mySettings.com_name}</Typography>
                </Grid>
                <Grid style={{justifyContent:'flex-end',zIndex:1}} item xs={12} sm={6}>
                    <Typography style={{textAlign:'right'}} className={classes.shopAdd}>{mySettings.com_add_one}</Typography>
                    <Typography style={{textAlign:'right'}} className={classes.shopAdd}>{mySettings.com_add_two}</Typography>
                    <Typography style={{textAlign:'right'}} className={classes.shopAdd}>{mySettings.com_add_three}</Typography>
                </Grid>
                <Box
                    component="img"
                    sx={{
                        height: 80
                    }}
                    style={{position:'absolute',right:0,top:0}}
                    alt="Image"
                    src={cornerImg}
                />
            </Grid>
            <Grid container style={{justifyContent:'center',marginTop:15}}>
                <Typography className={classes.shopProf}>Prop. : {mySettings.own_name}</Typography>
            </Grid>
            <Grid container style={{justifyContent:'space-between',marginTop:25}}>
            <Grid style={{paddingRight:20}} item xs={12} sm={6}>
                    <Typography component={'h2'} className={classes.invoiceNo}>Invoice No: {invData.id}</Typography>
                    <Typography className={classes.fontStl}>Date: {formatDate(invData.added_on)}</Typography>
            </Grid>
            <Grid style={{justifyContent:'flex-end'}} item xs={12} sm={6}>
            <Typography style={{textAlign:'right'}} className={classes.invoiceNo}>Buyer Details</Typography>
                <Typography style={{textAlign:'right'}} className={classes.fontStl}>Name: {buyerData.biller_name}{buyerData.biller_phone != '' ? ", Phone: "+buyerData.biller_phone:''}</Typography>
                {
                   buyerData.biller_add != '' &&
                   <Typography style={{textAlign:'right'}} className={classes.fontStl}>Address: {buyerData.biller_add}</Typography>
                }
            </Grid>
            </Grid>
            <div className={classes.divBorder}>
            <Box style={{
                position:'absolute',
                alignItems:'center',
                justifyContent:'center',
                alignSelf:'center',
                display:'flex',
                left:0,
                right:0,
                transform:'rotate(-20deg)',
                pointerEvents:'none',
                userSelect:'none'
            }}>
                <Typography className={classes.shopProfWaterMark}>{mySettings.own_name}</Typography>
            </Box>
            <Table className={classes.tableBorder} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}  size='small' aria-label="spanning table bag">
                <TableHead className={classes.tableHeader}>
                    <TableRow>
                        <TableCell align={'center'} style={{borderLeft:0,paddingLeft:15,paddingRight:15}} width={20}>S.No</TableCell>
                        <TableCell style={{paddingBottom:6,paddingTop:6,paddingLeft:15}} width={350}>Perticulars</TableCell>
                        <TableCell align={'center'} width={100}>Quantity</TableCell>
                        <TableCell align={'center'} width={110}>Rate</TableCell>
                        <TableCell align={'center'} width={110}>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {
                        itemsData.map((ele,i)=>{
                            return(
                                <TableRow key={i}>
                                    <TableCell align={'center'} style={{borderLeft:0,paddingTop:5,paddingBottom:5}}>{i+1}</TableCell>
                                    <TableCell style={{paddingLeft:15}}>{ele.name}</TableCell>
                                    <TableCell align={'center'}>{ele.qty}</TableCell>
                                    <TableCell align={'center'}>{getPrice(ele)}</TableCell>
                                    <TableCell align={'center'}>{priceRow(ele.qty,getPrice(ele))}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                    {
                        ((buyerData.tax != '' && buyerData.tax != 0 && Number(buyerData.tax) > 0) || (buyerData.discount != '' && buyerData.discount != 0 && Number(buyerData.discount) > 0)) &&
                        <BlankRow title={'Subtotal'} children={subtotal} />
                    }
                    {
                        (buyerData.discount != '' && buyerData.discount != 0 && Number(buyerData.discount) > 0) && 
                        <BlankRow title={'Discount ('+buyerData.discount+'%)'} children={calculatedValue(subtotal,buyerData.discount,'discount')} />
                    }
                    {
                        (buyerData.tax != '' && buyerData.tax != 0 && Number(buyerData.tax) > 0) &&
                        <BlankRow title={'Tax ('+buyerData.tax+'%)'} children={calculatedValue(subtotal,buyerData.tax,'tax',buyerData.discount)} />
                    }
                    <BlankRow isLast={true} title={'Total'} children={invData.total_amount} />
                </TableBody>
            </Table>
            </div>
            <Grid container style={{justifyContent:'space-between',marginTop:20}}>
            <Grid style={{paddingRight:20}} item xs={12} sm={8}>
                <Typography className={classes.fontStl} style={{marginLeft:3}}>
                Amount(in words): {toWords.convert(invData.total_amount,{currency: true, ignoreZeroCurrency: true})}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography className={classes.fontStl}>Signature :</Typography>
            </Grid>
            </Grid>
        </div>
        {
            (mySettings.inv_footer_pos === 1 && itemsData.length < 23) &&
            <Grid container className={isDisplay? `${classes.footer}`:`${classes.footerPrintTime}`}>
                <Box
                    component="img"
                    sx={{
                        height: 80
                    }}
                    alt="Image"
                    src={cornerImgD}
                />
                <Grid item xs={12} sm={4}>
                    <Typography className={classes.shopAddFooter}>WhatsApp: {mySettings.own_wp}</Typography>
                    <Typography className={classes.shopAddFooter}>Email: {mySettings.own_email}</Typography>
                </Grid>
                <Grid style={{position:'absolute',right:40,marginTop:50}} item xs={12} sm={4}>
                    <Typography className={classes.devText}>{'Developed by Rejjak Ali'}</Typography>
                </Grid>
            </Grid>
        }
      </div>
    );
})

export default PrintComponent;