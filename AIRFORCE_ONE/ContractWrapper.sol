#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DualKeyContractSystem.sol";

contract ContractWrapper {
    DualKeyContractSystem public keySystem;
    mapping(address => bytes32) public contractHashes;
    
    event ContractWrapped(address indexed contractAddress, bytes32 indexed contractHash);
    
    constructor(address _keySystem) {
        keySystem = DualKeyContractSystem(_keySystem);
    }
    
    function wrapContract(address contractAddress, bytes memory contractCode) external {
        // Register contract in key system
        bytes32 contractHash = keySystem.registerContract(contractCode);
        contractHashes[contractAddress] = contractHash;
        
        emit ContractWrapped(contractAddress, contractHash);
    }
    
    function validateContractAccess(address contractAddress, address user) external view returns (bool) {
        bytes32 contractHash = contractHashes[contractAddress];
        if(contractHash == bytes32(0)) return false;
        
        try keySystem.viewDecryptedContract(contractHash) returns (bytes memory) {
            return true;
        } catch {
            return false;
        }
    }
    
    // Modifier for other contracts to use
    modifier onlyValidated(address user) {
        require(validateContractAccess(msg.sender, user), "Contract access denied");
        _;
    }
}

#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################
