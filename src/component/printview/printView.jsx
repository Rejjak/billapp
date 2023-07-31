import React, { useState, useCallback, useEffect,memo,useContext,useRef } from 'react';
import {Box,Grid, Typography, TableContainer,Table,TableBody,TableCell,TableHead,TableRow, Paper, IconButton, TextField, Button, Tooltip, makeStyles, Card, CardContent,Select,MenuItem,InputLabel} from '@material-ui/core';
import PrintComponent from './printComponent';
import commonStyles from '../style/commonStyle';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import {useParams} from 'react-router-dom';
import RequestService from '../../service/requestService';
import {ColorModeContext} from '../../store';
const PrintView = ()=> {
    const {licenceData,salesCount,defaultAccessLimit} = useContext(ColorModeContext);
    const componentRef = useRef();
    const btnRef = useRef(null);
    const classes = commonStyles();
    const params = useParams();
    const [invData,setInvData] = useState(null);
    
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            document.removeEventListener('keydown', handleKeyPress);
            if(btnRef.current != null){
                btnRef.current.click();
            }
        }
    }; 

    const getInvoice = ()=> {
        let payload = {
            req_url : 'sales-get',
            data : {
                id : params.inv_id,
            }
        }
        RequestService.addRequest(payload).then((res)=>{
            setInvData(res);
        }).catch((err)=>{
            console.log(err);
        });
    }

    useEffect(()=>{
        getInvoice();

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };

    },[]);

    const showAlert = async()=> {
        let payload = {
            req_url : 'show-alert',
            data : {
                title : licenceData.alertMsg.title,
                msg:licenceData.alertMsg.message
            }
        }
        await RequestService.addRequest(payload)
    }

    return (
        <Box mt={2}>
            {
                invData != null &&
                <>
                    <PrintComponent data={invData} isDisplay={true}/>
                    <Grid container style={{justifyContent:'flex-end',alignItems:'center',marginTop:20}}>
                        {
                            licenceData != null &&
                            <>
                            {
                                (!licenceData.showAlert || salesCount < defaultAccessLimit) ?
                                <ReactToPrint
                                documentTitle={'bill_'+params.inv_id}
                                trigger={() => <Button ref={btnRef} className={classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold',marginLeft:10}}>Print this out!</Button>}
                                content={() => componentRef.current}
                                />:
                                <Button onClick={()=>showAlert()} className={classes.colorBtn} style={{color:'#fff',fontSize:12,fontWeight:'bold',marginLeft:10}}>Print this out!</Button>
                            }
                            </>
                        }
                        <div style={{display:'none'}}>
                            <PrintComponent data={invData} isDisplay={false} ref={componentRef}/>
                        </div>
                    </Grid> 
                </>
            }
        </Box>
    )
}

export default PrintView;