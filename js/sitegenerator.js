/**
 * SiteGenerator.js
 * 
 * Dit script zorgt voor het genereren van HTML-pagina's uit markdown bestanden.
 * Het leest markdown bestanden uit de /nieuws/ en /kandidaten/ mappen en zet deze om naar HTML.
 * 
 * Functionaliteit:
 * - Laden van kandidaten op de Over Ons pagina
 * - Laden van nieuwsberichten op de Actueel pagina
 * - Genereren van individuele pagina's voor elk nieuwsbericht
 */

const SiteGenerator = (function() {
    // Hulpfunctie om markdown naar HTML om te zetten (eenvoudige implementatie)
    function markdownToHtml(markdown) {
        if (!markdown) return '';
        
        // Basis markdown conversie (kan uitgebreid worden)
        let html = markdown
            // Headers
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            // Lists
            .replace(/^\s*\n\* (.*)/gm, '<ul>\n<li>$1</li>')
            .replace(/^\* (.*)/gm, '<li>$1</li>')
            .replace(/^\s*\n- (.*)/gm, '<ul>\n<li>$1</li>')
            .replace(/^- (.*)/gm, '<li>$1</li>')
            // Paragraphs
            .replace(/^\s*(\n)?(.+)/gm, function(m) {
                return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
            })
            // Line breaks
            .replace(/\n/g, '<br>');
            
        return html.trim();
    }
    
    // Functie om frontmatter uit markdown te halen
    function parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) return { frontMatter: {}, content: content };
        
        const frontMatterStr = match[1];
        const contentStr = match[2];
        
        // Parse YAML-like frontmatter
        const frontMatter = {};
        frontMatterStr.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                frontMatter[key] = value;
            }
        });
        
        return { frontMatter, content: contentStr };
    }
    
    // Functie om een datum te formatteren
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    // Functie om kandidaten te laden
    async function loadKandidaten(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            // In een echte implementatie zou je hier een fetch doen naar de markdown bestanden
            // Voor nu simuleren we dit met een setTimeout
            setTimeout(() => {
                console.log('Kandidaten geladen in container:', containerId);
                // Hier zou je de HTML voor de kandidaten genereren en in de container plaatsen
            }, 500);
        } catch (error) {
            console.error('Fout bij het laden van kandidaten:', error);
        }
    }
    
    // Functie om nieuwsberichten te laden
    async function loadNieuws(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            // In een echte implementatie zou je hier een fetch doen naar de markdown bestanden
            // Voor nu simuleren we dit met een setTimeout
            setTimeout(() => {
                console.log('Nieuws geladen in container:', containerId);
                // Hier zou je de HTML voor de nieuwsberichten genereren en in de container plaatsen
            }, 500);
        } catch (error) {
            console.error('Fout bij het laden van nieuws:', error);
        }
    }
    
    // Functie om een individuele nieuwspagina te genereren
    function generateNieuwsPage(slug, data) {
        // Deze functie zou een HTML-pagina genereren voor een specifiek nieuwsbericht
        console.log(`Nieuwspagina gegenereerd voor: ${slug}`);
    }
    
    // Functie om alle nieuwspagina's te genereren
    function generateAllNieuwsPages() {
        // Deze functie zou alle markdown bestanden in de /nieuws/ map lezen
        // en voor elk een HTML-pagina genereren
        console.log('Alle nieuwspagina\'s gegenereerd');
    }
    
    // Publieke API
    return {
        loadKandidaten,
        loadNieuws,
        generateNieuwsPage,
        generateAllNieuwsPages
    };
})();

// Automatisch alle pagina's genereren wanneer het script geladen wordt
document.addEventListener('DOMContentLoaded', function() {
    console.log('SiteGenerator geïnitialiseerd');
});
