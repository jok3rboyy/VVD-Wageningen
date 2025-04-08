// Wacht tot de HTML volledig geladen is
document.addEventListener('DOMContentLoaded', function() {

    const nieuwsContainer = document.getElementById('nieuws-container');

    // Controleer of de container bestaat op deze pagina
    if (!nieuwsContainer) {
        // Doe niets als de container niet gevonden wordt (bv. op andere pagina's)
        // console.log("Nieuwscontainer niet gevonden op deze pagina.");
        return;
    }

    // Functie om datum te formatteren (voorbeeld)
    function formatteerDatum(isoDatum) {
        if (!isoDatum || isoDatum.startsWith('1970')) return ''; // Toon niets bij ongeldige datum
        const date = new Date(isoDatum);
        return date.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Haal de nieuwsindex op
    fetch('/genereerd/data/nieuws-index.json') // Pad naar de gegenereerde JSON
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Zet de response om naar JSON
        })
        .then(nieuwsItems => {
            // Leeg de container (verwijder "Nieuws wordt geladen...")
            nieuwsContainer.innerHTML = '';

            if (nieuwsItems.length === 0) {
                nieuwsContainer.innerHTML = '<p>Er zijn momenteel geen nieuwsberichten.</p>';
                return;
            }

            // Loop door elk nieuwsitem en maak HTML
            nieuwsItems.forEach(item => {
                // Maak HTML voor één nieuwsitem - PAS DEZE STRUCTUUR AAN NAAR WENS!
                const itemHtml = `
                    <article class="nieuws-item-preview">
                        ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" class="nieuws-preview-thumb">` : '<div class="nieuws-preview-thumb-placeholder"></div>'}
                        <div class="nieuws-preview-content">
                            <h3><a href="${item.path}">${item.title || "Geen titel"}</a></h3>
                            <p class="nieuws-preview-meta">
                                <span class="datum">${formatteerDatum(item.date)}</span>
                            </p>
                            ${item.excerpt ? `<p class="nieuws-preview-excerpt">${item.excerpt}</p>` : ''}
                            <a href="${item.path}" class="lees-meer-knop">Lees meer →</a>
                        </div>
                    </article>
                `;
                // Voeg de HTML toe aan de container
                nieuwsContainer.innerHTML += itemHtml;
            });
        })
        .catch(error => {
            console.error('Fout bij het laden van nieuwsberichten:', error);
            if (nieuwsContainer) {
                nieuwsContainer.innerHTML = '<p class="foutmelding">Kon nieuwsberichten niet laden. Probeer het later opnieuw.</p>';
            }
        });
});