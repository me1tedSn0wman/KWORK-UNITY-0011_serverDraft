var http = require('http');
var url = require('url');
var mysql = require('mysql');
var express = require("express");
var cors = require('cors');
var spawn = require("child_process").spawn;

http.createServer(function (req,res) {
	res.writeHead(200, {'Context-Type': 'text/plain'});
	res.write(req.url);
	res.end();
}).listen(9852)

let i_num =0;

var con = mysql.createConnection({
	host: "localhost",
	user: "snow",
	port: "3306",
	database: "duelofanswer"
});


con.connect(function(err) {
	if(err) throw err;
	console.log("Connected");
	str_query = "TRUNCATE TABLE responses"
	con.query(
		str_query, 
		function (err, resultQuery, fields) {
			if(err) throw err;
		});
	
});




var app = express();

app.use(express.json());
app.use(cors());



app.get("/questions", (req, res) =>
{
	console.log("get all questions");
	str_query = "SELECT * FROM questions";
	let resultQuery;
	con.query(
		str_query, 
		function (err, resultQuery, fields) {
			if(err) throw err;

			dataJson = JSON.parse(JSON.stringify(resultQuery));
			console.log(dataJson);
			res.status(200).send(dataJson);
			}
		);



//	res.writeHead(200, {'Content-Type': 'application/json'})
//	res.write(result)

});

app.get("/questions/:id", (req, res) =>
{
	console.log('get question with id ${req.params.id}');

	console.log("get all questions");
	str_query = "SELECT * FROM questions WHERE QUESTION_NUM = "+ req.params.id;
	let resultQuery;
	con.query(
		str_query, 
		function (err, resultQuery, fields) {
			if(err) throw err;

			dataJson = JSON.parse(JSON.stringify(resultQuery[0]));
			console.log(dataJson);
			res.status(200).send(dataJson);
			}
		);
});

app.get("/questions_update", (req, res)=>{
	pyProg = spawn('python3', ["/home/tyukidama/python_bots/kwork-0011/tryDisc2.py"]);

	pyProg.stdout.on('data', function(data){
		console.log(data.toString());
	});
	pyProg.stderr.on('data', function(data){
		console.log(data.toString());
	})

	res.sendStatus(200);
});

app.get("/statistics_update", (req, res)=>{
	pyProg = spawn('python3', ["/home/tyukidama/python_bots/kwork-0011/updateStat.py"]);
	
	pyProg.stdout.on('data', function(data){
		console.log(data.toString());
	});
	pyProg.stderr.on('data', function(data){
		console.log(data.toString());
	})
	
	res.sendStatus(200);
});


app.get("/responces_stats/:id", (req, res) =>{
	console.log('get stat with id ${req.params.id}');

	str_query = "SELECT * FROM responces_stats WHERE QUESTION_NUM = "+ req.params.id;
	let resultQuery;
	con.query(
		str_query, 
		function (err, resultQuery, fields) {
			if(err) throw err;
			
			if(resultQuery != undefined && resultQuery.length >0) {
				dataJson = JSON.parse(JSON.stringify(resultQuery[0]));
				console.log(dataJson);
				res.status(200).send(dataJson);
			} else {
				res.sendStatus(400);
			}
		});
});

app.post("/responses", (req, res) => 
{
	console.log('add a response');
	console.log(req.body);
	i_num = i_num +1;
	str_query = "INSERT INTO responses(RESPONSE_ID, CLIENT_ID,QUESTION_NUM,ANSWER) VALUES ("
		+i_num + ","
		+req.body.clientId + ","
		+req.body.questionId + ","
		+req.body.answer
		+")"
		;
	console.log(str_query);
	con.query(
		str_query, 
		function (err, resultQuery, fields) {
			if(err) 
				throw err;
			else
				console.log("Inserted");
		});
});

app.all("/", (req, res) => 
{
	res.sendStatus("404");
});

let port_num = 9851
app.listen(port_num, ()=>
{
	console.log("listening on port $port_num");	
});


