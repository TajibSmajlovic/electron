const path = require('path');
const { app, Menu, ipcMain } = require('electron');

const MainWindow = require('./MainWindow');
const TimerTray = require('./TimerTray');

let mainWindow;
let tray;
let url = 'http://localhost:3000/';
let iconPath = path.join(
  __dirname,
  `../src/assets/${
    process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  }`
);

Menu.setApplicationMenu(false);

app.on('ready', () => {
  // app.dock.hide();
  mainWindow = new MainWindow(url);

  tray = new TimerTray(iconPath, mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('updateTimer', (e, timeLeft) => {
  tray.setToolTip(timeLeft);
});
