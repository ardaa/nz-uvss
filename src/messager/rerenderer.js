const electron = window.require('electron');
const { ipcRenderer } = electron;

export default function send(sql, ip) {
    return new Promise((resolve) => {
   
            ipcRenderer.send('asynchronous-message', sql);
        if(sql == 'SELECT version();'){
            ipcRenderer.once('asynchronous-online', (_, arg) => {
                resolve(arg);
            });
        }
        else if(sql.includes('plate_status')){
            ipcRenderer.once('asynchronous-gate', (_, arg) => {
                resolve(arg);
            });
        }
        else if(sql.includes('backup')){
            ipcRenderer.once('asynchronous-backup', (_, arg) => {
                resolve(arg);
            });
        }
        else if(sql.includes('restore')){
            ipcRenderer.once('asynchronous-restore', (_, arg) => {
                resolve(arg);
            });
        }
        
        else{
        ipcRenderer.once('asynchronous-reply', (_, arg) => {
            resolve(arg);
        });
        }
       
    });
}
