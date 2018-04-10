var BCCRoomBooking = artifacts.require("./BCCRoomBooking.sol");

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
    var bccRoomBooking;
    return BCCRoomBooking.deployed().then(function(instance) {
      bccRoomBooking = instance;
      var _name = "test room";
      var _description = "test description";
      var _size = "large";
      var _price = 100
      return bccRoomBooking.offerARoom(_name, _description, _size, _price);
    }).then(function(data) {
      return bccRoomBooking.getNumberOfRooms();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "no room has been offered");
    })
  })
});
