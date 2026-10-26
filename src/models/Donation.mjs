import { createHash } from '../utilities/hash.mjs';
import { GENESIS_BLOCK, INITIAL_DIFFICULTY } from './genesis.mjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logError, logInfo } from '../utilities/logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Donation {
    constructor({timestamp, hash, lastHash, data, nonce, difficulty = INITIAL_DIFFICULTY}) {
        this.timestamp = timestamp;
        this.hash = hash;
        this.lastHash = lastHash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new Donation({
            timestamp: Date.now(),
            hash: '#1',
            lastHash: '######',
            data: '[]',
            nonce: 0,
            difficulty: INITIAL_DIFFICULTY
        });
    }

    static async mineBlock({previousDonation, data}) {
        const timestamp = Date.now();
        const lastHash = previousDonation.hash;
        let nonce = 0;
        let hash = '';
        
        do {
            nonce++;
            hash = createHash(timestamp, lastHash, data, nonce);
        } while (!hash.startsWith('0'.repeat(INITIAL_DIFFICULTY)));
        
        return new this({
            timestamp,
            lastHash,
            hash,
            data,
            nonce,
            difficulty: INITIAL_DIFFICULTY
        });
    }

    static async validateBlock(block) {
        const { timestamp, lastHash, hash, data, nonce, difficulty } = block;
        
        const calculatedHash = createHash(timestamp, lastHash, data, nonce);
        if (calculatedHash !== hash) {
            throw new Error('Invalid hash');
        }
        
        if (!hash.startsWith('0'.repeat(difficulty))) {
            throw new Error('Hash does not meet difficulty requirement');
        }
        
        return true;
    }

    static async getAllDonations() {
        try {
            const data = await fs.readFile(path.join(__dirname, '../db/donations.json'), 'utf8');
            const donations = JSON.parse(data);
            
            for (let i = 1; i < donations.length; i++) {
                const { timestamp, data, hash, lastHash, nonce, difficulty } = donations[i];
                const prevHash = donations[i - 1].hash;

                if (lastHash !== prevHash) {
                    throw new Error('Invalid chain: lastHash does not match previous block hash');
                }

                const validHash = createHash(timestamp, lastHash, data, nonce);
                if (hash !== validHash) {
                    throw new Error('Invalid chain: hash does not match calculated hash');
                }
            }
            
            return donations;
        } catch (error) {
            await logError('Error reading donations: ' + error.message);
            return [];
        }
    }

    static async createDonation(donationData) {
        try {
            const donations = await this.getAllDonations();
            const previousDonation = donations[donations.length - 1] || this.genesis();
            
            const formattedData = {
                id: donationData.id,
                donor: donationData.donor,
                email: donationData.email,
                amount: donationData.amount,
                date: donationData.date,
                currency: donationData.currency,
                project: donationData.project,
                message: donationData.message,
                timestamp: donationData.timestamp
            };

            const newDonation = await this.mineBlock({
                previousDonation,
                data: JSON.stringify(formattedData)
            });

            await this.validateBlock(newDonation);

            donations.push(newDonation);
            await fs.writeFile(
                path.join(__dirname, '../db/donations.json'),
                JSON.stringify(donations, null, 2)
            );
            
            await logInfo(`New donation created with ID: ${formattedData.id}`);
            return newDonation;
        } catch (error) {
            await logError('Error creating donation: ' + error.message);
            throw error;
        }
    }
}