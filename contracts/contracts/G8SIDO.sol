// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract G8SIDO is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable g8sToken;
    IERC20 public immutable pusdToken;

    uint256 public pricePUSD; // PUSD (1e18) per 1 G8S (1e18)
    uint256 public tokensForSale;
    uint256 public tokensSold;
    uint256 public totalRaisedPUSD;

    uint256 public startTime;
    uint256 public endTime;

    mapping(address => uint256) public contributions;

    event Purchased(address indexed buyer, uint256 pusdAmount, uint256 tokensOut, uint256 timestamp);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    modifier saleActive() {
        require(!paused(), "paused");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "sale not active");
        _;
    }

    constructor(
        address g8sToken_,
        address pusdToken_,
        uint256 pricePUSD_,
        uint256 tokensForSale_,
        uint256 startTime_,
        uint256 endTime_
    ) Ownable(msg.sender) {
        require(g8sToken_ != address(0), "g8s=0");
        require(pusdToken_ != address(0), "pusd=0");
        require(pricePUSD_ > 0, "price=0");
        require(tokensForSale_ > 0, "sale=0");
        require(endTime_ > startTime_, "time invalid");

        g8sToken = IERC20(g8sToken_);
        pusdToken = IERC20(pusdToken_);
        pricePUSD = pricePUSD_;
        tokensForSale = tokensForSale_;
        startTime = startTime_;
        endTime = endTime_;
    }

    function setPricePUSD(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "price=0");
        uint256 old = pricePUSD;
        pricePUSD = newPrice;
        emit PriceUpdated(old, newPrice);
    }

    function pauseSale() external onlyOwner {
        _pause();
    }

    function resumeSale() external onlyOwner {
        _unpause();
    }

    function buyWithPUSD(uint256 pusdAmount) external nonReentrant saleActive {
        require(pusdAmount > 0, "pusd=0");
        uint256 tokensOut = (pusdAmount * 1e18) / pricePUSD; // floor
        require(tokensOut > 0, "dust");
        require(tokensSold + tokensOut <= tokensForSale, "exceeds cap");

        // Effects
        tokensSold += tokensOut;
        totalRaisedPUSD += pusdAmount;
        contributions[msg.sender] += pusdAmount;

        // Interactions
        require(pusdToken.transferFrom(msg.sender, address(this), pusdAmount), "pusd xfer fail");
        require(IERC20(g8sToken).transfer(msg.sender, tokensOut), "g8s xfer fail");

        emit Purchased(msg.sender, pusdAmount, tokensOut, block.timestamp);
    }

    function buyTokens(uint256 tokensDesired) external nonReentrant saleActive {
        require(tokensDesired > 0, "tokens=0");
        require(tokensSold + tokensDesired <= tokensForSale, "exceeds cap");
        uint256 pusdRequired = (tokensDesired * pricePUSD) / 1e18;
        require(pusdRequired > 0, "pusd=0");

        tokensSold += tokensDesired;
        totalRaisedPUSD += pusdRequired;
        contributions[msg.sender] += pusdRequired;

        require(pusdToken.transferFrom(msg.sender, address(this), pusdRequired), "pusd xfer fail");
        require(IERC20(g8sToken).transfer(msg.sender, tokensDesired), "g8s xfer fail");

        emit Purchased(msg.sender, pusdRequired, tokensDesired, block.timestamp);
    }

    function withdrawPUSD(address to) external onlyOwner {
        require(to != address(0), "to=0");
        uint256 bal = pusdToken.balanceOf(address(this));
        require(bal > 0, "no pusd");
        require(pusdToken.transfer(to, bal), "xfer fail");
    }

    function sweepUnsold(address to) external onlyOwner {
        require(block.timestamp > endTime, "not ended");
        require(to != address(0), "to=0");
        uint256 allocatedRemaining = tokensForSale - tokensSold;
        require(allocatedRemaining > 0, "none");
        uint256 bal = IERC20(g8sToken).balanceOf(address(this));
        uint256 toSend = allocatedRemaining < bal ? allocatedRemaining : bal;
        require(IERC20(g8sToken).transfer(to, toSend), "xfer fail");
    }
}
