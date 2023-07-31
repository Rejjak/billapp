const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const isDev = require('electron-is-dev');
const dbquery = require('./dbquery');
const updater = require('./updater');
const path = require('path');
 
let mainWindow;
let newWindow;

const menuTemplate = [
    {
        label: 'About',
        submenu: [
            {
                label: 'About binamate',
                click: () => {
                    createNewWindow('about.html',{modal:true,parent:mainWindow,width:250,height:390});
                }
            },
            {
                label: 'More',
                click: () => {
                    const url = 'https://rejjak.github.io/binamateweb/';
                    shell.openExternal(url);
                }
            },
            {
                label: 'Exit',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Contact',
        submenu: [
            {
                label: 'Developer details',
                click: async () => {
                    createNewWindow('contact.html',{height:400,modal:true,parent:mainWindow});
                }
            }
        ]
    },
    {
        label: 'Pricing',
        click: () => {
            createNewWindow('subs_plans.html',{modal:true,parent:mainWindow});
        }
    },
    { 
        label: 'Edit', 
        submenu: [
            {
              label: 'Cut',
              accelerator: 'CmdOrCtrl+X',
              role: 'cut'
            },
            {
              label: 'Copy',
              accelerator: 'CmdOrCtrl+C',
              role: 'copy'
            },
            {
              label: 'Paste',
              accelerator: 'CmdOrCtrl+V',
              role: 'paste'
            },
            {
              type: 'separator'
            },
            {
              label: 'Select All',
              accelerator: 'CmdOrCtrl+A',
              role: 'selectAll'
            }
        ]
    },
];
  

const menu = Menu.buildFromTemplate(menuTemplate);

function createNewWindow(page,options = {}) {
    if(newWindow != null){
        return;
    }
    const packageInfo = require('../package.json');
    const startURL = isDev ? `public/${page}` : `file://${path.join(__dirname, `../build/${page}`)}`;
    newWindow = new BrowserWindow({ 
        width: 300,
        maxWidth: 300,
        minWidth:300,
        height:500,
        maximizable:false,
        minimizable:false,
        resizable: false,
        autoHideMenuBar:true,
        ...options,
        webPreferences: {
            nodeIntegration : true,
            contextIsolation: false
        }
    });
    newWindow.loadFile(startURL);
    newWindow.on('closed', () => {
        newWindow = null;
    });
    newWindow.webContents.on('did-finish-load', () => {
        //newWindow.webContents.openDevTools();
        newWindow.webContents.send('package-info', {os:process.platform+' '+process.arch+' '+process.version,chromiumVersion:process.versions.chrome,...packageInfo});
    });
}

function createWindow() {
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    const iconPath = isDev ? './public/app_icon.ico' : `file://${path.join(__dirname, '../build/app_icon.ico')}`;
    mainWindow = new BrowserWindow({
        width:1250,
        minWidth:1250,
        minHeight:700,
        show: false,
        icon:iconPath,
        title:'Binamate',
        webPreferences: {
            nodeIntegration : true,
            contextIsolation: false
        }
    });
 
    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show',() => {
        Menu.setApplicationMenu(menu);
        mainWindow.show();
        dbquery.getStatistics();
        dbquery.addType();
        dbquery.getType();
        dbquery.deleteType();
        dbquery.addBrand();
        dbquery.getBrand();
        dbquery.deleteBrand();
        dbquery.addProduct();
        dbquery.getProduct();
        dbquery.deleteProduct();
        dbquery.addSale();
        dbquery.getSales();
        dbquery.deleteSale();
        dbquery.getSettings();
        dbquery.updateSettings();
        dbquery.getMacAdd();
        dbquery.dbUpload();
        dbquery.dbDownload();
        dbquery.reStartApp();
        dbquery.showAlert(mainWindow,iconPath);
        updater(mainWindow,iconPath);
        mainWindow.webContents.openDevTools();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('focus', () => {
        if(newWindow){
            newWindow.close();
            newWindow = null;
        }
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});