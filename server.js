
const AQA = require('./modules/AQA.js');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let port = 8080;

let jsonFile = './data/substantivos-classificação.json';

app.get("/", (req, res) => {
	let quiz = new AQA('evaluate');
	quiz.loadJSON(jsonFile);
	quiz.loadStyle('./src/style.css');
	quiz.loadTheoryMD('./data/substantivos-classificação.md');
	let html = quiz.generate();
	res.send(html);
});

app.post('/evaluate', function(req, res){
	console.log(req.body);
	let quiz = new AQA();
	quiz.loadJSON(jsonFile);
	quiz.loadStyle('./src/style.css');
	quiz.loadTheoryMD('./data/substantivos-classificação.md');
	let html = quiz.generate(req.body);
	res.send(html);
})

app.listen(port);
console.log('server on', port);

