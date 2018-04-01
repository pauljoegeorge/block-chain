
const Block = require('./block');
// const block = new Block('foo', 'bar', 'zoo', 'baz');
// console.log(block.toString());
// console.log(Block.genesis().toString());
const new_block = (Block.mineBlock(Block.genesis(),'for now i am the data'));

console.log(new_block.toString());