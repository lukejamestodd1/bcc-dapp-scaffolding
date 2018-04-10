var BCCToken = artifacts.require("BCCToken");
var BCCRoomBooking = artifacts.require("BCCRoomBooking");


module.exports = async function(deployer) {
  deployer.deploy(BCCToken).then(function() {
    var address = BCCToken.address;
    return deployer.deploy(BCCRoomBooking, address).then(function() {
      console.log("Deployed Done.")
    })
  })
};
