// js/sitegenerator.js (voor VVD Wageningen)

// === STAP 1: ALLE IMPORTS (require) ===
// Deze moeten ALTIJD bovenaan staan!
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter"); // npm install gray-matter
const { marked } = require("marked"); // npm install marked
const glob = require("glob");         // npm install glob
// ====================================

// === STAP 2: BASISPADEN DEFINIEREN ===
// Definieer de paden NADAT 'path' is geïmporteerd, en VOORDAT ze gebruikt worden.
const baseDir = path.join(__dirname, ".."); // Project root (omdat dit script in 'js/' staat)

// Input mappen (direct in de root)
const nieuwsContentDir = path.join(baseDir, "nieuws");
const kandidatenContentDir = path.join(baseDir, "kandidaten");

// Output mappen (in de map 'genereerd')
const outputBaseDir = path.join(baseDir, "genereerd");
const nieuwsOutputDir = path.join(outputBaseDir, "nieuws"); // HTML nieuwsberichten
const dataOutputDir = path.join(outputBaseDir, "data");   // JSON bestanden
// ====================================

// === STAP 3: (Optioneel, maar handig nu) DEBUG LOGS ===
// Log de berekende paden om te controleren of ze kloppen.
console.log("--- Paden Controle ---");
console.log("Script __dirname:", __dirname); // Map waar dit script staat
console.log("Project baseDir:", baseDir);     // Hoofdmap van het project
console.log("Input Nieuws:", nieuwsContentDir);
console.log("Input Kandidaten:", kandidatenContentDir);
console.log("Output Base:", outputBaseDir);
console.log("Output Nieuws HTML:", nieuwsOutputDir);
console.log("Output Data JSON:", dataOutputDir);
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
 * BELANGRIJK: Pas de inhoud van deze functie aan met je eigen VVD site template!
 * @param {object} data - De frontmatter data van het nieuwsbericht.
 * @param {string} htmlContent - De HTML-inhoud gegenereerd uit de markdown.
 * @returns {string} - De volledige HTML-string voor de pagina.
 */
