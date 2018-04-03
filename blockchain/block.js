const SHA256 = require('crypto-js/sha256');

const DIFFICULTY = 4;

class Block {
	constructor(timestamp, lastHash, hash, data, nonce) {
		this.timestamp = timestamp;
		this.lastHash  = lastHash;
		this.hash      = hash;
		this.nonce     = nonce;
		this.data      = data;
	}

	toString() {
		return `Block - 
			Timestamp: ${this.timestamp}
			LastHash : ${this.lastHash.substring(0,10)}
			Hash     : ${this.hash.substring(0,10)}
			Data     : ${this.data}
			Nonce    : ${this.nonce}`
	}
// Keyword static helps to call genesis method directly (Block.genesis())
	static genesis() {
		return new this('genesis time stamp', '-----', 'f156-h412', [], 0);	// this will call the same class Block 
	}

	static mineBlock(lastBlock, data) {
		let   timestamp, hash
		const lastHash    = lastBlock.hash;
		let   nonce       = 0;
		
		do {
			nonce++;
			timestamp = Date.now();
			hash      = Block.hash(timestamp, lastHash, data, nonce)

		}while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));	//until generate hash is started by 4 0's iterate the nonce value and hash

		return new this(timestamp, lastHash, hash, data);
	}

	static hash(timestamp, lastBlock, data, nonce){
		return SHA256(`${timestamp}${lastBlock}${data}${nonce}`).toString();
	}

	static blockHash(block) {
		const {timestamp, lastHash, data, nonce} = block;

		return Block.hash(timestamp, lastHash, data, nonce);
	}
}

// Export class as a module
module.exports = Block;

// Hash values are usually 32 bit long.. but we dont need to output whole 32 bits to difefrentiate.. so lets use  "substring method"