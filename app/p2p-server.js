const WebSocket = require('ws');

const P2P_PORT  = process.env.P2P_PORT || 5001;
const peers	    = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
	chain: 'CHAIN',
	transaction: 'TRANSACTION',
	clear_transactions: 'CLEAR'
};

class P2pServer {
	constructor(blokchain, transactionPool){
		this.blockchain = blokchain;
		this.transactionPool = transactionPool;
		this.sockets    = [];
	}

	listen(){
		const server = new WebSocket.Server({ port: P2P_PORT });
		server.on('connection', socket => this.connectSocket(socket));

		this.connectToPeers();
		console.log(`Listening  for peer to peer connection on port: ${P2P_PORT}`);
	}

	connectToPeers(){
		peers.forEach(peer => {
			const socket = new WebSocket(peer);
			socket.on('open', () => this.connectSocket(socket))
		});
	}

	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('socket connected');

		//for sending and receiving the message
		this.messageHandler(socket);	

		this.sendChain(socket);
		
	}

	messageHandler(socket) {
		socket.on('message', message => {
			const data = JSON.parse(message);	//all peers will receive the new block added  //this data is a chain
			// console.log('data received from sender: ', data);
			
			switch(data.type){ //chain or transaction
				case MESSAGE_TYPES.chain:
					this.blockchain.replaceChain(data.chain);  //data.chain = this.blockchain.chain
					break;
				case MESSAGE_TYPES.transaction:
					this.transactionPool.updateOrAddTransaction(data.transaction)
					break;
				case MESSAGE_TYPES.clear_transactions:
					this.transactionPool.clear();
					break;
			}
			// this.blockchain.replaceChain(data);
		});
	}

	sendChain(socket){
		socket.send(JSON.stringify({
			type: MESSAGE_TYPES.chain,
			chain: this.blockchain.chain
		}));	//the one who created block will send the data and 
															//it can be received by everyone using "socket.on"
	}

	sendTransaction(socket, transaction){
		socket.send(JSON.stringify({
			type: MESSAGE_TYPES.transaction,
			transaction
		}));
	}


	syncChains() {
		this.sockets.forEach(socket => this.sendChain(socket));  //will access each connected socket and replace with new valid chain
	}

	broadcastTransaction(transaction){  //broadcast each transaction to all the sockets connected (same as synChain)
		this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
	}

	broadcastClearTransactions() {
		this.sockets.forEach(socket => socket.send(JSON.stringify({
			type: MESSAGE_TYPES.clear_transactions
		})))
	}
} 

module.exports = P2pServer;

// when we are sending data through socket , message handler is expecting  a chain of data, but when we sending transaction it will try 
		// to replace the chain the data but it will result in conflict.
//Inorder to solve this issue 2 methods can be used.
 //1. we can specify the type while sending the data through message handler
 // 2. we can specify the updateHandler to update the message based on the type
 		// ie; specify the MESSAGE_TYPE  >> while sending chain and transaction , rather than sending block and transaction only, 
 			//include its type as well
 		// Now update the messageHandler
