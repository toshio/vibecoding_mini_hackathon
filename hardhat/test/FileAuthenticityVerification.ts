import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("FileAuthenticityVerification", function () {
  async function deployFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

    const FileAuthenticityVerificationFactory = await ethers.getContractFactory("FileAuthenticityVerification");
    const contract = await FileAuthenticityVerificationFactory.deploy();

    const testFileHash = ethers.keccak256(ethers.toUtf8Bytes("hello world"));
    const nonExistentHash = ethers.keccak256(ethers.toUtf8Bytes("not found"));

    return { contract, owner, otherAccount, thirdAccount, testFileHash, nonExistentHash };
  }

  describe("Deployment", function () {
    it("Should deploy without errors", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(contract.target).to.be.a("string");
    });
  });

  describe("storeHash", function () {
    it("Should allow a user to store a new hash and emit an event", async function () {
      const { contract, owner, testFileHash } = await loadFixture(deployFixture);

      await expect(contract.storeHash(testFileHash))
        .to.emit(contract, "RecordStored")
        .withArgs(testFileHash, owner.address);
    });

    it("Should set the correct owner for the hash", async function () {
      const { contract, owner, testFileHash } = await loadFixture(deployFixture);
      await contract.storeHash(testFileHash);
      
      expect(await contract.getOwner(testFileHash)).to.equal(owner.address);
    });

    it("Should revert if the same hash is stored twice", async function () {
      const { contract, testFileHash } = await loadFixture(deployFixture);
      await contract.storeHash(testFileHash);

      await expect(contract.storeHash(testFileHash))
        .to.be.revertedWith("Error: Hash already recorded.");
    });
  });

  describe("addSignature", function () {
    it("Should allow another user to sign a stored hash", async function () {
      const { contract, owner, otherAccount, testFileHash } = await loadFixture(deployFixture);
      await contract.connect(owner).storeHash(testFileHash);

      // The signMessage method automatically prefixes the message with "\x19Ethereum Signed Message:\n32"
      const signature = await otherAccount.signMessage(ethers.getBytes(testFileHash));

      await expect(contract.connect(otherAccount).addSignature(testFileHash, signature))
        .to.emit(contract, "SignatureAdded")
        .withArgs(testFileHash, otherAccount.address);
      
      expect(await contract.hasSigned(testFileHash, otherAccount.address)).to.be.true;
    });

    it("Should revert if trying to sign a non-existent hash", async function () {
      const { contract, otherAccount, nonExistentHash } = await loadFixture(deployFixture);
      
      const signature = await otherAccount.signMessage(ethers.getBytes(nonExistentHash));

      await expect(contract.connect(otherAccount).addSignature(nonExistentHash, signature))
        .to.be.revertedWith("Error: Hash not yet recorded.");
    });

    it("Should not validate a signature for the wrong hash", async function () {
        const { contract, owner, otherAccount, testFileHash, nonExistentHash } = await loadFixture(deployFixture);
        await contract.connect(owner).storeHash(testFileHash);

        // Create a signature for a *different* hash
        const signatureForWrongHash = await otherAccount.signMessage(ethers.getBytes(nonExistentHash));

        // Expect the event to be emitted, but check that the signer is NOT the account that signed the wrong hash
        await expect(contract.addSignature(testFileHash, signatureForWrongHash))
          .to.emit(contract, "SignatureAdded")
          .withArgs(testFileHash, (signer: string) => {
            expect(signer).to.not.equal(otherAccount.address);
            return true; // The withArgs predicate must return true
          });

        // Also assert that the signer mapping for the original account is false
        expect(await contract.hasSigned(testFileHash, otherAccount.address)).to.be.false;
    });

    it("Should revert if an address tries to sign the same hash twice", async function () {
      const { contract, owner, otherAccount, testFileHash } = await loadFixture(deployFixture);
      await contract.connect(owner).storeHash(testFileHash);

      const signature = await otherAccount.signMessage(ethers.getBytes(testFileHash));
      
      await contract.connect(otherAccount).addSignature(testFileHash, signature);

      // Try to sign again
      await expect(contract.connect(otherAccount).addSignature(testFileHash, signature))
        .to.be.revertedWith("Error: Address has already signed.");
    });
  });
});
