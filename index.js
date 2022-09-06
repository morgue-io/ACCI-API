const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');

const ImageKit = require('imagekit');
require('dotenv').config();

app.use(express.json({limit: '25mb'}));
app.use(cors());

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
    console.log(req.body);
    let r = await createNewSubmission(client, { ...req.body, createdAt: new Date().toUTCString() });
    res.json(r);
});

app.listen(3001, function () {
    console.log('Live at Port 3001');
});
