const EC = require('elliptic').ec;   // is used to generate keyPair
const ec = new EC('secp256k1');  // secp - standard of efficient crptography prime 256bit k(koblas scientish) and 1 standard

class ChainUtil {
	static genKeyPair(){
		return ec.genKeyPair();  // generate a secret key (inbuilt method)
	}

}

module.exports = ChainUtil;