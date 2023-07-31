import {ThemeProvider,createTheme,CssBaseline,colors} from '@material-ui/core';
import {useMemo,useState,createContext,useEffect} from 'react';
const defatultExtraData = {'tax':'','discount':'','cust_rate':1,'biller_name':'','biller_phone':'','biller_add':''};
const defaultAccessLimit = 50;

export const ColorModeContext = createContext({
    /**
     * Change theme
     */
    toggleMode : ()=> {},
    mode : 'light',
    /**
     * Change default light theme
     */
    updateLightTheme : ()=> {},
    lightTheme : 'navy',
    /**
     * Update cart data
     */
    cartData : [],
    updateCart : (d)=> {},
    /**
     * Update type data
     */
    typeData : [],
    updateType : (d)=> {},
    /**
     * Update brand data
     */
    brandData : [],
    updateBrand : (d)=> {},
    /**
     * Update tax and discount data
     */
    defaultAccessLimit : defaultAccessLimit,
    bagExtraData : defatultExtraData,
    defaultBagData : defatultExtraData,
    updateBagExtraData : (d)=> {},
    /**
     * Update product data
     */
    productData : [],
    updateProduct : (d)=> {},

    /**
     * Update settings data
     */
    settingsData : [],
    updateSettngs : (d)=> {},
    /**
     * Licence data
     */
    licenceData : null,
    updateLicence : (d)=> {},
     /**
     * Login data
     */
     isLogin : false,
     updateLogin : (d)=> {},

    /**
     * dashboard data
     */
     salesCount : 0,
     monthlyData : null,
     dailyData : null,
     salesAmount : null,
     updateMonthlyData : (d)=> {},
     updateDailyData : (d)=> {},
     updateSalesAmount : (d)=> {},
     updateSalesCount : (d)=> {},
});

