 - using geth to setup local private Blockchain
 - creating a folder (~/blockchain/bcc-dapp-privatechain/private)
 - create a gensis block by using `puppeth`
 - init private blockchain `geth --datadir=~/works/blockchain/bcc-dapp-privatechain/private init BCCPC.json`
 - create account

```
  geth --datadir=. account new
  geth --datadir=../ account list
  miner.stop()
  miner.start() // miner.start(2)
  net.version
  personal.unlockAccount(web3.eth.accounts[1], "pass123", 1000)
  web3.eth.sendTransaction({from: eth.coinbase, to: eth.accounts[1], value: web3.toWei(50, 'ether')})
```

https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console
