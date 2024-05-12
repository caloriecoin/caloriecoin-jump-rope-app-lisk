// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "../token/CalorieCoin.sol";

contract JumpingRewards {
    CalorieCoin private _calorieCoinContract;
    address private _gameManager;

    uint256 public depositOf;

    event Rewards(address indexed to, uint256 amount, string message);

    constructor(CalorieCoin calTokenContract) {
        _gameManager = msg.sender;
        _calorieCoinContract = calTokenContract;
    }

    function Deposit(uint256 amount) public
    {
        _calorieCoinContract.transferFrom(msg.sender, address(this), amount);
        depositOf += amount;
    }

    function GiveRewards(address to, uint256 amount, string memory message) public 
    {
        require(msg.sender == _gameManager, "access denined");   

        _calorieCoinContract.transfer(to, amount);
        depositOf -= amount;

        emit Rewards(to, amount, message);
    }
}
