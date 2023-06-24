import React, { useState } from 'react';
import {Typography, Fade, Modal, Box,Avatar,makeStyles,DialogActions,Button,IconButton} from '@material-ui/core';
import {Backup,Attachment,InsertDriveFile} from '@material-ui/icons';

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
  fileColor:{
    color : (theme.palette.type === 'dark') ? '#fff' : theme.palette.primary.main
  },
}));

function getFileExtension(filename) {
    return '.' + filename.split('.').pop().toLowerCase();
}

export default function BackupBtn({onChange,defaultValue}) {
  const classes = useStyles();
  //const [backfile,setBackupFile] = useState(defaultValue);

  const onFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const allowedExtensions = ['.wtt'];
        const fileExtension = getFileExtension(file.name);
        if (!allowedExtensions.includes(fileExtension)) {
            event.target.value = '';
            alert('Please select a valid SQLite file.');
        }else{
          const newName = 'new_db.sqlite';
          const updatedFile = new File([file], newName, { type: file.type });
          onChange({ filePath: file.path, updatedName: updatedFile.name, orignalName: file.name});
        }
    }else{
        onChange('');
    }
  }

  return (
    <div className={classes.root}>
      <>
        <input onChange={(e)=>onFileChange(e)} accept=".wtt" className={classes.input} id="iconnn-button-file" type="file" />
        <label htmlFor="iconnn-button-file">
          <IconButton color="primary" aria-label="upload file" component="span">
            {
                defaultValue != '' ? 
                <>
                    <InsertDriveFile className={classes.iconAddColor} style={{fontSize:56}} />
                    <span className={classes.fileColor}>{defaultValue}</span>
                </>:
                <Backup className={classes.iconAddColor} style={{fontSize:56}} />
            }
          </IconButton>
        </label>
        </>
    </div>
  );
}