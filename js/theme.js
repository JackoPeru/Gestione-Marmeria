// ===== GESTIONE TEMI =====
// Questo file gestisce l'applicazione dei temi e delle impostazioni di interfaccia

// Applica il tema in base alle impostazioni
function applyTheme() {
    const interfaccia = window.appData.impostazioni.interfaccia;
    
    // Applica il tema chiaro/scuro
    if (interfaccia.tema === 'scuro') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Applica i colori personalizzati
    document.documentElement.style.setProperty('--primary-color', interfaccia.colorePrimario);
    document.documentElement.style.setProperty('--secondary-color', interfaccia.coloreSecondario);
    
    // Applica il font
    document.documentElement.style.setProperty('--font-family', interfaccia.fontPrincipale);
    
    // Applica la dimensione del font
    let rootFontSize = '16px'; // Dimensione predefinita (media)
    
    switch(interfaccia.dimensioneFont) {
        case 'piccola':
            rootFontSize = '14px';
            break;
        case 'media':
            rootFontSize = '16px';
            break;
        case 'grande':
            rootFontSize = '18px';
            break;
    }
    
    document.documentElement.style.setProperty('--font-size-base', rootFontSize);
    
    // Salva le preferenze nel localStorage per mantenerle tra le sessioni
    localStorage.setItem('theme', interfaccia.tema);
}

// Ripristina il tema predefinito
function resetTheme() {
    // Valori predefiniti
    window.appData.impostazioni.interfaccia = {
        tema: 'chiaro',
        colorePrimario: '#3b82f6',
        coloreSecondario: '#10b981',
        fontPrincipale: 'Arial',
        dimensioneFont: 'media'
    };
    
    // Aggiorna i campi del form
    if (document.getElementById('tema')) {
        document.getElementById('tema').value = 'chiaro';
    }
    if (document.getElementById('colore-primario')) {
        document.getElementById('colore-primario').value = '#3b82f6';
    }
    if (document.getElementById('colore-secondario')) {
        document.getElementById('colore-secondario').value = '#10b981';
    }
    if (document.getElementById('font-principale')) {
        document.getElementById('font-principale').value = 'Arial';
    }
    if (document.getElementById('dimensione-font')) {
        document.getElementById('dimensione-font').value = 'media';
    }
    
    // Applica il tema predefinito
    applyTheme();
    
    // Salva le impostazioni
    saveAppData();
    
    showNotification('Tema ripristinato alle impostazioni predefinite');
}

// Inizializza il tema all'avvio dell'applicazione
function initTheme() {
    // Controlla se esiste un tema salvato nel localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && window.appData && window.appData.impostazioni) {
        // Se c'è un tema salvato, assicurati che sia sincronizzato con le impostazioni
        if (savedTheme !== window.appData.impostazioni.interfaccia.tema) {
            window.appData.impostazioni.interfaccia.tema = savedTheme;
            saveAppData();
        }
    }
    
    // Applica il tema corrente
    applyTheme();
}

