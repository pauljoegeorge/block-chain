const WebSocket = require('ws');

const P2P_PORT  = process.env.P2P_PORT || 5001;
const peers	    = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
	constructor(blokchain){
		this.blockchain = blokchain;
		this.sockets    = [];
	}

	listen(){
		const server = new WebSocket.Server({port: P2P_PORT});
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

		this.sendChain(socket)
		
	}

	sendChain(socket){
		socket.send(JSON.stringify(this.blockchain.chain));	//the one who created block will send the data and 
															//it can be received by everyone using "socket.on"
	}

	syncChains() {
		this.sockets.forEach(socket => this.sendChain(socket));  //will access each connected socket and replace with new valid chain
	}

	messageHandler(socket) {
		socket.on('message', message => {
			const data = JSON.parse(message);	//all peers will receive the new block added  //this data is a chain
			// console.log('data received from sender: ', data);

			this.blockchain.replaceChain(data);
		});
	}
} 

module.exports = P2pServer;