#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ArbitersShield.sol";

contract ExDexPool {
    ArbitersShield public shield;
    
    struct PoolData {
        uint256 totalStaked;
        uint256 rewardRate;
        mapping(address => uint256) userStakes;
        mapping(address => uint256) rewards;
        bool isActive;
    }
    
    mapping(bytes32 => PoolData) private pools;
    mapping(address => bytes32[]) private userPools;
    
    event StakeInitiated(bytes32 indexed poolId, address indexed user, uint256 amount);
    event RewardsClaimed(bytes32 indexed poolId, address indexed user, uint256 amount);
    
    constructor(address _shield) {
        shield = ArbitersShield(_shield);
    }
    
    function createStakingPool(
        uint256 rewardRate,
        bytes memory aiLogic
    ) external returns (bytes32) {
        bytes32 poolId = shield.protectPool(
            aiLogic,
            abi.encodePacked("STAKING_POOL", rewardRate),
            "STAKING"
        );
        
        PoolData storage pool = pools[poolId];
        pool.rewardRate = rewardRate;
        pool.isActive = true;
        
        return poolId;
    }
    
    function stake(bytes32 poolId, uint256 amount) external {
        require(pools[poolId].isActive, "Pool not active");
        
        PoolData storage pool = pools[poolId];
        pool.userStakes[msg.sender] += amount;
        pool.totalStaked += amount;
        
        userPools[msg.sender].push(poolId);
        
        emit StakeInitiated(poolId, msg.sender, amount);
    }
    
    function claimRewards(bytes32 poolId) external {
        PoolData storage pool = pools[poolId];
        require(pool.userStakes[msg.sender] > 0, "No stakes found");
        
        uint256 reward = calculateRewards(poolId, msg.sender);
        require(reward > 0, "No rewards available");
        
        pool.rewards[msg.sender] = 0;
        
        // Transfer rewards using shield
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Reward transfer failed");
        
        emit RewardsClaimed(poolId, msg.sender, reward);
    }
    
    function calculateRewards(bytes32 poolId, address user) public view returns (uint256) {
        PoolData storage pool = pools[poolId];
        return pool.userStakes[user] * pool.rewardRate / 100;
    }
    
    function getUserPools(address user) external view returns (bytes32[] memory) {
        return userPools[user];
    }
    
    function getPoolInfo(bytes32 poolId) external view returns (
        uint256 totalStaked,
        uint256 rewardRate,
        uint256 userStake,
        uint256 pendingRewards
    ) {
        PoolData storage pool = pools[poolId];
        return (
            pool.totalStaked,
            pool.rewardRate,
            pool.userStakes[msg.sender],
            calculateRewards(poolId, msg.sender)
        );
    }
    
    receive() external payable {
        // Accept deposits for staking
    }
}

#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################
