pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // All code goes here
    string public name = "DApp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakeHolders;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // 1. Stake Tokens (deposit)
    function stakeTokens(uint _amount) public {
        // Transfer mock dai tokens to this contract 
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update Staking balance
        stakingBalance[msg.sender] += _amount;

        // Add user to stakeholder arrry if not already steakholder
        if (!hasStaked[msg.sender]) {
            stakeHolders.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
    // 2. Unstake Tokens (withdraw)

    // 3. Issue Tokens
}
