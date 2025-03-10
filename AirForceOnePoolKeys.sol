// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AirForceOnePool.sol";

contract AirForceOnePoolKeys {
    address public owner;
    AirForceOnePool public pool;
    
    // Owner's private data
    struct OwnerData {
        bytes32 accessKey;
        uint256 profitShare;
        bool canWithdraw;
    }
    
    mapping(address => OwnerData) private ownerData;
    
    event OwnerKeyGenerated(address indexed owner, bytes32 indexed accessKey);
    event ProfitWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _pool) {
        owner = msg.sender;
        pool = AirForceOnePool(_pool);
        
        // Generate initial owner key
        bytes32 initialKey = generateOwnerKey(msg.sender);
        ownerData[msg.sender] = OwnerData({
            accessKey: initialKey,
            profitShare: 100,
            canWithdraw: true
        });
        
        emit OwnerKeyGenerated(msg.sender, initialKey);
    }
    
    function generateOwnerKey(address _owner) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_owner, block.timestamp, block.difficulty));
    }
    
    function getOwnerKey() external view returns (bytes32) {
        require(msg.sender == owner, "Only owner can view key");
        return ownerData[msg.sender].accessKey;
    }
    
    function withdrawPoolProfit(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(ownerData[msg.sender].canWithdraw, "Withdrawal not enabled");
        
        // Transfer profit to owner
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Profit withdrawal failed");
        
        emit ProfitWithdrawn(owner, amount);
    }
    
    // Emergency key regeneration (only if current key is compromised)
    function regenerateOwnerKey() external {
        require(msg.sender == owner, "Only owner can regenerate key");
        bytes32 newKey = generateOwnerKey(msg.sender);
        ownerData[msg.sender].accessKey = newKey;
        emit OwnerKeyGenerated(msg.sender, newKey);
    }
    
    receive() external payable {
        // Accept incoming payments
    }
}
