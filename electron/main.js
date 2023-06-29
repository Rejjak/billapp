const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const dbquery = require('./dbquery');
const updater = require('./updater');
const path = require('path');
 
let mainWindow;
 
// Configure autoUpdater

// autoUpdater.setFeedURL({
//     provider: 'github',
//     owner: 'Rejjak',
//     repo: 'billapp',
//     token: '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' // Optional, only required for private repositories
// });

// autoUpdater.autoDownload = false;

function createWindow() {
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    const iconPath = isDev ? './public/app_icon.ico' : `file://${path.join(__dirname, '../build/app_icon.ico')}`;
    mainWindow = new BrowserWindow({
        width:1250,
        minWidth:1250,
        height:700,
        show: false,
        icon:iconPath,
        title:'Binamate',
        webPreferences: {
            nodeIntegration : true,
            contextIsolation: false
        }
    });
 
    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => {
        Menu.setApplicationMenu(null);
        mainWindow.show();
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
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});