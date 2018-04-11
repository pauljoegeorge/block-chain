const ChainUtil           = require('../chain-util'); 
const Transaction         = require('./transaction');
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

	createTransaction(recipient, amount, transactionPool){
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

}

module.exports = Wallet;