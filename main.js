class AQA {
	constructor() {
		this.text = "<table>\n";
		this.questions = new Map();
		this.idCount = 0;
	}

	setTile(title, theory) {
		let textTitle = "<summary>" + title + "</summary>";
		let textTheory = "<details>" + textTitle + theory + "</details><br>";
		this.text += textTheory + this.text;
	}

	_addCell(text) {
		this.text += "<tr><td>" + text + "</td></tr>";
	}

	_addFeedback() {
		let id = this.idCount++;
		this.text += "<tr><td><div id=\"" + id + "\" hidden></div></td></tr>";
	}

	_insertQuestion(q) {
		let id = this.idCount++;
		this.questions.set(id, q);
		return id;
	}

	addDescription(desc) {
		this.text += "<tr><td>" + desc.question + "</td></tr>";
	}

	addQuestionShort(q) {
		let id = this._insertQuestion(q);
		let text = "<br>" + q.question + "<br>";
		text += "<input type=\"text\" id=\"" + id + "\"><br>"
		this._addCell(text);
		this._addFeedback();
	}

	addQuestionLong(q) {
		let id = this._insertQuestion(q);
		let text = "<br>" + q.question + "<br>";
		text += "<textarea id=\"" + id + "\"></textarea><br>";
		this._addCell(text);
		this._addFeedback();
	}

	_createGroup(q, groupName){
		let text = "";
		for (let opt of q.options) {
			text += groupName;
			text += "value=\"" + opt + "\"/>";
			text += opt + "<br>";
		}
		return text;
	}

	addQuestionMark(q) {
		let id = this._insertQuestion(q);
		let group = "<input id=\""+id+"\"";
		group += " type=\"checkbox\"";
		group +=  "name=\"question" + id + "\"";
		let text = "<br>" + q.question + "<br>";
		text += this._createGroup(q, group);
		this._addCell(text);
		this._addFeedback();
	}

	addQuestionChoice(q) {
		let id = this._insertQuestion(q);
		let group = "<input id=\""+id+"\"";
		group += " type=\"radio\"";
		group +=  "name=\"question" + id + "\"";
		let text = "<br>" + q.question + "<br>";
		text += this._createGroup(q, group);
		this._addCell(text);
		this._addFeedback();
	}

	_createSelection(id, key, values){
		let text = key + ": ";
		text += "<select id=\"" + id + "_" + key + "\">";
		for(let opt of values){
			text += "<option value=\"" + opt +"\">" + opt + "</option>";
		}
		text += "</select>";
		this._addCell(text);
		this._addFeedback();
	}

	addQuestionSelect(q) {
		let id = this._insertQuestion(q);
		let text = "<br>" + q.question + "<br>";
		this._addCell(text);
		for(let k of q.keys){
			this._createSelection(id, k, q.values);
		}
	}

	display() {
		this.text += "\n</table>";
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
				case "description":
					this.addDescription(q); break;
				case "short":
					this.addQuestionShort(q); break;
				case "long":
					this.addQuestionLong(q); break;
				case "mark":
					this.addQuestionMark(q); break;
				case "choice":
					this.addQuestionChoice(q); break;
				case "select":
					this.addQuestionSelect(q); break;
			}
		}
		this.display();
	}
}

let fileName = "example.json";
let quiz = new AQA();
quiz.execute(fileName);
