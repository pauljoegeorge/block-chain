const SHA256 = require('crypto-js/sha256');

const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
	constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
		this.timestamp  = timestamp;
		this.lastHash   = lastHash;
		this.hash       = hash;
		this.nonce      = nonce;
		this.difficulty = difficulty || DIFFICULTY;
		this.data       = data;
	}

	toString() {
		return `Block - 
			Timestamp  : ${this.timestamp}
			LastHash   : ${this.lastHash.substring(0,10)}
			Hash       : ${this.hash.substring(0,10)}
			Nonce      : ${this.nonce}
			Difficulty : ${this.difficulty}
			Data       : ${this.data}`
	}
// Keyword static helps to call genesis method directly (Block.genesis())
	static genesis() {
		return new this('genesis time stamp', '-----', 'f156-h412', [], 0, DIFFICULTY);	// this will call the same class Block 
	}

	static mineBlock(lastBlock, data) {
		let   timestamp, hash
		const lastHash    = lastBlock.hash;
		let   nonce       = 0;
		let {difficulty}  = lastBlock;
		
		do {
			nonce++;
			timestamp  = Date.now();
			difficulty = Block.adjustDifficulty(lastBlock, timestamp); // pass lastblock to find the timestamp of lastblock 
			hash       = Block.hash(timestamp, lastHash, data, nonce);

		}while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));	//until generate hash is started by 4 0's iterate the nonce value and hash

		return new this(timestamp, lastHash, hash, data, nonce, difficulty);
	}

	static hash(timestamp, lastBlock, data, nonce, difficulty){
		return SHA256(`${timestamp}${lastBlock}${data}${nonce}${difficulty}`).toString();
	}

	static blockHash(block) {
		const {timestamp, lastHash, data, nonce, difficulty} = block;

		return Block.hash(timestamp, lastHash, data, nonce, difficulty);
	}

	static adjustDifficulty(lastBlock, currentTime) {
		let {difficulty} = lastBlock;
		// checks whether previous time + mine_rate > current_time   if YES  mine_rate has to be increased 
		difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty +1 : difficulty -1; 
		return difficulty;
	}
}

// Export class as a module
module.exports = Block;

// Hash values are usually 32 bit long.. but we dont need to output whole 32 bits to difefrentiate.. so lets use  "substring method"