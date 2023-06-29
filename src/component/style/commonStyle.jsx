import {makeStyles} from '@material-ui/core';
import {blue,grey,blueGrey} from '@material-ui/core/colors';
const commonStyles = makeStyles((theme)=>({
    user_img:{
        height : '25px',
        width : '25px'
    },
    toolbar:{
        display:'flex',
        justifyContent:'space-between',
        boxShadow :theme.palette.type === 'dark' ? 'inset 0px -1px 1px #132F4C' : null
    },
    navList:{
        minWidth:'250px',
        maxWidth:'300px'
    },
    des:{
        fontSize:'10px',
        color:grey['A700']
    },
    drawerPaper:{
        width:'250px',
        marginTop:'64px',
        outline: 0,
        background:theme.palette.drawerBackground
    },
    drawerPaperMobile:{
        width:'250px',
        outline: 0,
        background:theme.palette.drawerBackground
    },
    navLink:{
        color:theme.palette.sidebarDefaultColor,
        "& div":{
            color:theme.palette.sidebarDefaultColor
        },
        "&:hover,&:hover div":{
            color:theme.palette.sidebarActiveColor
        }
    },
    logout:{
        marginLeft:10,
        fontWeight:'bold',
        fontSize:14,
        color:theme.palette.type === 'dark' ? '#ccc' : 'rgba(0, 0, 0, 0.54)'
    },
    logoutIconColor : {
        fontSize : '20px',
        color:(theme.palette.type === 'dark') ? '#ccc' : 'rgba(0, 0, 0, 0.54)'
    },
    logoutContainer:{
        height:50,
        width:100,
        position:'fixed',
        bottom:10,
        alignSelf:'center',
        flexDirection:'row',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginRight:'30px'
    },
    navLinkActive:{
        color: theme.palette.sidebarActiveColor,
        "& div":{
            color:theme.palette.sidebarActiveColor
        }
    },
    wrapper: {
        width: "100%",
        minHeight: "100vh",
        height: "auto",
        zIndex:"999999999",
        background: theme.palette.background,
        boxSizing: "border-box",
        padding: "70px 24px 24px 270px",
        [theme.breakpoints.down("sm")]: {
          padding: "70px 24px 24px 24px",
        },
    },
    wrapperNoPadding: {
        width: "100%",
        minHeight: "100vh",
        height: "auto",
        zIndex:"999999999",
        background: theme.palette.background,
        boxSizing: "border-box",
        paddingTop:'150px'
    },
    suspaneWrapper: {
        display : 'flex',
        justifyContent:'center',
        alignItems:'center',
        minHeight: "100vh",
        zIndex:'9999999'
    },
    paperBg:{
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
        borderRadius:'0px!important',
        color:'#FFFFFF!important',
        height:'30px',
        textTransform:'none!important',
        "&:hover":{
            backgroundColor:`${theme.palette.buttonColor}!important`
        }
    },
    redBtn:{
        backgroundColor:'rgb(235, 0, 20)',
        border:'1px solid rgb(235, 0, 20)',
        paddingLeft:'13px',
        paddingRight:'13px',
        borderRadius:'0px!important',
        color:'#FFFFFF',
        height:'30px',
        textTransform:'none!important',
        "&:hover":{
            backgroundColor:'rgb(235, 0, 20)!important'
        }
    },
    inputLabel:{
        color: theme.palette.type === 'dark' ? '#FFFFFF' : theme.palette.primary.main
    },
    noBorder: {
        border: "none",
    },
    boxSize:{
        boxSizing:'inherit!important'
    },
    tableBorder: {
        "& .MuiTableCell-root": {
            borderLeft: theme.palette.type === 'dark' ? "1px solid rgba(81, 81, 81, 1)" : "1px solid rgba(224, 224, 224, 1)",
            "& .MuiOutlinedInput-notchedOutline":{
                borderStyle : 'none'
            }
        },
        "& .MuiTableCell-sizeSmall" : {
            padding: 0
        }
    },
    selectStyle:{
        "& .MuiSelect-select" : {
            "&:focus":{
                background:'none'
            }
        },
        marginBottom:1
    },
    tableHeaderBg:{
        backgroundColor:theme.palette.buttonColor,
        "& tr th":{
            color: '#fff',
            fontWeight:'bold'
        } 
    },
    normalTable:{
        "& tr td":{
            fontWeight:'500'
        } 
    },
    normalBorder: {
        "& .MuiTableCell-root": {
            borderLeft: theme.palette.type === 'dark' ? "1px solid rgba(81, 81, 81, 1)" : "1px solid rgba(224, 224, 224, 1)",
            "& .MuiOutlinedInput-notchedOutline":{
                borderStyle : 'none'
            }
        }
    },
    iconAddColor:{
        ...(theme.palette.type === 'dark') ? {
            color : '#99CCF3'
        }:null
    }
}))

export default commonStyles;