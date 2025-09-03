require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Use a dummy private key for local testing if the real one isn't set.
// This prevents Hardhat from throwing an error during initialization.
const privateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: [privateKey]
    },
  },
};