const Blockchain = require('./index');
const Block 	 = require('./block');

describe('Blockchain', () => {
	let bc, bc2;

	beforeEach(() =>{
		bc  = new Blockchain();
		bc2 = new Blockchain();
	});

	it('sets the `chain` to have the lastBlock by default', () => {
		expect(bc.chain[0]).toEqual(Block.genesis());
	});

	it('add new blocks to the chain', () => {
		let data = "this is a dummy data";
		bc.addBlock(data);

		expect(bc.chain[bc.chain.length-1].data).toEqual(data);
	});

// checks valid chain (a good case)
	it('checks whether valid chain', () => {

		bc2.addBlock('test data');

		expect(bc.isValidChain(bc2.chain)).toBe(true);

	});

//  checks valid_chain(when a user attempts to change the data of other user)
	
	it('try to change the data of an exisiting block', () => {
		bc2.chain[0].data = "i am trying to change exisitng data"

		expect(bc.isValidChain(bc2)).toBe(false);
	})

 // when a user creates a new block and immediately try to change the data => it should return false 

 	it('sets the block to be currepted when user attempts to change the data after creating a block', () => {

 		bc2.addBlock('i am adding a new block');
 		bc2.chain[1] = 'i am not a new block';
 		expect(bc.isValidChain(bc2)).toBe(false);

 	})

 	it('replace the old chain to new chain', () => {
 		bc2.addBlock('i am new block to be added');
 		bc.replaceChain(bc2.chain);

 		expect(bc.chain).toEqual(bc2.chain);

 	});

 	it('will receive a chain length lesser than or equal to the currnt chain length', () => {
 		bc.addBlock('fooo');
 		bc.replaceChain(bc2.chain);
 		
 		expect(bc.chain).not.toEqual(bc2.chain);
 	})
})