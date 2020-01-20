const { ipcRenderer } = require('electron');
const buttonSubmit = document.querySelector('#submit');

buttonSubmit.onclick = (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector('form'));
    const [name, lastName, address, email, phoneNumber] = formData.values();
    const client = { name, lastName, address, email, phoneNumber: String(phoneNumber) };

    ipcRenderer.send('create:client', client);
}

ipcRenderer.on('client:error', (e, error) => {

})