var bccTokenAddr = "0x38cf23c52bb4b13f051aec09580a2de845a7fa35"

BCCToken.deployed().then(instance => {bcctoken = instance})
BCCRoomBooking.deployed().then(instance => {roomBooking = instance})

var acct0 = web3.eth.accounts[0]
var acct1 = web3.eth.accounts[1]

bcctoken.balanceOf(acct0)
bcctoken.transfer(acct1, 1000)
bcctoken.balanceOf(acct1)

roomBooking.offerRoom("Seabook Room", "Seabook Room's Description", "Large", 99)
roomBooking.getRoomsForBooking()

roomBooking.bookRoom(1, 99, bccTokenAddr, {from: acct1})

bcctoken.balanceOf(acct0)
bcctoken.balanceOf(acct1)


var offerRoomEvent = roomBooking.OfferRoomEvent({fromBlock: 0, toBlock: 'latest'});
offerRoomEvent.watch(function(error, result) {console.log(result.args);});

var bookRoomEvent = roomBooking.BookRoomEvent({fromBlock: 0, toBlock: 'latest'});
bookRoomEvent.watch(function(error, result) {console.log(result.args);});
