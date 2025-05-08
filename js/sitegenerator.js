// js/sitegenerator.js (voor VVD Wageningen)

// === STAP 1: ALLE IMPORTS (require) ===
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter"); // npm install gray-matter
const { marked } = require("marked"); // npm install marked
// ====================================

// === STAP 2: BASISPADEN DEFINIEREN ===
const baseDir = path.join(__dirname, ".."); // Project root
// Input
const nieuwsContentDir = path.join(baseDir, "nieuws");
const kandidatenContentDir = path.join(baseDir, "kandidaten");
// Output
const outputBaseDir = path.join(baseDir, "genereerd");
const dataOutputDir = path.join(outputBaseDir, "data");   // JSON bestanden
const nieuwsOutputDir = path.join(outputBaseDir, "nieuws"); // HTML nieuwsberichten
const kandidatenHTMLOutputDir = path.join(outputBaseDir, "kandidaten"); // HTML kandidaatpagina's
// ====================================

// === STAP 3: DEBUG LOGS ===
console.log("--- Paden Controle ---");
console.log("Script __dirname:", __dirname);
console.log("Project baseDir:", baseDir);
console.log("Input Nieuws:", nieuwsContentDir);
console.log("Input Kandidaten:", kandidatenContentDir);
console.log("Output Base:", outputBaseDir);
console.log("Output Data JSON:", dataOutputDir);
console.log("Output Nieuws HTML:", nieuwsOutputDir);
console.log("Output Kandidaten HTML:", kandidatenHTMLOutputDir);
console.log("----------------------");
// =====================================

// --- Hulpfuncties ---

/**
 * Zorgt ervoor dat een map bestaat. Maakt deze aan als hij niet bestaat.
 * @param {string} dirPath Het pad naar de map.
 */
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Map aangemaakt: ${path.relative(baseDir, dirPath)}`);
    } catch (error) {
      console.error(`❌ Fout bij aanmaken map ${dirPath}:`, error);
    }
  }
}

/**
 * Genereert de volledige HTML voor een nieuwspagina.
 * !! PAS DEZE FUNCTIE AAN MET JE EIGEN VVD SITE TEMPLATE !!
 * @param {object} data - De frontmatter data van het nieuwsbericht.
 * @param {string} htmlContent - De HTML-inhoud gegenereerd uit de markdown body.
 * @returns {string} - De volledige HTML-string voor de pagina.
 */
function createNieuwsHtmlPage(data, htmlContent) {
    let formattedDate = "Onbekende datum";
    if (data.date) {
        try {
            const date = new Date(data.date);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });
            }
        } catch (e) { console.error("Fout bij datum parsen:", data.date, e); }
    }

    // !! VERVANG DEZE VOORBEELD TEMPLATE !!
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${data.excerpt || data.title || 'Nieuws van VVD Wageningen'}">
  <title>${data.title || "Nieuws"} - VVD Wageningen</title>
  <!-- Gebruik root-relatieve paden -->
  <link rel="stylesheet" href="/style.css" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
  <link rel="manifest" href="/favicon_io/site.webmanifest" /> <!-- Controleer dit pad -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
  <header class="header">
    <nav class="navbar container">
      <a href="/" class="logo">
        <img src="/images/VVD_Logo_01_RGB_Kleur_1200DPI.png" alt="Logo VVD Wageningen" />
        <span>WAGENINGEN</span>
      </a>
      <button class="nav-toggle" aria-label="Menu openen/sluiten" aria-expanded="false" aria-controls="nav-menu">
        <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
      </button>
      <ul class="nav-links" id="nav-menu">
         <!-- Navigatie zonder 'active' class hier -->
          <li><a href="/">Home</a></li>
          <li><a href="/over-ons.html">Over Ons</a></li>
          <li class="dropdown">
            <a href="/standpunten.html" class="nav-link">Standpunten <span class="dropdown-arrow">▼</span></a>
            <ul class="dropdown-menu">
              <li><a href="/standpunten.html">Onze standpunten</a></li>
              <li><a href="/actiepunten.html">Actiepunten</a></li>
            </ul>
          </li>
          <li><a href="/actueel.html">Actueel</a></li>
          <li><a href="/contact.html">Contact</a></li>
      </ul>
    </nav>
  </header>

<main>
  <section class="section-padding">
    <div class="container artikel-container">
      <header class="artikel-header">
        <h1>${data.title || "Geen titel"}</h1>
        <p class="artikel-meta">
          Gepubliceerd op: ${formattedDate}
          ${data.category ? ` | Categorie: ${data.category.charAt(0).toUpperCase() + data.category.slice(1)}` : ''}
        </p>
      </header>

      <div class="artikel-inhoud text-content">
        ${htmlContent}
      </div>

      ${data.thumbnail ? `
        <div class="artikel-afbeelding">
          <img src="${data.thumbnail}" alt="Afbeelding bij artikel">
        </div>
      ` : ''}

      <div class="artikel-navigatie">
        <a href="/actueel.html" class="terug-knop link-arrow">← Terug naar Actueel</a>
      </div>
    </div>
  </section>
</main>

 <footer class="footer">
      <div class="container">
        <div class="footer-columns">
          <div class="footer-column">
            <h3>VVD Wageningen</h3>
            <ul>
              <li><a href="over-ons.html">Over Ons & Mensen</a></li>
              <li><a href="standpunten.html">Onze Standpunten</a></li>
              <li><a href="actiepunten.html">Onze Actiepunten</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Actueel</h3>
            <ul>
              <li><a href="actueel.html">Actueel</a></li>
              <li><a href="https://www.vvd.nl/evenementen/" target="_blank" rel="noopener noreferrer">Agenda</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Doe Mee</h3>
            <ul>
              <li>
                <a
                  href="https://www.vvd.nl/word-lid"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Word Lid</a
                >
              </li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Volg Ons</h3>
            <ul class="social-links">
              <li>
                <a href="https://www.facebook.com/VVDWageningen/"
                  ><i class="fab fa-facebook-f"></i
                ></a>
              </li>
              <li>
                <a href="https://x.com/vvdwageningen"
                  ><i class="fab fa-twitter"></i
                ></a>
              </li>
              <li>
                <a href="https://www.instagram.com/vvdwageningen/"
                  ><i class="fab fa-instagram"></i
                ></a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/vvd/"
                  ><i class="fab fa-linkedin-in"></i
                ></a>
              </li>
              <li>
                <a href="https://www.youtube.com/vvdtube"
                  ><i class="fab fa-youtube"></i
                ></a>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-bottom-inner">
            <p>
              ©
              <script>
                document.write(new Date().getFullYear());
              </script>
              VVD Wageningen - Alle rechten voorbehouden.
            </p>
            <p class="made-by">
              Website door
              <a
                href="https://twinpixel.nl"
                target="_blank"
                rel="noopener noreferrer"
                >TwinPixel</a
              >
            </p>
          </div>
        </div>
      </div>
    </footer>
  <!-- Algemeen script voor bv. nav toggle -->
  <script src="/js/main.js"></script>
  <!-- Geen pagina-specifieke scripts hier nodig -->
</body>
</html>
`;
}


