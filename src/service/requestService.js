const electron = window.require('electron');
const { ipcRenderer } = electron;
class RequestService{
    addRequest(payload){
        return new Promise((resolve) => {
            ipcRenderer.send(payload.req_url,payload.data);
            ipcRenderer.once(payload.req_url+'-reply', (_, arg) => {
                resolve(arg);
            });
        });
    }

    onRequest(event_name,cb){
        ipcRenderer.on(event_name, (_, arg) => {
            console.log(arg);
            cb(arg)
        });
    }

    onRequestRemove(event_name){
        ipcRenderer.removeAllListeners(event_name);
    }
}

export default new RequestService();