const { app, BrowserWindow, screen, ipcMain } = require('electron');
const Client = require('../db/schemas/Client');
const allWindow = require('../windows');
const url = require('url');
const path = require('path');

// const dirname_ = __dirname.split('/');
// const views = dirname_.slice(0, dirname_.length - 1).join('/') + /windows/;

const addClient = () => {
    const { size: { width, height } } = screen.getPrimaryDisplay();

    allWindow.newClientWindow = new BrowserWindow({
        width: width / 2,
        height: height / 2,
        title: 'Añade un nuevo cliente',
        webPreferences: {
            nodeIntegration: true
        }
    });

    //newClientWindow.loadFile('test.html');

    allWindow.newClientWindow.loadURL(url.format({
        //pathname: path.join(views, 'new-client-window/index.html'),
        pathname: path.join(__dirname, '../windows/new-client-window/index.html'),
        protocol: 'file',
        slashes: true
    }))

    allWindow.newClientWindow.webContents.openDevTools()

    allWindow.newClientWindow.on('close', () => {
        allWindow.newClientWindow = null;
    })

}

module.exports = { addClient }