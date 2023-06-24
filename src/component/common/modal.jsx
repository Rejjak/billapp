import React,{memo} from 'react';
import {Typography, Fade, Modal, Box,Backdrop,makeStyles,DialogActions,Button,Grid,DialogContentText,DialogTitle,DialogContent} from '@material-ui/core';

const Styles = makeStyles((theme)=>({
    card:{
        ...(theme.palette.type === 'dark') ? {
            border : '1px solid #1E4976',
            backgroundColor:theme.palette.cardBackground,
        }:{
            border : '1px solid #fff',
        }
    },
    colorBtn:{
        backgroundColor:theme.palette.type === 'dark' ? 'transparent' : theme.palette.buttonColor,
        border:`1px solid ${theme.palette.type === 'dark' ? '#fff' : theme.palette.buttonColor}`,
        paddingLeft:'13px',
        paddingRight:'13px',
        borderRadius:'0px',
        color:'#FFFFFF',
        height:'30px',
        fontSize:'13px',
        textTransform:'none',
        "&:hover":{
            backgroundColor:theme.palette.buttonColor
        }
    },
}))

const AppModal = ({visible,handleClose,handleSubmit,children,title,width,dialogModal,subTitle,submitTxt}) => {
    let style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:width ? width : 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 3,
    };
    let dialogStyle = {
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 2,
    };
    const classes = Styles();
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={visible}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={visible}>
                {
                    (dialogModal != undefined && dialogModal === true) ?
                    <Box className={classes.card} sx={dialogStyle}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                        {title}
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            {subTitle}
                        </DialogContentText>
                        <Box mt={4}>
                            <Grid container style={{justifyContent:'flex-end'}}>
                                {
                                    handleClose != null && 
                                    <Button color={'default'} className={classes.colorBtn} style={{marginRight:10}} onClick={handleClose}>Cancel</Button>
                                }
                                <Button color={'default'} className={classes.colorBtn} style={{fontWeight:'bold'}} onClick={handleSubmit} type="submit">{submitTxt != undefined ? submitTxt : 'Delete'}</Button>
                            </Grid>
                        </Box>
                    </Box>:
                    <Box className={classes.card} sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                        {title}
                        </Typography>
                        {children}
                        <Box mt={4}>
                            <Grid container style={{justifyContent:'flex-end'}}>
                                <Button color={'default'} className={classes.colorBtn} onClick={handleClose}>{handleSubmit != undefined ? 'Cancel' : 'Close'}</Button>
                                {
                                    handleSubmit != undefined &&
                                    <Button color={'default'} className={classes.colorBtn} style={{fontWeight:'bold',marginLeft:10}} onClick={handleSubmit} type="submit">Submit</Button>
                                }
                            </Grid>
                        </Box>
                    </Box>
                }
            </Fade>
        </Modal>
    );
}

export default memo(AppModal);
