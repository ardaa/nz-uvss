const electron = window.require('electron');
const { ipcRenderer } = electron;

export default function send(sql, ip) {
    return new Promise((resolve) => {
        if(sql=='alert'){
            ipcRenderer.send('alert', sql);
            resolve('alert');
        }
        if(sql=='changeIP'){
            ipcRenderer.send('changeIP', ip);
            resolve('ip');
        }
        ipcRenderer.once('asynchronous-reply', (_, arg) => {
            resolve(arg);
        });
        ipcRenderer.send('asynchronous-message', sql);
    });
}
