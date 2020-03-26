const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add-todo.html`);
  addWindow.on('closed', () => (addWindow = null));
}

ipcMain.on('todo:add', (e, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: 'Fajl',
    submenu: [
      {
        label: 'Add todo',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear todos',
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Comand+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

process.platform === 'darwin' && menuTemplate.unshift({});
process.env.NODE_ENV !== 'production' &&
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
