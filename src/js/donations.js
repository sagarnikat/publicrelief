const API_URL = 'http://localhost:3010/api/v1/donations';

function parseDonationData(block) {
    try {
        return JSON.parse(block.data);
    } catch {
        return null;
    }
}

function formatDonationAmount(donation) {
    const amount = Number(donation.amount);
    if (!Number.isFinite(amount)) return 'Amount unavailable';

    if (donation.currency === 'INR' || donation.currency === 'USD') {
        const locale = donation.currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: donation.currency,
            minimumFractionDigits: donation.currency === 'INR' ? 0 : 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    return `${amount} ${donation.currency || ''}`.trim();
}

function createDonationCard(block) {
    const donation = parseDonationData(block);
    if (!donation || !donation.id) return null;

    const card = document.createElement('article');
    card.className = 'donation-card';

    const top = document.createElement('div');
    top.className = 'donation-card-top';
    const project = document.createElement('span');
    project.className = 'donation-tag';
    project.textContent = donation.project || 'Community relief';
    const date = document.createElement('time');
    date.className = 'donation-date';
    const timestamp = Number(block.timestamp);
    date.dateTime = Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : '';
    date.textContent = Number.isFinite(timestamp)
        ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(timestamp)
        : 'Date unavailable';
    top.append(project, date);

    const amount = document.createElement('p');
    amount.className = 'donation-amount';
    amount.textContent = formatDonationAmount(donation);

    const donor = document.createElement('p');
    donor.className = 'donation-donor';
    donor.textContent = `From ${donation.donor || 'Anonymous'}`;

    const hash = document.createElement('p');
    hash.className = 'donation-hash';
    hash.textContent = `Block ${block.hash || 'unavailable'}`;

    const link = document.createElement('a');
    link.className = 'text-link donation-link';
    link.href = `./yourdonation.html?query=${encodeURIComponent(donation.id)}`;
    link.textContent = 'View record →';

    card.append(top, amount, donor, hash, link);
    return card;
}

function createBlockCard(block, blockNumber) {
    const donation = parseDonationData(block);
    if (!donation || !donation.id) return null;

    const card = document.createElement('article');
    card.className = 'chain-block';

    const header = document.createElement('header');
    header.className = 'chain-block-header';
    const blockLabel = document.createElement('span');
    blockLabel.className = 'chain-block-number';
    blockLabel.textContent = `BLOCK ${String(blockNumber).padStart(3, '0')}`;
    const timestamp = Number(block.timestamp);
    const date = document.createElement('time');
    date.className = 'donation-date';
    date.dateTime = Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : '';
    date.textContent = Number.isFinite(timestamp)
        ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp)
        : 'Date unavailable';
    header.append(blockLabel, date);

    const transaction = document.createElement('div');
    transaction.className = 'chain-transaction';
    const transactionLabel = document.createElement('p');
    transactionLabel.className = 'chain-transaction-label';
    transactionLabel.textContent = `TRANSACTION · ${donation.id}`;
    const project = document.createElement('h3');
    project.className = 'chain-project';
    project.textContent = donation.project || 'Community relief';
    const amount = document.createElement('p');
    amount.className = 'chain-amount';
    amount.textContent = formatDonationAmount(donation);
    const donor = document.createElement('p');
    donor.className = 'chain-donor';
    donor.textContent = `Contributed by ${donation.donor || 'Anonymous'}`;
    const recordLink = document.createElement('a');
    recordLink.className = 'text-link';
    recordLink.href = `./yourdonation.html?query=${encodeURIComponent(donation.id)}`;
    recordLink.textContent = 'View transaction details →';
    transaction.append(transactionLabel, project, amount, donor, recordLink);

    const metadata = document.createElement('dl');
    metadata.className = 'chain-metadata';
    const addHash = (label, value, isCurrentHash = false) => {
        const row = document.createElement('div');
        row.className = 'chain-metadata-row';
        const heading = document.createElement('dt');
        heading.textContent = label;
        const detail = document.createElement('dd');
        if (isCurrentHash && value) {
            const link = document.createElement('a');
            link.href = `./yourdonation.html?query=${encodeURIComponent(value)}`;
            link.textContent = value;
            detail.append(link);
        } else {
            detail.textContent = value || 'Unavailable';
        }
        row.append(heading, detail);
        metadata.append(row);
    };
    addHash('Previous block hash', block.lastHash);
    addHash('Block hash', block.hash, true);

    card.append(header, transaction, metadata);
    return card;
}

async function loadDonations(container, limit) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`The donation service returned ${response.status}.`);

        const blocks = await response.json();
        if (!Array.isArray(blocks)) throw new Error('The donation service returned an unexpected response.');

        const isChainView = container.id === 'donations-list';
        const records = blocks
            .map((block, index) => ({ block, index, donation: parseDonationData(block) }))
            .filter(item => item.donation?.id);

        container.replaceChildren();
        if (records.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-state';
            empty.textContent = 'No sample transactions yet. New entries will appear here.';
            container.append(empty);
            return;
        }

        if (isChainView) {
            const summary = document.getElementById('ledger-summary');
            if (summary) {
                summary.textContent = `${records.length} sample block${records.length === 1 ? '' : 's'} · ${records.length} transaction${records.length === 1 ? '' : 's'}`;
            }
        } else {
            records.sort((a, b) => Number(b.block.timestamp) - Number(a.block.timestamp));
            records.splice(limit);
        }

        records.forEach(({ block, index }) => {
            const card = isChainView
                ? createBlockCard(block, index)
                : createDonationCard(block);
            if (card) container.append(card);
        });
    } catch (error) {
        const message = document.createElement('p');
        message.className = 'empty-state error-state';
        message.textContent = `${error.message} Make sure the API server is running on port 3010.`;
        container.replaceChildren(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fullList = document.getElementById('donations-list');
    if (fullList) loadDonations(fullList, Number.POSITIVE_INFINITY);

    const latestList = document.getElementById('latest-donations');
    if (latestList) loadDonations(latestList, 3);
});
