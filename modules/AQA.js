
const showdown  = require('showdown');
const fs = require("fs");

class HElement {

	constructor(tag, name = null, classname = null){
		this.tag = tag;
		this.name = name;
		this.classname = classname;
		this.id = null;
		this._style = '';
		this._enabled = '';
		this.childs = [];
	}

	make(){
		let text = `<${this.tag}`;
		for(let e of this.getAttributes()){
			text += e.length > 0 ? ' ' + e : '';
		}
		text += '>';
		for(let e of this.childs){
			text += (typeof e === 'string') ? e : e.make();
		}
		text += `</${this.tag}>`;
		return text;
	}

	getAttributes(){
		let id = this.id ? `id="${this.id}"` : '';
		let name = this.name ? `name="${this.name}"` : '';
		let classname = this.classname ? `class="${this.classname}"` : '';
		return [id, classname, name, this._style, this._enabled];
	}

	addChild(child){
		this.childs.push(child);
	}

	enabled(set){
		this._enabled = set ? '' : ' disabled';
	}

	setCorrect(set){
		if(set){
			this._style = 'style="background:LightGreen';
		} else {
			this._style = 'style="background:LightSalmon';
		}
	}
}

class HShortText extends HElement {

	constructor(name){
		super('input', name);
		this.type = 'text';
		this.value = null;
	}

	getAttributes(){
		let list = super.getAttributes();
		list.push(`type="${this.type}"`);
		if(this.value){
			list.push(`value="${value}"`);
		}
		return list;
	}
}

class HLongText extends HElement {

	constructor(name){
		super('textarea', name);
		this.value = null;
	}

	getAttributes(){
		let list = super.getAttributes();
		if(this.value){
			list.push(`value="${value}"`);
		}
		return list;
	}
}

class HCheckbox extends HElement{

	constructor(name){
		super('input', name);
		this.type = 'checkbox';
		this.checked = false;
	}

	getAttributes(){
		let list = super.getAttributes();
		list.push(`type="${this.type}"`);
		if(this.checked){
			list.push('checked');
		}
		return list;
	}
}

class HCheckboxGroup extends HElement {

	constructor(tag, name){
		super(tag, name);
		this.options = new Map();
	}

	addOption(optionText){
		let opt = new HCheckbox(this.name);
		opt.addChild(optionText);
		let div = new HElement('div');
		div.addChild(opt);
		this.addChild(div);
		this.options.set(optionText, div);
	}

	setCorrectOptions(correct = []){
		for(let [text, e] of this.options.entries()){
			e.setCorrect(correct.includes(text));
		}
	}
}

class HRadioGroup extends HCheckboxGroup {

	constructor(tag, name){
		super(tag, name);
	}

	addOption(optionText){
		super.addOption(optionText);
		this.options.get(optionText).childs[0].type = 'radio';
	}

	setCorrectOptions(correct){
		for(let [text, e] of this.options.entries()){
			e.setCorrect(correct === text);
			e.enabled(false);
		}
	}
}


class HOption extends HElement {

	constructor(value){
		super('option');
		this.value = value;
		this.selected = false;
		this.addChild(value);
	}

	getAttributes(){
		let list = super.getAttributes();
		list.push(`value="${this.value}"`);
		if(this.selected){
			list.push('selected');
		}
		return list;
	}
}

class HSelect extends HElement {

	constructor(name){
		super('select', name);
		this.options = new Map();
		this.selectedOption = null;
	}

	addOption(optionText){
		let option = new HOption(optionText);
		this.options.set(optionText, option);
		this.addChild(option);
		if(!this.selectedOption){
			this.selectedOption = optionText;
		}
	}

	getSelectedOption(){
		return this.selectedOption;
	}

	setSelectedOption(optionText){
		this.options.get(optionText).selected = true;
	}
}

class HSelectGroup extends HElement {
	
	constructor(name, values){
		super('table', null, 'select');
		this._name = name;
		this.options = new Map();
		this.values = values;
		this.values.unshift('');
	}

	setSelectedKey(key, value){
		this.options.get(optionText).setSelectedOption(value);
	}

	setCorrectKey(key, value){
		let opt = this.options.get(key);
		val.setCorrect(opt.getSelectedOption() === value);
	}

	addKey(key){
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
		this.options.set(key, select);
	}
}

class AQA {

