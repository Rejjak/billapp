import React, { useState, useContext } from 'react';
import {Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

const ToastErr = React.memo(({open,title,handleClose}) => {
    return (
        <Snackbar style={{marginTop:50}} anchorOrigin={{vertical:'top',horizontal:'right'}} open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert color={'error'} style={{color:'#fff',backgroundColor:'#000'}} severity={'error'} onClose={handleClose} sx={{ width: '100%' }}>
                {title}
            </Alert>
        </Snackbar>
    )
})

export default ToastErr;