import React, { useState } from 'react';
import {Typography, Fade, Modal, Box,Backdrop,makeStyles,DialogActions,Button,IconButton} from '@material-ui/core';
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

export default function UploadButtons({onChange,defaultImage,userIcon}) {
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
      {
        image != '' ?
        <Box
        onClick={()=>{
          setImage('');
          onChange('');
        }}
        component="img"
        sx={{
            height: 73,
            width: 73,
            borderRadius:6
        }}
        alt="Image"
        src={image}
        />:
        <>
        <input onChange={(e)=>onImageChange(e)} accept="image/*" className={classes.input} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            {
              userIcon != undefined ?
              <AccountCircle className={classes.iconAddColor} style={{fontSize:56}} />:
              <PhotoCamera className={classes.iconAddColor} style={{fontSize:70}} />
            }
          </IconButton>
        </label>
        </>
      }
    </div>
  );
}