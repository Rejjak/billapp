import React, { useState, useEffect, useRef, createRef, useContext } from 'react';
import {Box,Grid,Card,CardContent,Typography,makeStyles,Button} from '@material-ui/core';
import RequestService from '../../service/requestService';
import FireStoreService from '../../service/firestore';
import {ColorModeContext} from '../../store';
import '../common/loader/basicLoader.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  const currDate = new Date();
  const currYear = currDate.getFullYear();
  
  const optionsDay = { day: 'numeric', month: 'long', year: 'numeric' };
  const dayName = currDate.toLocaleDateString('en-US', optionsDay);
  
  const optionsMonth = { month: 'long', year: 'numeric' };
  const monthName = currDate.toLocaleDateString('en-US', optionsMonth);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
  
const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        text: 'Current year monthly data - '+currYear,
      },
      scales: {
        x: {
          display: false, // Hide the button at the top of the chart
        },
        y: {
          display: true
        },
      },
      elements: {
        line: {
          borderColor: '#ffffff',
          backgroundColor:'#ffffff'
        },
        point: {
            borderColor: '#ffffff',
            backgroundColor:'#ffffff'
        },
      }  
    }
};
  

const optionsdaily = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        text: 'Current month daily data - '+monthName,
      },
      scales: {
        x: {
          display: false, // Hide the button at the top of the chart
        },
        y: {
          display: true
        },
      }  
    },
};
  
  
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatData = {
    labels,
    datasets: [
        {
            label: 'Total Amount',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth:3
        }
    ],
};



function Dashboard(props) {
    const classes = Styles();
    const {typeData,brandData,updateType,updateBrand,productData,updateProduct,updateSettngs,updateLicence,licenceData,monthlyData,dailyData,salesAmount,updateMonthlyData,updateDailyData,updateSalesAmount,updateSalesCount} = useContext(ColorModeContext);

    useEffect(()=>{
        getType();
        getBrand();
        getProduct();
        getFinalSettings();
        getSales();
        if(licenceData === null){
            getMacAdd();
        }
    },[]);

    const getSales = ()=> {
        let payload = {
            req_url : 'dashboard-statistics',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            const newData = {...formatData};
            newData.datasets[0].data = res.monthlyData;
            updateSalesAmount(res.salesAmount);
            updateDailyData(res.dailyData)
            updateMonthlyData(newData);
            updateSalesCount(res.salesCount);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const getFinalSettings = ()=> {
        let old_pass = localStorage.getItem("old_passowrd");
        if(old_pass != null){
            let values = JSON.parse(old_pass);
            let payload = {
                req_url : 'settings-update',
                data : values
            }
            RequestService.addRequest(payload).then((res)=>{
                getSettings();
                localStorage.removeItem("old_passowrd");
            }).catch((err)=>{
                console.log(err);
            }); 
        }else{
            getSettings();
        }
    }

    const getMacAdd = ()=> {
        let payload = {
            req_url : 'macadd-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            activeApp(res.mac_add);
        }).catch((err)=>{
            console.log(err);
        });
    }

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

    const getType = ()=> {
        if(typeData.length == 0){
            let payload = {
                req_url : 'type-get',
                data : null
            }
            RequestService.addRequest(payload).then((res)=>{
                updateType(res);
            }).catch((err)=>{
                console.log(err,'added type err');
            });
        }
    }

    const getBrand = ()=> {
        if(brandData.length == 0){
            let payload = {
                req_url : 'brand-get',
                data : null
            }
            RequestService.addRequest(payload).then((res)=>{
                updateBrand(res);
            }).catch((err)=>{
                console.log(err,'added Brand err');
            });
        }
    }

    const getProduct = ()=> {
        if(productData.length == 0){
            let payload = {
                req_url : 'product-get',
                data : null
            }
            RequestService.addRequest(payload).then((res)=>{
                updateProduct(res);
            }).catch((err)=>{
                console.log(err);
            });
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

    return (
        <Box mt={2}>
            {
                dailyData != null ?
                <>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.num_count}>{salesAmount?.totalAmountToday}</Typography>
                                <Typography className={classes.card_bottom_text}>Today</Typography>
                                <Typography style={{fontSize:15,textAlign:'center'}}>( {dayName} )</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.num_count}>{salesAmount?.totalAmountCurrentMonth}</Typography>
                                <Typography className={classes.card_bottom_text}>This Month</Typography>
                                <Typography style={{fontSize:15,textAlign:'center'}}>( {monthName} )</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.num_count}>{salesAmount?.totalAmountCurrentYear}</Typography>
                                <Typography className={classes.card_bottom_text}>This Year</Typography>
                                <Typography style={{fontSize:15,textAlign:'center'}}>( {currYear} )</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Grid item xs={12} sm={12}>
                        {
                            dailyData != null &&
                            <Card className={classes.card}>
                                <CardContent>
                                    <Line options={optionsdaily} data={dailyData} />
                                </CardContent>
                            </Card>
                        }
                    </Grid>
                    <Box mt={2}>
                        <Grid item xs={12} sm={12}>
                            {
                                monthlyData != null && 
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Line options={options} data={monthlyData} />
                                    </CardContent>
                                </Card>
                            }
                        </Grid>
                    </Box>
                </Box>
                </>:
                <Box style={{display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',top:0,bottom:0,left:245,right:0}}>
                    <Box style={{flexDirection:'column',alignItems:'center',justifyContent:'center',display:'flex'}}>
                        <div className='loader'></div>
                        <span style={{marginTop:20}}>Calculating your statistics, please wait...</span>
                    </Box>
                </Box>
            }
        </Box>
    );
}

const Styles = makeStyles((theme)=>({
    num_count : {
        fontSize : '25px',
        color:'#3399FF',
        textAlign:'center'
    },
    card_bottom_text : {
        fontSize : '25px',
        marginTop: '10px',
        textAlign:'center',
        ...(theme.palette.type === 'dark') ? {
            color:'#ddd'
        }:null
    },
    card:{
        borderRadius:'8px',
        ...(theme.palette.type === 'dark') ? {
            border : '1px solid #1E4976',
            backgroundColor:theme.palette.cardBackground,
        }:{
            border : '1px solid #fff',
        }
    }
}))

export default Dashboard;