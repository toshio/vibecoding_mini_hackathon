// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title FileAuthenticityVerification
 * @dev This contract allows users to record file hashes to prove their authenticity
 * and allows third parties to add their signatures as attestations.
 */
contract FileAuthenticityVerification {

    // Mapping from a data hash to the address of the original owner/recorder.
    mapping(bytes32 => address) public records;

    // Mapping from a data hash to a nested mapping of signer addresses to a boolean.
    // This tracks which addresses have attested to a specific hash.
    mapping(bytes32 => mapping(address => bool)) public signers;

    /**
     * @dev Emitted when a new file hash is successfully recorded.
     * @param dataHash The hash of the file that was recorded.
     * @param owner The address of the account that recorded the hash.
     */
    event RecordStored(bytes32 indexed dataHash, address indexed owner);

    /**
     * @dev Emitted when a new signature/attestation is added to an existing file hash.
     * @param dataHash The hash of the file being attested to.
     * @param signer The address of the account that provided the signature.
     */
    event SignatureAdded(bytes32 indexed dataHash, address indexed signer);

    /**
     * @dev Records a new file hash on the blockchain, linking it to the sender.
     * Throws if the hash has already been recorded.
     * @param dataHash The bytes32 hash of the file to record.
     */
    function storeHash(bytes32 dataHash) public {
        require(records[dataHash] == address(0), "Error: Hash already recorded.");
        records[dataHash] = msg.sender;
        emit RecordStored(dataHash, msg.sender);
    }

    /**
     * @dev Adds a signature to an already recorded file hash.
     * The signature is used to verify that the signer approves/attests to the data hash.
     * @param dataHash The bytes32 hash of the file to sign/attest to.
     * @param signature The cryptographic signature from the signer's wallet.
     */
    function addSignature(bytes32 dataHash, bytes memory signature) public {
        require(records[dataHash] != address(0), "Error: Hash not yet recorded.");

        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));
        address signerAddress = recoverSigner(messageHash, signature);

        require(signerAddress != address(0), "Error: Invalid signature.");
        require(!signers[dataHash][signerAddress], "Error: Address has already signed.");

        signers[dataHash][signerAddress] = true;
        emit SignatureAdded(dataHash, signerAddress);
    }

    /**
     * @dev Gets the owner of a given file hash.
     * @param dataHash The hash to query.
     * @return The address of the owner.
     */
    function getOwner(bytes32 dataHash) public view returns (address) {
        return records[dataHash];
    }

    /**
     * @dev Checks if a specific address has signed/attested to a file hash.
     * @param dataHash The hash to query.
     * @param signer The address of the potential signer.
     * @return true if the address has signed, false otherwise.
     */
    function hasSigned(bytes32 dataHash, address signer) public view returns (bool) {
        return signers[dataHash][signer];
    }
    
    /**
     * @dev Recovers the signer's address from a message hash and a signature.
     * @param _hash The hash that was signed.
     * @param _signature The signature to verify.
     * @return The address of the signer.
     */
    function recoverSigner(bytes32 _hash, bytes memory _signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_hash, v, r, s);
    }

    /**
     * @dev Splits a signature into its r, s, and v components.
     * @param sig The signature to split.
     */
    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
