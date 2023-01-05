
const fs = require("fs");
const ParseAQA = require('./AQA/ParseAQA');

let input = './gramática/substantivos-gênero.aqa';
let output = './gramática/substantivos-gênero.json';

let file = fs.readFileSync(input, 'utf-8');
let json = new ParseAQA().parse(file);
let data = JSON.stringify(json, null, 2);
fs.writeFileSync(output, data, 'utf-8');
