
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/favicon.ico', express.static('./AQA/favicon.ico'));

let port = 80;

let Topic = require('./Topics');

app.get("/", (_, res) => {
	res.send(Topic.makeIndex());
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

