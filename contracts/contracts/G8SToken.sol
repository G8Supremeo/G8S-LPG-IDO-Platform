// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract G8SToken is ERC20, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address initialHolder
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        require(initialHolder != address(0), "holder=0");
        _mint(initialHolder, initialSupply);
    }
}
