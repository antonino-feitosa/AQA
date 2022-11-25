class AQA {
	constructor() {
		this.text = "<table><tr>\n";
	}

	setTile(title, theory){
		let textTitle = "<summary>"+title+"</summary>";
		let textTheory = "<details>"+ textTitle + theory + "</details>\n";
		this.text += textTheory + this.text;
	}

	addDescription() {

	}

	addQuestionShort(){
		
	}

	addQuestionLong(){
		
	}

	addQuestionChoice(){
	}

	addQuestionAssociation(){
		
	}

	display(){
		this.text += "\n</tr></table>";
		document.body.innerHTML = this.text;
	}

	evaluate(){
		
	}

	async execute(fileName) {
		const response = await fetch(fileName);
		const json = await response.json();
		this.setTile(json.title, json.theory);
		this.display();
	}
}

let fileName = "example.json";
let quiz = new AQA();
quiz.execute(fileName);
