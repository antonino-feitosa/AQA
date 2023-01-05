const showdown = require('showdown');
const fs = require("fs");

class HElement {

	constructor(tag, name = null, classname = "main") {
		this.tag = tag;
		this.name = name;
		this.classname = classname;
		this.id = null;
		this.value = null;
		this.type = null;
		this._style = '';
		this._enabled = '';
		this.tooltip = null;
		this.childs = [];
	}

	make() {
		let content = '';
		for (let e of this.childs) {
			content += (typeof e === 'string') ? e : e.make();
		}
		if (this.tooltip) {
			let div = '<div class="tooltip">';
			div += `<span class="tooltiptext">${this.tooltip}</span>`
			div += content;
			div += '</div>';
			content = div;
		}

		let text = `<${this.tag}`;
		for (let e of this.getAttributes()) {
			text += e.length > 0 ? ' ' + e : '';
		}
		text += '>';
		text += content;
		text += `</${this.tag}>`;
		return text;
	}

	getAttributes() {
		let id = this.id ? `id="${this.id}"` : '';
		let name = this.name ? `name="${this.name}"` : '';
		let classname = this.classname ? `class="${this.classname}"` : '';
		let value = this.value ? `value="${this.value}"` : '';
		let type = this.type ? `type="${this.type}"` : '';
		return [id, classname, name, type, value, this._style, this._enabled];
	}

	addChild(child) {
		this.childs.push(child);
	}

	enabled(set) {
		this._enabled = set ? '' : ' disabled';
	}

	setCorrect(set) {
		if (set) {
			this._style = 'style="background:LightGreen"';
		} else {
			this._style = 'style="background:LightSalmon"';
		}
	}
}

class HShortText extends HElement {

	constructor(name) {
		super('input', name);
		this.type = 'text';
	}
}

class HLongText extends HElement {

	constructor(name) {
		super('textarea', name);
		this.value = null;
	}
}

class HCheckbox extends HElement {

	constructor(name, value) {
		super('input', name);
		this.value = value;
		this.type = 'checkbox';
		this.checked = false;
	}

	getAttributes() {
		let list = super.getAttributes();
		if (this.checked) {
			list.push('checked');
		}
		return list;
	}
}

class HCheckboxGroup extends HElement {

	constructor(tag, name) {
		super(tag, name);
		this.options = new Map();
	}

	addOption(optionText) {
		let opt = new HCheckbox(this.name, optionText);
		opt.addChild(optionText);
		let div = new HElement('div');
		div.addChild(opt);
		this.addChild(div);
		this.options.set(optionText, div);
	}

	getMarked() {
		let marks = [];
		this.options.forEach((v, k) => v.childs[0].checked && marks.push(k));
		return marks;
	}

	setMarked(optionText) {
		if (this.options.has(optionText)) {
			this.options.get(optionText).childs[0].checked = true;
		}
	}

	setCorrectOptions(correct) {
		let marks = this.getMarked();
		for (let [text, e] of this.options.entries()) {
			e.setCorrect(correct.includes(text) === marks.includes(text));
		}
		this.options.forEach(v => v.childs[0].enabled(false));
	}
}

class HRadioGroup extends HCheckboxGroup {

	constructor(tag, name) {
		super(tag, name);
	}

	addOption(optionText) {
		super.addOption(optionText);
		this.options.get(optionText).childs[0].type = 'radio';
	}

	getMarked() {
		let text = '';
		this.options.forEach((v, k) => v.childs[0].checked && (text = k));
		return text;
	}

	setCorrectOptions(correct) {
		this.setCorrect(correct === this.getMarked());
		this.options.forEach(v => v.childs[0].enabled(false));
	}
}

class HOption extends HElement {

	constructor(value) {
		super('option');
		this.value = value;
		this.selected = false;
		this.addChild(value);
	}

	getAttributes() {
		let list = super.getAttributes();
		if (this.selected) {
			list.push('selected');
		}
		return list;
	}
}

class HSelect extends HElement {

	constructor(name) {
		super('select', name);
		this.options = new Map();
		this.selectedOption = '';
	}

	addOption(optionText) {
		let option = new HOption(optionText);
		this.options.set(optionText, option);
		this.addChild(option);
	}

