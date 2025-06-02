// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./SunToken.sol";

contract StakingContract {
    SunToken public token;

    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public lastUpdateTime;
    mapping(address => uint256) public unclaimedRewards;
    uint256 public totalStaked;

    constructor(address _token) {
        token = SunToken(_token);
    }

    function stake(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value == amount, "Sent ETH must match stake amount");

        updateReward(msg.sender);

        stakedBalances[msg.sender] += amount;
        totalStaked += amount;
    }

    function unStake(uint256 amount) external {
        require(stakedBalances[msg.sender] >= amount, "Insufficient balance");

        updateReward(msg.sender);

        stakedBalances[msg.sender] -= amount;
        totalStaked -= amount;
        payable(msg.sender).transfer(amount);
    }

    function claimReward() external {
        updateReward(msg.sender);

        uint256 reward = unclaimedRewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        unclaimedRewards[msg.sender] = 0;
        token.mint(msg.sender, reward);
    }

    function updateReward(address _address) internal {
        uint256 lastTime = lastUpdateTime[_address];
        uint256 current = block.timestamp;

        if (lastTime > 0) {
            uint256 timeElapsed = current - lastTime;
            uint256 reward = (stakedBalances[_address] * timeElapsed) / 1 days;
            unclaimedRewards[_address] += reward;
        }

        lastUpdateTime[_address] = current;
    }

    function getBalance() external view returns (uint256) {
        return stakedBalances[msg.sender];
    }

    function getReward(address _address) external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastUpdateTime[_address];
        uint256 newReward = (stakedBalances[_address] * timeElapsed) / 1 days;
        return unclaimedRewards[_address] + newReward;
    }
}