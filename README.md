# Public Relief

Public Relief is a fictional charity website prototype for exploring how a donation ledger can make sample contributions easier to follow. It includes Indian relief-fund examples, INR and USD display, sample donation records, and a local hash-linked ledger.

> **Demo only:** the site does not accept payments, transfer funds, or represent a real charity. All included donors and contributions are fictional.

## Features

- Browse three sample relief funds:
  - **Assam Flood Relief Fund** — emergency support after floods.
  - **Food & Essentials Fund** — meals, hygiene kits, and daily essentials.
  - **Girls’ Education Fund** — school supplies and learning resources.
- Add a sample donation record in **INR (Indian Rupees, ₹)** or **USD (US Dollars, $)**. Amounts are formatted for their selected currency.
- Browse the donation ledger as individual blocks. Each block contains one sample transaction, its hash, and the previous block’s hash.
- Search for a transaction using its donation ID or block hash.

## Requirements

- Node.js 18 or newer
- npm
- Python 3, or another static file server

## Run locally

1. Install dependencies from the repository root:

   ```sh
   npm install
   ```

2. Start the API server in one terminal:

   ```sh
   npm run dev
   ```

   The API listens at `http://localhost:3010`. Alternatively, run `npm start` to start it without nodemon.

3. In a second terminal, serve the website from the repository root:

   ```sh
   python3 -m http.server 5500
   ```

4. Open [http://localhost:5500](http://localhost:5500). Keep both servers running while using the site.

The website calls the API at `http://localhost:3010`. The port is currently hard-coded in `src/server.mjs`; setting `PORT` in `config/config.env` does not change it.

## Website pages

| Page | Path | Purpose |
| --- | --- | --- |
| Home | `index.html` | Browse featured funds and recent sample donations |
| Our focus | `src/pages/projects.html` | Read about the three fictional relief funds |
| Make a donation | `src/pages/donation.html` | Add a sample donation record |
| Donation ledger | `src/pages/donations.html` | View transactions in hash-linked blocks |
| Find a donation | `src/pages/yourdonation.html` | Search by donation ID or block hash |
| About | `src/pages/about.html` | Learn about the prototype |

## Sample ledger data

The initial data is in `src/db/donations.json`. It contains a genesis block followed by five fictional donation blocks:

| Donation ID | Donor | Fund | Amount | Date |
| --- | --- | --- | ---: | --- |
| `demo-india-0001` | Aarav Sharma | Assam Flood Relief | ₹1,500 | 2026-10-22 |
| `demo-india-0002` | Meera Nair | Food & Essentials | ₹2,500 | 2026-10-23 |
| `demo-india-0003` | Riya Patel | Girls’ Education | ₹1,000 | 2026-10-24 |
| `demo-india-0004` | Kabir Rao | Assam Flood Relief | $50 | 2026-10-25 |
| `demo-india-0005` | Aditi Menon | Girls’ Education | ₹750 | 2026-10-26 |

Use these IDs or the block hashes shown on the ledger page to try the donation search.

## How the demo ledger works

- Each non-genesis block stores one donation as JSON text, along with a timestamp, nonce, difficulty, its own SHA-256 hash, and the previous block’s hash.
- When a donation is added, the server mines a hash with the configured leading-zero prefix and links the new block to the previous block.
- The browser displays each donation as a separate block. The current block hash links to its search result; the previous hash shows how blocks are connected.
- The genesis block starts the chain and does not contain a donation.
- The data is local and file-based. This is **not** a public, distributed, or independently audited blockchain. Hashes do not prove a payment happened or that funds reached a recipient.

## API

All endpoints are served from `http://localhost:3010` under `/api/v1`:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/donations` | Return the ledger as an array of blocks, including the genesis block |
| `GET` | `/api/v1/donation/:id` | Find and return the block containing the specified donation ID |
| `POST` | `/api/v1/donation` | Create and append a donation block |

Example request body for `POST /api/v1/donation`:

```json
{
  "id": "unique-donation-id",
  "donor": "Example Donor",
  "email": "donor@example.test",
  "amount": 1500,
  "currency": "INR",
  "project": "Assam Flood Relief",
  "date": "2026-10-27",
  "message": "Optional message",
  "timestamp": 1793097000000
}
```

The API requires `id`, `donor`, `email`, `amount`, `currency`, and `project`. `date`, `message`, and `timestamp` are optional. The website form offers INR and USD and the three sample funds listed above. The API itself does not restrict values to those form options.

## Data, privacy, and limitations

- New records are written to `src/db/donations.json`. Back up this file before replacing or editing the sample ledger.
- Donor names, email addresses, contribution amounts, and messages are stored in plain text and exposed by the demo API. Use fictional information only; never submit real personal, financial, or payment details.
- A submitted donation is only a sample ledger record. No payment is taken and no money is collected or distributed.
- The prototype is not production-ready and does not verify charities, partners, or fund use.
- Donation search in the website accepts either a donation ID or a block hash. The single-donation API endpoint searches by donation ID.

## Tests

Run the test suite with:

```sh
npm test -- --run
```

## Credits

The project concept and website content were created as a prototype for a fictional charity. Images were downloaded from Freepik.
