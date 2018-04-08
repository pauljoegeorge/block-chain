const ChainUtil           = require('../chain-util'); 
const { INITIAL_BALANCE } = require('../config');

class Wallet {
	constructor(){
		this.balance   = INITIAL_BALANCE;
		this.keyPair   = ChainUtil.genKeyPair(); // will create key pair 
		this.publicKey = this.keyPair.getPublic().encode('hex');  // getPublic() is an inbuilt method . which can be accessed by genKeypair
	}

	toString() {
		return ` Wallet -
			Balance   : ${this.balance}
			PublicKey : ${this.publicKey}`
	}

	sign(dataHash){
		return this.keyPair.sign(dataHash)   // .sign is an inbult function -> dataHash is details of tarnsaction
	}

}

module.exports = Wallet;