/*
	Page Template related Requires
*/
const template = require("./templates.js");
/*
	Card Search Requires
*/
const mtgSearch = require("./mtgSearchMain.js");
/*
	Server Requires
	----
	Cool Node Command Line Commands:
	-c: Complies the command for syntax errors
	-i: Allows you to mess with the javascript console. 
	https://nodejs.org/api/repl.html#repl_design_and_features

	----
*/
process.env.NODE_PENDING_DEPRECATION=1;
const serverConfig = require("./serverConfig.json");
/*
	Express related Requires
*/
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app=express();
/*
	Express Configuration Variables
*/
const port = serverConfig.port;
/*
	Basically what this stuff does is it parses the body of post requests
	So that I can make use of the data inside of them, and use it in my 
	Program.
*/
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//Starts up the server by binding the server to the specified port
app.listen(port,()=>console.log(`Server Running on Port ${port}!`));

var imageUrl="";
app.post("*",function(req,resp){
	console.log(`Post Request Info:\n${JSON.stringify(req.body)}`);
	resp.send(req.body);
});
app.get("/",(req,res)=>{
	console.log("Recieved a get request from "+req.ip);
	res.send(template.testPage());
	//res.send(template.testPage(`Inputed Header`,`This is a paragraph that i have custom made`));
	//res.sendFile(path.resolve("index.html"));
});

const searchTerm = "Knight";
mtgSearch.getCardIdFromCardName(searchTerm).then((searchId)=>mtgSearch.getCardInfoFromCardId(searchId,false,true).then(
	(cardInfo)=>{
		console.log(cardInfo);
		console.log(`Card Id Found: ${cardInfo.id}`);
	//getCardNameFromCardId(id,true,true).then((name)=>console.log(`Card Name Found: ${name}`));
	})
);