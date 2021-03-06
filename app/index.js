const express    = require('express');	//for GET 
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');  // for POST
const P2pServer  = require('./p2p-server');
const Wallet     = require('../wallet');  // creates a new trasactions and submit it to transaction-pool
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001; // while running we can use HTTP_PORT:3000 npm run dev
const app       = express();
const bc        = new Blockchain();
const wallet    = new Wallet();
const tp        = new TransactionPool();
const p2pServer = new P2pServer(bc, tp); 
const miner     = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/block', (req, res) => {
	res.json(bc.chain);
});

app.post('/mine', (req, res) => {
	const new_block = bc.addBlock(req.body.data);
	console.log('New block is added', new_block);

	//when a new valid block is added, in each peer this update should be done.
	p2pServer.syncChains();

	res.redirect('/block');
})

app.get('/transactions', (req, res) => {  // Get all transaction (initially expecting empty array)
	res.json(tp.transactions)
})

//Post a new transaction  (this is a transaction of single user and it is not shared among others for now)
app.post('/transact', (req, res) => {
	const { recipient, amount } = req.body
	const transaction = wallet.createTransaction(recipient, amount, bc, tp);
	
	p2pServer.broadcastTransaction(transaction)

	res.redirect('/transactions');
});

app.get('/mine-transaction', (req, res) => {
	const block = miner.mine();
	console.log(`New block added: ${block.toString()}`);
	res.redirect('/block');
})

//To share the public key
app.get('/public-key', (req, res) => {
	res.json({PublicKey: wallet.publicKey});
})

app.listen(HTTP_PORT, () => console.log(`listening to port ${HTTP_PORT}`));
p2pServer.listen();








//-----how to run //

//create a connection normally :

//npm run dev -> now it will create a connection with HTTP_PORT 3001 AND P2P_PORT 5001 

//Now create another peer connection with http_port and p2p_port a new port numbers and set PEERS = 5001

// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev