// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "../token/CalorieCoin.sol";

contract RopeJumpingFight {
    enum GameState {
        GAME_MATCHED,
        GAME_CANCELD,
        GAME_STARTED,
        GAME_ENDED
    }

    struct Game {
        address player1;
        address player2;
        address winner;
        int256 player1JumpingTotalCount;
        int256 player2JumpingTotalCount;
        uint256 player1Fee;
        uint256 player2Fee;
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    event GameResult(uint256 indexed gameId, address winner, int256 player1JumpingTotalCount, int256 player2JumpingTotalCount, uint256 rewards);

    address private _gameManager;
    uint256 private _gameIdCounter;

    CalorieCoin private _calorieCoinContract;

    mapping (uint256=> Game) private _matchingList;
    mapping (uint256=> GameState) private _currentGameState;

    constructor(CalorieCoin calTokenContract) {
        _gameManager = msg.sender;
        _gameIdCounter = 0;

        _calorieCoinContract = calTokenContract;
    }

    function CreateSingleGame(address _player1, address _player2, Signature memory _player1Sign, Signature memory _player2Sign,  uint256 entryFee) public
    {
        require(msg.sender == _gameManager, "permission denied");
        require(_calorieCoinContract.balanceOf(_player1) >= entryFee, "player1 insufficient balance");
        require(_calorieCoinContract.balanceOf(_player2) >= entryFee, "player2 insufficient balance");
        
        _calorieCoinContract.permit(_player1, address(this), entryFee, block.timestamp + (1000 * 60) * 5, _player1Sign.v, _player1Sign.r, _player1Sign.s);
        _calorieCoinContract.permit(_player2, address(this), entryFee, block.timestamp + (1000 * 60) * 5, _player2Sign.v, _player2Sign.r, _player2Sign.s);

        _calorieCoinContract.transferFrom(_player1, address(this), entryFee);
        _calorieCoinContract.transferFrom(_player2, address(this), entryFee);

        Game memory _newGame;
        _newGame.player1 = _player1;
        _newGame.player2 = _player2;
        _newGame.winner = address(0);
        _newGame.player1JumpingTotalCount = -1;
        _newGame.player2JumpingTotalCount = -1;
        _newGame.player1Fee = entryFee;
        _newGame.player2Fee = entryFee;
        
        _matchingList[_gameIdCounter] = _newGame;
        _currentGameState[_gameIdCounter] = GameState.GAME_MATCHED;
        _gameIdCounter++;
    }

    function GameCancel(uint256 _gameId) public 
    {
        require(msg.sender == _gameManager, "permission denied");
        require(_currentGameState[_gameId] != GameState.GAME_ENDED, "game already ended");
        require(_currentGameState[_gameId] != GameState.GAME_CANCELD, "game already cancel");

        _calorieCoinContract.transfer(_matchingList[_gameId].player1, _matchingList[_gameId].player1Fee);
        _calorieCoinContract.transfer(_matchingList[_gameId].player2, _matchingList[_gameId].player2Fee);

        _currentGameState[_gameIdCounter] = GameState.GAME_CANCELD;
    }

    function SetPlayerJumpingCount(address _player, uint256 _gameId, int256 _count) public 
    {
        require(msg.sender == _gameManager, "permission denied");
        require(_currentGameState[_gameId] != GameState.GAME_ENDED, "game already ended");
        require(_currentGameState[_gameId] != GameState.GAME_CANCELD, "game already cancel");
        require(_matchingList[_gameId].player1 == _player || _matchingList[_gameId].player2 == _player, "player is not in game");

        if(_matchingList[_gameId].player1 == _player) 
        {
            _matchingList[_gameId].player1JumpingTotalCount = _count;
            _currentGameState[_gameId] = GameState.GAME_STARTED;
        }
        else if(_matchingList[_gameId].player2 == _player)
        {
            _matchingList[_gameId].player2JumpingTotalCount = _count;
            _currentGameState[_gameId] = GameState.GAME_STARTED;
        }
    }

    function SetGameEnd(uint256 _gameId) public
    {
        require(msg.sender == _gameManager, "permission denied");
        require(_currentGameState[_gameId] == GameState.GAME_STARTED, "game not started");
        require(_matchingList[_gameId].player1JumpingTotalCount >= 0, "player1 jumping count not setup");
        require(_matchingList[_gameId].player2JumpingTotalCount >= 0, "player2 jumping count not setup");
        
        address _winner;
        if(_matchingList[_gameId].player1JumpingTotalCount > _matchingList[_gameId].player2JumpingTotalCount)
        {
            // player1 win
            _winner = _matchingList[_gameId].player1;
            _calorieCoinContract.transfer(_matchingList[_gameId].player1, _matchingList[_gameId].player1Fee);
            _calorieCoinContract.transfer(_matchingList[_gameId].player1, _matchingList[_gameId].player2Fee);
        }
        else if(_matchingList[_gameId].player1JumpingTotalCount < _matchingList[_gameId].player2JumpingTotalCount)
        {
            // player2 win
            _winner = _matchingList[_gameId].player2;
            _calorieCoinContract.transfer(_matchingList[_gameId].player1, _matchingList[_gameId].player1Fee);
            _calorieCoinContract.transfer(_matchingList[_gameId].player1, _matchingList[_gameId].player2Fee);
        }
        else 
        {
            // draw
            _calorieCoinContract.transfer(_matchingList[_gameId].player1, _matchingList[_gameId].player1Fee);
            _calorieCoinContract.transfer(_matchingList[_gameId].player2, _matchingList[_gameId].player2Fee);
        }

        emit GameResult(_gameId, _winner, _matchingList[_gameId].player1JumpingTotalCount, _matchingList[_gameId].player2JumpingTotalCount, _matchingList[_gameId].player1Fee + _matchingList[_gameId].player2Fee);
    }

    function GetGameResult(uint256 _gameId) public view returns(Game memory) 
    {
        return _matchingList[_gameId];
    }
}