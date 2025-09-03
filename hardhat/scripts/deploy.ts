import { ethers } from "hardhat";

async function main() {
  const FileAuthenticityVerification = await ethers.getContractFactory(
    "FileAuthenticityVerification"
  );
  const fileAuthenticityVerification = await FileAuthenticityVerification.deploy();

  await fileAuthenticityVerification.waitForDeployment();

  const contractAddress = await fileAuthenticityVerification.getAddress();
  console.log(
    `FileAuthenticityVerification deployed to: ${contractAddress}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
