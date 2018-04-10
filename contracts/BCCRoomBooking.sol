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

  function offerARoom(string _name, string _description, string _size, uint256 _price) onlyOwner public {
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
  }

  function getNumberOfRooms() view public returns(uint256)  {
    return roomCounter;
  }


}
