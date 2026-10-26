# Public Relief

A charity website demo exploring how a hash-linked donation ledger could make donations more transparent.

> “Your donation’s impact made visible to everyone.”

Visitors can browse recent donations, search for a donation, and submit a donation record for a selected project. The site is a prototype for a fictional charity.

## Requirements

- Node.js 18 or newer
- npm
- Python 3 (to serve the website locally), or another static file server

## Run locally

1. Clone or download this repository, then open a terminal in the project directory.
2. Install the Node.js dependencies:

   ```sh
   npm install
   ```

3. Start the API server:

   ```sh
   npm run dev
   ```

   The API listens on `http://localhost:3010`. You can use `npm start` instead to start it without nodemon.

4. In a second terminal, from the project directory, start a static server for the website:

   ```sh
   python3 -m http.server 5500
   ```

5. Open [http://localhost:5500](http://localhost:5500) in your browser. Keep both servers running while using the site.

The frontend sends API requests to `http://localhost:3010`. The API port is currently set in `src/server.mjs`; the `PORT` value in `config/config.env` does not configure it.

## API

The API is versioned under `/api/v1`:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/donations` | Return the donation ledger |
| `GET` | `/api/v1/donation/:id` | Find a donation by the donation ID stored in its data |
| `POST` | `/api/v1/donation` | Add a donation to the ledger |

Example request body for `POST /api/v1/donation`:

```json
{
  "id": "unique-donation-id",
  "donor": "Example Donor",
  "email": "donor@example.com",
  "amount": 25,
  "currency": "EUR",
  "project": "Ukraine",
  "date": "2026-10-26",
  "message": "Optional message",
  "timestamp": 1793016000000
}
```

The `id`, `donor`, `email`, `amount`, `currency`, and `project` fields are required. `date`, `message`, and `timestamp` are optional.

## Data and limitations

- Donation records are stored in `src/db/donations.json`; new records are written to this file. Back it up before resetting or replacing the data.
- The ledger uses hashes and proof-of-work-style mining as a demonstration. It is **not** a real blockchain and does not process payments or transfer funds.
- This is a local prototype, not a production-ready donation service. Donation information, including donor email addresses, is stored in plain text and exposed by the API. Do not use real personal or payment information.
- The website’s donation search accepts either a donation ID or a block hash. The single-donation API endpoint looks up records by donation ID.

## Tests

Run the test suite with:

```sh
npm test
```

## Credits

The project concept and website content were created as a prototype for a fictional charity. Images were downloaded from Freepik.
