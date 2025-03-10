// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AirForceOneBridge.sol";
import "./The_Arbiter_protocol.sol";
import "./HcManga.sol";
import "./AirForceOnePoolKeys.sol";

contract AirForceOnePool {
    address public bridge;
    address public arbiter;
    address public tokenManager;
    address public keyManager;
    
    mapping(address => uint256) public userDeposits;
    mapping(string => uint256) public chainLiquidity;
    
    uint256 public constant MIN_DEPOSIT = 0.1 ether;
    uint256 public totalLiquidity;
    uint256 public ownerProfit;
    
    event PoolDeposit(address indexed user, uint256 amount, uint256 serial);
    event PoolWithdraw(address indexed user, uint256 amount, string targetChain);
    event ProfitDistributed(address indexed user, uint256 amount);
    event OwnerProfitAccrued(uint256 amount);
    
    constructor(address _bridge, address _arbiter, address _tokenManager) {
        bridge = _bridge;
        arbiter = _arbiter;
        tokenManager = _tokenManager;
        
        // Deploy key manager
        AirForceOnePoolKeys keys = new AirForceOnePoolKeys(address(this));
        keyManager = address(keys);
    }
    
    function deposit() external payable {
        require(msg.value >= MIN_DEPOSIT, "Deposit below minimum");
        
        // Get serial number from token manager
        uint256 serial = HardcodedTokenManager(tokenManager).mintToken(msg.sender);
        
        // Validate through arbiter
        require(Arbiter(arbiter).validateAction(serial, msg.sender, ""), "Invalid deposit");
        
        userDeposits[msg.sender] += msg.value;
        totalLiquidity += msg.value;
        
        // Calculate owner's profit share (10%)
        uint256 ownerShare = msg.value * 10 / 100;
        ownerProfit += ownerShare;
        
        emit PoolDeposit(msg.sender, msg.value, serial);
        emit OwnerProfitAccrued(ownerShare);
    }
    
    function bridgeAndStake(uint256 amount, string calldata targetChain) external {
        require(userDeposits[msg.sender] >= amount, "Insufficient deposit");
        require(chainLiquidity[targetChain] + amount <= totalLiquidity, "Insufficient liquidity");
        
        // Get new serial for this action
        uint256 serial = HardcodedTokenManager(tokenManager).mintToken(msg.sender);
        
        // Bridge the tokens
        AirForceOneBridge(bridge).bridgeTokens(amount, targetChain, serial);
        
        userDeposits[msg.sender] -= amount;
        chainLiquidity[targetChain] += amount;
        
        // Calculate and distribute profit
        uint256 profit = calculateProfit(amount);
        if(profit > 0) {
            distributeProfit(msg.sender, profit);
        }
        
        emit PoolWithdraw(msg.sender, amount, targetChain);
    }
    
    function calculateProfit(uint256 amount) internal pure returns (uint256) {
        // Enhanced profit calculation with market conditions
        return amount * 5 / 100; // 5% profit for users
    }
    
    function distributeProfit(address user, uint256 profit) internal {
        // Calculate owner's share (20% of profits)
        uint256 ownerShare = profit * 20 / 100;
        uint256 userShare = profit - ownerShare;
        
        ownerProfit += ownerShare;
        
        // Send user's share
        (bool success, ) = user.call{value: userShare}("");
        require(success, "Profit distribution failed");
        
        emit ProfitDistributed(user, userShare);
        emit OwnerProfitAccrued(ownerShare);
    }
    
    // Owner profit withdrawal (only through key manager)
    function withdrawOwnerProfit() external {
        require(msg.sender == keyManager, "Only key manager can withdraw");
        uint256 amount = ownerProfit;
        ownerProfit = 0;
        AirForceOnePoolKeys(keyManager).withdrawPoolProfit(amount);
    }
    
    // View functions
    function getOwnerProfit() external view returns (uint256) {
        return ownerProfit;
    }
    
    function getUserDeposit(address user) external view returns (uint256) {
        return userDeposits[user];
    }
    
    function getChainLiquidity(string calldata chain) external view returns (uint256) {
        return chainLiquidity[chain];
    }
    
    receive() external payable {
        deposit();
    }
}
