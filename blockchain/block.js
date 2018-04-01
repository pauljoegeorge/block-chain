const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(timestamp, lastHash, hash, data) {
		this.timestamp = timestamp;
		this.lastHash  = lastHash;
		this.hash      = hash;
		this.data      = data;
	}

	toString() {
		return `Block - 
			Timestamp: ${this.timestamp}
			LastHash : ${this.lastHash.substring(0,10)}
			Hash     : ${this.hash.substring(0,10)}
			Data     : ${this.data}`;
	}
// Keyword static helps to call genesis method directly (Block.genesis())
	static genesis() {
		return new this('genesis time stamp', '-----', 'f156-h412', []);	// this will call the same class Block 
	}

	static mineBlock(lastBlock, data) {
		const timestamp = Date.now();
		const lastHash  = lastBlock.hash;
		const hash      = Block.hash(timestamp, lastHash, data);
		// const hash      = 'to be done';

		return new this(timestamp, lastHash, hash, data);
	}

	static hash(timestamp, lastBlock, data){
		return SHA256(`${timestamp}${lastBlock}${data}`).toString();
	}

	static blockHash(block) {
		const {timestamp, lastHash, data} = block;

		return Block.hash(timestamp, lastHash, data);
	}
}

// Export class as a module
module.exports = Block;

// Hash values are usually 32 bit long.. but we dont need to output whole 32 bits to difefrentiate.. so lets use  "substring method"