	getSelectedOption() {
		return this.selectedOption;
	}

	setSelectedOption(optionText) {
		this.selectedOption = optionText;
		this.options.get(optionText).selected = true;
	}
}

class HSelectGroup extends HElement {

	constructor(name, values) {
		super('table', null, 'select');
		this._name = name;
		this.options = new Map();
		this.values = values;
		this.values.unshift('');
	}

	setSelectedKey(key, value) {
		this.options.get(key).setSelectedOption(value);
	}

	enabled(set) {
		this.options.forEach(e => e.enabled(set));
	}

	setCorrectKey(key, value) {
		let opt = this.options.get(key);
		let isCorrect = opt.getSelectedOption() === value;
		opt.setCorrect(isCorrect);
		opt.cell.setCorrect(isCorrect);
	}

	addKey(key) {
		let select = new HSelect(this._name);
		this.values.forEach(v => select.addOption(v));
		let tdkey = new HElement('td', null, 'select');
		tdkey.addChild(key + ':');
		let tdsel = new HElement('td', null, 'select');
		tdsel.addChild(select);
		let tr = new HElement('tr', null, 'select');
		tr.addChild(tdkey);
		tr.addChild(tdsel);
		this.addChild(tr);
		select.cell = tr;
		this.options.set(key, select);
	}
}

function shuffle(array){
	for(let i=0;i<array.length-1;i++){
		let index = i + Math.floor(Math.random() * (array.length - i));
		[array[i], array[index]] = [array[index], array[i]];
	}
}

class AQA {

	constructor(request = '/') {
		this.request = request;
		this.title = 'AQA';
		this.style = null;
		this.theory = null;
		this.table = new HElement('table', null, 'main');
	}

	loadJSON(fileName) {
		let file = fs.readFileSync(fileName, 'utf8');
		this.json = JSON.parse(file);
		this.title = this.json.title;
	}

	loadStyle(fileName) {
		this.style = fs.readFileSync(fileName, 'utf-8');
	}

	loadTheoryMD(fileName) {
		let md = fs.readFileSync(fileName, 'utf-8');
		let converter = new showdown.Converter();
		this.theory = converter.makeHtml(md);
	}

	generate(answers = null) {
		let functions = new Map();
		functions.set('description', q => this.addDescription(q));
		functions.set('short', q => this.addQuestionShort(q));
		functions.set('long', q => this.addQuestionLong(q));
		functions.set('mark', q => this.addQuestionMark(q));
		functions.set('choice', q => this.addQuestionOptions(q));
		functions.set('select', q => this.addQuestionSelect(q));
		this._shuffle(); // shuffle the sequence of short questions
		this.json.questions.forEach(q => functions.get(q.type)(q));
		let score = answers ? this._evaluate(answers) : null;
		return this._make(score);
	}

	_shuffle(){
		let questions = this.json.questions;
		let start = 0;
		let end = questions.findIndex(q => q.type === 'description');
		while(end !== -1){
			start = start + 1;
			if(questions[start].type === 'short'){
				this._shuffleArray(questions, start, end);
			}
			start = end;
			end = questions.findIndex((q, index) => q.type === 'description' && index > end);
		}
		this._shuffleArray(questions, start, questions.length);
	}

	_shuffleArray(array, start, end){
		for(let i=start;i<end-1;i++){
			let index = Math.floor(Math.random() * (end - i) + start);
			[array[i], array[index]] = [array[index], array[i]];
		}
	}

	_evaluate(answers) {
		let functions = new Map();
		functions.set('short', q => this.evalQuestionShort(q, answers));
		functions.set('long', q => this.evalQuestionLong(q, answers));
		functions.set('mark', q => this.evalQuestionMark(q, answers));
		functions.set('choice', q => this.evalQuestionOptions(q, answers));
		functions.set('select', q => this.evalQuestionSelect(q, answers));

		let sum = 0;
		let score = 0;
		let questions = this.json.questions.filter(q => q.type !== 'description');
		for (let q of questions) {
			functions.get(q.type)(q);
			score += q.score * q.difficulty;
			sum += q.difficulty;
		}

		let tootiptext = q => {
			let msg = 'Score: ' + Math.floor((1000 * q.score * q.difficulty) / sum);
			if (q.feedback)
				msg += '<br>' + q.feedback;
			return msg;
		};

		questions.forEach(q => q.cell.tooltip = tootiptext(q));
		sum = sum > 0 ? Math.floor((1000 * score) / sum) : 0;
		return sum;
	}