	constructor(title, request){
		this.title = title;
		this.request = request;
		this.style = null;
		this.theory = null;
		this.table = new HElement('table', null, 'main');
	}

	loadTheoryMD(fileName){
		let md = fs.readFileSync(fileName);
		converter = new showdown.Converter(),
    	this.theory = converter.makeHtml(md);
	}

	parseJSON(json, answers = null){
		for (let q of json.questions) {
			switch (q.type) {
				case 'description':
					this.addDescription(q)
					break;
				case 'short':
					this.addQuestionShort(q);
					answers && this.evalQuestionShort(q, answers);
					break;
				case 'long':
					this.addQuestionLong(q);
					answers && this.evalQuestionLong(q, answers);
					break;
				case 'mark':
					this.addQuestionMark(q);
					answers && this.evalQuestionMark(q, answers);
					break;
				case 'choice':
					this.addQuestionOptions(q);
					answers && this.evalQuestionOptions(q, answers);
					break;
				case 'select':
					this.addQuestionSelect(q);
					answers && this.evalQuestionSelect(q, answers);
					break;
			}
		}
		return this._make(!answers);
	}

	_addCell(element){
		let td = new HElement('td', null, 'main');
		td.addChild(element);
		let tr = new HElement('tr', null, 'main');
		tr.addChild(td);
		this.table.addChild(tr);
		return td;
	}

	addDescription(q){
		this._addCell(q.question);
	}

	addQuestionShort(q){
		q.element = new HShortText(q.name);
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionShort(q, answers){
		let isCorrect = answers[q.name] && q.answer.trim() === answers[q.name].trim();
		q.element.value = answers[q.name];
		q.element.setCorrect(isCorrect);
		q.element.enabled(false);
		q.cell.setCorrect(isCorrect);
	}

	addQuestionLong(q){
		q.element = new HLongText(q.name);
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionLong(q, answers){
		let isCorrect = false; // TODO BLEU metric
		q.element.value = answers[q.name];
		q.element.setCorrect(isCorrect);
		q.element.enabled(false);
		q.cell.setCorrect(isCorrect);
	}

	addQuestionMark(q){
		q.element = new HCheckboxGroup('div', q.name);
		q.options.forEach(o => q.element.addOption(o));
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionMark(q, answers){
		if(!Array.isArray(this.answers[q.name])){
			answers[q.name] = [answers[q.name]];
		}
		q.element.setCorrectOptions(answers[q.name]);

		let allCorrect = true;
		q.options.forEach((e,i) => {
			let isCorrect = this.answers[q.name].includes(e) === q.answer[i];
			allCorrect = allCorrect && isCorrect;
		});
		q.cell.setCorrect(allCorrect);
	}

	addQuestionOptions(q){
		q.element = new HRadioGroup('div', q.name);
		q.options.forEach(o => q.element.addOption(o));
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionOptions(q, answers){
		q.element.setCorrectOptions(answers[q.name]);
		q.cell.setCorrect(q.answer === answers[q.name]);
	}

	addQuestionSelect(q){
		q.element = new HSelectGroup(q.name, q.values);
		q.keys.forEach(o => q.element.addKey(o));
		q.cell = this._addCell(q.question);
		q.cell.addChild('<br>');
		q.cell.addChild(q.element);
	}

	evalQuestionSelect(q, answers){
		let allCorrect = true;
		q.keys.forEach((k,i) => {
			let value = answers[q.name] && answers[q.name][i];
			let isCorrect = q.answer[k] === value;
			q.element.setSelectedKey(k, value);
			q.element.setCorrectKey(k, q.answer[k]);
			allCorrect = allCorrect && isCorrect;
		});
		q.cell.setCorrect(allCorrect);
	}

	_make(evaluate){
		let text = '<!DOCTYPE html><html><head>';
		text += `<title>AQA - ${this.title}</title>`;
		if(this.style)
			text += `<style>${this.style}</style>`;
		text += '</head><body>';
		text += `<details class="main">`;
		text += `<summary class="main">${this.title}</summary>`;
		if(this.theory)
			text += this.theory;
		text += '</details>';
		text += `<form action="${this.request}" method="post" autocomplete="off">`;
		text += this.table.make();
		if(evaluate)
			text += '<input id="confirm" type="submit" value="Evaluate!">';
		text += '</form></body></html>';
		return text;
	}
}

module.exports = AQA;
