const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.send('API Running...');
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/message', require('./routes/api/message'));

app.listen(PORT, () => {
    console.log(`Sever Start On Port ${PORT}`);
});

