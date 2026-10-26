document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('donation-form');
    const status = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const project = document.getElementById('project');
    const requestedProject = new URLSearchParams(window.location.search).get('project');

    if (requestedProject && [...project.options].some(option => option.value === requestedProject)) {
        project.value = requestedProject;
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        status.className = 'form-status';
        status.textContent = 'Adding your sample record…';
        submitButton.disabled = true;

        const donation = {
            id: crypto.randomUUID().replaceAll('-', ''),
            donor: document.getElementById('donor').value.trim(),
            email: document.getElementById('email').value.trim(),
            amount: Number(document.getElementById('amount').value),
            date: new Date().toISOString().slice(0, 10),
            currency: document.getElementById('currency').value,
            project: project.value,
            message: document.getElementById('message').value.trim(),
            timestamp: Date.now()
        };

        try {
            const response = await fetch('http://localhost:3010/api/v1/donation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donation)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `The donation service returned ${response.status}.`);
            }

            status.className = 'form-status form-status-success';
            status.textContent = `Sample record added. Your donation ID is ${donation.id}.`;
            form.reset();
            project.value = 'Sudan war';
        } catch (error) {
            status.className = 'form-status form-status-error';
            status.textContent = `${error.message} Make sure the API server is running on port 3010.`;
        } finally {
            submitButton.disabled = false;
        }
    });
});
