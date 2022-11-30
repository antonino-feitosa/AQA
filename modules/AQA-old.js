
class AQA {
	constructor() {
		this.text = ''
		this.questions = new Map();
		this.idCount = 0;
	}
	
	loadTheory(){
		//let showdown  = require('showdown'),
    	converter = new showdown.Converter(),
    	text = '# hello, markdown!',
    	html = converter.makeHtml(text);
		return html;
	}

	setTitle(title, theory, fileName) {
		let textTitle = `<summary class="main">${title}</summary>`;
		let text = this.loadTheory();
		let textTheory = `<details class="main">${textTitle}${text}</details>`;
		let table = '<form><table class="main">'
		let file = `<input type="hidden" id="fileName" value="${fileName}">`;
		this.text += textTheory + table + file;
	}

	_addCell(text) {
		this.text += `<tr class="main"><td class="main">${text}</td></tr>`;
	}

	_insertQuestion(q) {
		let id = this.idCount++;
		this.questions.set(id, q);
		return id;
	}

	addDescription(desc) {
		this._addCell(desc.question);
	}

	addQuestionShort(q) {
		let id = this._insertQuestion(q);
		let text = q.question + '<br>';
		text += `<input type="text" id="${id}" class="main">`
		this._addCell(text);
	}

	addQuestionLong(q) {
		let id = this._insertQuestion(q);
		let text = q.question + '<br>';
		text += `<textarea id="${id}" class="main"></textarea>`;
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
		let id = this._insertQuestion(q);
		let group = `<div><input type="${type}" name="${id}"`;
		let text = q.question + this._createGroup(q, group);
		this._addCell(text);
	}

	_createSelection(id, key, values) {
		let text = `<tr class="select"><td class="select">${key}:</td><td class="select">`;
		text += `<select id="${id}_${key}" name=${id} class="main"><option value=""></option>`;
		for (let opt of values) {
			text += `<option value="${opt}">${opt}</option>`;
		}
		text += '</select></td>';
		return text;
	}

	addQuestionSelect(q) {
		let id = this._insertQuestion(q);
		let text = q.question;
		text += '<table class="select" cellspacing="0" cellpadding="0">';
		for (let k of q.keys) {
			text += this._createSelection(id, k, q.values);
		}
		text += '</table>';
		this._addCell(text);
	}

	display() {
		this.text += '</table><br><input id="confirm" type="button" value="Evaluate!" onclick="return evaluateQuestions(this);"></form>';
		document.body.innerHTML = this.text;
	}

	async execute(fileName) {
		const response = await fetch(fileName);
		const json = await response.json();
		this.setTitle(json.title, json.theory, fileName);
		for (let q of json.questions) {
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
		this.display();
	}

	_setStyleParent(element, correct = true) {
		element.parentElement.style.background = correct ? 'PaleGreen' : 'Salmon';
	}

	_setStyle(element, correct = true) {
		element.style.borderColor = correct ? 'ForestGreen' : 'Crimson';
		element.style.background = correct ? 'LightGreen' : 'LightSalmon';
	}

	evalQuestionShort(id, q) {
		let e = document.getElementById(id);
		let isCorrect = e.value.trim() === q.answer.trim();
		this._setStyle(e, isCorrect);
		this._setStyleParent(e, isCorrect);
		return isCorrect ? 1 : 0;
	}

	evalQuestionLong(id, q) {
		// BLEU metric
		return 0;
	}

	evalQuestionMark(id, q) {
		let vet = document.getElementsByName(id);
		let numCorrect = 0;
		for (let index = 0; index < q.answer.length; index++) {
			let e = vet[index];
			let isCorrect = e.checked === q.answer[index];
			this._setStyle(e.parentElement, isCorrect);
			numCorrect += isCorrect ? 1 : 0;
		}
		this._setStyleParent(vet[0].parentElement, numCorrect === q.answer.length);
		return numCorrect / q.answer.length;
	}

	evalQuestionOptions(id, q) {
		let vet = document.getElementsByName(id);
		for(let index = 0; index < vet.length; index++){
			let e = vet[index];
			if(e.checked === true){
				let isCorrect = e.value === q.answer;
				this._setStyle(e.parentElement, isCorrect);
				this._setStyleParent(e.parentElement, isCorrect);
				return 1;
			}
		}
		return 0;
	}

	evalQuestionSelect(id, q) {
		let e, numCorrect = 0, total = 0;
		for(let [key, value] of Object.entries(q.answer)){
			e = document.getElementById(id + '_' + key);
			let isCorrect = e.value.trim() === value.trim();
			this._setStyle(e.parentElement.parentElement, isCorrect);
			numCorrect += isCorrect ? 1 : 0;
			total += 1;
		}
		this._setStyleParent(e.parentElement.parentElement.parentElement.parentElement, numCorrect === total);
		return numCorrect / total;
	}

	evaluate(element) {
		element.disabled = true;
		let sum = 0, total = 0;
		for (let [id, q] of this.questions.entries()) {
			switch (q.type) {
				case 'short':
					sum += this.evalQuestionShort(id, q);
					total += 1;
					break;
				case 'long':
					sum += this.evalQuestionLong(id, q); 
					total += 1;
					break;
				case 'mark':
					sum += this.evalQuestionMark(id, q);
					total += 1;
					break;
				case 'choice':
					sum += this.evalQuestionOptions(id, q);
					total += 1;
					break;
				case 'select':
					sum += this.evalQuestionSelect(id, q);
					total += 1;
					break;
			}
		}

		console.log(sum);
		let points = Math.floor((1000 * sum)/total);
		let div = `<div class="result">Score: ${points}</div>`
		document.body.innerHTML += div;
	}
}

export { AQA };
