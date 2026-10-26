document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    const addDetail = (container, label, value, className = '') => {
        const row = document.createElement('div');
        row.className = 'record-detail';
        const heading = document.createElement('span');
        heading.className = 'record-detail-label';
        heading.textContent = label;
        const detail = document.createElement('span');
        detail.className = className;
        detail.textContent = value;
        row.append(heading, detail);
        container.append(row);
    };

    const query = new URLSearchParams(window.location.search).get('query');
    if (query) input.value = query;

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const searchTerm = input.value.trim().toLowerCase();
        results.replaceChildren();

        const loading = document.createElement('p');
        loading.className = 'loading-message';
        loading.textContent = 'Searching the donation ledger…';
        results.append(loading);

        try {
            const response = await fetch('http://localhost:3010/api/v1/donations');
            if (!response.ok) throw new Error(`The donation service returned ${response.status}.`);

            const blocks = await response.json();
            if (!Array.isArray(blocks)) throw new Error('The donation service returned an unexpected response.');

            const block = blocks.find(item => {
                if (String(item.hash).toLowerCase() === searchTerm) return true;
                try {
                    return JSON.parse(item.data).id?.toLowerCase() === searchTerm;
                } catch {
                    return false;
                }
            });

            if (!block) throw new Error('No record matched that donation ID or block hash.');
            const donation = JSON.parse(block.data);

            const card = document.createElement('article');
            card.className = 'record-card';
            const heading = document.createElement('p');
            heading.className = 'eyebrow';
            heading.textContent = 'Donation record';
            const title = document.createElement('h2');
            title.textContent = donation.project || 'Community relief';
            const details = document.createElement('div');
            details.className = 'record-details';

            const timestamp = Number(block.timestamp);
            const date = Number.isFinite(timestamp)
                ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(timestamp)
                : 'Date unavailable';

            addDetail(details, 'Donation ID', donation.id, 'record-value-mono');
            addDetail(details, 'Block hash', block.hash, 'record-value-mono');
            addDetail(details, 'Previous block', block.lastHash, 'record-value-mono');
            addDetail(details, 'Added', date);
            addDetail(details, 'Donor', donation.donor || 'Anonymous');
            addDetail(details, 'Amount', `${donation.amount ?? '—'} ${donation.currency || ''}`.trim());
            if (donation.message) addDetail(details, 'Message', donation.message);

            const note = document.createElement('p');
            note.className = 'record-note';
            note.textContent = 'This record is part of a local demonstration ledger; it is not a payment receipt.';
            card.append(heading, title, details, note);
            results.replaceChildren(card);
        } catch (error) {
            const message = document.createElement('p');
            message.className = 'empty-state error-state';
            message.textContent = error.message.includes('No record')
                ? error.message
                : `${error.message} Make sure the API server is running on port 3010.`;
            results.replaceChildren(message);
        }
    });
});
