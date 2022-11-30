
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/src/.'));
let port = 8080;


const AQA = require('./modules/AQA.js');
const fs = require("fs");

app.get("/", (req, res) => {
	let json = require('./data/example.json');
	let style = fs.readFileSync(__dirname + '/src/style.css');
	let quiz = new AQA(style, json, 'example.json');
	let html = quiz.generate();
	res.send(html);
});

app.post('/evaluate', function(req, res){
	let json = require('./data/example.json');
	let style = fs.readFileSync(__dirname + '/src/style.css');
	let quiz = new AQA(style, json, 'example.json', req.body);
	let html = quiz.generate();
    res.send(html);
})

app.listen(port);
console.log('server on', port);

