// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "../token/CalorieCoin.sol";

contract Shop {
    struct Item {
        string name;
        uint256 total;
        uint256 price;
    }

    event SubmitItem(uint256 indexed itemId, Item item);
    event Buy(address buyer, uint256 itemId, uint256 amount, uint256 paidToken);

    CalorieCoin private _calorieCoinContract;
    address private _owner;

    mapping (uint256=> Item) private _itemList;
    mapping (uint256=> uint256) private _itemSupplyment;
    
    constructor(CalorieCoin calTokenContract) {
        _owner = msg.sender;

        _calorieCoinContract = calTokenContract;
    }

    function submitItem(uint256 itemId, Item memory item) public {
        require(
            msg.sender == _owner,
            "Only manager can submit items"
        );

        require(bytes(item.name).length <= 0, "item already exist");
        require(item.total > 0, "item total > 0");
        require(item.price >= 0, "item price >= 0");

        _itemList[itemId] = item;

        emit SubmitItem(itemId, item);
    }
    
    function issueItem(uint256 itemId, uint256 amount) public {
        require(
            msg.sender == _owner,
            "Only manager can submit items"
        );
        
        require(bytes(_itemList[itemId].name).length > 0, "item Id not registed");
        require(_itemList[itemId].total >= (_itemSupplyment[itemId] + amount), "cannot be issue over total count");

        _itemSupplyment[itemId] += amount;
    }

    function getItem(uint256 itemId) public view returns (Item memory) {
        require(bytes(_itemList[itemId].name).length > 0, "item Id not registed");

        return _itemList[itemId];
    }

    function getItemSupplyment(uint256 itemId) public view returns (uint256) {
        require(bytes(_itemList[itemId].name).length > 0, "item Id not registed");

        return _itemSupplyment[itemId];
    }

    function updateItemName(uint256 itemId, string memory name) public {
        require(bytes(name).length > 0, "item name cannot be 0 length");
        
        _itemList[itemId].name = name;
    }

    function updateItemTotal(uint256 itemId, uint256 total) public {
        require(total > 0, "item total > 0");
        
        _itemList[itemId].total = total;
    }

    function updateItemPrice(uint256 itemId, uint256 price) public {
        require(price >= 0, "item price >= 0");
        
        _itemList[itemId].price = price;
    }

    function buyItem(uint256 itemId, uint256 amount) public {
        require(bytes(_itemList[itemId].name).length > 0, "item Id not registed");
        require(_itemSupplyment[itemId] >= amount, "item does not exist");

        require(_calorieCoinContract.balanceOf(msg.sender) >= (_itemList[itemId].price * amount), "insufficien balance");

        _itemSupplyment[itemId] -= amount;
        _calorieCoinContract.transfer(_owner, _itemList[itemId].price * amount);

        emit Buy(msg.sender, itemId, amount, _itemList[itemId].price * amount);
    }
}