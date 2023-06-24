const { ipcMain, dialog, app, BrowserWindow } = require('electron');
const { download } = require('electron-dl');
const si = require('systeminformation');
const db = require('./db');
const fs = require("fs");
const path = require('path');

exports.addType = () => {
    let event_name = 'type-create';
    ipcMain.on(event_name, (event, arg) => {
        if(arg.prd_id != undefined){
            db('prd_types').update({
                name : arg.name,
                image:arg.image
            }).where('id','=',arg.prd_id).then(() => {
                event.reply(event_name+'-reply','Type added!');
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }else{
            db('prd_types').insert({
                name : arg.name,
                image:arg.image,
                added_on : new Date()
            }).then(() => {
                event.reply(event_name+'-reply','Type added!');
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }
    });
}

exports.getType = () => {
    let event_name = 'type-get';
    ipcMain.on(event_name, (event, arg) => {
        db.select('*').from('prd_types').orderBy('id','desc').then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.deleteType = () => {
    let event_name = 'type-delete';
    ipcMain.on(event_name, (event, arg) => {
        db.delete().from('prd_types').where('id',arg.id).then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.addBrand = () => {
    let event_name = 'brand-create';
    ipcMain.on(event_name, (event, arg) => {
        if(arg.prd_id != undefined){
            db('brands').update({
                name : arg.name,
                image:arg.image
            }).where('id','=',arg.prd_id).then(() => {
                event.reply(event_name+'-reply','Brand added!');
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }else{
            db('brands').insert({
                name : arg.name,
                image:arg.image,
                added_on : new Date()
            }).then(() => {
                event.reply(event_name+'-reply','Brand added!');
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }
    });
}

exports.getBrand = () => {
    let event_name = 'brand-get';
    ipcMain.on(event_name, (event, arg) => {
        db.select('*').from('brands').orderBy('id','desc').then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.deleteBrand = () => {
    let event_name = 'brand-delete';
    ipcMain.on(event_name, (event, arg) => {
        db.delete().from('brands').where('id',arg.id).then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.addProduct = () => {
    let event_name = 'product-create';
    ipcMain.on(event_name, (event, arg) => {
        if(arg.prd_id != undefined){
            db('products').update({
                name : arg.prdName != '' ? arg.prdName : (arg.brandName != '' ? (arg.typeName+' - '+arg.brandName):arg.typeName),
                type:arg.typeName != '' ? arg.typeName : 'No',
                brand : arg.brandName != '' ? arg.brandName : 'No',
                model:arg.modelName != '' ? arg.modelName : 'No',
                stock : arg.stock,
                price:arg.price,
                sp_price:arg.specialPrice != '' ? arg.specialPrice : arg.price
            }).where('id','=',arg.prd_id).then(() => {
                event.reply(event_name+'-reply','Product updated!');
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }else{
            db('products').insert({
                name : arg.prdName != '' ? arg.prdName : (arg.brandName != '' ? (arg.typeName+' - '+arg.brandName):arg.typeName),
                type:arg.typeName != '' ? arg.typeName : 'No',
                brand : arg.brandName != '' ? arg.brandName : 'No',
                model:arg.modelName != '' ? arg.modelName : 'No',
                stock : arg.stock,
                price:arg.price,
                sp_price:arg.specialPrice != '' ? arg.specialPrice : arg.price,
                added_on : new Date()
            }).then(() => {
                event.reply(event_name+'-reply','Product added!');
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }
    });
}

exports.getProduct = () => {
    let event_name = 'product-get';
    ipcMain.on(event_name, (event, arg) => {
        db.select('*').from('products').orderBy('id','desc').then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.deleteProduct = () => {
    let event_name = 'product-delete';
    ipcMain.on(event_name, (event, arg) => {
        db.delete().from('products').where('id',arg.id).then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.addSale = () => {
    let event_name = 'sales-create';
    ipcMain.on(event_name, (event, arg) => {
        db('sales_history').insert({
            items : JSON.stringify(arg.items),
            bag_extra : JSON.stringify(arg.extra_items),
            total_amount : arg.total_amount,
            added_on : new Date()
        }).then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.getSales = () => {
    let event_name = 'sales-get';
    ipcMain.on(event_name, (event, arg) => {
        if(arg != undefined && arg.id != undefined){
            db.select('*').from('sales_history').where('id',arg.id).then((res) => {
                event.reply(event_name+'-reply',res);
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }else{
            db.select('*').from('sales_history').orderBy('id','desc').then((res) => {
                event.reply(event_name+'-reply',res);
            }).catch(err => {
                event.reply(event_name+'-reply',err);
            })
        }
    });
}

exports.deleteSale = () => {
    let event_name = 'sales-delete';
    ipcMain.on(event_name, (event, arg) => {
        db.delete().from('sales_history').where('id',arg.id).then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.getSettings = () => {
    let event_name = 'settings-get';
    ipcMain.on(event_name, (event, arg) => {
        db.select('*').from('app_setting').then((res) => {
            event.reply(event_name+'-reply',res);
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.updateSettings = () => {
    let event_name = 'settings-update';
    ipcMain.on(event_name, (event, arg) => {
        db('app_setting').update(arg).where('id','=',1).then(() => {
            event.reply(event_name+'-reply','settings updated!');
        }).catch(err => {
            event.reply(event_name+'-reply',err);
        })
    });
}

exports.getMacAdd = async() => {
    let event_name = 'macadd-get';
    let msi = await si.baseboard();
    try{
        let stats = fs.statSync("db.sqlite");
        let fileSizeInBytes = stats.size;
        let fileSizeInGb = fileSizeInBytes / (1024*1024*1024);
        ipcMain.on(event_name, (event, arg) => {
            event.reply(event_name+'-reply',{mac_add:msi.serial,db_size:fileSizeInGb.toFixed(2)});
        });
    }catch(err){
        ipcMain.on(event_name, (event, arg) => {
            event.reply(event_name+'-reply',{mac_add:msi.serial});
        });
    }
}

exports.dbUpload = () => {
    let event_name = 'db-file-upload';
    ipcMain.on(event_name, (event, { filePath, updatedName }) => {
        fs.readFile(filePath, (errorn, fileData) => {
            if (errorn) {
              dialog.showErrorBox('Error', `Unable to read file: ${errorn.message}`);
              return;
            }
            const __filePath = path.join(__dirname,'../'+updatedName);
            const __oldFilePath = path.join(__dirname,'../db.sqlite');
            fs.writeFile(__filePath, fileData, (error) => {
                if (error) {
                  dialog.showErrorBox('Error', `Unable to save file: ${error.message}`);
                  return;
                }
                
                const sqlite3 = require('sqlite3').verbose();
                const db = new sqlite3.Database('new_db.sqlite', sqlite3.OPEN_READONLY, (errn) => {
                    if (errn) {
                        dialog.showErrorBox('Error', `Unable to process file: ${errn.message}`);
                        return;
                    }
                
                    db.get('SELECT sqlite_version() AS version', (err, row) => {
                        if (err) {
                            dialog.showErrorBox('Error', `Invalid SQLite file: ${err.message}`);
                        } else {
                            if(row.version === '3.41.1'){
                                fs.rename(__filePath, __oldFilePath, (errd) => {
                                    if (errd) {
                                        dialog.showErrorBox('Error', 'Operation faild, please try again');
                                        return;
                                    }
                                    event.reply(event_name+'-reply',{status:true,message:'File uploaded successfully'});
                                });
                            }else{
                                dialog.showErrorBox('Error', 'This file could not be supported');
                            }
                        }
                        db.close((errb) => {
                            if(errb){
                                console.log(errb);
                            }
                        });
                    });
                });
                
            });
        });
    });
}

exports.dbDownload = ()=> {
    let event_name = 'db-file-download';
    ipcMain.on(event_name, (event, arg) => {
        const dbFilePath = path.join(__dirname,'../db.sqlite');
        download(BrowserWindow.getFocusedWindow(), `file://${dbFilePath}`, { saveAs: true, filename: 'backup.wtt' }).then(dl => {
          console.log('File downloaded successfully:', dl.getSavePath());
        }).catch(err => {
          console.error('Error downloading file:', err);
        });
    }); 
}

exports.reStartApp = ()=> {
    let event_name = 'restart-app';
    ipcMain.on(event_name, (event, arg) => {
        app.relaunch();
        app.quit();
    });
}