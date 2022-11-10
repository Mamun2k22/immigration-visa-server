const jwt = require('jsonwebtoken')
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { request } = require('express');
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
        const reviewCollection = client.db('immigration').collection('review');

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '30d' })
            res.send({ token })
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query); // find korar jono karsor
            const service = await cursor.toArray(); // client site use korte pari
            res.send(service);

        })

        app.get('/services/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            const cursor = await serviceCollection.findOne(query); // find korar jono karsor
            res.send(cursor);

        })


        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query); // find korar jono karsor
            const service = await cursor.limit(3).toArray(); // client site use korte pari
            console.log(service);
            res.send(service);

        })
        // review

        app.get('/reviews', async (req, res) => {


            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })

        // Post Review

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });

        // Delete

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body })
            res.send(result)
        })

        // R:
        app.get('/all/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const feedback = await cursor.toArray();
            res.send(feedback)
        });

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