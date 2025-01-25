#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SecurityPassToken.sol";

contract DualKeyContractSystem {
    address public owner;
    SecurityPassToken public securityPass;
    
    struct ContractAccess {
        bytes32 ownerKey;
        bytes originalCode;
        bytes encryptedCode;
        bool isActive;
        mapping(address => bool) authorizedUsers;
    }
    
    mapping(bytes32 => ContractAccess) private contracts;
    mapping(address => bool) public authorizedViewers;
    
    event ContractRegistered(bytes32 indexed contractHash);
    event UserAuthorized(bytes32 indexed contractHash, address indexed user);
    event TransactionInitiated(bytes32 indexed txHash, address indexed user);
    
    constructor(address _securityPass) {
        owner = msg.sender;
        securityPass = SecurityPassToken(_securityPass);
        authorizedViewers[msg.sender] = true;
    }
    
    function registerContract(bytes memory contractCode) external returns (bytes32) {
        require(msg.sender == owner, "Only owner can register");
        
        bytes32 contractHash = keccak256(abi.encodePacked(contractCode, block.timestamp));
        bytes32 ownerKey = generateOwnerKey();
        
        ContractAccess storage newContract = contracts[contractHash];
        newContract.ownerKey = ownerKey;
        newContract.originalCode = contractCode;
        newContract.encryptedCode = _encrypt(contractCode, ownerKey);
        newContract.isActive = true;
        
        emit ContractRegistered(contractHash);
        return contractHash;
    }
    
    function authorizeUser(bytes32 contractHash, address user) external {
        require(msg.sender == owner, "Only owner can authorize");
        require(securityPass.hasValidPass(user), "User has no security pass");
        
        contracts[contractHash].authorizedUsers[user] = true;
        emit UserAuthorized(contractHash, user);
    }
    
    function viewPlainContract(bytes32 contractHash) external view returns (bytes memory) {
        require(securityPass.hasValidPass(msg.sender), "No security pass");
        require(contracts[contractHash].authorizedUsers[msg.sender], "Not authorized");
        
        return contracts[contractHash].originalCode;
    }
    
    function initiateTransaction(bytes32 contractHash, uint256 amount) external returns (bytes32) {
        require(securityPass.hasValidPass(msg.sender), "No security pass");
        require(contracts[contractHash].authorizedUsers[msg.sender], "Not authorized");
        
        bytes32 txHash = keccak256(abi.encodePacked(
            msg.sender,
            contractHash,
            block.timestamp,
            amount
        ));
        
        // Create live transaction view
        securityPass.createTransactionView(
            msg.sender,
            txHash,
            amount,
            string(abi.encodePacked("Contract interaction: ", toHexString(contractHash)))
        );
        
        emit TransactionInitiated(txHash, msg.sender);
        return txHash;
    }
    
    function generateOwnerKey() internal view returns (bytes32) {
        return keccak256(abi.encodePacked(
            owner,
            block.timestamp,
            block.difficulty,
            "AIRFORCE_ONE_OWNER"
        ));
    }
    
    function _encrypt(bytes memory data, bytes32 key) internal pure returns (bytes memory) {
        bytes memory result = new bytes(data.length);
        for(uint i = 0; i < data.length; i++) {
            result[i] = data[i] ^ bytes1(uint8(uint256(key) >> (i % 32 * 8)));
        }
        return result;
    }
    
    function toHexString(bytes32 value) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i*2] = alphabet[uint8(value[i] >> 4)];
            str[i*2+1] = alphabet[uint8(value[i] & 0x0f)];
        }
        return string(str);
    }
}

#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################
