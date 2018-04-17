const Wallet          = require('./index');
const TransactionPool = require('./transaction-pool');
const Transaction     = require('./transaction');
const Blockchain      = require('../blockchain')
const { INITIAL_BALANCE } = require('../config')

describe('Wallet', () => {
	let wallet, tp;

	beforeEach(() => {
		wallet = new Wallet();
		tp     = new TransactionPool();
		bc     = new Blockchain();
	});

	describe('creating a transaction', () => {
		let recipient, amount, transaction;

		beforeEach(() => {
			amount = 50;
			recipient = 'htuvQ-UqxRz'
			transaction = wallet.createTransaction(recipient, amount, bc, tp);
		});
		//create the same transaction again
		describe('creating the same transaction again', () => {
			beforeEach(() => {
				wallet.createTransaction(recipient, amount, bc,  tp);
			});
			it('doubles the sentAmount subtracted from the Wallet', () => {
				expect(transaction.outputs.find(t => t.address == wallet.publicKey).amount).toEqual(wallet.balance - amount*2)
			})
			it('clones the amount in recipient', () => {
				expect(transaction.outputs.filter(output => output.address === recipient).map(output => amount)).toEqual([amount, amount]);
			})
		})	
	})

	describe('calculating the balance', () => {
		let addBalance, repeatAdd, senderWallet;

		beforeEach(() => {
			senderWallet = new Wallet();
			addBalance =100;
			repeatAdd = 3;
			for (let i =0; i<repeatAdd; i++) {
				senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
			}
			bc.addBlock(tp.transactions);
		});

		it('calculates the balance for blockchain transactions matching the recipient', () => {
			expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd))
		});

		it('calculates the balance of sender', () => {
			expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd))
		});

		describe('recipient conducuts transaction', () => {
			let subtractBalance, recipientBalance;

			beforeEach(() => {
				tp.clear();
				subtractBalance = 60;
				recipientBalance = wallet.calculateBalance(bc);
				wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
				bc.addBlock(tp.transactions);
			})
			describe('sender sents to another recipient', () => {
				beforeEach(() => {
					tp.clear();
					senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
					bc.addBlock(tp.transactions);
				});

				it('calculates the balance only using the recent transactions', () => {
					expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
				})
			})
		}) 
	})
}) 