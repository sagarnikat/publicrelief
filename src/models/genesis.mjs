export const INITIAL_DIFFICULTY = 4;
export const MINE_RATE = 1000;
export const MINING_REWARD = 50;

export const GENESIS_BLOCK = {
    timestamp: Date.now(),
    data: [],
    hash: '#1',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    lastHash: '#######'
};