    require('dotenv').config();
    const express = require('express');
    const { MongoClient } = require('mongodb');
    const app = express();
    const path = require('path');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const DEFAULT_PORT_VALUE = 3000;
    const PORT = process.env.PORT || DEFAULT_PORT_VALUE;

    const client = new MongoClient('mongodb://127.0.0.1:27017');

    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));

    let collection;

    const connectDb = async () => {
        try {
            await client.connect();
            const db = client.db('syuzDB');
            collection = db.collection('products');
            console.log('Connected to the database successfully.');
        } catch (err) {
            console.error('Failed to connect to the database', err);
        }
    };

    app.post('/products', async (req, res) => {
        const { name, price, image } = req.body;
        const result = await collection.insertOne({ name, price, image });
        res.send(result);

    });

    app.get('/products', async (req, res) => {
        const result = await collection.find().toArray();
        res.send(result);
    });


    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    connectDb().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    });