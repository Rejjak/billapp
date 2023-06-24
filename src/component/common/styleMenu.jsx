import * as React from 'react';
import {Menu} from '@material-ui/core';
import { styled } from '@material-ui/styles';

const StyledMenu = styled((props) => (
    <Menu
      style={{position:'fixed',left:16}}
      elevation={0}
    //   anchorOrigin={{
    //     vertical: 'bottom',
    //     horizontal: 'right',
    //   }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      minWidth: 90,
      marginTop:theme.spacing(2.5),
      color:theme.palette.type === 'light' ? '#1E64AE' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        //padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: '#1E64AE',
          marginTop:theme.spacing(1.5)
          //marginRight: theme.spacing(1.5),
        }
      },
    },
  }));

  export default StyledMenu;