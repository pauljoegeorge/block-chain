
class TransactionPool{
	constructor(){
		this.transactions = [];
	}

	updateOrAddTransaction(transaction){
		//check whether transaction already exisiting .. if yes update it otherwise push it to transactions array
		let transactionWithId = this.transactions.find(t => t.id === transaction.id );  //check transaction exists

		if(transactionWithId){
			this.transactions[this.transactions.indexOf(transaction.id)] = transaction;
		}else {
			this.transactions.push(transaction);
		}
	}

	existingTransaction(address){
		return this.transactions.find(t => t.input.address === address);
	}
}

module.exports = TransactionPool;