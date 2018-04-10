var BCCToken = artifacts.require("BCCToken");
var BCCRoomBooking = artifacts.require("BCCRoomBooking");


module.exports = function(deployer) {
  deployer.deploy(BCCRoomBooking);
}

/*
module.exports = async function(deployer) {

  deployer.deploy(BCCToken).then(function() {
    return deployer.deploy(BCCRoomBooking).then(function() {
      console.log("Deployed Done.")
    })
  })
};
*/
