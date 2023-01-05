
/* grammar aqa

file = title endl theory endl questions

questions = question [feedback] endl file | question [feedback]
question = long question | short question | mark question | choice question | select question

long = 'long' endl text long_answer
long_answer = text long_answer | text endl

short = 'short' endl text endl short_answer
short_answer = text text endl short_answer | text text endl

select = 'select' endl text endl short_answer

mark = 'mark' endl text endl options endl mark_options
options = text options | text endl

choice = 'choice' endl text endl text endl options

description = 'descrition' endl text endl

feedback = 'feedback' endl text endl
text = string - {\n}
endl = '\n'

*/


class ParseAQA {

    constructor() {
    }

    parse(text) {
        this.sentences = text.replaceAll('\r\n', '\n').split('\n');
        if(this.sentences.length < 3){
            console.warn('Wrong file format!');
            return null;
        }
        
        this.json = {title: this.nextSentence(), theory: this.nextSentence(), questions: []};
        this.nextSentence()

        this.lines = this.sentences.length;
        this.count = 1;
        while(this.sentences.length > 0){
            this.parse_question();
        }
        return this.json;
    }

    nextSentence(){
        if(!this.sentences || this.sentences.length === 0){
            console.warn('Premature end of file!');
            return '';
        }
        return this.sentences.shift().trim();
    }

    hasNextSentence(){
        return this.sentences && this.sentences.length > 0 && this.sentences[0] !== '';
    }

    parse_question() {
        let sent = this.nextSentence();
        switch (sent) {
            case 'long': this.parse_long(); break;
            case 'short': this.parse_short(); break;
            case 'mark': this.parse_mark(); break;
            case 'choice': this.parse_choice(); break;
            case 'select': this.parse_select(); break;
            case 'description': this.parse_description(); break;
            case 'feedback': this.parse_feedback(); break;
            default:
                console.warn(`Can not process line ${this.lines - this.sentences.length}: ${sent}`);
                this.sentences.length = 0;
        }
        this.nextSentence();
    }

    parse_feedback(){
        let text = this.nextSentence();
        this.json.questions[this.json.questions.length-1].feedback = text;
    }

    parse_description(){
        let q = {}
        q.type = 'description';
        q.question = this.nextSentence();
        this.json.questions.push(q);
    }

    create_question(type, difficulty, question, answer){
        let q = {};
        q.type = type;
        q.difficulty = difficulty;
        q.name = this.count++;
        q.question = question;
        q.answer = answer;
        q.feedback = '';
        this.json.questions.push(q);
        return q;
    }

    parse_long(){
        let question = this.nextSentence();
        let answer = [];
        while(this.hasNextSentence()){
            answer.push(this.nextSentence())
        }
        this.create_question('long', 10, question, answer);
    }

    parse_short(){
        this.parse_description();
        while(this.hasNextSentence()){
            let question = this.nextSentence();
            let answer = this.nextSentence();
            this.create_question('short', 3, question, answer);
        }
        // add description for style
        let q = {}
        q.type = 'description';
        q.question = '';
        this.json.questions.push(q);
    }

    parse_select(){
        let question = this.nextSentence();
        let answer = new Map();
        while(this.hasNextSentence()){
            let key = this.nextSentence();
            let value = this.nextSentence();
            answer.set(key,value);
        }
        let q = this.create_question('select', 2, question, answer);
        q.values = [...answer.values()];
        q.keys = [...answer.keys()];
    }

    parse_mark(){
        let question = this.nextSentence();
        let answers = [];
        while(this.hasNextSentence()){
            answers.push(this.nextSentence());
        }
        this.nextSentence();
        let options = Array.from(answers);
        while(this.hasNextSentence()){
            options.push(this.nextSentence());
        }
        let q = this.create_question('mark', 1, question, answers);
        q.options = options;
    }

    parse_choice(){
        let question = this.nextSentence();
        let answer = this.nextSentence();
        let options = [answer];
        while(this.hasNextSentence()){
            options.push(this.nextSentence());
        }
        let q = this.create_question('choice', 1, question, answer);
        q.options = options;
    }
}


module.exports = ParseAQA;
