const Block        = require('./block');
const {DIFFICULTY} = require('../config'); 

describe('Block', () => {
	let data, lastBlock, block;

	beforeEach(() => {
		data = 'any value';
		lastBlock = Block.genesis();
		block = Block.mineBlock(lastBlock, data);
	});

	it('sets the `data` to match the input', () => {
		expect(block.data).toEqual(data);
	});

	it('sets the `lastHash` to match the  hash of the last block', () => {
		expect(block.lastHash).toEqual(lastBlock.hash);
	});

	it('should generate a hash starting withs zeros equal to DIFFICULTY', () => {
		expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
		console.log(block.toString());
	});
});