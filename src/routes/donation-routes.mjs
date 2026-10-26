import express from 'express';
import {
	createDonation,
	listAllDonations,
	getDonationById,
} from '../controllers/donation-controller.mjs';

const donationRouter = express.Router();

donationRouter
	.route('/')
	.get(listAllDonations)
	.post(createDonation);

donationRouter
	.route('/:id')
	.get(getDonationById);

export default donationRouter;
