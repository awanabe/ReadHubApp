const path = require('path')
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
    // dereference the window
    // for multiple windows store them in an array
    mainWindow = null;
}

function createMainWindow() {
    const win = new electron.BrowserWindow({
        'width': 800,
        'height': 600,
        'minWidth': 500,
        'minHeight': 200,
        'acceptFirstMouse': true,
        'titleBarStyle': 'hidden'
    });

    win.loadURL(path.join('file://', __dirname, '/index.html'));
    win.on('closed', onClosed);

    return win;
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', function () {
    mainWindow = createMainWindow();
});
