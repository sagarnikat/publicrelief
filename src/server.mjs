import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import Donation from './models/Donation.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get('/donation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'donation.html'));
});

const API_BASE = '/api/v1';

app.get(`${API_BASE}/donations`, async (req, res) => {
    try {
        const donations = await Donation.getAllDonations();
        res.json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get(`${API_BASE}/donation/:id`, async (req, res) => {
    try {
        const donations = await Donation.getAllDonations();
        const donation = donations.find(d => {
            try {
                const data = JSON.parse(d.data);
                return data.id === req.params.id;
            } catch (e) {
                console.error('Error parsing donation data:', e);
                return false;
            }
        });
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.json(donation);
    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post(`${API_BASE}/donation`, async (req, res) => {
    try {
        const requiredFields = ['id', 'donor', 'email', 'amount', 'currency', 'project'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        const newDonation = await Donation.createDonation(req.body);
        res.status(201).json(newDonation);
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server körs på port ${port}`);
});
