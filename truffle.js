var HDWalletProvider = require("truffle-hdwallet-provider");

const yargs = require('yargs');
var provider, address;

// Not using remote node until secure way to store seed/private key is established.
//
// if (yargs.argv.network  == 'ropsten' || yargs.argv.network  == 'mainnet') {
//   var providerURL = 'http://localhost:8545';
//   // var providerURL = `https://${yargs.argv.network}.infura.io`
//   var HDWalletProvider = require("truffle-privatekey-provider");
//   // todo: Think about more secure way
//   var mnemonic = yargs.argv.mnemonic;
//   provider = new HDWalletProvider(mnemonic, providerURL, 0);
//   // address = "0x" + provider.wallet.getAddress().toString("hex");
//   // console.log('Provider address', provider.getAddress());
//   console.log('Deploying to ', providerURL);
// }

if (yargs.argv.network == 'rinkeby_infura') {
  var mnemonic = "baby target remain dish kite lion hedgehog width clinic render dragon laugh";
  var provider = new HDWalletProvider(mnemonic, 
      "https://rinkeby.infura.io/v3/db3210de5a4a40fca2e8fdf5c3b2ea33", 
      0)
}

module.exports = {
  networks: {
    rinkeby_infura: {
      provider: provider,
      gasPrice: 50000000000, // 50 gwei,
      network_id: 4
    },
    development: {
      host: "localhost",
      port: 8545,
      gas: 6712388,
      // gasPrice: 2000000000, // 1 gwei
      network_id: "*"
    },
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gasPrice: 0x01
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    rinkeby: {
      host: "localhost",
      network_id: 4,
      port: 8101,
      gasPrice: 50000000000 // 50 gwei,
    },
    ropsten: {
      gasPrice: 50000000000, // 50 gwei,
      // provider: provider,
      network_id: 3,
      // from: address
    },
    mainnet: {
      // gas: 5000000,
      host: "localhost",
      gasPrice: 1000000000, // 1 gwei
      port: 8545,
      // provider:provider,
      // from: "0x4b3A4F3F42BA61141A4F7101F77dC141AE15c59A",
      from: "0x4b3a4f3f42ba61141a4f7101f77dc141ae15c59a",
      network_id: 1
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 1
    }
  }
};


