const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2')
const Vue = require('../../modules/Vue');

const clientWindow = new Vue({
	el: '#clientWindow',
	data: {
		formUntouched: true,
		client: {},
		hasBeenModified: false,
		loading: false
	},
	methods: {
		closeWindow() {
			ipcRenderer.send('client-info:close');
		},
		removeClient() {
			Swal.fire({
				title: `Vas a eliminar al cliente ${this.client.name} ${this.client.lastName}`,
				text: "Recuerda, que no podrás volver atrás",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminarlo'
			}).then((result) => {
				if (result.value) {
					ipcRenderer.send('client-info:remove', this.client);
					this.loading = true;
				}
			});
		},
		updateClient() {
			ipcRenderer.send('client-info:update', this.client);
			this.loading = true;
		}
	}
});

ipcRenderer.on('client-data', function(event, client) {
	clientWindow.client = client;
});