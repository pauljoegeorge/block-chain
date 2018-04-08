const TransactionPool = require('./transaction-pool');
const Transaction     = require('./transaction');
const Wallet          = require('./index');


describe('Transactions', () => {
	let tp, wallet , transaction;

	beforeEach(() => {
		tp = new TransactionPool();
		wallet  = new Wallet();
		transaction = Transaction.newTransaction(wallet, 'hty45-gTv', 30);
		tp.updateOrAddTransaction(transaction);
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
})