// Aggiungi gli stili CSS per il tema scuro
// Aggiungi stili CSS più completi per il tema scuro
function addDarkThemeStyles() {
    if (document.getElementById('dark-theme-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'dark-theme-styles';
    style.textContent = `
        /* Stili per il tema scuro - Regole globali */
        body.dark-theme {
            --bg-color: #121212;
            --text-color: #e0e0e0;
            --card-bg: #1e1e1e;
            --border-color: #333;
            --hover-color: #2c2c2c;
            --shadow-color: rgba(0, 0, 0, 0.5);
            --input-bg: #2d2d2d;
            --header-bg: #1a1a1a;
            --sidebar-bg: #1a1a1a;
            --sidebar-text: #e0e0e0;
            --sidebar-hover: #2c2c2c;
            --tab-active: var(--primary-color);
            
            background-color: var(--bg-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Regole globali per tutti gli elementi */
        body.dark-theme * {
            color: var(--text-color);
        }
        
        /* Contenuto principale */
        body.dark-theme #main-content,
        body.dark-theme .main-content,
        body.dark-theme .content-wrapper,
        body.dark-theme .view-container,
        body.dark-theme .dashboard-container,
        body.dark-theme .view {
            background-color: var(--bg-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Card specifiche della dashboard */
        body.dark-theme .dashboard-card,
        body.dark-theme .stat-card,
        body.dark-theme .info-card,
        body.dark-theme [class*="card"],
        body.dark-theme .card-body,
        body.dark-theme .card-header,
        body.dark-theme .card-footer {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        /* Stili specifici per le card nella dashboard */
        body.dark-theme .dashboard-container .card {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i box bianchi nella dashboard */
        body.dark-theme .dashboard-container > div > div {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Tabelle migliorate */
        body.dark-theme table,
        body.dark-theme .table,
        body.dark-theme tbody,
        body.dark-theme thead,
        body.dark-theme tr,
        body.dark-theme th,
        body.dark-theme td {
            background-color: transparent !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        body.dark-theme table,
        body.dark-theme .table {
            background-color: var(--card-bg) !important;
        }
        
        body.dark-theme thead tr,
        body.dark-theme th {
            background-color: #2a2a2a !important;
        }
        
        body.dark-theme tbody tr:nth-child(even) {
            background-color: #1a1a1a !important;
        }
        
        body.dark-theme tbody tr:nth-child(odd) {
            background-color: var(--card-bg) !important;
        }
        
        body.dark-theme tbody tr:hover {
            background-color: var(--hover-color) !important;
        }
        
        /* Stili per i grafici e visualizzazioni */
        body.dark-theme .chart-container,
        body.dark-theme .chart,
        body.dark-theme canvas {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i box di appunti e sezioni speciali */
        body.dark-theme .note-box,
        body.dark-theme .appunti,
        body.dark-theme textarea.app-input {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i bottoni primari e secondari */
        body.dark-theme .btn-primary {
            background-color: var(--primary-color) !important;
            color: white !important;
        }
        
        body.dark-theme .btn-secondary {
            background-color: #3a3a3a !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        body.dark-theme .btn-secondary:hover {
            background-color: #4a4a4a !important;
        }
        
        /* Stili per i bottoni di azione nelle tabelle */
        body.dark-theme .btn-info,
        body.dark-theme .btn-warning,
        body.dark-theme .btn-danger,
        body.dark-theme .btn-success {
            color: white !important;
        }
        
        /* Stili per le intestazioni delle sezioni */
        body.dark-theme .section-header,
        body.dark-theme .view-header {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-bottom: 1px solid var(--border-color) !important;
        }
        
        /* Stili per i box di ricerca */
        body.dark-theme .search-container,
        body.dark-theme .search-input,
        body.dark-theme .filter-container {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i selettori e dropdown */
        body.dark-theme select option {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
        }
        
        /* Stili per i contenitori specifici della dashboard */
        body.dark-theme [id^="view-"] {
            background-color: var(--bg-color) !important;
        }
        
        /* Stili per i contenitori di progetti, clienti, ecc. */
        body.dark-theme #view-clienti,
        body.dark-theme #view-progetti,
        body.dark-theme #view-materiali,
        body.dark-theme #view-preventivi,
        body.dark-theme #view-fatture,
        body.dark-theme #view-impostazioni {
            background-color: var(--bg-color) !important;
        }
        
        /* Stili per i contenitori di elementi nella dashboard */
        body.dark-theme .dashboard-container > div {
            background-color: transparent !important;
        }
        
        /* Stili per gli appunti */
        body.dark-theme textarea,
        body.dark-theme input[type="text"],
        body.dark-theme input[type="search"],
        body.dark-theme input[type="email"],
        body.dark-theme input[type="tel"],
        body.dark-theme input[type="number"],
        body.dark-theme input[type="password"],
        body.dark-theme input:not([type="checkbox"]):not([type="radio"]):not([type="color"]) {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili specifici per la sezione appunti */
        body.dark-theme .appunti,
        body.dark-theme [id*="appunt"],
        body.dark-theme [class*="appunt"],
        body.dark-theme [id*="note"],
        body.dark-theme [class*="note"] {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i campi di ricerca */
        body.dark-theme input[type="search"],
        body.dark-theme .search-box,
        body.dark-theme [id*="search"],
        body.dark-theme [class*="search"],
        body.dark-theme [id*="cerca"],
        body.dark-theme [class*="cerca"],
        body.dark-theme [placeholder*="Cerca"],
        body.dark-theme [placeholder*="cerca"] {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i contenitori di ricerca */
        body.dark-theme .search-container,
        body.dark-theme .filter-container,
        body.dark-theme .search-filter-container {
            background-color: transparent !important;
        }
        
        /* Stili per i box bianchi nella dashboard e nelle altre viste */
        body.dark-theme > div > div,
        body.dark-theme .view > div,
        body.dark-theme .view-container > div,
        body.dark-theme .dashboard-container > div,
        body.dark-theme .content-wrapper > div {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i box di appunti nella dashboard */
        body.dark-theme [id*="appunti"] textarea,
        body.dark-theme [class*="appunti"] textarea,
        body.dark-theme [id*="note"] textarea,
        body.dark-theme [class*="note"] textarea {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i placeholder nei campi di input */
        body.dark-theme ::placeholder {
            color: #999 !important;
            opacity: 1 !important;
        }
        
        /* Stili per i campi di input disabilitati */
        body.dark-theme input:disabled,
        body.dark-theme textarea:disabled,
        body.dark-theme select:disabled {
            background-color: #1a1a1a !important;
            color: #777 !important;
        }
        
        /* Stili per i bottoni di azione negli appunti */
        body.dark-theme [id*="appunti"] button,
        body.dark-theme [class*="appunti"] button,
        body.dark-theme [id*="note"] button,
        body.dark-theme [class*="note"] button {
            background-color: var(--primary-color) !important;
            color: white !important;
        }
        
        /* Stili migliorati per i filtri */
        body.dark-theme .filter-container,
        body.dark-theme .filter-panel,
        body.dark-theme .filter-box,
        body.dark-theme .filter-dropdown,
        body.dark-theme .filter-popup,
        body.dark-theme .filter-menu,
        body.dark-theme .filters-wrapper,
        body.dark-theme [id*="filtri"],
        body.dark-theme [class*="filtri"],
        body.dark-theme [id*="filter"],
        body.dark-theme [class*="filter"] {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i contenitori di filtri */
        body.dark-theme .filter-container > div,
        body.dark-theme .filter-panel > div,
        body.dark-theme .filter-box > div,
        body.dark-theme .filter-dropdown > div,
        body.dark-theme .filter-popup > div,
        body.dark-theme .filter-menu > div {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
        }
        
        /* Stili per le etichette nei filtri */
        body.dark-theme .filter-container label,
        body.dark-theme .filter-panel label,
        body.dark-theme .filter-box label,
        body.dark-theme .filter-dropdown label,
        body.dark-theme .filter-popup label,
        body.dark-theme .filter-menu label,
        body.dark-theme [id*="filtri"] label,
        body.dark-theme [class*="filtri"] label,
        body.dark-theme [id*="filter"] label,
        body.dark-theme [class*="filter"] label {
            color: var(--text-color) !important;
        }
        
        /* Stili per i select nei filtri */
        body.dark-theme .filter-container select,
        body.dark-theme .filter-panel select,
        body.dark-theme .filter-box select,
        body.dark-theme .filter-dropdown select,
        body.dark-theme .filter-popup select,
        body.dark-theme .filter-menu select,
        body.dark-theme [id*="filtri"] select,
        body.dark-theme [class*="filtri"] select,
        body.dark-theme [id*="filter"] select,
        body.dark-theme [class*="filter"] select {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i bottoni nei filtri */
        body.dark-theme .filter-container button,
        body.dark-theme .filter-panel button,
        body.dark-theme .filter-box button,
        body.dark-theme .filter-dropdown button,
        body.dark-theme .filter-popup button,
        body.dark-theme .filter-menu button,
        body.dark-theme [id*="filtri"] button,
        body.dark-theme [class*="filtri"] button,
        body.dark-theme [id*="filter"] button,
        body.dark-theme [class*="filter"] button,
        body.dark-theme button[id*="reset"],
        body.dark-theme button[class*="reset"],
        body.dark-theme button:contains("Resetta") {
            background-color: #3a3a3a !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        /* Stili per il bottone di reset filtri */
        body.dark-theme .reset-filters,
        body.dark-theme button[id*="reset"],
        body.dark-theme button[class*="reset"],
        body.dark-theme button:contains("Resetta"),
        body.dark-theme [id*="resetta"],
        body.dark-theme [class*="resetta"] {
            background-color: #3a3a3a !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        /* Stili per i popup di filtro */
        body.dark-theme .filter-popup,
        body.dark-theme .filter-panel,
        body.dark-theme .filter-dropdown,
        body.dark-theme .filter-menu,
        body.dark-theme .dropdown-menu,
        body.dark-theme .popup-filter {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: 0 4px 8px var(--shadow-color) !important;
        }
        
        /* Stili per i contenitori bianchi nei filtri */
        body.dark-theme .filter-container > div,
        body.dark-theme .filter-panel > div,
        body.dark-theme .filter-box > div,
        body.dark-theme .filter-dropdown > div,
        body.dark-theme .filter-popup > div,
        body.dark-theme .filter-menu > div,
        body.dark-theme .dropdown-menu > div {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
        }
        
        /* Stili per i popup di filtro aperti */
        body.dark-theme .filter-popup.active,
        body.dark-theme .filter-panel.active,
        body.dark-theme .filter-dropdown.active,
        body.dark-theme .filter-menu.active,
        body.dark-theme .dropdown-menu.active,
        body.dark-theme .popup-filter.active {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: 0 4px 8px var(--shadow-color) !important;
        }
        
        /* Stili per i popup di filtro con sfondo bianco */
        body.dark-theme .filter-popup.white-bg,
        body.dark-theme .filter-panel.white-bg,
        body.dark-theme .filter-dropdown.white-bg,
        body.dark-theme .filter-menu.white-bg,
        body.dark-theme .dropdown-menu.white-bg,
        body.dark-theme .popup-filter.white-bg {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
        }
        
        /* Stili per i dropdown e select */
        body.dark-theme select,
        body.dark-theme .dropdown,
        body.dark-theme .select,
        body.dark-theme .custom-select,
        body.dark-theme .app-select {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per le opzioni nei dropdown */
        body.dark-theme option,
        body.dark-theme select option,
        body.dark-theme .dropdown-item {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
        }
        
        /* Stili per i dropdown aperti */
        body.dark-theme select:focus,
        body.dark-theme .dropdown.show,
        body.dark-theme .dropdown-menu,
        body.dark-theme .dropdown-content,
        body.dark-theme .filter-dropdown {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
            box-shadow: 0 4px 8px var(--shadow-color) !important;
        }
        
        /* Stili per i popup di filtro */
        body.dark-theme .filter-popup,
        body.dark-theme .filter-panel,
        body.dark-theme .filter-dropdown,
        body.dark-theme .filter-menu,
        body.dark-theme .dropdown-menu {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: 0 4px 8px var(--shadow-color) !important;
        }
        
        /* Stili per i bottoni di filtro */
        body.dark-theme .filter-button,
        body.dark-theme .filter-toggle,
        body.dark-theme button[id*="filter"],
        body.dark-theme button[class*="filter"],
        body.dark-theme .btn-filter,
        body.dark-theme .reset-filters,
        body.dark-theme button:contains("Filtri"),
        body.dark-theme button:contains("Resetta") {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i popup bianchi */
        body.dark-theme .popup,
        body.dark-theme .popup-content,
        body.dark-theme .modal-dialog,
        body.dark-theme .modal-content,
        body.dark-theme .dropdown-menu,
        body.dark-theme .context-menu,
        body.dark-theme .tooltip {
            background-color: var(--card-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i selettori di data */
        body.dark-theme input[type="date"],
        body.dark-theme input[type="datetime"],
        body.dark-theme input[type="datetime-local"],
        body.dark-theme input[type="month"],
        body.dark-theme input[type="time"],
        body.dark-theme input[type="week"],
        body.dark-theme .date-picker,
        body.dark-theme .time-picker {
            background-color: var(--input-bg) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Stili per i toggle switch */
        body.dark-theme .toggle-switch,
        body.dark-theme .switch,
        body.dark-theme .custom-switch {
            background-color: transparent !important;
        }
        
        body.dark-theme .toggle-switch label,
        body.dark-theme .switch label,
        body.dark-theme .custom-switch label {
            background-color: #444 !important;
        }
        
        body.dark-theme .toggle-switch input:checked + label,
        body.dark-theme .switch input:checked + label,
        body.dark-theme .custom-switch input:checked + label {
            background-color: var(--primary-color) !important;
        }
        
        /* Stili per i bottoni di reset filtri */
        body.dark-theme .reset-filters,
        body.dark-theme button[id*="reset"],
        body.dark-theme button[class*="reset"],
        body.dark-theme button:contains("Resetta") {
            background-color: #3a3a3a !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        /* ... existing styles ... */
    `;
    
    document.head.appendChild(style);
}

// Modifica la funzione applyTheme per estrarre i valori RGB dal colore primario
function applyTheme() {
    const interfaccia = window.appData.impostazioni.interfaccia;
    
    // Applica il tema chiaro/scuro
    if (interfaccia.tema === 'scuro') {
        document.body.classList.add('dark-theme');
        
        // Estrai i valori RGB dal colore primario per usarli nelle variabili CSS
        const primaryColor = interfaccia.colorePrimario;
        const rgbValues = hexToRgb(primaryColor);
        if (rgbValues) {
            document.documentElement.style.setProperty('--primary-color-rgb', `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`);
        }
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Applica i colori personalizzati
    document.documentElement.style.setProperty('--primary-color', interfaccia.colorePrimario);
    document.documentElement.style.setProperty('--secondary-color', interfaccia.coloreSecondario);
    
    // Applica il font
    document.documentElement.style.setProperty('--font-family', interfaccia.fontPrincipale);
    
    // Applica la dimensione del font
    let rootFontSize = '16px'; // Dimensione predefinita (media)
    
    switch(interfaccia.dimensioneFont) {
        case 'piccola':
            rootFontSize = '14px';
            break;
        case 'media':
            rootFontSize = '16px';
            break;
        case 'grande':
            rootFontSize = '18px';
            break;
    }
    
    document.documentElement.style.setProperty('--font-size-base', rootFontSize);
    
    // Salva le preferenze nel localStorage per mantenerle tra le sessioni
    localStorage.setItem('theme', interfaccia.tema);
}

// Funzione helper per convertire colore hex in RGB
function hexToRgb(hex) {
    // Rimuovi # se presente
    hex = hex.replace(/^#/, '');
    
    // Converti in formato standard a 6 cifre
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Estrai i valori RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return {r, g, b};
}

// Inizializza gli stili del tema all'avvio
document.addEventListener('DOMContentLoaded', function() {
    addDarkThemeStyles();
    
    // Inizializza il tema dopo che i dati sono stati caricati
    if (window.appData) {
        initTheme();
    } else {
        // Se i dati non sono ancora disponibili, aspetta che vengano caricati
        document.addEventListener('appDataLoaded', function() {
            initTheme();
        });
    }
});