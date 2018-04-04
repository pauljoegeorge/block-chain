
// const Block = require('./blockchain/block');
// // const block = new Block('foo', 'bar', 'zoo', 'baz');
// // console.log(block.toString());
// // console.log(Block.genesis().toString());
// const new_block = (Block.mineBlock(Block.genesis(),'for now i am the data'));

// console.log(new_block.toString());

// -------------FOR TESTING PROOF OF WORK ----------//
// const Blockchain = require('./blockchain');
// const bc = new Blockchain();

// for (let i =0; i<10; i++) {
// 	console.log(bc.addBlock(`foo ${i}`).toString());  //test code to add 10 blocks and  to examine the value of difficulty
// }


//-------- FOR TESTING WALLET----------------//

const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());


// npm run dev-test