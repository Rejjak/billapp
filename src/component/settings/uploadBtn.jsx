import React, { useState } from 'react';
import {Typography, Fade, Modal, Box,Avatar,makeStyles,DialogActions,Button,IconButton} from '@material-ui/core';
import {PhotoCamera,AccountCircle} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  iconAddColor:{
    color : (theme.palette.type === 'dark') ? '#99CCF3' : theme.palette.primary.main
},
}));

export default function UploadBtn({onChange,defaultImage}) {
  const classes = useStyles();
  const [image,setImage] = useState(defaultImage != undefined ? defaultImage : '');

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        onChange(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  return (
    <div className={classes.root}>
      <>
        <input onChange={(e)=>onImageChange(e)} accept="image/*" className={classes.input} id="iconn-button-file" type="file" />
        <label htmlFor="iconn-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
                {
                    image != '' ?
                    <Avatar style={{height:56,width:56,borderRadius:28}} src={image}/>:
                    <AccountCircle className={classes.iconAddColor} style={{fontSize:56}} />
                }
          </IconButton>
        </label>
        </>
    </div>
  );
}