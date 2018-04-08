const SHA256 = require('crypto-js/sha256'); // to generate hash value
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

	static hash(data){
		return SHA256(JSON.stringify(data)).toString();  // generate hash 
	}

	static verifySignature(publicKey, signature, dataHash){
		return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)//inbuilt method to decrypt the publickey and verify the output and return true or false
	}

}

module.exports = ChainUtil;