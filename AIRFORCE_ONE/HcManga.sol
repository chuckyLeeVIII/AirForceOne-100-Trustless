
#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################

#HardcodedTokenManager.sol

#Handles serial stamping during token minting.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HardcodedTokenManager {
    mapping(uint256 => bool) private validSerials;
    mapping(address => uint256) public userSerials;

    event TokenMinted(address indexed user, uint256 serial);
    event TokenInvalidated(uint256 serial);

    uint256 private nextSerial = 1;

    function mintToken(address user) external returns (uint256) {
        uint256 serial = nextSerial;
        validSerials[serial] = true;
        userSerials[user] = serial;
        nextSerial++;

        emit TokenMinted(user, serial);
        return serial;
    }

    function invalidateToken(uint256 serial) external {
        validSerials[serial] = false;
        emit TokenInvalidated(serial);
    }

    function isValidSerial(uint256 serial) external view returns (bool) {
        return validSerials[serial];
    }
}

#################################################################################################################################################################################################################
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#################################################################################################################################################################################################################
