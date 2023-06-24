import React,{useState,lazy,Suspense,useContext} from 'react';
import {ColorModeContext} from '../../store';
import HeaderComponent from '../header/header';
import Sidebar from '../sidebar/sidebar';
import {BrowserRouter, Routes, Route, HashRouter} from 'react-router-dom'
import { Box, CircularProgress } from "@material-ui/core";
import commonStyles from "../style/commonStyle";
const Dashboard = lazy(()=>import('../dashboard/dashboard'));
const Home = lazy(()=>import('../home/home'));
const Product = lazy(()=>import('../product/product'));
const Brand = lazy(()=>import('../brand/brand'));
const Category = lazy(()=>import('../category/category'));
const Bag = lazy(()=>import('../bag/bag'));
const Sales = lazy(()=>import('../sales/sales'));
const PrintView = lazy(()=>import('../printview/printView'));
const Settings = lazy(()=>import('../settings/settings'));
const Login = lazy(()=>import('../login/login'));

function Mainapp() {
    const {isLogin} = useContext(ColorModeContext);
    const classes = commonStyles();
    const [mobileOpen,setMobileOpen] = useState(false);
    const toggleMobileMenu = ()=> {
        setMobileOpen(!mobileOpen);
    }

    // const container = {
    //     backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROWsTMTou4O5nJnz1uQh6vScaCxlDls2-fOSO5Xji2S3aDL5sLaDseRVr5uDoGF5k7Md0&usqp=CAU")`,
    //     backgroundSize: 'cover',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundPosition: 'center',
    // };

    return (
        <HashRouter>
            <HeaderComponent isLogin={isLogin} handleClick={()=>toggleMobileMenu()}/>
            {
                isLogin &&
                <Sidebar handleClick={()=>toggleMobileMenu()} showMobileMenu={mobileOpen}/>
            }
            <Box className={isLogin ? classes.wrapper : classes.wrapperNoPadding}>
                <Suspense>
                    <Routes>
                        <Route path='/product' element={<Product/>} />
                        <Route path='/category' element={<Category/>} />
                        <Route path='/brand' element={<Brand/>} />
                        <Route path='/bag' element={<Bag/>} />
                        <Route path='/sales' element={<Sales/>}/>
                        <Route path='/settings' element={<Settings/>}/>
                        <Route path='/print/:inv_id' element={<PrintView/>}/>
                        <Route path='/dashboard' element={<Dashboard/>} />
                        <Route path='/' element={<Login/>} />
                    </Routes>
                </Suspense>
            </Box>
        </HashRouter>
    );
}

export default Mainapp;