function createNieuwsHtmlPage(data, htmlContent) {
  // ** VERVANG DEZE HELE TEMPLATE DOOR JE ECHTE VVD PAGINA TEMPLATE **
  // Zorg dat paden naar CSS/JS/Images beginnen met "/" (root-relative).

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("nl-NL", {
        year: "numeric", month: "long", day: "numeric"
      })
    : "Onbekende datum";

  // Voorbeeld template - PAS DEZE AAN!
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${data.excerpt || ""}">
  <title>${data.title || "Nieuws"} - VVD Wageningen</title>
  <link rel="stylesheet" href="/style.css"> <!-- Voorbeeld pad -->
  <link rel="icon" href="/favicon_io/favicon.ico"> <!-- Voorbeeld pad -->
  <!-- Voeg hier andere VVD head elementen toe -->
</head>
<body>
  <header>
    <!-- PLAATS HIER JE VVD HEADER -->
    <h1>VVD Wageningen - Nieuws</h1>
    <nav>
        <a href="/">Home</a> | <a href="/actueel.html">Actueel</a> <!-- Voorbeeld nav -->
    </nav>
  </header>

  <main>
    <article class="nieuws-artikel">
      <h1>${data.title || "Geen titel"}</h1>
      <p class="datum">Gepubliceerd op: ${formattedDate}</p>
      ${data.thumbnail ? `<img src="${data.thumbnail}" alt="Thumbnail" class="nieuws-thumbnail">` : ""}
      <div class="nieuws-content">
        ${htmlContent}
      </div>
      <a href="/actueel.html">← Terug naar overzicht</a>
    </article>
  </main>

  <footer>
    <!-- PLAATS HIER JE VVD FOOTER -->
    <p>© ${new Date().getFullYear()} VVD Wageningen</p>
  </footer>

  <!-- <script src="/js/main.js"></script> --> <!-- Voorbeeld script pad -->
</body>
</html>
`;
}

// --- Generatie Processen ---

/**
 * Leest nieuws markdown bestanden, genereert HTML pagina's en een nieuws-index.json.
 */
function generateNieuws() {
  console.log("\n🚀 Start genereren nieuwspagina's...");
  ensureDirExists(nieuwsOutputDir); // Gebruikt paden gedefinieerd bovenaan
  ensureDirExists(dataOutputDir);   // Gebruikt paden gedefinieerd bovenaan

  let files;
  try {
     files = glob.sync(path.join(nieuwsContentDir, "**/*.md"), { absolute: true }); // Gebruik absoluut pad voor zekerheid
  } catch(error) {
      console.error(`❌ Fout bij zoeken naar nieuwsbestanden in ${nieuwsContentDir}:`, error);
      files = []; // Zorg dat files een lege array is bij fout
  }

  // Extra log om gevonden bestanden te tonen
  console.log(`🔍 [Nieuws] Zoeken in: ${nieuwsContentDir}`);
  console.log(`🔍 [Nieuws] Gevonden bestanden (${files.length}):`, files.map(f => path.relative(baseDir, f)));

  const index = [];

  if (files.length === 0) {
    console.warn(`⚠️ Geen markdown bestanden (.md) gevonden in: ${nieuwsContentDir}`);
    // Schrijf lege index om fouten op de site te voorkomen
    fs.writeFileSync(path.join(dataOutputDir, "nieuws-index.json"), JSON.stringify([], null, 2));
    console.log(`   -> Lege nieuws-index.json aangemaakt in ${path.relative(baseDir, dataOutputDir)}`);
    return;
  }

  files.forEach((file) => {
    const relativePath = path.relative(baseDir, file);
    try {
      const rawContent = fs.readFileSync(file, "utf-8");
      const { data, content } = matter(rawContent);
      console.log(`   [Nieuws] Verwerken: ${relativePath}, Frontmatter keys:`, Object.keys(data)); // Log alleen keys

      const slug = path.basename(file, ".md");

      if (!data.title) console.warn(`   ⚠️ WAARSCHUWING: Titel mist in ${relativePath}`);
      if (!data.date) console.warn(`   ⚠️ WAARSCHUWING: Datum mist in ${relativePath}`);

      const htmlContent = marked.parse(content);
      const fullHtml = createNieuwsHtmlPage(data, htmlContent); // Roept helper aan

      const outputHtmlFile = path.join(nieuwsOutputDir, `${slug}.html`);
      fs.writeFileSync(outputHtmlFile, fullHtml);

      index.push({
        title: data.title || "Geen titel",
        date: data.date || new Date(0).toISOString(),
        excerpt: data.excerpt || "",
        thumbnail: data.thumbnail || "/images/VVD_Logo_01_RGB_Kleur_1200DPI.png", // Pas fallback aan!
        path: `/genereerd/nieuws/${slug}.html`, // Pad vanaf website root
      });
      console.log(`   [Nieuws] Item toegevoegd aan index (totaal nu: ${index.length})`);

    } catch (error) {
      console.error(`❌ Fout bij verwerken nieuwsbericht ${relativePath}:`, error);
    }
  });

  index.sort((a, b) => new Date(b.date) - new Date(a.date)); // Nieuwste eerst

  const indexFile = path.join(dataOutputDir, "nieuws-index.json");
  console.log(`[Nieuws] Klaar om te schrijven, index lengte: ${index.length}`);
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
  console.log(`✅ Nieuws index gegenereerd: ${path.relative(baseDir, indexFile)}`);
  console.log(`👍 Nieuws generatie voltooid.`);
}

/**
 * Leest kandidaten markdown bestanden en genereert een kandidaten-lijst.json.
 */
function generateKandidaten() {
  console.log("\n🚀 Start genereren kandidatenlijst...");
  ensureDirExists(dataOutputDir); // Gebruikt pad gedefinieerd bovenaan

  let files;
   try {
     files = glob.sync(path.join(kandidatenContentDir, "**/*.md"), { absolute: true }); // Gebruik absoluut pad
  } catch(error) {
      console.error(`❌ Fout bij zoeken naar kandidatenbestanden in ${kandidatenContentDir}:`, error);
      files = []; // Zorg dat files een lege array is bij fout
  }

  // Extra log om gevonden bestanden te tonen
  console.log(`🔍 [Kandidaten] Zoeken in: ${kandidatenContentDir}`);
  console.log(`🔍 [Kandidaten] Gevonden bestanden (${files.length}):`, files.map(f => path.relative(baseDir, f)));

  const kandidatenLijst = [];

  if (files.length === 0) {
    console.warn(`⚠️ Geen markdown bestanden (.md) gevonden in: ${kandidatenContentDir}`);
    fs.writeFileSync(path.join(dataOutputDir, "kandidaten-lijst.json"), JSON.stringify([], null, 2));
    console.log(`   -> Lege kandidaten-lijst.json aangemaakt in ${path.relative(baseDir, dataOutputDir)}`);
    return;
  }

  files.forEach((file) => {
    const relativePath = path.relative(baseDir, file);
    try {
      const rawContent = fs.readFileSync(file, "utf-8");
      const { data } = matter(rawContent); // Alleen frontmatter nodig
      console.log(`   [Kandidaten] Verwerken: ${relativePath}, Frontmatter keys:`, Object.keys(data)); // Log alleen keys

      if (!data.naam) console.warn(`   ⚠️ WAARSCHUWING: Naam mist in ${relativePath}`);
      if (!data.volgorde) console.warn(`   ⚠️ WAARSCHUWING: Volgorde mist in ${relativePath}`);

      kandidatenLijst.push({
        id: path.basename(file, ".md"),
        naam: data.naam || "Onbekende kandidaat",
        foto: data.foto || "/images/default-kandidaat.png", // Pas fallback aan!
        rol: data.rol || "",
        volgorde: parseInt(data.volgorde || 999, 10),
        email: data.email || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        bio_kort: data.bio_kort || "",
      });
       console.log(`   [Kandidaten] Item toegevoegd aan lijst (totaal nu: ${kandidatenLijst.length})`);

    } catch (error) {
      console.error(`❌ Fout bij verwerken kandidaat ${relativePath}:`, error);
    }
  });

  kandidatenLijst.sort((a, b) => a.volgorde - b.volgorde); // Sorteer op volgorde

  const lijstFile = path.join(dataOutputDir, "kandidaten-lijst.json");
  console.log(`[Kandidaten] Klaar om te schrijven, lijst lengte: ${kandidatenLijst.length}`);
  fs.writeFileSync(lijstFile, JSON.stringify(kandidatenLijst, null, 2));
  console.log(`✅ Kandidatenlijst gegenereerd: ${path.relative(baseDir, lijstFile)}`);
  console.log(`👍 Kandidaten generatie voltooid.`);
}

// --- Script Uitvoeren ---
// Dit blok komt als LAATSTE en roept de functies aan.
console.log("===== VVD Wageningen Site Generator =====");
generateNieuws();       // Roep de nieuws generator functie aan
generateKandidaten();   // Roep de kandidaten generator functie aan
console.log("\n✅ Alle taken voltooid!");
console.log(`   Output bestanden staan in: ${path.relative(baseDir, outputBaseDir)}`); // Gebruikt variabelen van bovenaan
console.log("=======================================");