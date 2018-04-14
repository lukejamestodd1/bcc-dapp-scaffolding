App = {
  web3Provider: null,
  contracts: {},
  c_owner: "0x0",
  c_account: "0x0",
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
        App.reloadRooms();
      });
    })
  },


  getBalances: function(coinbase) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
      }else {
        var account = accounts[0];
        App.c_account = account;
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
        console.log("offer room");
        return instance.offerRoom(_room_name,
          _room_description, _room_size, _room_price);
      }).then(function(result){
        console.log(result);
      }).catch(function(err){
        console.error(err);
      })
  },

  reloadRooms: function() {
    // avoid reentry
    if (App.loading) {
      return;
    }
    App.loading = true;

    // refresh account information because the balance may have changed

    var appInstance;

    App.contracts.BCCRoomBooking.deployed().then(function(instance) {
      appInstance = instance;
      return appInstance.getRoomsForBooking();
    }).then(function(roomIds) {
      // Retrieve and clear the room placeholder
      console.log(roomIds, roomIds.length);
      var roomRow = $('#roomsRow');
      roomRow.empty();

      for (var i = 0; i < roomIds.length; i++) {
        var roomId = roomIds[i];
        console.log(roomId);
        appInstance.rooms(roomId).then(function(room) {
          App.displayRoom(
            room[0], // id
            room[1], // owner
            room[2], // booking person
            room[3], // name
            room[4], // desc
            room[5], // size
            room[6] // price
          );
        });
      }
      App.loading = false;
    }).catch(function(err) {
      console.log(err.message);
      App.loading = false;
    });
  },

  listenToEvents: function() {
  },

  displayRoom: function(id, owner, bookingPerson, name, description, size, price) {
    var roomsRow = $('#roomsRow');
    console.log(id, owner, bookingPerson, name, description);

    // Retrieve and fill the room template
    var roomTemplate = $('#roomTemplate');
    roomTemplate.find('.panel-title').text(name);
    roomTemplate.find('.room-price').text(price);
    roomTemplate.find('.room-size').text(size);
    roomTemplate.find('.room-description').text(description);
    roomTemplate.find('.btn-booking').attr('data-id', id);
    roomTemplate.find('.btn-booking').attr('data-value', price);


    if (App.c_account === owner && bookingPerson == "0x0000000000000000000000000000000000000000") {
      var bookingPersonAddress = bookingPerson.substring(0, 5) + "..." + bookingPerson.slice(-5);
      roomTemplate.find('.room-booked-by').text(bookingPersonAddress);
      roomTemplate.find('.btn-booking').prop("disabled",true);
      if (bookingPerson.slice(-5).toString() != "00000") {
        roomTemplate.find('.panel-body').addClass("booked");
        roomTemplate.find('.btn-booking').text("Booked");
      } else {
        roomTemplate.find('.panel-body').removeClass("booked");
        roomTemplate.find('.btn-booking').text("Available");
      }
    } else if (App.c_account != owner && bookingPerson == "0x0000000000000000000000000000000000000000") {
        roomTemplate.find('.room-booked-by').text("n/a");
        roomTemplate.find('.btn-booking').text("Available");
        roomTemplate.find('.btn-booking').addClass("btn-success");
        roomTemplate.find('.btn-booking').prop("disabled",false);
    } else {
        roomTemplate.find('.room-booked-by').text(bookingPerson.substring(0, 5) + "..." + bookingPerson.slice(-5));
        roomTemplate.find('.btn-booking').text("Booked");
        roomTemplate.find('.btn-booking').prop("disabled",true);
    }
    roomsRow.append(roomTemplate.html());
  },

  bookRoom: function() {
  }
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
