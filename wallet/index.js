const ChainUtil = require('../chain-util'); 
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
	constructor(){
		this.balance   = INITIAL_BALANCE;
		this.keyPair   = ChainUtil.genKeyPair(); // will create key pair 
		this.publicKey = this.keyPair.getPublic().encode('hex');  // getPublic() is an inbuilt method . which can be accessed by genKeypair
	}

	toString() {
		return ` Wallet -
			Balance   : ${this.balance}
			PublicKey : ${this.publicKey}`
	}

	sign(dataHash){
		return this.keyPair.sign(dataHash)   // .sign is an inbult function -> dataHash is details of tarnsaction
	}

	createTransaction(recipient, amount, blockchain, transactionPool){
		this.balance = this.calculateBalance(blockchain)
		//check amount is > balance
		if(this.balance < amount){
			console.log('amount exceeeds the balance');
			return;
		}

		//check whether transaction already exist in transaction pool .. if yes update
		let transaction = transactionPool.existingTransaction(this.publicKey)
		if(transaction){
			transaction.update(this, recipient, amount);   //this - wallet
		}else {
			transaction = Transaction.newTransaction(this, recipient, amount);
			transactionPool.updateOrAddTransaction(transaction);
		}
		return transaction;
	}

	calculateBalance(blockchain){
		// Aim is to find the most recent transaction and  use that balance
		let balance = this.balance;
		let transactions = [];
		//get all transactions of each block of a blockchain and push it to transactions array
		blockchain.chain.forEach(block => block.data.forEach(transaction => {
			transactions.push(transaction)
		}));
		//Identify all the trasanctions whose address matches the wallet public key
		const walletInputTs = transactions.filter(transaction => transaction.input.address == this.publicKey)

		//Initialize start time
		let startTime = 0;

		if(walletInputTs.length > 0){
			const recentInputTs = walletInputTs.reduce(
				(prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
			);
			//find the balance after recent transaction
			balance = recentInputTs.outputs.find(output => output.address === this.publicKey).amount;
			startTime = recentInputTs.input.timestamp;
		}
		// so when a new transaction comes if timestamp is greater than recent transaction update the balance
		transactions.forEach(transaction => {
			if(transaction.input.timestamp > startTime) {
				transaction.outputs.find(output => {
					if (output.address === this.publicKey) {
						balance += output.amount
					}
				});
			}
		});
		return balance;
	}

	static blockchainWallet(){
		const blockchainWallet = new this();
		blockchainWallet.address = 'blockchain-wallet'
		return blockchainWallet;
	}
}

module.exports = Wallet;