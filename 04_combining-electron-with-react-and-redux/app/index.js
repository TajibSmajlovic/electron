const { app, BrowserWindow, ipcMain, shell } = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const _ = require('lodash');

let mainWindow;
let url = 'http://localhost:3000/';

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    }
  });
  mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('videos:added', async (e, videos) => {
  const promises = _.map(videos, video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        if (err) reject(err);
        resolve({
          ...video,
          duration: metadata.format.duration,
          format: 'avi'
        });
      });
    });
  });

  let res = await Promise.all(promises);
  mainWindow.webContents.send('videos:complete', res);
});

ipcMain.on('conversion:start', (e, data) => {
  const videos = [];
  for (var video in data) {
    if (data.hasOwnProperty(video)) {
      videos.push(data[video]);
    }
  }
  _.each(videos, video => {
    const outputDir = video.path.split(video.name)[0];
    const outputName = video.name.split('.')[0];
    const outputPath = `${outputDir}${outputName}.${video.format}`;

    ffmpeg(video.path)
      .output(outputPath)
      .on('progress', ({ timemark }) =>
        mainWindow.webContents.send('conversion:progres', { video, timemark })
      )
      .on('end', () =>
        mainWindow.webContents.send('conversion:end', { video, outputPath })
      )
      .run();
  });
});

ipcMain.on('folder:open', (e, outputPath) =>
  shell.showItemInFolder(outputPath)
);
