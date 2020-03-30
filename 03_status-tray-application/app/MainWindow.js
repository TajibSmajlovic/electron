const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      width: 300,
      height: 510,
      frame: false,
      resizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: false
      }
    });

    this.loadURL(url);

    this.on('blur', () => this.onBlur.bind(this));
  }
  onBlur() {
    this.hide();
  }
}

module.exports = MainWindow;
