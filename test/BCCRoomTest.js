var BCCRoomBooking = artifacts.require("./BCCRoomBooking.sol");
var BCCToken = artifacts.require("./BCCToken.sol");

// test suite
contract('BCCRoomBooking', function(accounts){
  it("should be initialized with empty values", function() {
    return BCCRoomBooking.deployed().then(function(instance) {
      return instance.getNumberOfRooms();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "no room has been offered");
    })
  });

  it("should have one room being able to offer", function() {
    return BCCRoomBooking.deployed().then(function(instance) {
      var _name = "test room";
      var _description = "test description";
      var _size = "large";
      var _price = 100;
      instance.offerRoom(_name, _description, _size, _price);
      return instance;
    }).then(function(instance) {
      return instance.getRoomsForBooking();
    }).then(function(data) {
      assert.equal(data.length, 1, "Should have one room been offered");
    })
  });

  it("should book one room", function() {
    var acct0 = web3.eth.accounts[0];
    var acct1 = web3.eth.accounts[1];

    return BCCToken.deployed().then(function(instance){
      instance.transfer(acct1, 100);
      return instance;
    }).then(function(instance){
      BCCRoomBooking.deployed().then(function(instanceBCCRoomBooking) {
        var _id = 1;
        var _price = 100;
        instanceBCCRoomBooking.bookRoom(_id, _price, {from: acct1});
        return instanceBCCRoomBooking;
      }).then(function(instanceBCCRoomBooking) {
        return instanceBCCRoomBooking.getRoomsForBooking();
      }).then(function(data) {
        assert.equal(data.length, 0, "Should have one room been offered");
      })
    })
  })

});
