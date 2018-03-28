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
    alert("Need your implementation")
  },

  initContract: function() {

  },


  getBalances: function(coinbase) {
  },

  offerRoom: function() {
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
