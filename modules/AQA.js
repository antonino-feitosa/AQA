
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
		if(this.answers){
			let isCorrect = q.answer.trim() === this.answers[q.name].trim();
			style = 'style="background:' + (isCorrect ? 'LightGreen' : 'LightSalmon') + '"';
		}
		text += `<input type="text" name="${q.name}" ${style} class="main">`
		this._addCell(text, style);
	}

	addQuestionLong(q) {
		let text = q.question + '<br>';
		text += `<textarea name="${q.name}" class="main"></textarea>`;
		this._addCell(text);
	}

	_createGroup(q, groupName) {
		let text = '';
		for (let opt of q.options) {
			text += groupName;
			text += `value="${opt}"/>`;
			text += opt + '</input></div>';
		}
		return text;
	}

	addQuestionOptions(q, type = 'checkbox') {
		let group = `<div><input type="${type}" name="${q.name}"`;
		let text = q.question + this._createGroup(q, group);
		this._addCell(text);
	}

	_createSelection(name, key, values) {
		let text = `<tr class="select"><td class="select">${key}:</td><td class="select">`;
		text += `<select name="${name}" class="main"><option value=""></option>`;
		for (let opt of values) {
			text += `<option value="${opt}">${opt}</option>`;
		}
		text += '</select></td>';
		return text;
	}

	addQuestionSelect(q) {
		let text = q.question;
		text += '<table class="select" cellspacing="0" cellpadding="0">';
		for (let k of q.keys) {
			text += this._createSelection(q.name, k, q.values);
		}
		text += '</table>';
		this._addCell(text);
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
					this.addQuestionOptions(q, 'checkbox'); break;
				case 'choice':
					this.addQuestionOptions(q, 'radio'); break;
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
