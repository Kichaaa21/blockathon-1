import {Web3} from "web3";
const web3 = new Web3("http://127.0.0.1:8545/");
const contractAbi =   [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "getUserData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "userId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "password",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "referralCode",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "referrer",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "referralPoints",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "level",
            "type": "uint256"
          }
        ],
        "internalType": "struct ReferralSystemContract.User",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "password",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "referralCode",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "referrer",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "referralPoints",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "level",
        "type": "uint256"
      }
    ],
    "name": "storeUserData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "password",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "referralCode",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "referrer",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "referralPoints",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "level",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// Your ReferralSystem class code here...
class ReferralSystem {
    constructor() {
        this.users = {};  // Dictionary to store user data (user_id: {'referral_code', 'referrer', 'level', 'points'})
    }

    generateReferralCode(user_id) {
        return `REF-${user_id}`;
    }

    register(user_id, password, referral_code = null) {
        if (this.users[user_id]) {
            throw new Error("User already exists");
        }

        if (referral_code) {
            const referrer = this.findReferrerByCode(referral_code);
            if (!referrer) {
                console.log("Invalid referral code");
                return;
            }

            const referrer_level = this.users[referrer]['level'];
            this.users[user_id] = {
                'password': password,
                'referral_code': this.generateReferralCode(user_id),
                'referrer': referrer,
                'level': referrer_level + 1,
                'points': 0
            };
        } else {
            this.users[user_id] = {
                'password': password,
                'referral_code': this.generateReferralCode(user_id),
                'referrer': null,
                'level': 0,
                'points': 0
            };
        }
        console.log("User registered successfully.");
    }

    findReferrerByCode(referral_code) {
        for (const uid in this.users) {
            if (this.users[uid]['referral_code'] === referral_code) {
                return uid;
            }
        }
        return null;
    }

    addUser(user_id, referral_code = null) {
        if (this.users[user_id]) {
            throw new Error("User already exists");
        }

        if (referral_code) {
            let referrer = null;
            for (const uid in this.users) {
                if (this.users[uid]['referral_code'] === referral_code) {
                    referrer = uid;
                    break;
                }
            }

            if (!referrer) {
                console.log("Invalid referral code");
                return;
            }

            const referrer_level = this.users[referrer]['level'];
            this.users[user_id] = {
                'referral_code': this.generateReferralCode(user_id),
                'referrer': referrer,
                'level': referrer_level + 1,
                'points': 0
            };
        } else {
            this.users[user_id] = {
                'referral_code': this.generateReferralCode(user_id),
                'referrer': null,
                'level': 0,
                'points': 0
            };
        }
    }

    calculateReferralPoints(amount) {
        // Customize the points calculation logic here
        // For example, you can use an exponential decay function
        return Math.floor(amount * 0.1);  // Example: 10% of the amount
    }
  
    calculateTotalLevels(user_id) {
        let levels = 1;
        let referrer = this.users[user_id];
        while (referrer && referrer['referrer']) {
            referrer = this.users[referrer['referrer']];
            levels++;
        }
        return levels;
    }
   
    distributeReferralPointsChain(user_id, points) {
        const referrer = this.users[user_id];
        if (referrer) {
            const referrer_level = referrer['level'];
            let referrer_points = referrer['points'];

            // Calculate the total number of levels in the chain
            const totalLevels = this.calculateTotalLevels(user_id);

            // Customize the percentage split based on the referrer's level and total levels
            const percentage = this.calculatePercentage(referrer_level, totalLevels);

            const user_points = points * (percentage / 100); // Convert percentage to a fraction
            referrer_points += user_points;

            // Update points for referrer
            this.users[user_id]['points'] = referrer_points;

            // Distribute points to the next referrer in the chain
            if (referrer['referrer']) {
                this.distributeReferralPointsChain(referrer['referrer'], user_points);
            }
        }
    }


calculatePercentage(level, totalLevels) {
    // Customize the percentage calculation logic based on the referrer's level
    // Levels are counted from the end of the chain (user3 will have level 1, user2 will have level 2, etc.)
    const percentageIncrement = 15 / totalLevels; // Total percentage divided among all levels
    return 5 + (totalLevels - level) * percentageIncrement;
}


    getAllReferrers(user_id) {
        const referrerChain = [];

        const findReferrers = (user_id, depth = 0) => {
            for (const uid in this.users) {
                if (this.users[uid]['referrer'] === user_id) {
                    referrerChain.push({ uid, depth });
                    findReferrers(uid, depth + 1);
                }
            }
        };

        findReferrers(user_id);
        return referrerChain;
    }

    login(user_id, password) {
        const user = this.users[user_id];
        if (user && user['password'] === password) {
            return true;
        }
        return false;
    }

    processPurchase(user_id, amount) {
        // Handle the purchase logic here
        // This could be different from referral logic
    }

    processReferralChain(user_id, referrer_id, amount) {
        const user = this.users[user_id];
        const referrer = this.users[referrer_id];

        if (!user || !referrer) {
            throw new Error("Invalid user or referrer");
        }

        // Calculate referral points based on the amount
        const referral_points = this.calculateReferralPoints(amount);

        // Distribute points to referrers up the chain
        this.distributeReferralPointsChain(user['referrer'], referral_points);
    }

