const os = require('os');

const electron = require('electron');
const windowStateKeeper = require('electron-window-state');

const { getConnection } = require('./db/db');
const Client = require('./db/schemas/Client');

const { sendEmail } = require('./utils/send-mail');

const template = require('./menu/menu-template');

const allWindow = require('./windows');

const { app, BrowserWindow, dialog, ipcMain, Menu, screen } = electron;

// Mantén una referencia global del objeto window, si no lo haces, la ventana 
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.

let mainScreen, openClientScreen;

const osData = ['hostname', 'platform', 'release', 'type'].reduce((acc, key) => {
	acc[key] = os[key]();
	return acc;
}, {});

osData.user = os.userInfo().username;
osData.accessDate = new Date(Date(Date.now() - os.uptime() * 1000)).getTime();

console.log(osData);

function createWindow() {
	//const OSScreen = screen.getPrimaryDisplay();

	mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	});

	// Crea la ventana del navegador.
	mainScreen = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		webPreferences: {
			nodeIntegration: true
		},
		icon: __dirname + '/app.ico'
	});;

	mainWindowState.manage(mainScreen);

	// y carga el index.html de la aplicación.
	mainScreen.loadFile(__dirname + '/windows/main-page/index.html');

	// Abre las herramientas de desarrollo (DevTools).
	mainScreen.webContents.openDevTools();

	// Emitido cuando la ventana es cerrada.
	mainScreen.on('closed', () => {
		// Elimina la referencia al objeto window, normalmente  guardarías las ventanas
		// en un vector si tu aplicación soporta múltiples ventanas, este es el momento
		// en el que deberías borrar el elemento correspondiente.
		mainScreen = null
		app.quit();
	});

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu);
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', createWindow);

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
	// En macOS es común para las aplicaciones y sus barras de menú
	// que estén activas hasta que el usuario salga explicitamente con Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// En macOS es común volver a crear una ventana en la aplicación cuando el
	// icono del dock es clicado y no hay otras ventanas abiertas.
	if (mainScreen === null) {
		createWindow()
	}
});

const getClients = async () => {
	try {
		const clients = (await Client.find({})).map(c => mongoModelToObject(c))

		mainScreen.webContents.send('clients:found', clients);

	} catch (e) {

	}
}

const mongoModelToObject = (model) => {
	model = model.toObject();
	delete model.__v;

	model._id = model._id.toString();

	return model;
}

ipcMain.on('create:client', async (e, client) => {
	try {
		await new Client(client).save();
		await getClients();

		allWindow.newClientWindow.close();
		allWindow.newClientWindow = null;
	} catch (e) {

		console.error(e);

		allWindow.newClientWindow.webContents.send('client:error', e.message);
	}
})

ipcMain.on('clients:search', async () => {
	getClients();
})

ipcMain.on('clients:open', async (_, client) => {
	// dialog.showMessageBox({title: 'Cliente abierto', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi deserunt quod impedit, doloremque sapiente nobis provident aperiam perferendis molestiae, id rerum cupiditate nesciunt dignissimos, ducimus ab suscipit similique quasi. Enim!'});
	console.log(allWindow)
	if (openClientScreen) openClientScreen.close();
	// Crea la ventana del navegador.
	openClientScreen = new BrowserWindow({
		width: 1200,
		height: 1200,
		webPreferences: {
			nodeIntegration: true
		},
		icon: __dirname + '/app.ico'
	});

	// y carga el index.html de la aplicación.
	openClientScreen.loadFile('./windows/client-info/index.html');



	openClientScreen.webContents.on('dom-ready', () => {
		openClientScreen.webContents.send('client-data', client);
	})
	openClientScreen.setMenu(null);
	// Abre las herramientas de desarrollo (DevTools).
	openClientScreen.webContents.openDevTools();

	openClientScreen.on('closed', () => {
		openClientScreen = null;
	});
})

ipcMain.on('client-info:close', () => {
	openClientScreen.close();
	openClientScreen = null;
});

ipcMain.on('client-info:remove', async (_, { _id }) => {
		console.log(_id);
	try {
		//await Client.remove({ _id });
		await getClients();

		openClientScreen.close();
		openClientScreen = null;
	} catch (e) {

		console.error(e);

		openClientScreen.webContents.send('client:error', e.message);
	}
});

ipcMain.on('client-info:update', async(_, client) => {
	console.log(client._id);
	try {
		await Client.findOneAndReplace({_id: client._id}, client);
		await getClients();

		openClientScreen.close();
		openClientScreen = null;
		console.log(client)
	} catch (e) {

		console.error(e);

		openClientScreen.webContents.send('client:error', e.message);
	}
});