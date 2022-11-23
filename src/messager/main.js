const { ipcMain } = require('electron');
const { Client } = require('pg');
const sound = require('sound-play');
const path = require('path');
//server config path

const Store = require('electron-store');

const store = new Store();

var ip = store.get('db_ip');
var alertBool = store.get('alert_bool');

ipcMain.on('asynchronous-message', (event, arg) => {
  const sql = arg;

  if (sql == 'alert') {
    sound.play(path.join(__dirname, '/master_warn.mp3'));
    sound.play('C:\\file.mp3');
  } else if (sql.includes('changeIP')) {
    store.set('db_ip', arg.split(':')[1]);
    ip = store.get('db_ip');
  } else if (sql == 'getIP') {
    event.reply('asynchronous-reply', ip);
  } else if (sql.includes('changeAlarm')) {
    store.set('alert_bool', arg.split(':')[1]);
  } else if (sql == 'backup') {
    const { exec } = require('child_process');
    exec('setx PGPASS postgre');
    exec(
      `C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe -h ${ip} -U postgres --format custom --blobs --file C:\\${ new Date().toISOString()}_db.backup agss`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          console.log(stderr)
          event.reply('asynchronous-backup', JSON.stringify(stdout));
          return;
        }
        
        event.reply('asynchronous-backup', 'success');
      })
    }
    else if (sql.includes('restore')) {
      const { exec } = require('child_process');
      exec('setx PGPASS postgre');
      exec(
        `C:\\Program Files\\PostgreSQL\\15\\bin\\pg_restore.exe -h ${ip} -U postgres --clean --dbname agss ${sql.split(':')[1]}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            console.log(stderr)
            event.reply('asynchronous-restore', JSON.stringify(stdout));
            return;}
          }
      )
    }
   
        
  
  else {
    let client = new Client({
      host: ip,
      user: 'postgres',
      password: 'postgre',
      database: 'agss',
    });
    client.connect();
    client
      .query(sql)
      .then((data) => {
        if (sql == 'SELECT version();') {
          event.reply('asynchronous-online', data.rows);
        } else if (sql.includes('plate_status')) {
          event.reply('asynchronous-gate', data.rows);
        } else {
          event.reply('asynchronous-reply', data.rows);
        }
        client.end();
      })
      .catch((err) => {
        if (sql == 'SELECT version();') {
          event.reply('asynchronous-online', 'error');
        } else {
          event.reply('asynchronous-reply', 'error');
        }
        console.log('Error');
        console.log(err);
        client.end();
      });
  }
});
