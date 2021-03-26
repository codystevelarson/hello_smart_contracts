pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // All code goes here
    string public name = "DApp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakeHolders;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stake Tokens (deposit)
    function stakeTokens(uint _amount) public {
        require(_amount > 0, "amount cannot be 0");

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

    // Issue Tokens
    function issueTokens() public {
        // Only owner can call function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to stakers
        for (uint i=0; i < stakeHolders.length; i++) {
            address recipient = stakeHolders[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0){
                dappToken.transfer(recipient, balance);
            }
        }
    }

    // Unstake Tokens (withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance and status
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }   

}
