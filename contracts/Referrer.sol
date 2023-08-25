// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReferralSystemContract {
    struct User {
        string userId;
        string password;
        string referralCode;
        string referrer;
        uint256 referralPoints;
        uint256 level;
    }

    mapping(string => User) public users;

    // Function to store user data
    function storeUserData(
        string memory userId,
        string memory password,
        string memory referralCode,
        string memory referrer,
        uint256 referralPoints,
        uint256 level
    ) public {
        users[userId] = User({
            userId: userId,
            password: password,
            referralCode: referralCode,
            referrer: referrer,
            referralPoints: referralPoints,
            level: level
        });
    }

    // Function to get user data
    function getUserData(string memory userId) public view returns (User memory) {
        return users[userId];
    }
}