const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const buildPDF = require('./compile-pdf');

const ImageKit = require('imagekit');
const { resolve } = require('path');
require('dotenv').config();

app.use(express.json({limit: '25mb'}));
app.use(cors({
    origin: "*",
    credentials: true,
}));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function createNewSubmission(client, obj) {
	try {
		const result = await client.db('test').collection('membership_formdata').insertOne(obj);
        console.log(result);
		return { success: true, msg: result };
	} catch (e) {
		console.log(e);
		return { success: false, error: e };
	}
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY
});

app.get('/', async function (req, res) {
    res.json({
        msg: "Welcome to ACCI API server"
    });
});

app.post('/imagekitify', async function (req, res) {
    imagekit.upload({
        file: req.body.base64,
        fileName: "img.jpg"
    }, function (error, result) {
        if (error) console.log(error);
        else res.json(result);
    });
});

app.post('/new-submission', async function (req, res) {
    try {
        console.log(req.body);
        await createNewSubmission(client, { ...req.body, createdAt: new Date().toUTCString() });
        const fileName = await buildPDF(req.body);
        res.download(resolve(`./${fileName}`));
        fs.unlink(path, (err) => { if (err) throw err; });
    } catch (e) {
        res.json({
            success: false,
            msg: e
        });
    }
});

app.listen(parseInt(process.env.PORT), function () {
    console.log(`Live at Port ${process.env.PORT}`);
});
