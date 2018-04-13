const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
	constructor(){
		this.id     = ChainUtil.id();
		this.input  = null;
		this.outputs = [];
	}
	//updating the transaction
	update(senderWallet, recepient, amount){
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

		if(amount > senderOutput.amount){
			return;
		}

		senderOutput.amount = senderOutput.amount - amount; // update the senderWallet balance by subtracting the amount;
		this.outputs.push({ amount, address: recepient });  // amount and address of receiver
		Transaction.signTransaction(this, senderWallet); //once above things are successfully done, sign the transaction
		
		return this;
	}

	static transactionWithOutput(senderWallet, outputs){
		const transaction = new this();
		transaction.outputs.push(...outputs);
		Transaction.signTransaction(transaction, senderWallet)  // once the condition is met sign the transaction
		return transaction;
	}

	static newTransaction(senderWallet, recepient, amount) {
		
		if(amount > senderWallet.balance){
			console.log(`amount exceeded the balance`);
			return;
		}

		return Transaction.transactionWithOutput(senderWallet,[
			{ amount: senderWallet.balance - amount, address: senderWallet.publicKey},
			{ amount, address: recepient }
		]);	
	}
	// find blockchainWallet in wallet/index.js
	static rewardTransaction(minerWallet, blockchainWallet){
		return Transaction.transactionWithOutput(blockchainWallet, [{
			amount: MINING_REWARD, address: minerWallet.publicKey
		}]);
	}

	static signTransaction(transaction, senderWallet){
		transaction.input = {
			timestamp : Date.now(),
			amount    : senderWallet.balance,
			address   : senderWallet.publicKey,
			signature : senderWallet.sign(ChainUtil.hash(transaction.outputs))
		}
	}

	static verifyTransaction(transaction){
		return ChainUtil.verifySignature(
			transaction.input.address,
			transaction.input.signature,
			ChainUtil.hash(transaction.outputs)
		);
	}
}

module.exports = Transaction;