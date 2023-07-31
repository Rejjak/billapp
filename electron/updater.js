const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');


module.exports = (mainWindow,iconPath)=> {

    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'Rejjak',
        repo: 'billapp',
        token: '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', // Optional, only required for private repositories
    });
    
    autoUpdater.autoDownload = true;
    autoUpdater.on('update-available',(e)=>{
        mainWindow.webContents.send('update-progress','update-available'+JSON.stringify(e));
        //autoUpdater.downloadUpdate();
    });

    autoUpdater.on('update-downloaded',(e)=>{
        dialog.showMessageBox(mainWindow,{
            type:'info',
            title:'Binamate',
            message:'Update Downloaded',
            detail:'Update has been downloaded. Restart the application to apply the changes.',
            buttons:['Restart','Later'],
            icon:iconPath,
            noLink:true
        }).then(({response})=>{
            if(response === 0){
                autoUpdater.quitAndInstall();
            }
        })
    });

    autoUpdater.on('download-progress',(obj)=>{
        const progress = obj.percent.toFixed(2);
        mainWindow.webContents.send('update-progress',progress);
    });

    autoUpdater.on('error',(err)=>{
        mainWindow.webContents.send('update-progress','error'+JSON.stringify(err));
    });

    autoUpdater.checkForUpdatesAndNotify();
}