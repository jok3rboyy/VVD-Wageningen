document.addEventListener('DOMContentLoaded', function() {

    const nieuwsContainer = document.getElementById('nieuws-container');

    if (!nieuwsContainer) return;

    function formatteerDatum(isoDatum) {
        if (!isoDatum || isoDatum.startsWith('1970')) return '';
        try {
            const date = new Date(isoDatum);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return '';
        }
    }

    fetch('/genereerd/data/nieuws-index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(alleNieuwsItems => {
            nieuwsContainer.innerHTML = '';

            if (!alleNieuwsItems || alleNieuwsItems.length === 0) {
                nieuwsContainer.innerHTML = '<p>Geen nieuws gevonden.</p>';
                return;
            }

            // Gebruik álle nieuwsitems in plaats van alleen slice(0, 3)
            alleNieuwsItems.forEach(item => {
                const labelText = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Nieuws';
                const cardText = item.title || 'Geen titel';
                const imageUrl = item.thumbnail || '/images/VVD_Logo_01_CMYK_Kleur_1200DPI.jpg';
                const formattedDate = formatteerDatum(item.date);

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
        })
        .catch(error => {
            console.error('Fout bij het laden van nieuws:', error);
            nieuwsContainer.innerHTML = '<p class="foutmelding">Kon het nieuws niet laden.</p>';
        });
});
