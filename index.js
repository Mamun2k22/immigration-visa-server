const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// Midle ware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ldmt6s4.mongodb.net/?retryWrites=true&w=majority `;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connect to Database:
async function run() {
    try {
        const serviceCollection = client.db('immigration').collection('services');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query); // find korar jono karsor
            const service = await cursor.toArray(); // client site use korte pari
            res.send(service);

        })

        app.get('/services/home', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query); // find korar jono karsor
            const service = await cursor.limit(3).toArray(); // client site use korte pari
            res.send(service);

        })
    }
    finally {

    }
} run().catch(er => console.error(er));

app.get('/', (req, res) => {
    res.send('Immigration Server is a Running')
})

app.listen(port, () => {
    console.log(`Immigration Server is a Running on ${port}`);
})