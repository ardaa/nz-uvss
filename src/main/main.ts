/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

require('../messager/main');

const Store = require('electron-store');


class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

process.on('uncaughtException', function (err) {
  console.log(err);
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }


  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };



  var splash = new BrowserWindow({
    width: 400, 
    height: 400, 
    transparent: true, 
    frame: false, 
    alwaysOnTop: false 
});

splash.loadURL(`file://${__dirname}/splash.html`);
splash.center()

//Work breakdown structure, milestones of the project, project plan, methods for implementing project tasks, required tools for accomplishing project tasks and progress of the project are discussed in this part.


//C:\Program Files\HuarayTech\MV Viewer\Development\Samples\Python\uvss_last\Storage\Database\records.db
if(app.isPackaged){
const execSync = require("child_process").execSync;
const response = execSync("wmic csproduct get uuid");
const serial = String(response).split("\n")[1].replace("-", "").trim().toLowerCase();
}
// console.log(serial);
// console.log(serial !== "475BFA80-5C46-0000-0000-000000000000");
// if(serial !== "B91E0B4E-95FC-8889-1706-5811224A519D".toLowerCase()){
//    app.exit(0);
// }

const store = new Store();
if (store.get('db_ip') === undefined) {
  store.set('db_ip', '192.168.1.23');
}



mainWindow = new BrowserWindow({
  show: false,
  width: 1920,
  height: 1080,
  minHeight: 600,
  minWidth: 1000,
  icon: getAssetPath('icon.png'),
  autoHideMenuBar: true,

  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,
    preload: app.isPackaged
      ? path.join(__dirname, 'preload.js')
      : path.join(__dirname, '../../.erb/dll/preload.js'),
  },
});

mainWindow.loadURL(resolveHtmlPath('index.html'));

mainWindow.setAspectRatio(16 / 9);

splash.close()


mainWindow.on('ready-to-show', () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  if (process.env.START_MINIMIZED) {
    mainWindow.minimize();
  } else {
    mainWindow.show();
  }
});

const ret = globalShortcut.register('F11', () => {
  mainWindow?.webContents.openDevTools()
})  

mainWindow.on('closed', () => {
  mainWindow = null;
});

const menuBuilder = new MenuBuilder(mainWindow);
menuBuilder.buildMenu();

// Open urls in the user's browser
mainWindow.webContents.setWindowOpenHandler((edata) => {
  shell.openExternal(edata.url);
  return { action: 'deny' };
});




};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
