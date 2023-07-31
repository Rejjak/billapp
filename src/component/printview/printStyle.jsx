import {makeStyles} from '@material-ui/core';
const printStyles = makeStyles((theme)=>({
    tableBorder: {
        "& .MuiTableCell-root": {
            borderLeft: "1px solid #dee2e6",
            borderBottomColor:'#dee2e6',
            "& .MuiOutlinedInput-notchedOutline":{
                borderStyle : 'none'
            }
        },
        "& .MuiTableCell-sizeSmall" : {
            padding: 0
        }
    },
    tableHeader:{
        backgroundColor:'#f2f2f2',
        "& tr th":{
            color: '#000000',
            fontWeight:'bold',
            fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
            fontSize:'12px'
        } 
    },
    tableBody:{
        "& tr td":{
            color: '#111111',
            fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
            fontSize:'12px'
        } 
    },
    divBorder:{
        border : '1px solid #dee2e6',
        marginTop:'20px'
    },
    fontStl:{
        fontSize:'12px',
        color:'#111',
        fontFamily: 'Verdana, Geneva, Tahoma, sans-serif'
    },
    shopName:{
        fontSize:'30px',
        color:'#3397BD',
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        fontWeight:'bold',
        textShadow:"3px 3px 3px #ababab"
    },
    shopAdd:{
        fontSize:'14px',
        color:'#3397BD',
        fontFamily: "Roboto-Medium, sans-serif"
    },
    shopProf:{
        fontSize:'22px',
        color:'#3397BD',
        fontWeight:'bold',
        fontFamily: "Sofia, serif"
    },
    shopProfWaterMark:{
        fontSize:'70px',
        color:'#ccc',
        fontWeight:'bold',
        opacity:0.1,
        fontFamily: "Sofia, serif",
        marginTop:'80px',
        userSelect:'none'
    },
    invoiceNo:{
        fontSize:'13px',
        fontFamily: "monospace",
        fontWeight:'bold',
        color:'#000000'
    },
    shopAddFooter:{
        fontSize:'10px',
        color:'#111111',
        opacity:0.5,
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
    },
    devText:{
        fontSize:'8px',
        color:'#000000',
        opacity:0.3,
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
    },
    footerPrintTime:{
        position:'absolute',
        bottom:0,
        alignItems:'center'
    },
    footer:{
        alignItems:'center'
    },
    bnm:{zIndex:99999999999,position:'relative'}
}))

export default printStyles;