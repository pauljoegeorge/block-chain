const EC     = require('elliptic').ec;   // is used to generate keyPair
const uuidV1 = require('uuid/v1');       // for generating a unique id for transaction.

const ec     = new EC('secp256k1');  // secp - standard of efficient crptography prime 256bit k(koblas scientish) and 1 standard


class ChainUtil {
	static genKeyPair(){
		return ec.genKeyPair();  // generate a secret key (inbuilt method)
	}

	static id() {
		return uuidV1();   //returns the unique id
	}

}

module.exports = ChainUtil;