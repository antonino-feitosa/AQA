
class AQA {

	constructor(style, json, name, answers = null) {
		this.text = '<!DOCTYPE html><html><head>';
		this.text += '<title>AQA</title>';
		this.text += `<style>${style}</style>`;
		this.text += '</head><body>';
		this.json = json;
		this.answers = answers;
		this._setTitle(json.title, json.theory, name);
	}
	
	_loadTheory(){
		let showdown  = require('showdown'),
    	converter = new showdown.Converter(),
    	text = '# hello, markdown!',
    	html = converter.makeHtml(text);
		return html;
	}

	_setTitle(title, name) {
		this.text += `<details class="main">`;
		this.text += `<summary class="main">${title}</summary>`;
		this.text += this._loadTheory() + '</details>';
		this.text += '<form action="evaluate" method="post" autocomplete="off">';
		this.text += '<table class="main">';
		this.text += `<input type="hidden" id="fileName" value="${name}">`;
	}

	_addCell(text, style = "") {
		this.text += `<tr class="main">`
		this.text += `<td class="main" ${style}>${text}</td></tr>`;
	}

	addDescription(desc) {
		this._addCell(desc.question);
	}

	addQuestionShort(q) {
		let text = q.question + '<br>';
		let style = "";
		let value = "";
		if(this.answers){
			let isCorrect = this.answers[q.name] && q.answer.trim() === this.answers[q.name].trim();
			style = 'style="background:' + (isCorrect ? 'LightGreen' : 'LightSalmon') + '"';
			value = `value="${this.answers[q.name]}" disabled`;
		}
		text += `<input type="text" name="${q.name}" class="main" ${style} ${value}>`
		this._addCell(text, style);
	}

	addQuestionLong(q) {
		let text = q.question + '<br>';
		text += `<textarea name="${q.name}" class="main"></textarea>`;
		this._addCell(text);
	}

	_createGroup(q, type = 'checkbox', styleByOption, markedByOption) {
		let text = '';
		for (let opt of q.options) {
			let style = styleByOption.get(opt);
			let group = `<div ${style}><input type="${type}" name="${q.name}"`;
			text += group;
			let check = markedByOption.get(opt);
			text += `value="${opt}" ${check}>`;
			text += opt + '</input></div>';
		}
		return text;
	}

	addQuestionMark(q) {
		let style = "";
		let styleByOption = new Map();
		let markByOption = new Map();
		if(this.answers){
			if(!Array.isArray(this.answers[q.name])){
				this.answers[q.name] = [this.answers[q.name]];
			}
			let numCorrect = 0;
			q.options.forEach((e,i) => {
				let isCorrect = this.answers[q.name].includes(e) === q.answer[i];
				let style = 'style="background:' + (isCorrect ? 'LightGreen' : 'LightSalmon') + '"';
				numCorrect += isCorrect ? 1 : 0;
				styleByOption.set(e, style);
				markByOption.set(e, this.answers[q.name].includes(e) ? 'checked disabled': 'disabled');
			});
			style = 'style="background:' + (numCorrect === q.options.length ? 'LightGreen' : 'LightSalmon') + '"';
		}
		let text = q.question + this._createGroup(q, 'checkbox', styleByOption, markByOption);
		this._addCell(text, style);
	}

	addQuestionOptions(q) {
		let style = "";
		let styleByOption = new Map();
		let markByOption = new Map();
		if(this.answers){
			if(this.answers[q.name]){
				let isCorrect = this.answers[q.name] === q.answer;
				style = 'style="background:' + (isCorrect ? 'LightGreen' : 'LightSalmon') + '"';
				q.options.forEach(e => {
					styleByOption.set(e, style);
					markByOption.set(e, e === this.answers[q.name] ? 'checked disabled': 'disabled');
				});
			}
		}
		let text = q.question + this._createGroup(q, 'radio', styleByOption, markByOption);
		this._addCell(text, style);
	}

	_createSelection(name, key, values, style, value) {
		let text = `<tr class="select" ${style}><td class="select">${key}:</td><td class="select">`;
		text += `<select name="${name}" class="main" ${style}><option value=""></option>`;
		for (let opt of values) {
			let selected = opt === value ? 'selected' : '';
			text += `<option value="${opt}" ${selected}>${opt}</option>`;
		}
		text += '</select></td>';
		return text;
	}

	addQuestionSelect(q) {
		let text = q.question;
		text += '<table class="select" cellspacing="0" cellpadding="0">';
		let numCorrect = 0;
		let style = '';
		q.keys.forEach((k,i) => {
			let style = '';
			let value = '';
			if(this.answers){
				value = this.answers[q.name][i];
				let isCorrect = q.answer[k] === value;
				numCorrect += isCorrect ? 1 : 0;
				style = 'disabled style="background:' + (isCorrect ? 'LightGreen' : 'LightSalmon') + '"';
			}
			text += this._createSelection(q.name, k, q.values, style, value);
		});
		style = 'style="background:' + (numCorrect === q.keys.length ? 'LightGreen' : 'LightSalmon') + '"';
		text += '</table>';
		this._addCell(text, style);
	}

	generate() {
		for (let q of this.json.questions) {
			switch (q.type) {
				case 'description':
					this.addDescription(q); break;
				case 'short':
					this.addQuestionShort(q); break;
				case 'long':
					this.addQuestionLong(q); break;
				case 'mark':
					this.addQuestionMark(q); break;
				case 'choice':
					this.addQuestionOptions(q); break;
				case 'select':
					this.addQuestionSelect(q); break;
			}
		}
		this.text += '</table><br>';
		if(!this.answers)
			this.text += '<input id="confirm" type="submit" value="Evaluate!">';
		this.text += '</form></body></html>';
		return this.text;
	}
}

module.exports = AQA;
