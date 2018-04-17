const TransactionPool = require('./transaction-pool');
const Transaction     = require('./transaction');
const Wallet          = require('./index');
const Blockchain      = require('../blockchain')


describe('Transactions', () => {
	let tp, wallet , transaction, bc;

	beforeEach(() => {
		bc = new Blockchain();
		tp = new TransactionPool();
		wallet  = new Wallet();
		// transaction = Transaction.newTransaction(wallet, 'hty45-gTv', 30);
		// tp.updateOrAddTransaction(transaction);
		transaction = wallet.createTransaction('hty45-gTv', 30, bc, tp);
	})

	it('adds a transaction to the pool', () => {
		expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
	});

	it('updates the existing transaction', () => {
		const oldTransaction = JSON.stringify(transaction);
		const newTransaction = transaction.update(wallet, 'abcd-fuH', 40);

		tp.updateOrAddTransaction(newTransaction);
		expect(JSON.stringify(tp.transactions.find(t => t.id == oldTransaction.id))).not.toEqual(newTransaction);
	})

	it('clears transaction', () => {
		tp.clear();
		expect(tp.transactions).toEqual([]);
	})

	describe('mixing valid and invalid transactions', () => {
		let validTransactions;

		beforeEach(() => {
			validTransactions = [...tp.transactions];
			for(let i=0; i<6; i++){
				wallet = new Wallet();
				transaction = wallet.createTransaction('hty45-gTv', 30, bc, tp);

				if(i%2 ==0){
					transaction.input.amount = 99999;
				}else {
					validTransactions.push(transaction)
				}
			}
		});
		it('shows a difference between valid and corrupt transactions', () => {
			expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
		});

		it('grabs valid transactions', () => {
			expect(tp.validTransactions()).toEqual(validTransactions);
		});
	});
})