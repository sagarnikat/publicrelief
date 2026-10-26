import Donation from '../models/Donation.mjs';
import AppError from '../models/AppError.mjs';

export default class DonationRepository {
	async listAll() {
		const donations = await Donation.find();
		console.log('Amount of donations found:', donations.length);
		return donation;
	}

	async find(id) {
		const donation = await Donation.findById(id);

		if (!donation) {
			throw new AppError(
				`Can't find this donation with id: ${id}`,
				404
			);
		}
		return donation;
	}

	async create(donation) {
		const { id, donor, email, amount, date, currency, project, message, timestamp } =
			donation.body;
		try {
			const response = await Donation.create({
				id, donor, email, amount, date, currency, project, message, timestamp
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	}
	}
