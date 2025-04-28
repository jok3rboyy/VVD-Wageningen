/**
 * main.js
 * 
 * Algemene JavaScript functionaliteit voor de VVD Wageningen website.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionaliteit (bestaande code)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    const body = document.body;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('nav-open');
             // Belangrijk: sluit dropdowns als hoofdmenu sluit
            if (!body.classList.contains('nav-open')) {
                closeAllMobileDropdowns();
            }
        });
    }

    // --- NIEUW: Mobiele Dropdown Functionaliteit ---
    const dropdownToggles = document.querySelectorAll('.nav-links .dropdown > .nav-link');

    // Functie om alle mobiele dropdowns te sluiten
    function closeAllMobileDropdowns(exceptThisOne = null) {
        document.querySelectorAll('.nav-links .dropdown.open').forEach(openDropdown => {
            if (openDropdown !== exceptThisOne) {
                openDropdown.classList.remove('open');
                const link = openDropdown.querySelector('.nav-link');
                if(link) link.setAttribute('aria-expanded', 'false');
            }
        });
    }

    dropdownToggles.forEach(toggle => {
        // Voeg aria-expanded toe indien nog niet aanwezig
        if (!toggle.hasAttribute('aria-expanded')) {
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', (event) => {
            // Alleen activeren als het mobiele menu zichtbaar is
            // Controleer een stijl die specifiek is voor het mobiele menu,
            // bijv. de display van de nav-toggle of de position van nav-links
            const isMobileView = window.getComputedStyle(navToggle).display === 'block';

            if (isMobileView) {
                event.preventDefault(); // Voorkom navigatie door de hoofdlink op mobiel

                const parentLi = toggle.closest('.dropdown'); // Vind de parent <li>
                const currentlyExpanded = parentLi.classList.contains('open');

                // Sluit eerst alle andere dropdowns
                closeAllMobileDropdowns(parentLi);

                // Toggle de huidige dropdown
                parentLi.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !currentlyExpanded);
            }
            // Op desktop: laat de link normaal navigeren (geen preventDefault)
        });
    });

    // Optioneel: sluit dropdowns bij klikken buiten het menu op mobiel
    document.addEventListener('click', (event) => {
        const isMobileView = window.getComputedStyle(navToggle).display === 'block';
        if (isMobileView && body.classList.contains('nav-open')) {
            const target = event.target;
            // Check if the click is outside the nav menu entirely
            if (!navMenu.contains(target) && !navToggle.contains(target)) {
                 body.classList.remove('nav-open');
                 navToggle.setAttribute('aria-expanded', 'false');
                 closeAllMobileDropdowns();
            }
        }
    });

});

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                // For now, we'll just show a success message
                const formContainer = contactForm.parentElement;
                formContainer.innerHTML = '<div class="success-message"><h3>Bedankt voor uw bericht!</h3><p>We nemen zo spoedig mogelijk contact met u op.</p></div>';
            }
        });
    }

    // Add Netlify Identity widget to all pages
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
            if (!user) {
                window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                });
            }
        });
    }

