const electron = require('electron');

const { ipcRenderer } = electron;

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();

  const { path } = document.querySelector('input').files[0];

  ipcRenderer.send('video:submit', path);
});

ipcRenderer.on('video:metadata', (e, duration) => {
  document.getElementById('result').innerHTML = duration;
});
