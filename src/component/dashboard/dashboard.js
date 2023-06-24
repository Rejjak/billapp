import React, { useState, useEffect, useRef, createRef, useContext } from 'react';
import {Box,Grid,Card,CardContent,Typography,makeStyles,Button} from '@material-ui/core';
import RequestService from '../../service/requestService';
import FireStoreService from '../../service/firestore';
import {ColorModeContext} from '../../store';
import {getMonthlyData,getSalesAmount,formatDailyChartData} from '../../service/calculation';

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
        text: 'Current year monthly data',
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
        text: 'Current month daily data',
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
        label: '',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth:3
        }
    ],
};

function Dashboard(props) {
    const classes = Styles();
    const {typeData,brandData,updateType,updateBrand,productData,updateProduct,updateSettngs,updateLicence,licenceData} = useContext(ColorModeContext);
    const [data,setData] = useState(null);
    const [dailyData,setDailyData] = useState(null);
    const [salesAmount,setSalesAmount] = useState(null);

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
            req_url : 'sales-get',
            data : null
        }
        RequestService.addRequest(payload).then((res)=>{
            const chartData = getMonthlyData(res);
            setSalesAmount(getSalesAmount(res));
            setDailyData(formatDailyChartData(res))
            const newData = {...formatData};
            newData.datasets[0].data = chartData.map((ele)=>ele.total_amount);
            setData(newData);
            console.log(formatDailyChartData(res));
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
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.num_count}>{salesAmount?.totalAmountToday}</Typography>
                            <Typography className={classes.card_bottom_text}>Total Users</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.num_count}>{salesAmount?.totalAmountCurrentMonth}</Typography>
                            <Typography className={classes.card_bottom_text}>Total Users</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.num_count}>{salesAmount?.totalAmountCurrentYear}</Typography>
                            <Typography className={classes.card_bottom_text}>Active Devices</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box mt={2}>
                <Grid item xs={12} sm={12}>
                    <Card className={classes.card}>
                        <CardContent>
                        {
                            data != null &&
                            <Line options={options} data={data} />
                        }
                        </CardContent>
                    </Card>
                </Grid>
                <Box mt={2}>
                    <Grid item xs={12} sm={12}>
                        <Card className={classes.card}>
                            <CardContent>
                            {
                                dailyData != null &&
                                <Line options={optionsdaily} data={dailyData} />
                            }
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
            </Box>
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