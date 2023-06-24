const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const dbquery = require('./dbquery');
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
    mainWindow = new BrowserWindow({
        width:1250,
        minWidth:1250,
        height:700,
        show: false,
        webPreferences: {
            nodeIntegration : true,
            contextIsolation: false
        }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.webContents.openDevTools();
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