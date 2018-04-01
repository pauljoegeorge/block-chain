// For GET request 
const Blockchain = require('../blockchain');
const express 	 = require('express');  	//FOR GET METHOD
const bodyParser = require('body-parser');  // FOR POST
const P2pServer  = require('./p2p-server'); // FOR peer to peer webserver

const HTTP_PORT = process.env.HTTP_PORT || 3001;			//HTTP_PORT=3002 npm run dev
const app 		= express();
const bc 		= new Blockchain();
const p2pserver = new P2pServer(bc);  //P2pServer takes blockchain as input

app.use(bodyParser.json());	// FOR POST

app.get('/block', (req, res) =>{
	res.json(bc.chain);
});

app.post('/mine', (req, res) => {
	const new_block = bc.addBlock(req.body.data);
	console.log("Yes new block is added");

	res.redirect('/block');		//redirects to get method
})

app.listen(HTTP_PORT, () => console.log(`Listening to port ${HTTP_PORT}`));
p2pserver.listen();  //to fire up web socket service












//-----how to run //

//create a connection normally :

//npm run dev -> now it will create a connection with HTTP_PORT 3001 AND P2P_PORT 5001 

//Now create another peer connection with http_port and p2p_port a new port numbers and set PEERS = 5001