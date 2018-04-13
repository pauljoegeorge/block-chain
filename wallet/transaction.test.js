const Transaction = require('./transaction');
const Wallet      = require('./index');
const { MINING_REWARD } = require('../config');

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

	it('checks whether wallet balance is same as transaction input balance', ()=> {
		expect(transaction.input.amount).toEqual(wallet.balance)
	})

	it('validates the valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	})

	it('invalidates a corrupt transaction', () => {
		transaction.outputs[0].amount = 50000;  // users minimum balance is lesser than 5000 , so this condition is false
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
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

	describe('and update the transaction', () => {
		let nextAmount, nextRecipient;

		beforeEach(()=> {
			nextAmount = 20;
			nextRecipient = 'abc-d45shtuv'
			transaction.update(wallet, nextRecipient, nextAmount);
		});

		it('subtracts the new amount from the current senderBalance', () =>{
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount )
		});

		it('adds amount to recipients wallet', () =>{
			expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
		})
	})

	describe('create a reward for the transaction', () => {
		beforeEach(() => {

			transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
		});

		it('reward a miner', () => {
			// transaction.outputs wil have the reward.
			expect(transaction.outputs.find(output => output.address == wallet.publicKey).amount).toEqual(MINING_REWARD);
		})

	})


});