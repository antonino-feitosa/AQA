class AQA {
	constructor() {
		this.text = '<table class="main">';
		this.questions = new Map();
		this.idCount = 0;
	}

	setTile(title, theory) {
		let textTitle = `<summary class="main">${title}</summary>`;
		let textTheory = `<details class="main">${textTitle}${theory}</details><br>`;
		this.text += textTheory + this.text;
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
		text += `<textarea id="${id}" rows=10 class="main"></textarea>`;
		this._addCell(text);
	}

	_createGroup(q, groupName){
		let text = '';
		for (let opt of q.options) {
			text += groupName;
			text += `value="${opt}"/>`;
			text += opt;
		}
		return text;
	}

	addQuestionOptions(q, type='checkbox') {
		let id = this._insertQuestion(q);
		let group = `<br><input id="${id}"`;
		group += ` type="${type}"`;
		group +=  `name="question_${id}"`;
		let text = q.question + this._createGroup(q, group);
		this._addCell(text);
	}

	_createSelection(id, key, values){
		let text = `<tr class="select"><td class="select">${key}:</td><td class="select">`;
		text += `<select id=${id}_${key} class="main"><option value=""></option>`;
		for(let opt of values){
			text += `<option value="${opt}">${opt}</option>`;
		}
		text += '</select></td>';
		return text;
	}

	addQuestionSelect(q) {
		let id = this._insertQuestion(q);
		let text = q.question;
		text += '<table class="select">';
		for(let k of q.keys){
			text += this._createSelection(id, k, q.values);
		}
		text += '</table>';
		this._addCell(text);
	}

	display() {
		this.text += '</table><br><input type="submit" value="Evaluate!">';

		document.body.innerHTML = this.text;
	}

	evaluate() {

	}

	async execute(fileName) {
		const response = await fetch(fileName);
		const json = await response.json();
		this.setTile(json.title, json.theory);
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
}

let fileName = './data/example.json';
let quiz = new AQA();
quiz.execute(fileName);
