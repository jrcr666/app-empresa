const Vue = require('../../modules/Vue');
const fs = require('fs');

const { ipcRenderer } = require('electron');

const template = fs.readFileSync(__dirname + '/main.html', 'utf8');
const mainScreen = new Vue({
	el: '#main',
	data: {
		loading: false,
		alert: {
			showAlert: false,
			className: 'alert-danger',
			message: 'No se ha podido conecctar a internet, inténtelo de nuevo'
		},
		clients: [],

		closeAlert() {
			this.alert.showAlert = false;
		},

		openClient(client) {
			ipcRenderer.send('clients:open', client);
		}
	},
	template,
	// LifeCycles
	beforeCreate() {

	},
	created() {
		ipcRenderer.send('clients:search');
		this.loading = true;
	},
	mounted() {
		ipcRenderer.on('clients:found', (e, clients) => {
			mainScreen.clients = clients;

			this.loading = false;
		});
	},
	beforeUpdate() {

	},
	updated() {

	}
});

if (!navigator.onLine) openAlert({ className: 'alert-danger', message: 'No se ha podido conectar a internet, inténtelo de nuevo' });

window.ononline = () => {
	openAlert({ className: 'alert-success', message: 'Se ha recuperado la conexión' });
}

window.onoffline = () => {
	openAlert({ className: 'alert-danger', message: 'No se ha podido conectar a internet, inténtelo de nuevo' });
}

function openAlert({ className, message }) {
	mainScreen.alert.className = className
	mainScreen.alert.message = message;
	mainScreen.alert.showAlert = true;

	setTimeout(() => {
		mainScreen.alert.showAlert = false;
	}, 5000)
}