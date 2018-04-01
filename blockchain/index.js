const Block = require('./block');

class Blockchain {
	constructor() {
		this.chain = [Block.genesis()];
	}

	addBlock(data) {

		// lastBlock =  this.chain[this.chain.length-1]
		const block = Block.mineBlock(this.chain[this.chain.length-1], data);
		this.chain.push(block);

		return block;
	}

	isValidChain(chain) {
		// checks whetehr chain[0] matched genesis 
		if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

		for(let i =1 ; i<chain.length; i++) {
			const block 	= chain[i];
			const lastBlock = chain[i-1];

			// checks whether lastHash of current block matches the hash value of previous block and checks whethere hashvalue of blockmatches  the block.hash
			if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)){
				return false;
			}
		}
		return true;
	}

	// Replace chain - checks whether newchain.length is greater than old chain and valid otherwise escape 
	// if conditions are satisfied  REPLACE old chain by new chain 

	replaceChain(newChain) {
		if(newChain.length <= this.chain.length) {
			console.log("Received chains length is lesser than the current chain");
			return;
		} else if(!this.isValidChain(newChain)) {
			console.log("This is not a valid chain");
			return;
		}
		console.log("Old chain is replaced by new one");
		this.chain = newChain;
	}
}

module.exports = Blockchain;