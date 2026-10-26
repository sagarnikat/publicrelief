document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        toggle.classList.toggle('active', isOpen);
        menu.classList.toggle('active', isOpen);
    });

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMenu();
            toggle.focus();
        }
    });
});
