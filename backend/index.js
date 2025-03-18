console.log('Pokrećem server...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001; // Promijenjen port

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders'); // Dodajemo ordersRouter

app.use('/users', usersRouter);
app.use('/orders', ordersRouter); // Povezujemo ordersRouter

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});