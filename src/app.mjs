import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import donationRouter from './routes/donation-routes.mjs';
import errorHandler from './middleware/errorHandler.mjs';
import AppError from './models/AppError.mjs';

dotenv.config({ path: './config/config.env' });

connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/donation', donationRouter);

app.all(/(.*)/, (req, res, next) => {
	next(
		new AppError(
			`Cannot find resource ${req.originalUrl}`,
			404
		)
	);
});

app.use(errorHandler);

export { app };
