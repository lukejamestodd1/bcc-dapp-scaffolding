App = {
  web3Provider: null,
  contracts: {},
  c_owner: "0x0",
  account: "0x0",
  loading: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("BCCToken.json", function(data) {
      var bccTokenArtifact = data;
      App.contracts.BCCToken = TruffleContract(bccTokenArtifact);
      App.contracts.BCCToken.setProvider(App.web3Provider);
    })

    $.getJSON("BCCRoomBooking.json", function(data) {
      var bccRoomBookingArtifact = data;
      App.contracts.BCCRoomBooking = TruffleContract(bccRoomBookingArtifact);
      App.contracts.BCCRoomBooking.setProvider(App.web3Provider);

      App.contracts.BCCRoomBooking.deployed().then(instance => {
        var bccRoomBookingInstance = instance;
        return bccRoomBookingInstance.owner();
      }).then(owner => {
        App.c_owner = owner;
        App.getBalances(owner);
      });
    })
  },


  getBalances: function(coinbase) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
      }else {
        var account = accounts[0];
        App.contracts.BCCToken.deployed().then(instance => {
          var bccTokenInstance = instance;
          return bccTokenInstance.balanceOf(account);
        }).then(result => {
          var balance = result.c[0];

          if (account === coinbase) {
            $('#offer-room').show();
          } else {
            $('#offer-room').hide();
          }

          $('#account').text(account);
          $('#accountBalance').text(balance + " BCCT");
        });
      }
    })
  },

  offerRoom: function() {
      console.log("offer room");
      // retrieve details of the room
      var _room_name = $("#room-name").val();
      var _room_price = parseFloat($("#room-price").val() )|| 0;
      var _room_description = $("#room-description").val();
      var _room_size = $("#room-size").val();


      if ((_room_name.trim() === '') || (_room_price === 0)) {
        // nothing to sell
        alert("You have to have a name of the room and price for the room!");
        return false;
      }

      return App.contracts.BCCRoomBooking.deployed().then(function(instance) {
        instance.offerRoom(_room_name,
          _room_description, _room_size, _room_price);
      }).then(function(result){
        console.log(result);
      }).catch(function(err){
        console.error(err);
      })


  },

  reloadRooms: function() {
  },

  listenToEvents: function() {
  },

  displayRoom: function(id, owner, bookingPerson, name, description, size, price) {
  },

  bookRoom: function() {
  }
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
