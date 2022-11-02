const { ipcMain } = require('electron');
const { Client } = require('pg');
const sound = require("sound-play");
let client = new Client({
    host: '192.168.1.23:5432',
    user: 'postgres',
    password: 'postgre',
    database: 'agss',
});



ipcMain.on('asynchronous-message', (event, arg) => {
    const sql = arg;
    client.connect()
    client.query(sql, (err, res) => {
        event.reply('asynchronous-reply', (err && err.message) || res);
    client.end()
    }) 

});


ipcMain.on('alert', (event, arg) => {

    sound.play("assets/master_warn.mp3");
    });

ipcMain.on('changeIP', (event, arg) => {
    const ip = arg;
    
    
    });


