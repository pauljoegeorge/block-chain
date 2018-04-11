const Wallet          = require('./index');
const TransactionPool = require('./transaction-pool');
const Transaction     = require('./transaction');

describe('Wallet', () => {
	let wallet, tp;

	beforeEach(() => {
		wallet = new Wallet();
		tp     = new TransactionPool();
	});

	describe('creating a transaction', () => {
		let recipient, amount, transaction;

		beforeEach(() => {
			amount = 50;
			recipient = 'htuvQ-UqxRz'
			transaction = wallet.createTransaction(recipient, amount, tp);
		});
		//create the same transaction again
		describe('creating the same transaction again', () => {
			beforeEach(() => {
				wallet.createTransaction(recipient, amount, tp);
			});
			it('doubles the sentAmount subtracted from the Wallet', () => {
				expect(transaction.outputs.find(t => t.address == wallet.publicKey).amount).toEqual(wallet.balance - amount*2)
			})
			it('clones the amount in recipient', () => {
				expect(transaction.outputs.filter(output => output.address === recipient).map(output => amount)).toEqual([amount, amount]);
			})
		})	
	})
}) 