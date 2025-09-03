require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [`${PRIVATE_KEY}`]
    },
  },
};