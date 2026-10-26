const API_URL = 'http://localhost:3010/api/v1/donations';

function parseDonationData(block) {
    try {
        return JSON.parse(block.data);
    } catch {
        return null;
    }
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
    amount.textContent = `${donation.amount ?? '—'} ${donation.currency || ''}`.trim();

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

async function loadDonations(container, limit) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`The donation service returned ${response.status}.`);

        const blocks = await response.json();
        if (!Array.isArray(blocks)) throw new Error('The donation service returned an unexpected response.');

        const records = blocks
            .map(block => ({ block, donation: parseDonationData(block) }))
            .filter(item => item.donation?.id)
            .sort((a, b) => Number(b.block.timestamp) - Number(a.block.timestamp))
            .slice(0, limit);

        container.replaceChildren();
        if (records.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-state';
            empty.textContent = 'No donation records yet. New sample entries will appear here.';
            container.append(empty);
            return;
        }

        records.forEach(({ block }) => {
            const card = createDonationCard(block);
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
