
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/src/.'));
var port = 8080;

/*app.get('/data/example.json', function(req, res) {
	res.sendFile(__dirname + '/data/example.json');
});*/

app.post('/', function(req, res){
    res.send('OK Here!');
})

app.listen(port);
console.log('server on', port);

