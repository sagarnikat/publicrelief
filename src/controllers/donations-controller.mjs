import DonationRepository from '../repositories/donation-repository.mjs';
import { catchErrorAsync } from '../utilities/catchErrorAsync.mjs';

export const listAllDonations = catchErrorAsync(async (req, res) => {
	const donations = await new DonationRepository().listAll();
	res.status(200).json({ success: true, statusCode: 200, data: donations });
});

export const createDonation = catchErrorAsync(async (req, res) => {
	const donation = await new DonationRepository().add(req.body);
	res.status(201).json({ success: true, statusCode: 201, data: donation });
});

export const getDonationById = catchErrorAsync(async (req, res) => {
	const donation = await new DonationRepository().findById(req.params.id);
	res.status(200).json({ success: true, statusCode: 200, data: donation });
});