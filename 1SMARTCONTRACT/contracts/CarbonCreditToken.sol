// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


// Test Merge

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditToken is ERC20, Ownable {
    struct Listing {
        uint256 amount;
        uint256 pricePerToken;
        address seller;
        bool active; // Flag for listing status
    }

    // struct FuturesContract {
    //     uint256 amount;
    //     uint256 agreedPricePerToken;
    //     uint256 settlementDate;
    //     address buyer;
    //     address seller;
    //     bool isSettled;
    // }

    uint256 public nextListingId = 1;

    mapping(uint256 => Listing) public listings;

    // Pass the initialOwner parameter to the Ownable constructor
    constructor(address initialOwner) ERC20("CarbonCreditToken", "CCT") Ownable(initialOwner) {
        transferOwnership(initialOwner);
    }

    // Mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Invalid address");
        _mint(to, amount);
    }

    // Burn tokens to retire them
    function retire(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        _burn(msg.sender, amount);
    }

    // List tokens for sale
    function listTokens(uint256 amount, uint256 pricePerToken) public {
        require(amount > 0, "Amount must be greater than zero");
        require(pricePerToken > 0, "Price per token must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance");

    // Approve tokens for escrow
    require(ERC20(address(this)).allowance(msg.sender, address(this)) >= amount, "Approve tokens first");

    // Create a listing (without on-chain token transfer)
    listings[nextListingId] = Listing({
        amount: amount,
        pricePerToken: pricePerToken,
        seller: msg.sender,
        active: true
    });

        nextListingId++;
    }

    // Buy tokens from a listing
    function buyTokens(uint256 listingID) public payable {
        Listing storage listing = listings[listingID];

        require(listing.active, "Listing is not active");
        require(msg.value > 0, "Payment must be greater than zero");

        uint256 amountToBuy = msg.value / listing.pricePerToken;
        require(amountToBuy > 0, "Not enough funds to buy tokens");
        require(amountToBuy <= listing.amount, "Not enough tokens in the listing");

        // Transfer funds to the seller
        payable(listing.seller).transfer(msg.value);

        // Transfer tokens to the buyer
        _transfer(address(this), msg.sender, amountToBuy);

        // Update or remove the listing
        listing.amount -= amountToBuy;
        if (listing.amount == 0) {
            listing.active = false;
        }
    }

    // Cancel a listing and return tokens to the seller
    function cancelListing(uint256 listingID) public {
        Listing storage listing = listings[listingID];

        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "You are not the seller");

        uint256 amountToReturn = listing.amount;

        // Return tokens to the seller
        if (amountToReturn > 0) {
            _transfer(address(this), msg.sender, amountToReturn);
        }

        // Mark the listing as inactive
        listing.active = false;

        // Remove the listing from the mapping
        delete listings[listingID];
    }

    mapping(address => uint256) private lockedTokens;

    function lockTokens(uint256 amount) public onlyOwner {
        require(balanceOf(msg.sender) >= amount, "Insufficient tokens");
        lockedTokens[msg.sender] += amount;
        _transfer(msg.sender, address(this), amount); // Transfer to contract
    }

    function unlockTokens(address recipient, uint256 amount) public onlyOwner {
        require(lockedTokens[recipient] >= amount, "Insufficient locked tokens");
        lockedTokens[recipient] -= amount;
        _transfer(address(this), recipient, amount); // Transfer to user
    }

    // Create a futures contract
    // function createFuturesContract(
    //     uint256 amount,
    //     uint256 agreedPricePerToken,
    //     uint256 settlementDate,
    //     address buyer
    // ) public {
    //     require(amount > 0, "Amount must be greater than zero");
    //     require(agreedPricePerToken > 0, "Price per token must be greater than zero");
    //     require(settlementDate > block.timestamp, "Settlement date must be in the future");
    //     require(balanceOf(msg.sender) >= amount, "Insufficient tokens");

    //     // Transfer tokens to the contract for escrow
    //     _transfer(msg.sender, address(this), amount);

    //     // Create the futures contract
    //     futuresContracts[nextFuturesId] = FuturesContract({
    //         amount: amount,
    //         agreedPricePerToken: agreedPricePerToken,
    //         settlementDate: settlementDate,
    //         buyer: buyer,
    //         seller: msg.sender,
    //         isSettled: false
    //     });

    //     nextFuturesId++;
    // }

    // Settle a futures contract
    // function settleFuturesContract(uint256 futuresId) public payable {
    //     FuturesContract storage futures = futuresContracts[futuresId];

    //     require(!futures.isSettled, "Contract already settled");
    //     require(block.timestamp >= futures.settlementDate, "Settlement date not reached");
    //     require(msg.sender == futures.buyer, "Only buyer can settle the contract");

    //     uint256 totalPrice = futures.amount * futures.agreedPricePerToken;
    //     require(msg.value == totalPrice, "Incorrect payment amount");

    //     // Transfer payment to the seller
    //     payable(futures.seller).transfer(msg.value);

    //     // Transfer tokens to the buyer
    //     _transfer(address(this), futures.buyer, futures.amount);

    //     // Mark the contract as settled
    //     futures.isSettled = true;
    // }
}
