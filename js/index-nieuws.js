document.addEventListener('DOMContentLoaded', function() {

    const nieuwsContainer = document.getElementById('laatste-nieuws-container');

    // Stop als de container niet op deze pagina bestaat
    if (!nieuwsContainer) {
        // console.log("Container #laatste-nieuws-container niet gevonden.");
        return;
    }

    // Optioneel: Functie om datum te formatteren (als je die wilt tonen)
    
    function formatteerDatum(isoDatum) {
        if (!isoDatum || isoDatum.startsWith('1970')) return '';
        try {
            const date = new Date(isoDatum);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('nl-NL', {
                day: 'numeric', month: 'short', year: 'numeric' // Korter formaat voor kaart?
            });
        } catch (e) { return ''; }
    }
    

    // Haal de nieuwsindex op
    fetch('/genereerd/data/nieuws-index.json') // Pad naar de JSON
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(alleNieuwsItems => {
            nieuwsContainer.innerHTML = ''; // Leeg de "laden..." melding

            if (!alleNieuwsItems || alleNieuwsItems.length === 0) {
                nieuwsContainer.innerHTML = '<p>Geen recent nieuws gevonden.</p>';
                return;
            }

            // Pak de eerste 3 items (JSON is al gesorteerd nieuw->oud)
            const laatsteDrie = alleNieuwsItems.slice(0, 3);

            // Maak HTML voor elke kaart
            laatsteDrie.forEach(item => {
                const labelText = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Nieuws';
                const cardText = item.title || 'Geen titel';
                const imageUrl = item.thumbnail || '/images/default-nieuws-placeholder.png';
                const formattedDate = formatteerDatum(item.date); // <-- hier!
            
                const cardHtml = `
                    <div class="card">
                      <a href="${item.path}" aria-label="Lees meer over ${item.title || 'dit nieuws'}">
                        <img src="${imageUrl}" alt="" loading="lazy" />
                      </a>
                      <div class="card-content">
                        <p class="label">${labelText}</p>
                         <p class="text">${cardText}</p>
                        <p class="datum">${formattedDate}</p>
                        <a class="btn btn-small" href="${item.path}">Lees meer</a>
                      </div>
                    </div>
                `;
            
                nieuwsContainer.innerHTML += cardHtml;
            });

            // Als er minder dan 3 items zijn, kun je evt lege ruimte opvullen of niets doen.
            // Voor nu toont het gewoon 1, 2 of 3 kaarten.

        })
        .catch(error => {
            console.error('Fout bij het laden van laatste nieuws:', error);
            if (nieuwsContainer) {
                nieuwsContainer.innerHTML = '<p class="foutmelding">Kon het laatste nieuws niet laden.</p>';
            }
        });
});