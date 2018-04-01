const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers    = process.env.PEERS ? process.env.PEERS.split(',') : []; 
// This is for idetifying on the peers connected 
// ws://localhost:5001, ws://localhost:5002 .. peers will have this value
//Instead of http  ws is used

class P2pServer {
	constructor(blockchain){
		this.blockchain = blockchain;
		this.socket 	= [];
	}

	//establishing the connection
	listen(){
		const server = new WebSocket.Server({port: P2P_PORT});
		server.on('connection', socket => this.connectSocket(socket));

		this.connectToPeers();
		console.log(`Listening for peer to peer connection on port: ${P2P_PORT}`);
	}

	connectToPeers() {
		peers.forEach(peer => {
			// ws://localhost:5001
			const socket = new WebSocket(peer);
			socket.on('open', () => this.connectSocket(socket));
		})
	}

	//stack all the sockets
	connectSocket(socket) {
		this.socket.push(socket);
		console.log('Socket connected');
	}

}

module.exports = P2pServer;