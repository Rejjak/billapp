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
}

export default new RequestService();