export const ColorContextProvider = ({children})=> {
    let text = document.getElementById("app_mode").getAttribute("app_mode");
    let light_name = document.getElementById("app_mode").getAttribute("light_theme");
    const [bagExtraData,setBagExtraData] = useState(defatultExtraData);
    const [prdData, setProductData] = useState([]);
    const [defaultMode,setMode] = useState(text);
    const [defaultLight,setLight] = useState(light_name != null ? light_name : 'navy');
    const [cart,setAddToCart] = useState([]);
    const [types,setTypes] = useState([]);
    const [brands,setBrnads] = useState([]);
    const [settings,setSettings] = useState([]);
    const [licence,setLicence] = useState(null);
    const [login,setLogin] = useState(false);
    const [sales,setSalesCount] = useState(0);
    const [monthlyData,setMonthlyData] = useState(null);
    const [dailyData,setDailyData] = useState(null);
    const [salesAmount,setSalesAmount] = useState(null);

    const colorContextValue = useMemo(()=>({
        toggleMode : () => setMode(prevMode => {
            localStorage.setItem("mode", prevMode === 'light' ? 'dark' : 'light')
            if(prevMode === 'light'){
                return 'dark'
            }else{
                return 'light'
            }
        }),
        mode : defaultMode
    }),[defaultMode])

    const lightThemeContextValue = useMemo(()=>({
        updateLightTheme : (data)=> {
            setLight(data);
            localStorage.setItem("lightName", data);
        },
        lightTheme : defaultLight
    }),[defaultLight])

    const dataContextValue = useMemo(()=>({
        cartData : cart,
        updateCart : (data)=> setAddToCart(data)
    }),[cart])

    const licenceContextValue = useMemo(()=>({
        licenceData : licence,
        updateLicence : (data)=> setLicence(data)
    }),[licence])

    const dashboardContextValue = useMemo(()=>({
        salesCount : sales,
        monthlyData : monthlyData,
        dailyData : dailyData,
        salesAmount : salesAmount,
        updateMonthlyData : (data)=> setMonthlyData(data),
        updateDailyData : (data)=> setDailyData(data),
        updateSalesAmount : (data)=> setSalesAmount(data),
        updateSalesCount : (data)=> setSalesCount(data)
    }),[dailyData])

    const loginContextValue = useMemo(()=>({
        isLogin : login,
        updateLogin : (data)=> setLogin(data)
    }),[login])

    const settingsContextValue = useMemo(()=>({
        settingsData : settings,
        updateSettngs : (data)=> setSettings(data)
    }),[settings])

    const productContextValue = useMemo(()=>({
        productData : prdData,
        updateProduct : (data)=> setProductData(data)
    }),[prdData])

    const typeContextValue = useMemo(()=>({
        typeData : types,
        updateType : (data)=> setTypes(data)
    }),[types])

    const brandContextValue = useMemo(()=>({
        brandData : brands,
        updateBrand : (data)=> setBrnads(data)
    }),[brands])

    const bagExtraDataContextValue = useMemo(()=>({
        bagExtraData : bagExtraData,
        defaultBagData : defatultExtraData,
        updateBagExtraData : (data)=> setBagExtraData(data)
    }),[bagExtraData])

    const darkTheme = createTheme({
        fontFamily: 'Roboto, sans-serif',
        palette: {
            type: "dark",
            background: {
                default: "#0A1929"
            },
            primary: {
                main: "#061B2F",
            },
            secondary: {
                main: "#FFFFFF"
            },
            error:{
                main : 'rgb(235, 0, 20)'
            },
            drawerBackground:'#001E3C',
            cardBackground:'#001E3C',
            sidebarActiveColor : '#99CCF3',
            sidebarDefaultColor: '#ccc',
            buttonColor:'#001E3C',
            checkboxBackground:'#1E64AE'
        },
    });
    
    const lightTheme = createTheme({
        fontFamily: 'Roboto, sans-serif',
        palette: {
            type: "light",
            background: {
                default: "#efefef"
            },
            primary: {
                main: "#1E64AE"
            },
            secondary: {
                main: "#1E64AE"
            },
            error:{
                main : 'rgb(235, 0, 20)'
            },
            drawerBackground:'#ffffff',
            cardBackground:'#ffffff',
            sidebarActiveColor : '#1E64AE',
            sidebarDefaultColor: 'rgba(0, 0, 0, 0.54)',
            buttonColor:'#1E64AE',
            checkboxBackground:'#1E64AE'
        }
    });

    const pinkTheme = createTheme({
        fontFamily: 'Roboto, sans-serif',
        palette: {
            type: "light",
            background: {
                default: "#efefef"
            },
            primary: {
                main: "#C71585"
            },
            secondary: {
                main: "#C71585"
            },
            error:{
                main : 'rgb(235, 0, 20)'
            },
            drawerBackground:'#ffffff',
            cardBackground:'#ffffff',
            sidebarActiveColor : '#C71585',
            sidebarDefaultColor: 'rgba(0, 0, 0, 0.54)',
            buttonColor:'#C71585',
            checkboxBackground:'#C71585'
        }
    });

    const tealLightTheme = createTheme({
        fontFamily: 'Roboto, sans-serif',
        palette: {
            type: "light",
            background: {
                default: "#efefef"
            },
            primary: {
                main: "#128c7e"
            },
            secondary: {
                main: "#128c7e"
            },
            error:{
                main : 'rgb(235, 0, 20)'
            },
            drawerBackground:'#ffffff',
            cardBackground:'#ffffff',
            sidebarActiveColor : '#128c7e',
            sidebarDefaultColor: 'rgba(0, 0, 0, 0.54)',
            buttonColor:'#128c7e',
            checkboxBackground:'#128c7e'
        }
    });

    const tealTheme = createTheme({
        fontFamily: 'Roboto, sans-serif',
        palette: {
            type: "light",
            background: {
                default: "#ece5dd"
            },
            primary: {
                main: "#128c7e"
            },
            secondary: {
                main: "#128c7e"
            },
            error:{
                main : 'rgb(235, 0, 20)'
            },
            drawerBackground:'#ffffff',
            cardBackground:'#ffffff',
            sidebarActiveColor : '#128c7e',
            sidebarDefaultColor: 'rgba(0, 0, 0, 0.54)',
            buttonColor:'#128c7e',
            checkboxBackground:'#128c7e'
        }
    });

    const getTheme = useMemo(()=>{
        switch (defaultLight) {
            case 'navy':
                return lightTheme;

            case 'teal':
                return tealTheme;

            case 'tealLight':
                return tealLightTheme;

            case 'pink':
                return pinkTheme;

            default:
                return lightTheme;
        }
    },[defaultLight])

    return (
        <ColorModeContext.Provider value={{...colorContextValue,...dataContextValue,...typeContextValue,...brandContextValue,...bagExtraDataContextValue,...productContextValue,...lightThemeContextValue,...settingsContextValue,...licenceContextValue,...loginContextValue,...dashboardContextValue}}>
            <ThemeProvider theme={defaultMode === 'light' ? getTheme : darkTheme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}