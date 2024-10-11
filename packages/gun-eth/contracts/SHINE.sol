// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SHINE {
    struct DataRecord {
        bytes32 contentHash;
        uint256 timestamp;
        address updater;
    }

    mapping(bytes => DataRecord) public nodeData;

    event DataUpdated(
        bytes indexed nodeId,
        bytes32 contentHash,
        address updater
    );

    function updateData(bytes memory nodeId, bytes32 contentHash) public {
        nodeData[nodeId] = DataRecord(contentHash, block.timestamp, msg.sender);
        emit DataUpdated(nodeId, contentHash, msg.sender);
    }

    function verifyData(
        bytes memory nodeId,
        bytes32 contentHash
    ) public view returns (bool, uint256, address) {
        DataRecord memory record = nodeData[nodeId];
        bool isValid = record.contentHash == contentHash;
        return (isValid, record.timestamp, record.updater);
    }

    function getLatestRecord(
        bytes memory nodeId
    ) public view returns (bytes32, uint256, address) {
        DataRecord memory record = nodeData[nodeId];
        return (record.contentHash, record.timestamp, record.updater);
    }

    function batchUpdateData(
        bytes[] memory nodeIds,
        bytes32[] memory contentHashes
    ) public {
        require(
            nodeIds.length == contentHashes.length,
            "Arrays length mismatch"
        );
        for (uint i = 0; i < nodeIds.length; i++) {
            updateData(nodeIds[i], contentHashes[i]);
        }
    }
}