    buy(user_id, password, amount) {
        const user = this.users[user_id];
    
        if (!user) {
            console.log("User not registered. Please register first.");
            return;
        }
    
        if (!this.login(user_id, password)) {
            console.log("Invalid login credentials.");
            return;
        }
    
        if (user['referrer']) {
            this.processPurchase(user_id, amount);
            console.log(`Purchase processed for user ${user_id}`);
    
            // Distribute referral points
            const referral_points = this.calculateReferralPoints(amount);
    
            // Distribute referral points to referrers, excluding the user making the purchase
            this.distributeReferralPointsChain(user['referrer'], referral_points);
            console.log(`Referral points distributed for user ${user['referrer']}`);
        } else {
            const referral_code = prompt("Enter referral code (leave empty if none): ");
            let referrer = null;
            for (const uid in this.users) {
                if (this.users[uid]['referral_code'] === referral_code) {
                    referrer = uid;
                    break;
                }
            }
    
            if (referrer) {
                this.users[user_id]['referrer'] = referrer;
                this.processReferralChain(user_id, referrer, amount);
                console.log(`Purchase and referral processed for user ${user_id}`);
            } else if (referral_code === '') {
                this.processPurchase(user_id, amount);
                console.log(`Purchase processed for user ${user_id}`);
            } else {
                console.log("Invalid referral code");
            }
        }
    }
    
    getUserData(user_id) {
        return this.users[user_id];
    }

    async sendUserDataToContract(web3, contractAbi, contractAddress, user_id, password, referral_code, referrer, level) {
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        
        try {
            const referral_points = this.calculateReferralPoints(0); // Initialize with 0 points
            const userData = {
                userId: user_id,
                password: password,
                referralCode: referral_code,
                referrer: referrer,
                referralPoints: referral_points,
                level: level
            };

            const result = await contract.methods.storeUserData(
                userData.userId,
                userData.password,
                userData.referralCode,
                userData.referrer,
                userData.referralPoints,
                userData.level
            ).send({ from: web3.eth.defaultAccount });

            console.log("Transaction hash:", result.transactionHash);
        } catch (error) {
            console.error("Error sending user data to contract:", error);
        }
    }
   
}

// Example usage

const referralSystem = new ReferralSystem();
const outputDiv = document.getElementById('output');
        const registerForm = document.getElementById('registerForm');
        const loginForm = document.getElementById('loginForm');
        const buyForm = document.getElementById('buyForm');
        const viewDetailsForm = document.getElementById('viewDetailsForm');

        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user_id = registerForm.elements.registerUserID.value;
            const password = registerForm.elements.registerPassword.value;
            const referral_code = registerForm.elements.registerReferralCode.value;
            
            try {
                referralSystem.register(user_id, password, referral_code);
                outputDiv.textContent = 'User registered successfully.';
            } catch (error) {
                outputDiv.textContent = error.message;
            }
        });

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user_id = loginForm.elements.loginUserID.value;
            const password = loginForm.elements.loginPassword.value;
            
            if (referralSystem.login(user_id, password)) {
                outputDiv.textContent = 'Login successful.';
            } else {
                outputDiv.textContent = 'Invalid login credentials.';
            }
        });

        buyForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user_id = buyForm.elements.buyUserID.value;
            const password = buyForm.elements.buyPassword.value;
            
            if (referralSystem.login(user_id, password)) {
                const amount = parseFloat(buyForm.elements.buyAmount.value);
                referralSystem.buy(user_id, password, amount);
                outputDiv.textContent = `Purchase and referral processed for user ${user_id}`;
            } else {
                outputDiv.textContent = 'Invalid login credentials.';
            }
        });

        viewDetailsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user_id = viewDetailsForm.elements.viewDetailsUserID.value;
            const user_data = referralSystem.getUserData(user_id);
            if (user_data) {
                outputDiv.textContent = `User ID: ${user_id}\nReferral Code: ${user_data['referral_code']}\nReferrer: ${user_data['referrer']}\nLevel: ${user_data['level']}`;
            } else {
                outputDiv.textContent = 'User not found';
            }
        });

        document.getElementById('viewReferralPointsBtn').addEventListener('click', () => {
            let pointsText = '';
            for (const user_id in referralSystem.users) {
                const user_data = referralSystem.users[user_id];
                pointsText += `User ID: ${user_id}\nReferral Points: ${user_data['points']}\n\n`;
            }
            outputDiv.textContent = pointsText;
        });
        document.getElementById('viewReferralTreeBtn').addEventListener('click', () => {
            const user_id = prompt("Enter user ID: ");
            const all_referrers = referralSystem.getAllReferrers(user_id);
            if (all_referrers.length > 0) {
                let treeText = `Referral tree for ${user_id}:\n`;
                for (const { uid, depth } of all_referrers) {
                    const indent = "  ".repeat(depth);
                    treeText += `${indent}→ ${uid}\n`;
                }
                document.getElementById('output').textContent = treeText;
            } else {
                document.getElementById('output').textContent = `No referrers for ${user_id}`;
            }
        });