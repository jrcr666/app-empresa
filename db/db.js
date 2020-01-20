const mongoose = require('mongoose');
const Client = require('./schemas/Client');

let db;
(async () => {
    db = await mongoose.connect('mongodb+srv://jrcr666:986532@juanracluster-1anys.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('Conectado a mongoDB');
})()

const getConnection = () => db;