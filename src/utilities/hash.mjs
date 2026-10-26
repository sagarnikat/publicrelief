import crypto from 'crypto';

export const createHash = (...args) => {
    const hash = crypto.createHash('sha256');
    hash.update(args.join(''));
    return hash.digest('hex');
};

export const verifyHash = (hash, difficulty) => {
    const prefix = '0'.repeat(difficulty);
    return hash.startsWith(prefix);
};

export const mineHash = (timestamp, lastHash, data, difficulty) => {
    let nonce = 0;
    let hash = '';
    
    do {
        nonce++;
        hash = createHash(timestamp, lastHash, data, nonce);
    } while (!verifyHash(hash, difficulty));
    
    return { hash, nonce };
};
