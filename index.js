'use strict';
const electron = require('electron');

const app = electron.app;

const debug = /--debug/.test(process.argv[2]);

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
        width: 1200,
        height: 800,
        'minWidth': 500,
        'minHeight': 200,
        'acceptFirstMouse': true,
        // 'titleBarStyle': 'hidden'
    });

    win.loadURL('file://' + __dirname + '/pages/index.html');
    win.on('closed', onClosed);

    if (debug) {
        win.webContents.openDevTools();
        win.maximize();
        require('devtron').install()
    }

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();
});
