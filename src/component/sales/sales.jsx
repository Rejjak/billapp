import React, { useState, useCallback, useEffect,memo,useContext } from 'react';
import {Box,Grid, Typography, TableContainer,Table,TableBody,TableCell,TableHead,TableRow, Paper, IconButton, TextField, Button, Tooltip, makeStyles, Card, CardContent} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import { useNavigate } from "react-router-dom";
import {Edit, Delete, Add, ShoppingBasket, Receipt} from '@material-ui/icons';
import AppModal from '../common/modal';
import RequestService from '../../service/requestService';
import commonStyles from '../style/commonStyle';

const ActionBtn = ({onDelete,onReceipt}) => {
    const classes = commonStyles();
    return (
        <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:0}}>
            <Tooltip title={'Receipt'}>
                <IconButton onClick={onReceipt} size={'small'}>
                    <Receipt className={classes.iconAddColor}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={'Delete'}>
                <IconButton onClick={onDelete} size={'small'}>
                    <Delete className={classes.iconAddColor}/>
                </IconButton>
            </Tooltip>
        </div>
    )
};
var saleTempData = [];
function Sales(props) {
    const navigate = useNavigate()
    const classes = commonStyles();
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [prdId, setPrdId] = useState(null);
    const [searchTxt,setSearchTxt] = useState('');
    const [isLoaded,setLoaded] = useState(false);
    const [salesData,setSalesData] = useState([]);

    useEffect(()=>{
        getSales();
    },[]);

    const navigateTo = (id)=> {
        navigate(`/print/${id}`);
    }

    const displayDeleteModal = useCallback((value,prd_id = null)=>{
        setDeleteModal(value);
        setPrdId(prd_id);
    },[showDeleteModal]);

    const updateSearch = useCallback((v)=> {
        setSearchTxt(v);
    },[searchTxt]);

    const deleteProduct = ()=> {
        let payload = {
            req_url : 'sales-delete',
            data : {id:prdId}
        }
        RequestService.addRequest(payload).then((res)=>{
            getSales();
            displayDeleteModal(false);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const getSales = ()=> {
        let payload = {
            req_url : 'sales-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            setSalesData(res);
            saleTempData = res;
            setLoaded(true);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const checkBorder = (arr,i)=> {
        if(i == arr.length -1){
            return {borderBottom:0}
        }else{
            return null
        }
    }

    const makeValidAddress = (name,phone,add)=> {
        let str = '';
        if(phone != ''){
            str = name + ', '+phone;
        }else{
            str = name + ', '+add;
        }
        return str;
    }

    const changedSalesDataOnSearch = useCallback((value)=>{
        setSalesData(value);
    },[salesData]);

    const search = (searchText)=>{
		updateSearch(searchText);
		if(saleTempData.length>0){
			let data = [...saleTempData];
			let newData = [];
			if(searchText != ''){
				newData = data.filter(function(item){
                    let exstraData = JSON.parse(item.bag_extra);
					let name = exstraData.biller_name.toUpperCase();
                    let phone = exstraData.biller_phone.toUpperCase();
                    let add = exstraData.biller_add.toUpperCase();
                    let cust_type = exstraData.cust_rate == 1 ? 'NORMAL' : 'SPECIAL';
                    let amount = item.total_amount;
                    let bill_id = item.id.toString();
                    let bill_date = formatDate(item.added_on).toString();
					let textData = searchText.toUpperCase().trim();
					return (name.indexOf(textData) > -1 || phone.indexOf(textData) > -1 || add.indexOf(textData) > -1 || cust_type.indexOf(textData) > -1 || amount.indexOf(textData) > -1 || bill_id.indexOf(textData) > -1 || bill_date.indexOf(textData) > -1) 
                });
                changedSalesDataOnSearch(newData);
			}else{
                changedSalesDataOnSearch(saleTempData);
            }
		}else{
            changedSalesDataOnSearch(saleTempData);
        }
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

    return (
        <Box mt={2}>
            <AppModal 
            dialogModal={true}
            title={'Delete product'}
            subTitle={'Are you sure you want to delete this product?'}
            handleClose={()=>displayDeleteModal(false)} 
            handleSubmit={()=>deleteProduct()}
            visible={showDeleteModal}/>
            <Typography style={{fontFamily:'Roboto-Medium'}} variant={'h6'}>Sales History</Typography>
            <Grid container style={{justifyContent:'space-between',alignItems:'center',marginTop:20}}>
                <div></div>
                <Grid item xs={12} sm={4}>
                    <TextField color={'secondary'} 
                    onChange={(e)=>search(e.target.value)} 
                    placeholder={'Search here...'} fullWidth inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                </Grid>
            </Grid>
            {
                (isLoaded && salesData.length == 0) ?
                <Typography style={{fontFamily:'Roboto-Medium',textAlign:'center',marginTop:100}} variant={'h6'}>No results found</Typography>:
                <TableContainer style={{marginTop:20}} className={classes.paperBg} component={Paper}>
                    <Table className={classes.normalBorder} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} size={'small'} aria-label="spanning table">
                        <TableHead className={classes.tableHeaderBg}>
                            <TableRow>
                                <TableCell align="center" style={{borderLeft:0}} width={20}>S.No</TableCell>
                                <TableCell style={{paddingBottom:5,paddingTop:5,paddingLeft:15}}>Customer Details</TableCell>
                                <TableCell align="center">Amount</TableCell>
                                <TableCell align="center">Invoice No</TableCell>
                                <TableCell align="center">Bill Type</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                salesData.map((ele,i)=>{
                                    let exstraData = JSON.parse(ele.bag_extra);
                                    let cust = makeValidAddress(exstraData.biller_name,exstraData.biller_phone,exstraData.biller_add);
                                    return (
                                        <TableRow key={ele.id}>
                                            <TableCell align="center" style={{borderLeft:0,...checkBorder(salesData,i)}}>{i+1}</TableCell>
                                            <TableCell style={{paddingLeft:15,...checkBorder(salesData,i)}}>{cust}</TableCell>
                                            <TableCell align="center" style={checkBorder(salesData,i)}>{ele.total_amount}</TableCell>
                                            <TableCell align="center" style={checkBorder(salesData,i)}>{ele.id}</TableCell>
                                            <TableCell align="center" style={checkBorder(salesData,i)}>{exstraData.cust_rate == 1 ? 'Normal':'Special'}</TableCell>
                                            <TableCell align="center" style={checkBorder(salesData,i)}>{formatDate(ele.added_on)}</TableCell>
                                            <TableCell align="center" style={checkBorder(salesData,i)}><ActionBtn onBag={()=>console.log(2)} onReceipt={()=>navigateTo(ele.id)} onDelete={()=>displayDeleteModal(true,ele.id)}/></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </Box>
    );
}

export default Sales;