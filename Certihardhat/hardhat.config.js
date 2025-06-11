require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
defaultNetwork:"localhost",
  solidity: "0.8.30",
  networks:{
    localhost:{
      url:"http://127.0.0.1:8545/"
    },
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/irO2jCpjvVcMsqplI-w4lwfqZZPhYS_K`,
      accounts:["0ebfb4004ee4b07ecc057f02b333be981d4e57218853c2a0ac89053ef3f986e6"]
    }
  }
};
