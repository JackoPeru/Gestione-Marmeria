// File principale dell'applicazione
import { loadView } from './events.js';

// Assicurati che il DOM sia caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Inizializza l'applicazione
function initApp() {
    console.log('Inizializzazione applicazione Gestione Marmeria');
    
    // Verifica che tutti i moduli siano caricati correttamente
    checkModules();
    
    // Carica la vista iniziale (se non è già stata caricata da events.js)
    if (!document.querySelector('.view[style*="display: block"]')) {
        loadView('dashboard');
    }
}

// Verifica che tutti i moduli siano caricati correttamente
function checkModules() {
    const requiredModules = [
        'utils.js',
        'clienti.js',
        'progetti.js',
        'materiali.js',
        'preventivi.js',
        'fatture.js',
        'documenti.js',
        'impostazioni.js',
        'dashboard.js',
        'events.js'
    ];
    
    console.log('Verifica dei moduli in corso...');
    
    // Questa è solo una verifica di base, non può realmente controllare se i moduli sono caricati
    // ma può aiutare a identificare problemi di importazione nei moduli
    
    // In un'applicazione reale, potresti implementare un sistema più robusto di verifica dei moduli
}