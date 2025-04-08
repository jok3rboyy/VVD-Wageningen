// js/kandidaten-lijst.js - Script om de kandidatenlijst te laden op bijv. over-ons.html

document.addEventListener('DOMContentLoaded', function() {

    // Zoek de container waar de kandidatenkaarten moeten komen
    // Zorg dat dit ID overeenkomt met het ID in je HTML (bv. over-ons.html)
    const kandidatenContainer = document.getElementById('kandidaten-container');

    // Stop de uitvoering als de container niet op deze pagina wordt gevonden
    if (!kandidatenContainer) {
        // console.log("Container #kandidaten-container niet gevonden op deze pagina.");
        return;
    }

    /**
     * Helper functie om een klikbare social media link met icoon te maken.
     * Vereist Font Awesome (of een ander icoon-systeem) correct geladen in de HTML.
     * @param {string|null} url - De URL voor de link (bv. email, linkedin URL)
     * @param {string} iconClass - De Font Awesome class (bv. 'fab fa-linkedin')
     * @param {string} label - Beschrijvend label (voor title en screenreaders)
     * @returns {string} - De HTML string voor de link, of een lege string als URL leeg is.
     */
    function createSocialLink(url, iconClass, label) {
        if (!url) return ''; // Geen URL, geen link

        let fullUrl = url.trim();
        let isEmail = false;

        // Automatisch 'mailto:' toevoegen voor e-mailadressen
        if (fullUrl.includes('@') && !fullUrl.startsWith('mailto:')) {
            fullUrl = `mailto:${fullUrl}`;
            isEmail = true;
        // Automatisch 'https://' toevoegen als er geen protocol is (behalve bij mailto:)
        } else if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://') && !fullUrl.startsWith('mailto:')) {
            fullUrl = `https://${fullUrl}`;
        }

        // Genereer de HTML voor de link
        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" title="${label || (isEmail ? 'Stuur e-mail' : 'Bezoek website')}" class="social-link">
                  <i class="${iconClass}"></i>
                  <span class="sr-only">${label}</span> <!-- Tekst voor screenreaders -->
                </a>`;
    }

    // Haal de kandidatenlijst op van het gegenereerde JSON-bestand
    fetch('/genereerd/data/kandidaten-lijst.json') // Controleer of dit pad correct is
        .then(response => {
            // Controleer of het ophalen van het bestand gelukt is
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Zet de response body om naar een JavaScript object/array
            return response.json();
        })
        .then(kandidaten => {
            // Leeg de container (verwijder de "laden..." melding)
            kandidatenContainer.innerHTML = '';

            // Toon een melding als de lijst leeg is
            if (!kandidaten || kandidaten.length === 0) {
                kandidatenContainer.innerHTML = '<p>Geen teamleden gevonden.</p>';
                return; // Stop verdere uitvoering
            }

            // Loop door elke kandidaat in de lijst
            kandidaten.forEach(kandidaat => {
                // Maak de HTML structuur voor één kandidaatkaart
                // Gebruik de classes uit je HTML-voorbeeld (bv. team-member)
                // ** BELANGRIJK: Voeg een link toe rond de afbeelding en basisinfo **
                const kandidaatHtml = `
                    <div class="team-member">
                        <a href="${kandidaat.path}" class="team-member-link" aria-label="Lees meer over ${kandidaat.naam}">
                            <img
                                src="${kandidaat.foto || '/images/default-kandidaat.png'}" <!-- Controleer fallback pad -->
                                alt="" <!-- Alt is leeg omdat de afbeelding deel uitmaakt van een link -->
                                class="team-photo"
                                loading="lazy"
                             >
                            <div class="team-info">
                                <h3>${kandidaat.naam || "Onbekende kandidaat"}</h3>
                                ${kandidaat.rol ? `<p class="team-role">${kandidaat.rol}</p>` : ''}
                                ${kandidaat.bio_kort ? `<p class="team-bio">${kandidaat.bio_kort}</p>` : ''}
                            </div>
                        </a>
                         <div class="kandidaat-socials"> <!-- Social links staan buiten de hoofdlink -->
                             ${createSocialLink(kandidaat.email, 'fas fa-envelope', 'E-mail')}
                             ${createSocialLink(kandidaat.linkedin, 'fab fa-linkedin', 'LinkedIn')}
                             ${createSocialLink(kandidaat.twitter, 'fab fa-twitter', 'Twitter/X')}
                             ${createSocialLink(kandidaat.instagram, 'fab fa-instagram', 'Instagram')}
                             ${createSocialLink(kandidaat.facebook, 'fab fa-facebook', 'Facebook')}
                             ${createSocialLink(kandidaat.website, 'fas fa-globe', 'Website')}
                        </div>
                    </div>
                `;
                // Voeg de HTML van deze kandidaat toe aan de container
                kandidatenContainer.innerHTML += kandidaatHtml;
            });
        })
        .catch(error => {
            // Vang eventuele fouten tijdens het fetch proces op
            console.error('Fout bij het laden van teamleden:', error);
            // Toon een foutmelding aan de gebruiker in de container
            if (kandidatenContainer) {
                kandidatenContainer.innerHTML = '<p class="foutmelding">Kon de lijst met teamleden niet laden. Probeer het later opnieuw.</p>';
            }
        });
}); // Einde DOMContentLoaded listener