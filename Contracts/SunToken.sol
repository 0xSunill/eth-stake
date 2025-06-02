// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SunToken is ERC20 {
    address stakingContract;
    constructor(address _stakingContract) ERC20("sun", "SUN") {
        stakingContract = _stakingContract;
    }

    function mint(address to, uint256 amount) external {
        require(
            msg.sender == stakingContract,
            "Only staking contract can mint"
        );
        _mint(to, amount);
    }

    function updateStakingContract(address _stakingContract) external {
        require(
            msg.sender == stakingContract,
            "Only current staking contract can update"
        );
        stakingContract = _stakingContract;
    }
}