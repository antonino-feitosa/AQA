
const AQA = require('./AQA.js');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/favicon.ico', express.static('favicon.ico'));

let port = 80;

let jsonFile = './private/substantivos-classificação.json';
let style = './style.css';
let theory = './private/substantivos-classificação.md';

// TODO index.html
// TODO handle links
app.get("/", (req, res) => {
	let quiz = new AQA('evaluate');
	quiz.loadJSON(jsonFile);
	quiz.loadStyle(style);
	quiz.loadTheoryMD(theory);
	let html = quiz.generate();
	res.send(html);
});

app.post('/evaluate', function(req, res){
	console.log(req.body);
	let quiz = new AQA();
	quiz.loadJSON(jsonFile);
	quiz.loadStyle(style);
	quiz.loadTheoryMD(theory);
	let html = quiz.generate(req.body);
	res.send(html);
})

app.listen(port);
console.log('server on', port);

