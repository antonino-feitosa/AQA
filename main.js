class AQA {
	constructor() {
		this.text = "<table>\n";
		this.answer = new Map();
		this.difficulty = new Map();
		this.idCount = 0;
	}

	setTile(title, theory){
		let textTitle = "<summary>"+title+"</summary>";
		let textTheory = "<details>"+ textTitle + theory + "</details><br>";
		this.text += textTheory + this.text;
	}

	_addCell(text){
		this.text += "<tr><td>"+text+"</td></tr>";
	}

	_insertQuestion(q){
		let id = this.idCount++;
		this.answer.set(id, q.answer);
		this.difficulty.set(id, q.difficulty);
		return id;
	}

	addDescription(desc) {
		this._addCell(desc.question);
	}

	addQuestionShort(q){
		let id = this._insertQuestion(q);
		let text = "<br>" + q.question + "<br>";
		text += "<input type=\"text\" id=\""+ id +"\"><br>"
		this._addCell(text);
		
	}

	addQuestionLong(q){
		let id = this._insertQuestion(q);
		let text = "<br>" + q.question + "<br>";
		text += "<textarea id=\""+id+"\"></textarea><br>"
		this._addCell(text);
	}

	addQuestionChoice(){
	}

	addQuestionAssociation(){
		
	}

	display(){
		this.text += "\n</table>";
		document.body.innerHTML = this.text;
	}

	evaluate(){
		
	}

	async execute(fileName) {
		const response = await fetch(fileName);
		const json = await response.json();
		this.setTile(json.title, json.theory);
		for(let q of json.questions){
			switch(q.type){
				case "description":
					this.addDescription(q); break;
				case "short":
					this.addQuestionShort(q); break;
				case "long":
					this.addQuestionLong(q); break;
			}
		}
		this.display();
	}
}

let fileName = "example.json";
let quiz = new AQA();
quiz.execute(fileName);
