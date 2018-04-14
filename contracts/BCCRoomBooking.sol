pragma solidity ^0.4.18;

import "./Owned.sol";
import "./BCCToken.sol";

contract BCCRoomBooking is Owned {
  struct Room {
    uint256 id;
    address owner;
    address bookingPerson;
    string name;
    string description;
    string size;
    uint256 price;
  }

  mapping(uint256 => Room) public rooms;

  uint256 roomCounter;

  address bccTokenAddr;

  // Events
  event OfferRoomEvent (
    uint indexed _id,
    address indexed _owner,
    string _name,
    string _description,
    string _size,
    uint256 _price
  );
  event BookRoomEvent (
    uint indexed _id,
    address indexed _owner,
    address indexed _bookingPerson,
    string _name,
    string _description,
    string _size,
    uint256 _price
  );

  function BCCRoomBooking(address _bccTokenAddr) public {
    bccTokenAddr = _bccTokenAddr;
  }

  function offerRoom(string _name, string _description, string _size, uint256 _price) onlyOwner public {
    roomCounter ++;

    rooms[roomCounter] = Room (
        roomCounter,
        msg.sender,
        0x0,
        _name,
        _description,
        _size,
        _price
    );

    OfferRoomEvent(roomCounter, msg.sender, _name, _description, _size, _price);
  }

  function getNumberOfRooms() view public returns(uint256)  {
    return roomCounter;
  }

  function getRoomsForBooking() public view returns (uint[]) {
    if(roomCounter == 0) {
      return new uint[](0);
    }

    // prepare intermediary array
    uint[] memory roomIds = new uint[](roomCounter);

    uint numberOfRoomsForBooking = 0;
    // iterate over rooms
    for (uint i = 1; i <= roomCounter; i++) {
      // keep only the ID of rooms not booked yet
      //if (rooms[i].bookingPerson == 0x0) {
        roomIds[numberOfRoomsForBooking] = rooms[i].id;
        numberOfRoomsForBooking++;
      //}
    }

    /* copy the articleIds array into the smaller forBooking array
    uint[] memory forBooking = new uint[](numberOfRoomsForBooking);
    for (uint j = 0; j < numberOfRoomsForBooking; j++) {
      forBooking[j] = roomIds[j];
    }
    */
    return (roomIds);
  }

  function bookRoom(uint _id, uint price) payable public {
    // we check whether there is at least one room
    require(roomCounter > 0);

    // we check whether the room exists
    require(_id > 0 && _id <= roomCounter);

    // we retrieve the room
    Room storage room = rooms[_id];

    // we check whether the room has not already been sold
    require(room.bookingPerson == 0x0);

    // we don't allow the owner to buy his/her own room
    require(room.owner != msg.sender);

    // we check whether the value sent corresponds to the room price
    require(room.price == price);

    // keep bookingPerson's information
    room.bookingPerson = msg.sender;

    // the bookingPerson can book the room
    BCCToken bccToken = BCCToken(bccTokenAddr);
    bccToken.transferMoney(room.owner, price, msg.sender);

    // trigger the event
    BookRoomEvent(_id, room.owner, room.bookingPerson, room.name, room.description, room.size, price);
  }

}