/**
 * Genereert de volledige HTML voor een individuele kandidaatpagina.
 * !! PAS DEZE FUNCTIE AAN MET JE EIGEN VVD SITE TEMPLATE !!
 * @param {object} data - De frontmatter data van de kandidaat.
 * @param {string} htmlBioContent - De HTML-inhoud gegenereerd uit de markdown body (de volledige bio).
 * @returns {string} - De volledige HTML-string voor de pagina.
 */
function createKandidaatHtmlPage(data, htmlBioContent) {
    // Helper functie voor social links binnen deze scope
    function createSocialLink(url, iconClass, label) {
        if (!url) return '';
        let fullUrl = url.trim(); let isEmail = false;
        if (fullUrl.includes('@') && !fullUrl.startsWith('mailto:')) { fullUrl = `mailto:${fullUrl}`; isEmail = true; }
        else if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://') && !fullUrl.startsWith('mailto:')) { fullUrl = `https://${fullUrl}`; }
        // Zorg dat je FontAwesome laadt of vervang iconen
        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" title="${label || (isEmail ? 'Stuur e-mail' : 'Bezoek website')}" class="social-link"><i class="${iconClass}"></i><span class="sr-only">${label}</span></a>`;
    }

    // !! VERVANG DEZE VOORBEELD TEMPLATE !!
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${data.bio_kort || `Lees meer over ${data.naam}, ${data.rol || ''} bij VVD Wageningen.`}">
    <title>${data.naam || "Kandidaat"} - VVD Wageningen</title>
    <!-- Gebruik root-relatieve paden -->
    <link rel="stylesheet" href="/style.css" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
    <link rel="manifest" href="/favicon_io/site.webmanifest" /> <!-- Controleer dit pad -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
    <header class="header">
      <nav class="navbar container">
        <a href="/" class="logo">
          <img src="/images/VVD_Logo_01_RGB_Kleur_1200DPI.png" alt="Logo VVD Wageningen" />
          <span>WAGENINGEN</span>
        </a>
        <button class="nav-toggle" aria-label="Menu openen/sluiten" aria-expanded="false" aria-controls="nav-menu">
          <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
        </button>
        <ul class="nav-links" id="nav-menu">
           <!-- Navigatie zonder 'active' class hier -->
           <li><a href="/">Home</a></li>
           <li><a href="/over-ons.html">Over Ons</a></li>
           <li class="dropdown">
             <a href="/standpunten.html" class="nav-link">Standpunten <span class="dropdown-arrow">▼</span></a>
             <ul class="dropdown-menu">
               <li><a href="/standpunten.html">Onze standpunten</a></li>
               <li><a href="/actiepunten.html">Actiepunten</a></li>
             </ul>
           </li>
           <li><a href="/actueel.html">Actueel</a></li>
           <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>
        <section class="page-header">
          <div class="container">
            <h1>${data.naam || "Kandidaat"}</h1>
             ${data.rol ? `<p class="intro-text kandidaat-rol-detail">${data.rol}</p>` : ''} <!-- Stijl deze class -->
          </div>
        </section>

        <section class="section-padding">
            <div class="container kandidaat-detail-container"> <!-- Class voor layout (bv. grid/flex) -->
                 <div class="kandidaat-detail-foto">
                     <img src="${data.foto || '/images/default-kandidaat.png'}" alt="Foto van ${data.naam}" class="detail-foto"> <!-- Stijl deze class -->
                 </div>
                 <div class="kandidaat-detail-info">
                      <!-- Naam/Rol staan nu in header, hier de socials & bio -->
                     <div class="kandidaat-socials detail-socials"> <!-- Stijl deze class -->
                        ${createSocialLink(data.email, 'fas fa-envelope', 'E-mail')}
                        ${createSocialLink(data.linkedin, 'fab fa-linkedin', 'LinkedIn')}
                        ${createSocialLink(data.twitter, 'fab fa-twitter', 'Twitter/X')}
                        ${createSocialLink(data.instagram, 'fab fa-instagram', 'Instagram')}
                        ${createSocialLink(data.facebook, 'fab fa-facebook', 'Facebook')}
                        ${createSocialLink(data.website, 'fas fa-globe', 'Website')}
                     </div>

                     <h2 class="section-title-small">Over ${data.naam ? data.naam.split(' ')[0] : 'deze kandidaat'}</h2> <!-- Subkopje -->
                     <div class="kandidaat-bio-volledig text-content"> <!-- Stijl deze class (kan text-content hergebruiken) -->
                         ${htmlBioContent} <!-- Hier komt de markdown bio -->
                     </div>

                     <div class="artikel-navigatie"> <!-- Hergebruik class? -->
                         <a href="/over-ons.html" class="terug-knop link-arrow">← Terug naar Team</a> <!-- Controleer pad/tekst -->
                     </div>
                 </div>
            </div>
        </section>

        <!-- Optioneel: CTA sectie hier ook? -->

    </main>

      <footer class="footer">
      <div class="container">
        <div class="footer-columns">
          <div class="footer-column">
            <h3>VVD Wageningen</h3>
            <ul>
              <li><a href="over-ons.html">Over Ons & Mensen</a></li>
              <li><a href="standpunten.html">Onze Standpunten</a></li>
              <li><a href="actiepunten.html">Onze Actiepunten</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Actueel</h3>
            <ul>
              <li><a href="actueel.html">Actueel</a></li>
              <li><a href="https://www.vvd.nl/evenementen/" target="_blank" rel="noopener noreferrer">Agenda</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Doe Mee</h3>
            <ul>
              <li>
                <a
                  href="https://www.vvd.nl/word-lid"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Word Lid</a
                >
              </li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Volg Ons</h3>
            <ul class="social-links">
              <li>
                <a href="https://www.facebook.com/VVDWageningen/"
                  ><i class="fab fa-facebook-f"></i
                ></a>
              </li>
              <li>
                <a href="https://x.com/vvdwageningen"
                  ><i class="fab fa-twitter"></i
                ></a>
              </li>
              <li>
                <a href="https://www.instagram.com/vvdwageningen/"
                  ><i class="fab fa-instagram"></i
                ></a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/vvd/"
                  ><i class="fab fa-linkedin-in"></i
                ></a>
              </li>
              <li>
                <a href="https://www.youtube.com/vvdtube"
                  ><i class="fab fa-youtube"></i
                ></a>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-bottom-inner">
            <p>
              ©
              <script>
                document.write(new Date().getFullYear());
              </script>
              VVD Wageningen - Alle rechten voorbehouden.
            </p>
            <p class="made-by">
              Website door
              <a
                href="https://twinpixel.nl"
                target="_blank"
                rel="noopener noreferrer"
                >TwinPixel</a
              >
            </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Algemeen script voor bv. nav toggle -->
    <script src="/js/main.js"></script>
     <!-- Geen pagina-specifieke scripts hier nodig -->
</body>
</html>
`;
}


// --- Generatie Processen ---

/**
 * Leest nieuws markdown bestanden, genereert HTML pagina's en een nieuws-index.json.
 * Gebruikt fs.readdirSync voor betrouwbaarheid.
 */
function generateNieuws() {
    console.log("\n🚀 Start genereren nieuwspagina's...");
    ensureDirExists(nieuwsOutputDir);
    ensureDirExists(dataOutputDir);

    let files = [];
    let rawFileNames = [];

    try {
        console.log(`🔍 [Nieuws] Lezen van mapinhoud via fs.readdirSync: ${nieuwsContentDir}`);
        rawFileNames = fs.readdirSync(nieuwsContentDir);
        console.log(`   [fs.readdirSync] Gevonden items in map (${rawFileNames.length}):`, rawFileNames);

        files = rawFileNames
            .filter(fileName => fileName.toLowerCase().endsWith('.md'))
            .map(fileName => path.join(nieuwsContentDir, fileName));

        console.log(`   [Filter] Gevonden .md bestanden na filter (${files.length}):`, files.map(f => path.basename(f)));

    } catch (error) {
        console.error(`❌ Fout tijdens fs.readdirSync of filteren voor ${nieuwsContentDir}:`, error);
        files = [];
    }

    console.log(`🔍 [Nieuws] Resulterende lijst met .md paden (${files.length}):`, files.map(f => path.relative(baseDir, f)));

    const index = []; // Lijst voor nieuws-index.json

    if (files.length === 0) {
      console.warn(`⚠️ Geen .md bestanden gevonden in ${nieuwsContentDir} (via fs.readdirSync)`);
      fs.writeFileSync(path.join(dataOutputDir, "nieuws-index.json"), JSON.stringify([], null, 2));
      console.log(`   -> Lege nieuws-index.json aangemaakt in ${path.relative(baseDir, dataOutputDir)}`);
      return;
    }

    files.forEach((file) => {
      const relativePath = path.relative(baseDir, file);
      try {
        const rawContent = fs.readFileSync(file, "utf-8");
        const { data, content } = matter(rawContent);
        console.log(`   [Nieuws] Verwerken: ${relativePath}, Frontmatter keys:`, Object.keys(data));

        const slug = path.basename(file, ".md");

        if (!data.title) console.warn(`   ⚠️ WAARSCHUWING: Veld 'title' mist in ${relativePath}`);
        if (!data.date) console.warn(`   ⚠️ WAARSCHUWING: Veld 'date' mist in ${relativePath}`);

        const htmlContent = marked.parse(content || ""); // Gebruik lege string als content null is
        const fullHtml = createNieuwsHtmlPage(data, htmlContent);

        const outputHtmlFile = path.join(nieuwsOutputDir, `${slug}.html`);
        fs.writeFileSync(outputHtmlFile, fullHtml);

        index.push({
          title: data.title || "Geen titel",
          date: data.date || new Date(0).toISOString(),
          excerpt: data.excerpt || "",
          thumbnail: data.thumbnail || "/images/VVD_Logo_01_RGB_Kleur_1200DPI_Background.png", // Controleer fallback
          path: `/nieuws/${slug}.html`,
          category: data.category || "algemeen" // Categorie voor filteren
        });
         console.log(`   [Nieuws] Item toegevoegd aan index (totaal nu: ${index.length})`);

      } catch (error) {
        console.error(`❌ Fout bij verwerken nieuwsbericht ${relativePath}:`, error);
      }
    });

    index.sort((a, b) => new Date(b.date) - new Date(a.date));

    const indexFile = path.join(dataOutputDir, "nieuws-index.json");
    console.log(`[Nieuws] Klaar om te schrijven, index lengte: ${index.length}`);
    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
    console.log(`✅ Nieuws index gegenereerd: ${path.relative(baseDir, indexFile)}`);
    console.log(`👍 Nieuws generatie voltooid.`);
}


/**
 * Leest kandidaten markdown bestanden, genereert individuele HTML pagina's
 * EN een kandidaten-lijst.json voor het overzicht.
 * Gebruikt fs.readdirSync voor betrouwbaarheid.
 */
function generateKandidaten() {
    console.log("\n🚀 Start genereren kandidaten (lijst + pagina's)...");
    ensureDirExists(dataOutputDir);
    ensureDirExists(kandidatenHTMLOutputDir); // Zorg dat deze map bestaat

    let files = [];
    let rawFileNames = [];

    try {
        console.log(`🔍 [Kandidaten] Lezen van mapinhoud via fs.readdirSync: ${kandidatenContentDir}`);
        rawFileNames = fs.readdirSync(kandidatenContentDir);
        console.log(`   [fs.readdirSync] Gevonden items in map (${rawFileNames.length}):`, rawFileNames);

        files = rawFileNames
            .filter(fileName => fileName.toLowerCase().endsWith('.md'))
            .map(fileName => path.join(kandidatenContentDir, fileName));

        console.log(`   [Filter] Gevonden .md bestanden na filter (${files.length}):`, files.map(f => path.basename(f)));

    } catch (error) {
        console.error(`❌ Fout tijdens fs.readdirSync of filteren voor ${kandidatenContentDir}:`, error);
        files = [];
    }

    console.log(`🔍 [Kandidaten] Resulterende lijst met .md paden (${files.length}):`, files.map(f => path.relative(baseDir, f)));

    const kandidatenLijst = []; // Lijst voor JSON

    if (files.length === 0) {
      console.warn(`⚠️ Geen .md bestanden gevonden in ${kandidatenContentDir} (via fs.readdirSync)`);
      fs.writeFileSync(path.join(dataOutputDir, "kandidaten-lijst.json"), JSON.stringify([], null, 2));
      console.log(`   -> Lege kandidaten-lijst.json aangemaakt in ${path.relative(baseDir, dataOutputDir)}`);
      return;
    }

    files.forEach((file) => {
      const relativePath = path.relative(baseDir, file);
      try {
        const rawContent = fs.readFileSync(file, "utf-8");
        const { data, content } = matter(rawContent); // Haal ook content op voor bio
        console.log(`   [Kandidaten] Verwerken: ${relativePath}, Frontmatter keys:`, Object.keys(data));

        if (!data.naam) console.warn(`   ⚠️ WAARSCHUWING: Veld 'naam' mist in ${relativePath}`);
        if (!data.volgorde) console.warn(`   ⚠️ WAARSCHUWING: Veld 'volgorde' mist in ${relativePath}`);

        // --- Genereer individuele HTML pagina ---
        const slug = path.basename(file, ".md");
        const htmlBioContent = marked.parse(content || ""); // Gebruik markdown body voor bio
        const fullHtml = createKandidaatHtmlPage(data, htmlBioContent); // Gebruik kandidaat template

        const outputHtmlFile = path.join(kandidatenHTMLOutputDir, `${slug}.html`); // Naar /genereerd/kandidaten/
        fs.writeFileSync(outputHtmlFile, fullHtml);
        console.log(`   📄 Kandidaat HTML gegenereerd: ${path.relative(baseDir, outputHtmlFile)}`);
        // --- Einde genereren HTML pagina ---

        // --- Toevoegen aan JSON lijst ---
        kandidatenLijst.push({
          id: slug,
          naam: data.naam || "Onbekende kandidaat",
          foto: data.foto || "/images/default-kandidaat.png", // Controleer fallback
          rol: data.rol || "",
          volgorde: parseInt(data.volgorde || 999, 10),
          email: data.email || null,
          linkedin: data.linkedin || null,
          twitter: data.twitter || null,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          website: data.website || null,
          bio_kort: data.bio_kort || "",
          path: `/kandidaten/${slug}.html` // Pad naar de detailpagina
        });
         console.log(`   [Kandidaten] Item toegevoegd aan JSON lijst (totaal nu: ${kandidatenLijst.length})`);
         // --- Einde toevoegen aan JSON lijst ---

      } catch (error) {
        console.error(`❌ Fout bij verwerken kandidaat ${relativePath}:`, error);
      }
    });

    kandidatenLijst.sort((a, b) => a.volgorde - b.volgorde); // Sorteer lijst

    const lijstFile = path.join(dataOutputDir, "kandidaten-lijst.json");
    console.log(`[Kandidaten] Klaar om JSON lijst te schrijven, lengte: ${kandidatenLijst.length}`);
    fs.writeFileSync(lijstFile, JSON.stringify(kandidatenLijst, null, 2));
    console.log(`✅ Kandidatenlijst gegenereerd: ${path.relative(baseDir, lijstFile)}`);
    console.log(`👍 Kandidaten generatie voltooid.`);
}

// --- Script Uitvoeren ---
console.log("===== VVD Wageningen Site Generator =====");
generateNieuws();
generateKandidaten();
console.log("\n✅ Alle taken voltooid!");
console.log(`   Output bestanden staan in: ${path.relative(baseDir, outputBaseDir)}`);
console.log("=======================================");