
const AQA = require('./AQA/AQA.js');

const style = './AQA/style.css';

class Topic {

    constructor(topic, desc, json, theory){
        this.topic = topic;
        this.desc = desc;
        this.json = json;
        this.theory = theory;
        Topic.topics.set(topic, this);
    }

    loadHTML(response = null){
        let quiz = new AQA(this.topic);
        quiz.loadJSON(this.json);
        quiz.loadStyle(style);
        quiz.loadTheoryMD(this.theory);
        let html = quiz.generate(response);
        return html;
    }

    evalHTML(response){
        return this.loadHTML(response);
    }
}

Topic.topics = new Map();
Topic.get = topic => Topic.topics.get(topic);
Topic.makeIndex = function(){ // TODO change to client side
    let html =
`
<!DOCTYPE html><html><head><title>Automatic Question Answer</title>
<style>
    body { padding: 40px; background-color: #eee; font-size: 20px; }
    table { width: 100%; }
</style></head><body>
<table><thead><tr><th>Exams</th></tr></thead><tbody>\n
`
    for(let t of Topic.topics.values()){
        html += `\t<tr><td><a href="/apply?aqa=${t.topic}">${t.desc}</a></td></tr>`
    }
    html += '</tbody></table></body></html>';
    return html;
}

new Topic('presentsimple', 'English - Present Simple', './english/present simple.json', './english/present simple.md');

module.exports = Topic;
