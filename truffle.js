var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "twelve words for generating a serial ethereum address based on same seed!";



module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    bccpc: {
      host: "10.0.0.24",
      port: 8545,
      network_id: "2048",
      gas: 4700000
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/H0MnmEaaittMM4B3XX2S")
      },
      network_id: 42,
      gas: 4700000
    }
  }

};
