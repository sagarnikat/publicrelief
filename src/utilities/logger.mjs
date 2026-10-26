import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logError = async (message) => {
    try {
        const timestamp = new Date().toString();
        const logMessage = `[ERROR] ${timestamp}: ${message}\n`;
        const logPath = path.join(__dirname, '../log/app.log');
        
        await fs.mkdir(path.dirname(logPath), { recursive: true });
        await fs.appendFile(logPath, logMessage);
    } catch (error) {
        console.error('Could not log error:', error);
    }
};

export const logInfo = async (message) => {
    try {
        const timestamp = new Date().toString();
        const logMessage = `[INFO] ${timestamp}: ${message}\n`;
        const logPath = path.join(__dirname, '../log/app.log');
        
        await fs.mkdir(path.dirname(logPath), { recursive: true });
        await fs.appendFile(logPath, logMessage);
    } catch (error) {
        console.error('Could not log info:', error);
    }
}; 