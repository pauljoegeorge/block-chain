const Transaction = require('./transaction');
const Wallet      = require('./index');


describe('Transaction', () => {
	let transaction, wallet, recipient, amount;

	beforeEach(() => {
		wallet = new Wallet();
		amount = 50;
		recipient = 'bc3ngfh';
		transaction = Transaction.newTransaction(wallet, recipient,amount);
	});	

	it('output the `amount` for the sender subtracted from balance', () =>  {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
	})

	it('output the `amount` added to recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
		// console.log(transaction.outputs)
	});


	describe('transacting with an amount more than the minimum balance' , () => {
		beforeEach(() => {
			amount = 5000;
			transaction = Transaction.newTransaction(wallet, recipient, amount);
		});

		it('doesnot create the transaction', ()=> {
			expect(transaction).toEqual(undefined);
		});
	})

});