#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ArbitersShield.sol";
import "./SecurityPassToken.sol";

contract PhiDataBankingAgent {
    ArbitersShield public shield;
    SecurityPassToken public securityPass;
    
    struct BankingOperation {
        bytes32 operationHash;
        address user;
        uint256 amount;
        string operationType;
        bool isExecuted;
        bytes32 aiSignature;
    }
    
    struct UserAccount {
        uint256 balance;
        uint256 savingsRate;
        uint256 lastOperation;
        bytes32[] operations;
        bool isActive;
    }
    
    mapping(address => UserAccount) private accounts;
    mapping(bytes32 => BankingOperation) private operations;
    
    event OperationExecuted(bytes32 indexed opHash, address indexed user, string opType);
    event AccountUpdated(address indexed user, uint256 newBalance);
    event AIDecision(bytes32 indexed opHash, string decision);
    
    constructor(address _shield, address _securityPass) {
        shield = ArbitersShield(_shield);
        securityPass = SecurityPassToken(_securityPass);
    }
    
    function executeOperation(
        string memory opType,
        uint256 amount,
        bytes32 aiSig
    ) external returns (bytes32) {
        require(securityPass.hasValidPass(msg.sender), "No security pass");
        
        bytes32 opHash = keccak256(abi.encodePacked(
            msg.sender,
            opType,
            amount,
            block.timestamp
        ));
        
        BankingOperation storage op = operations[opHash];
        op.operationHash = opHash;
        op.user = msg.sender;
        op.amount = amount;
        op.operationType = opType;
        op.aiSignature = aiSig;
        
        // Process through shield
        shield.protectPool(
            abi.encodePacked(opHash, aiSig),
            abi.encodePacked("BANKING_OP", amount),
            opType
        );
        
        _executeAIOperation(opHash);
        
        emit OperationExecuted(opHash, msg.sender, opType);
        return opHash;
    }
    
    function _executeAIOperation(bytes32 opHash) internal {
        BankingOperation storage op = operations[opHash];
        UserAccount storage account = accounts[op.user];
        
        if (!account.isActive) {
            account.isActive = true;
            account.savingsRate = 2; // 2% base savings rate
        }
        
        if (keccak256(bytes(op.operationType)) == keccak256(bytes("DEPOSIT"))) {
            account.balance += op.amount;
        } else if (keccak256(bytes(op.operationType)) == keccak256(bytes("WITHDRAW"))) {
            require(account.balance >= op.amount, "Insufficient balance");
            account.balance -= op.amount;
        }
        
        account.lastOperation = block.timestamp;
        account.operations.push(opHash);
        op.isExecuted = true;
        
        emit AccountUpdated(op.user, account.balance);
        emit AIDecision(opHash, "EXECUTED");
    }
    
    function getAccountInfo() external view returns (
        uint256 balance,
        uint256 savingsRate,
        uint256 lastOperation,
        uint256 operationCount
    ) {
        UserAccount storage account = accounts[msg.sender];
        return (
            account.balance,
            account.savingsRate,
            account.lastOperation,
            account.operations.length
        );
    }
    
    function getOperationDetails(bytes32 opHash) external view returns (
        address user,
        uint256 amount,
        string memory opType,
        bool executed
    ) {
        BankingOperation storage op = operations[opHash];
        require(op.user == msg.sender, "Unauthorized");
        return (
            op.user,
            op.amount,
            op.operationType,
            op.isExecuted
        );
    }
    
    receive() external payable {
        executeOperation("DEPOSIT", msg.value, bytes32(0));
    }
}

#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################
