
const port = 80;
const baseDir = process.argv[2] || './AQA'
const Topic = require('./Topics');
Topic.readFile(process.argv[3] || 'topics.json');

const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/favicon.ico', express.static(baseDir + '/favicon.ico'));

app.get("/", (_, res) => {
	res.send(Topic.makeIndex());
});

app.get("/style.css", (_, res) => {
	res.sendFile(path.resolve(baseDir + '/style.css'));
});

app.get("/apply", (req, res) => {
	let topic = req.query.aqa;
	let html = Topic.get(topic).loadHTML();
	res.send(html);
});

app.post('/evaluate', function(req, res){
	let topic = req.query.aqa;
	let response = req.body;
	let html = Topic.get(topic).evalHTML(response);
	res.send(html);
})

app.listen(port);
console.log('server on', port);

