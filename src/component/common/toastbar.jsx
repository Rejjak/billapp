import React, { useState, useContext } from 'react';
import {Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

const ToastBar = React.memo(({open,title,handleClose,autoHideDuration}) => {
    return (
        <Snackbar style={{marginTop:50}} anchorOrigin={{vertical:'top',horizontal:'right'}} open={open} autoHideDuration={autoHideDuration ? autoHideDuration : 800} onClose={handleClose}>
            <Alert color={title.includes("already") ? 'error' : 'success'} style={{color:'#fff',backgroundColor:'#000'}} severity={title.includes("already") ? 'error' : 'success'} onClose={handleClose} sx={{ width: '100%' }}>
                {title}
            </Alert>
        </Snackbar>
    )
})

export default ToastBar;