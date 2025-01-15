const crypto = require('crypto');

class ConsistentHashing {
    constructor(virtualNodes = 3) {
        this.ring = new Map(); // Stores hash -> node mapping
        this.virtualNodes = virtualNodes; // Number of virtual nodes per real node
        this.sortedHashes = []; // Sorted list of hash values
    }

    /**
     * Generates a consistent hash for a given key.
     * @param {string} key
     * @returns {number} A hash value.
     */
    hash(key) {
        return parseInt(crypto.createHash('md5').update(key).digest('hex').substr(0, 8), 16);
    }

    /**
     * Adds a node and its virtual nodes to the hash ring.
     * @param {string} node
     */
    addNode(node) {
        for (let i = 0; i < this.virtualNodes; i++) {
            const virtualNode = `${node}#${i}`;
            const hash = this.hash(virtualNode);
            this.ring.set(hash, node);
            this.sortedHashes.push(hash);
        }
        this.sortedHashes.sort((a, b) => a - b);
    }

    /**
     * Removes a node and its virtual nodes from the hash ring.
     * @param {string} node
     */
    removeNode(node) {
        for (let i = 0; i < this.virtualNodes; i++) {
            const virtualNode = `${node}#${i}`;
            const hash = this.hash(virtualNode);
            this.ring.delete(hash);
            const index = this.sortedHashes.indexOf(hash);
            if (index !== -1) this.sortedHashes.splice(index, 1);
        }
    }

    /**
     * Gets the node responsible for a given key.
     * @param {string} key
     * @returns {string} The node responsible for the key.
     */
    getNode(key) {
        const hash = this.hash(key);
        for (const h of this.sortedHashes) {
            if (hash <= h) return this.ring.get(h);
        }
        return this.ring.get(this.sortedHashes[0]); // Wrap around
    }

    /**
     * Distributes keys across nodes.
     * @param {string[]} keys
     * @returns {object} A mapping of nodes to their assigned keys.
     */
    distributeKeys(keys) {
        const distribution = {};
        for (const key of keys) {
            const node = this.getNode(key);
            if (!distribution[node]) distribution[node] = [];
            distribution[node].push(key);
        }
        return distribution;
    }
}

// Create a consistent hashing instance
const ch = new ConsistentHashing(3); // Use 3 virtual nodes per real node

// Nodes in the system
ch.addNode('NodeA');
ch.addNode('NodeB');
ch.addNode('NodeC');

// Keys to distribute
const keys = ['Key1', 'Key2', 'Key3', 'Key4', 'Key5', 'Key6', 'Key7', 'Key8', 'Key9'];

// Distribution before changes
console.log("Initial Key Distribution:");
let distribution = ch.distributeKeys(keys);
console.log(distribution);

// Add a new node
console.log("\nAdding NodeD...");
ch.addNode('NodeD');
console.log("Key Distribution After Adding NodeD:");
distribution = ch.distributeKeys(keys);
console.log(distribution);

// Remove a node
console.log("\nRemoving NodeB...");
ch.removeNode('NodeB');
console.log("Key Distribution After Removing NodeB:");
distribution = ch.distributeKeys(keys);
console.log(distribution);
