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
		expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
	});

	it('reduces the mine_rate by 1 as the current_time exceeded the mine_rate', () => {
		// if current_time is more than than the expected limit -> redice by 1
		expect(Block.adjustDifficulty(block, block.timestamp+3600000)).toEqual(block.difficulty-1);
	});

	it('increase the mine_rate by 1 as the current_time is greater than the limit', () => {
		expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty + 1);
	});
});