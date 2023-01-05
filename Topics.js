
const fs = require("fs");
const AQA = require('./AQA.js');

class Topic {

    constructor(topic, desc, json, theory) {
        this.topic = topic;
        this.desc = desc;
        this.json = json;
        this.theory = theory;
        Topic.topics.set(topic, this);
    }

    loadHTML(response = null) {
        let quiz = new AQA(this.topic);
        quiz.loadJSON(this.json);
        quiz.loadTheoryMD(this.theory);
        let html = quiz.generate(response);
        return html;
    }

    evalHTML(response) {
        return this.loadHTML(response);
    }
}

Topic.baseDir = '.';
Topic.topics = new Map();
Topic.get = topic => Topic.topics.get(topic);
Topic.makeIndex = function () { // TODO change to client side
    let html =
        `
<!DOCTYPE html><html><head><title>Automatic Question Answer</title>
<style>
    body { padding: 40px; background-color: #eee; font-size: 20px; }
    table { width: 100%; }
</style></head><body>
<table><thead><tr><th>Exams</th></tr></thead><tbody>\n
`
    for (let t of Topic.topics.values()) {
        html += `\t<tr><td><a href="/apply?aqa=${t.topic}">${t.desc}</a></td></tr>`
    }
    html += '</tbody></table></body></html>';
    return html;
}

Topic.readFile = function (fileName) {
    try {
        if (fs.existsSync(fileName)) {
            let file = fs.readFileSync(fileName, 'utf-8');
            let json = JSON.parse(file, null, 2);
            json.topics.forEach(t => new Topic(t.topic, t.desc, t.json, t.theory));
        }
    } catch (err) {
        console.error(err)
    }
}

Topic.writeFile = function (fileName) {
    let data = JSON.stringify({ topics: [...Topic.topics.values()] }, null, 2);
    fs.writeFileSync(fileName, data, 'utf-8');
}

//new Topic('presentsimple', 'English - Present Simple', './english/present simple.json', './english/present simple.md');

module.exports = Topic;
