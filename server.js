
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/src/.'));
let port = 8080;


const AQA = require('./modules/AQA.js');
const fs = require("fs");
const showdown  = require('showdown');

app.get("/", (req, res) => {
	let json = require('./data/example.json');
	let quiz = new AQA(json.title, 'evaluate');
	quiz.style = fs.readFileSync(__dirname + '/src/style.css');
/*
	let md = fs.readFileSync('./data/substantivos-classificação.md');
	converter = new showdown.Converter(),
	quiz.theory = converter.makeHtml(md);
*/
	let html = quiz.parseJSON(json);
	res.send(html);
});

app.post('/evaluate', function(req, res){
	let json = require('./data/example.json');
	let quiz = new AQA(json.title, 'evaluate');
	quiz.style = fs.readFileSync(__dirname + '/src/style.css');
	/*
	let md = fs.readFileSync('./data/substantivos-classificação.md');
	converter = new showdown.Converter(),
	quiz.theory = converter.makeHtml(md);
	*/

	let html = quiz.parseJSON(json, req.body);
	res.send(html);
})

app.listen(port);
console.log('server on', port);