	_make(score = null) {
		let text = '<!DOCTYPE html><html><head>';
		text += `<title>AQA - ${this.title}</title>`;
		if (this.style)
			text += `<style>${this.style}</style>`;
		text += '</head><body>';
		text += `<details class="main">`;
		text += `<summary class="main">${this.title}</summary>`;
		if (this.theory)
			text += this.theory;
		text += '</details>';
		text += `<form action="/evaluate?aqa=${this.request}" method="post" autocomplete="off">`;
		text += this.table.make();
		if (score) {
			text += `<div class="result">Score: ${score}</div>`;
		} else {
			text += '<input id="confirm" type="submit" value="Evaluate!">';
		}
		text += '</form></body></html>';
		return text;
	}

	_addCell(element) {
		let td = new HElement('td', null, 'main');
		td.addChild(element);
		let tr = new HElement('tr', null, 'main');
		tr.addChild(td);
		this.table.addChild(tr);
		return td;
	}

	addDescription(q) {
		if(q.question.length > 0){
			q.element = this._addCell(q.question);
		}
	}

	addQuestionShort(q) {
		q.element = new HShortText(q.name);
		q.cell = this._addCell(q.element);
		q.cell.addChild(q.question);
	}

	evalQuestionShort(q, answers) {
		let isCorrect = answers[q.name] && q.answer.trim() === answers[q.name].trim();
		q.element.value = answers[q.name];
		q.element.setCorrect(isCorrect);
		q.element.enabled(false);
		q.cell.setCorrect(isCorrect);
		q.score = isCorrect ? 1 : 0;
	}

	addQuestionLong(q) {
		q.element = new HLongText(q.name);
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionLong(q, answers) {
		let isCorrect = false; // TODO BLEU metric
		q.element.value = answers[q.name];
		q.element.setCorrect(isCorrect);
		q.element.enabled(false);
		q.cell.setCorrect(isCorrect);
		q.score = 0;
	}

	addQuestionMark(q) {
		q.element = new HCheckboxGroup('div', q.name);
		shuffle(q.options);
		q.options.forEach(o => q.element.addOption(o));
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionMark(q, answers) {
		if (!answers[q.name]) {
			answers[q.name] = [];
		} else if (!Array.isArray(answers[q.name])) {
			answers[q.name] = [answers[q.name]];
		}
		answers[q.name].forEach(e => q.element.setMarked(e));
		q.element.setCorrectOptions(q.answer);

		let numCorrect = 0;
		q.options.forEach((e, i) => {
			let isCorrect = answers[q.name].includes(e) === q.answer.includes(e);
			numCorrect += isCorrect ? 1 : 0;
		});
		q.cell.setCorrect(numCorrect === q.options.length);
		q.score = numCorrect / q.options.length;
	}

	addQuestionOptions(q) {
		q.element = new HRadioGroup('div', q.name);
		shuffle(q.options);
		q.options.forEach(o => q.element.addOption(o));
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionOptions(q, answers) {
		q.element.setMarked(answers[q.name]);
		q.element.setCorrectOptions(q.answer);
		q.cell.setCorrect(q.answer === answers[q.name]);
		q.score = q.answer === answers[q.name] ? 1 : 0;
	}

	addQuestionSelect(q) {
		q.element = new HSelectGroup(q.name, q.values);
		q.keys.forEach(o => q.element.addKey(o));
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionSelect(q, answers) {
		let numCorrect = 0;
		q.keys.forEach((k, i) => {
			let value = answers[q.name] && answers[q.name][i];
			let isCorrect = q.answer[k] === value;
			q.element.setSelectedKey(k, value);
			q.element.setCorrectKey(k, q.answer[k]);
			numCorrect += isCorrect ? 1 : 0;
		});
		q.element.enabled(false);
		q.cell.setCorrect(numCorrect === q.keys.length);
		q.score = numCorrect / q.keys.length;
	}
}

module.exports = AQA;
