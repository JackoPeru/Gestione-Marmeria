// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM caricato, inizializzazione applicazione");
    
    try {
        // Inizializza i dati
        initAppData(); // Modificato da initSampleData a initAppData
        
        // Crea il contenitore principale se non esiste
        if (!document.getElementById('main-content')) {
            console.log("Creazione contenitore principale");
            const mainContent = document.createElement('div');
            mainContent.id = 'main-content';
            mainContent.className = 'content-area';
            
            // Trova la sidebar per posizionare il contenuto accanto ad essa
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                // Inserisci il contenitore principale dopo la sidebar
                sidebar.after(mainContent);
            } else {
                // Se non c'è sidebar, aggiungi al body
                document.body.appendChild(mainContent);
            }
        }
        
        // Inizializza le viste
        initViews();
        
        // Carica la vista iniziale (dashboard)
        loadView('dashboard');
        
        // Gestisci la navigazione
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const viewName = this.getAttribute('data-view');
                if (viewName) {
                    loadView(viewName);
                }
            });
        });
        
        console.log("Applicazione inizializzata con successo");
    } catch (error) {
        console.error("Errore durante l'inizializzazione dell'applicazione:", error);
    }
});

// Funzione per inizializzare le viste dell'applicazione
function initViews() {
    console.log("Inizializzazione delle viste dell'applicazione");
    
    // Ottieni il contenitore principale
    const mainContainer = document.getElementById('main-content');
    if (!mainContainer) {
        console.error("Contenitore principale non trovato");
        return;
    }
    
    // Crea le viste principali se non esistono
    const views = ['dashboard', 'clienti', 'progetti', 'materiali', 'preventivi', 'fatture', 'impostazioni'];
    
    views.forEach(viewName => {
        if (!document.getElementById(`view-${viewName}`)) {
            console.log(`Creazione vista: ${viewName}`);
            const viewElement = document.createElement('div');
            viewElement.id = `view-${viewName}`;
            viewElement.className = 'view';
            viewElement.style.display = 'none';
            mainContainer.appendChild(viewElement);
        }
    });
    
    console.log("Viste inizializzate con successo");
}

// Funzione per caricare una vista specifica
function loadView(viewName) {
    console.log("Caricamento vista:", viewName);
    
    // Nascondi tutte le viste
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Ottieni l'elemento della vista
    let viewElement = document.getElementById(`view-${viewName}`);
    
    // Se l'elemento non esiste, crealo
    if (!viewElement) {
        console.log(`Creazione elemento view-${viewName}`);
        const mainContainer = document.getElementById('main-content');
        
        if (!mainContainer) {
            console.error("Contenitore principale non trovato");
            return;
        }
        
        viewElement = document.createElement('div');
        viewElement.id = `view-${viewName}`;
        viewElement.className = 'view';
        mainContainer.appendChild(viewElement);
    }
    
    // Mostra la vista
    viewElement.style.display = 'block';
    
    // Aggiorna la classe active nella navigazione
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        }
    });
    
    // Carica i dati specifici per la vista
    switch (viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'clienti':
            renderClienti();
            break;
        case 'progetti':
            renderProgetti();
            break;
        case 'materiali':
            renderMateriali();
            break;
        case 'preventivi':
            renderPreventivi();
            break;
        case 'fatture':
            renderFatture();
            break;
        case 'impostazioni':
            renderImpostazioni();
            break;
    }
}

// Inizializza i dati di esempio se non esistono
function initSampleData() {
    console.log("Inizializzazione dati di esempio");
    
    // Clienti di esempio
    window.appData.clienti = [
        { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@email.it', telefono: '333-1234567', indirizzo: 'Via Roma 123, Milano', dataRegistrazione: '2022-05-10' },
        { id: 2, nome: 'Giuseppe', cognome: 'Verdi', email: 'giuseppe.verdi@email.it', telefono: '333-7654321', indirizzo: 'Via Milano 45, Roma', dataRegistrazione: '2022-08-15' }
    ];
    
    // Materiali di esempio
    window.appData.materiali = [
        { id: 1, codice: 'MAR-001', nome: 'Marmo di Carrara', categoria: 'Marmo', fornitore: 'Cava Toscana S.r.l.', quantita: 15, unitaMisura: 'Lastre', prezzoUnitario: 450.00 },
        { id: 2, codice: 'GRA-001', nome: 'Granito Rosa Beta', categoria: 'Granito', fornitore: 'Graniti Italia S.r.l.', quantita: 12, unitaMisura: 'Lastre', prezzoUnitario: 320.00 }
    ];
    
    // Progetti di esempio
    window.appData.progetti = [
        { id: 1, titolo: 'Piano Cucina in Marmo', descrizione: 'Realizzazione di un piano cucina in marmo di Carrara con lavello integrato.', dataInizio: '2023-10-15', dataFine: null, stato: 'In Corso', clienteId: 1, costoTotale: 2500.00 }
    ];
    
    // Preventivi di esempio
    window.appData.preventivi = [
        { id: 1, numero: 'P-2023-001', data: '2023-10-25', dataScadenza: '2023-11-25', descrizione: 'Pavimentazione in granito per salone di 50mq', importo: 4800.00, aliquotaIVA: 22, stato: 'Approvato', clienteId: 2 }
    ];
    
    // Fatture di esempio
    window.appData.fatture = [
        { id: 1, numero: 'F-2023-001', data: '2023-10-30', dataScadenza: '2023-11-30', descrizione: 'Pavimentazione in granito per salone di 50mq', importo: 4800.00, aliquotaIVA: 22, stato: 'Pagata', clienteId: 2, dataPagamento: '2023-11-15', metodoPagamento: 'Bonifico Bancario' }
    ];
    
    console.log("Dati di esempio inizializzati");
}

// Funzione per navigare tra le diverse sezioni dell'app con supporto per filtri
// Funzione per navigare tra le diverse viste dell'applicazione
// Modifica nella funzione navigateTo per assicurarsi che il filtro venga passato correttamente
function navigateTo(section, action = 'list', id = null, options = {}) {
    console.log(`Navigazione a: ${section}, azione: ${action}, id: ${id}, opzioni:`, options);
    
    // Verifica se la vista esiste, altrimenti creala
    let viewElement = document.getElementById(`view-${section}`);
    if (!viewElement) {
        console.log(`Vista ${section} non trovata, creazione...`);
        const mainContainer = document.getElementById('main-content');
        if (mainContainer) {
            viewElement = document.createElement('div');
            viewElement.id = `view-${section}`;
            viewElement.className = 'view';
            mainContainer.appendChild(viewElement);
        } else {
            console.error("Contenitore principale non trovato");
            return;
        }
    }
    
    // Nascondi tutte le viste
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Mostra la vista richiesta
    viewElement.style.display = 'block';
    
    // Aggiorna la classe attiva nel menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === section) {
            link.classList.add('active');
        }
    });
    
    // Esegui l'azione appropriata in base alla sezione
    switch (section) {
        case 'progetti':
            if (action === 'list') {
                // Assicurati di passare le opzioni a renderProgetti
                console.log("Passaggio opzioni a renderProgetti:", options);
                // Aggiungi un timeout come per le fatture
                setTimeout(() => {
                    renderProgetti(options);
                }, 100);
            } else if (action === 'view') {
                showProgettoDetails(id);
            } else if (action === 'edit' && id) {
                editProgetto(id);
            }
            break;
        case 'dashboard':
            renderDashboard();
            break;
        case 'clienti':
            if (action === 'view' && id) {
                viewCliente(id);
            } else if (action === 'edit' && id) {
                editCliente(id);
            } else {
                // Aggiungiamo un timeout per assicurarci che la vista sia completamente caricata
                setTimeout(() => {
                    renderClienti();
                }, 100);
            }
            break;
        case 'materiali':
            if (action === 'view' && id) {
                viewMateriale(id);
            } else if (action === 'edit' && id) {
                editMateriale(id);
            } else {
                renderMateriali();
            }
            break;
        case 'preventivi':
            if (action === 'view' && id) {
                viewPreventivo(id);
            } else if (action === 'edit' && id) {
                editPreventivo(id);
            } else {
                renderPreventivi();
            }
            break;
        case 'fatture':
            if (action === 'list') {
                // Assicurati che la vista sia completamente caricata prima di renderizzare
                setTimeout(() => {
                    renderFatture(options);
                }, 100);
            } else if (action === 'detail' && id) {
                showFatturaDetails(id);
            }
            break;
            
        // Aggiungi altre sezioni qui
    }
}

// Funzione per aggiornare l'URL con i parametri di navigazione
function updateURL(section, action, id, options) {
    const url = new URL(window.location.href);
    url.searchParams.set('section', section);
    url.searchParams.set('action', action);
    
    if (id) {
        url.searchParams.set('id', id);
    } else {
        url.searchParams.delete('id');
    }
    
    // Aggiungi eventuali opzioni all'URL
    if (options && Object.keys(options).length > 0) {
        for (const [key, value] of Object.entries(options)) {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        }
    }
    
    // Aggiorna l'URL senza ricaricare la pagina
    window.history.pushState({}, '', url);
}

// Aggiungi queste funzioni alla fine del file app.js

// Funzione per visualizzare i dettagli di un progetto
function showProgettoDetails(progettoId) {
    console.log(`Visualizzazione dettagli progetto: ${progettoId}`);
    
    // Trova il progetto
    const progetto = window.appData.progetti.find(p => p.id == progettoId);
    if (!progetto) {
        console.error(`Progetto con ID ${progettoId} non trovato`);
        return;
    }
    
    // Naviga alla vista progetti con un filtro che mostra solo progetti "In Corso" e "In Attesa"
    navigateTo('progetti', 'list', null, { filter: 'daFare', selectedId: progettoId });
}

// Funzione per visualizzare i dettagli di una fattura
function showFatturaDetails(fatturaId) {
    console.log(`Visualizzazione dettagli fattura: ${fatturaId}`);
    
    // Trova la fattura
    const fattura = window.appData.fatture.find(f => f.id == fatturaId);
    if (!fattura) {
        console.error(`Fattura con ID ${fatturaId} non trovata`);
        return;
    }
    
    // Naviga alla vista fatture
    navigateTo('fatture');
    
    // Qui puoi implementare la logica per mostrare i dettagli della fattura
    // Per esempio, selezionare la fattura nella lista o aprire un modal
    
    // Per ora, mostriamo un alert con alcune informazioni
    setTimeout(() => {
        alert(`Dettagli Fattura #${fattura.numero || fattura.id}:\nImporto: ${formatCurrency(fattura.importo)}\nStato: ${fattura.stato}\nData: ${formatDate(fattura.data)}`);
    }, 500);
}

// Rendi le funzioni disponibili globalmente
window.showProgettoDetails = showProgettoDetails;
window.showFatturaDetails = showFatturaDetails;

// Aggiungi questa funzione per mantenere la compatibilità con il codice esistente
function viewProgetto(progettoId) {
    console.log(`viewProgetto chiamata per ID: ${progettoId}`);
    // Qui potremmo richiamare la tua showProgettoDetails
    showProgettoDetails(progettoId);
}

// Rendi la funzione globale se ti serve
window.viewProgetto = viewProgetto;


// Aggiungi questa funzione per navigare ai progetti in corso
function navigateToProgettiInCorso() {
    // Prima naviga alla pagina progetti
    navigateTo('progetti');
    
    // Imposta una variabile globale per indicare che dobbiamo filtrare per progetti in corso
    window.applyProgettiInCorsoFilter = true;
}

// Rendi la funzione disponibile globalmente
window.navigateToProgettiInCorso = navigateToProgettiInCorso;


// Inizializza i dati dell'applicazione
function initAppData() {
    console.log("Inizializzazione dati applicazione");
    
    // Se appData non esiste, crealo
    if (!window.appData) {
        window.appData = {
            clienti: [],
            progetti: [],
            materiali: [],
            preventivi: [],
            fatture: [],
            impostazioni: {
                nomeAzienda: 'Marmeria',
                partitaIVA: '12345678901',
                indirizzo: 'Via Roma 123, Milano',
                telefono: '02-1234567',
                email: 'info@marmeria.it',
                aliquotaIVA: 22,
                valuta: 'EUR'
            }
        };
    }
    
    // Prova a caricare i dati dal localStorage
    if (!loadAppData()) {
        // Se non ci sono dati salvati, inizializza con dati di esempio
        initSampleData();
        // Salva i dati
        saveAppData();
    }
    
    return true;
}

// Funzione per salvare i dati dell'applicazione
function saveAppData() {
    try {
        console.log("Salvataggio dati applicazione...");
        
        // Verifica che appData esista
        if (!window.appData) {
            console.error("appData non esiste");
            return false;
        }
        
        const dataToSave = JSON.stringify(window.appData);
        localStorage.setItem('marmeriaData', dataToSave);
        
        console.log("Dati salvati con successo");
        return true;
    } catch (error) {
        console.error("Errore durante il salvataggio dei dati:", error);
        return false;
    }
}

// Funzione per caricare i dati dell'applicazione
function loadAppData() {
    try {
        console.log("Caricamento dati applicazione...");
        const data = localStorage.getItem('marmeriaData');
        
        if (data) {
            const parsedData = JSON.parse(data);
            
            // Verifica che i dati abbiano la struttura corretta
            if (parsedData && typeof parsedData === 'object') {
                window.appData = parsedData;
                console.log("Dati caricati con successo");
                return true;
            }
        }
        
        console.log("Nessun dato valido trovato");
        return false;
    } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        return false;
    }
}

// Inizializza i dati di esempio se non esistono
function initSampleData() {
    console.log("Inizializzazione dati di esempio");
    
    // Clienti di esempio
    window.appData.clienti = [
        { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@email.it', telefono: '333-1234567', indirizzo: 'Via Roma 123, Milano', dataRegistrazione: '2022-05-10' },
        { id: 2, nome: 'Giuseppe', cognome: 'Verdi', email: 'giuseppe.verdi@email.it', telefono: '333-7654321', indirizzo: 'Via Milano 45, Roma', dataRegistrazione: '2022-08-15' }
    ];
    
    // Materiali di esempio
    window.appData.materiali = [
        { id: 1, codice: 'MAR-001', nome: 'Marmo di Carrara', categoria: 'Marmo', fornitore: 'Cava Toscana S.r.l.', quantita: 15, unitaMisura: 'Lastre', prezzoUnitario: 450.00 },
        { id: 2, codice: 'GRA-001', nome: 'Granito Rosa Beta', categoria: 'Granito', fornitore: 'Graniti Italia S.r.l.', quantita: 12, unitaMisura: 'Lastre', prezzoUnitario: 320.00 }
    ];
    
    // Progetti di esempio
    window.appData.progetti = [
        { id: 1, titolo: 'Piano Cucina in Marmo', descrizione: 'Realizzazione di un piano cucina in marmo di Carrara con lavello integrato.', dataInizio: '2023-10-15', dataFine: null, stato: 'In Corso', clienteId: 1, costoTotale: 2500.00 }
    ];
    
    // Preventivi di esempio
    window.appData.preventivi = [
        { id: 1, numero: 'P-2023-001', data: '2023-10-25', dataScadenza: '2023-11-25', descrizione: 'Pavimentazione in granito per salone di 50mq', importo: 4800.00, aliquotaIVA: 22, stato: 'Approvato', clienteId: 2 }
    ];
    
    // Fatture di esempio
    window.appData.fatture = [
        { id: 1, numero: 'F-2023-001', data: '2023-10-30', dataScadenza: '2023-11-30', descrizione: 'Pavimentazione in granito per salone di 50mq', importo: 4800.00, aliquotaIVA: 22, stato: 'Pagata', clienteId: 2, dataPagamento: '2023-11-15', metodoPagamento: 'Bonifico Bancario' }
    ];
    
    console.log("Dati di esempio inizializzati");
}

// Funzione per navigare tra le diverse sezioni dell'app con supporto per filtri
// Funzione per navigare tra le diverse viste dell'applicazione
// Modifica nella funzione navigateTo per assicurarsi che il filtro venga passato correttamente
function navigateTo(section, action = 'list', id = null, options = {}) {
    console.log(`Navigazione a: ${section}, azione: ${action}, id: ${id}, opzioni:`, options);
    
    // Verifica se la vista esiste, altrimenti creala
    let viewElement = document.getElementById(`view-${section}`);
    if (!viewElement) {
        console.log(`Vista ${section} non trovata, creazione...`);
        const mainContainer = document.getElementById('main-content');
        if (mainContainer) {
            viewElement = document.createElement('div');
            viewElement.id = `view-${section}`;
            viewElement.className = 'view';
            mainContainer.appendChild(viewElement);
        } else {
            console.error("Contenitore principale non trovato");
            return;
        }
    }
    
    // Nascondi tutte le viste
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Mostra la vista richiesta
    viewElement.style.display = 'block';
    
    // Aggiorna la classe attiva nel menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === section) {
            link.classList.add('active');
        }
    });
    
    // Esegui l'azione appropriata in base alla sezione
    switch (section) {
        case 'progetti':
            if (action === 'list') {
                // Assicurati di passare le opzioni a renderProgetti
                console.log("Passaggio opzioni a renderProgetti:", options);
                // Aggiungi un timeout come per le fatture
                setTimeout(() => {
                    renderProgetti(options);
                }, 100);
            } else if (action === 'view') {
                showProgettoDetails(id);
            } else if (action === 'edit' && id) {
                editProgetto(id);
            }
            break;
        case 'dashboard':
            renderDashboard();
            break;
        case 'clienti':
            if (action === 'view' && id) {
                viewCliente(id);
            } else if (action === 'edit' && id) {
                editCliente(id);
            } else {
                // Aggiungiamo un timeout per assicurarci che la vista sia completamente caricata
                setTimeout(() => {
                    renderClienti();
                }, 100);
            }
            break;
        case 'materiali':
            if (action === 'view' && id) {
                viewMateriale(id);
            } else if (action === 'edit' && id) {
                editMateriale(id);
            } else {
                renderMateriali();
            }
            break;
        case 'preventivi':
            if (action === 'view' && id) {
                viewPreventivo(id);
            } else if (action === 'edit' && id) {
                editPreventivo(id);
            } else {
                renderPreventivi();
            }
            break;
        case 'fatture':
            if (action === 'list') {
                // Assicurati che la vista sia completamente caricata prima di renderizzare
                setTimeout(() => {
                    renderFatture(options);
                }, 100);
            } else if (action === 'detail' && id) {
                showFatturaDetails(id);
            }
            break;
            
        // Aggiungi altre sezioni qui
    }
}

// Funzione per aggiornare l'URL con i parametri di navigazione
function updateURL(section, action, id, options) {
    const url = new URL(window.location.href);
    url.searchParams.set('section', section);
    url.searchParams.set('action', action);
    
    if (id) {
        url.searchParams.set('id', id);
    } else {
        url.searchParams.delete('id');
    }
    
    // Aggiungi eventuali opzioni all'URL
    if (options && Object.keys(options).length > 0) {
        for (const [key, value] of Object.entries(options)) {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        }
    }
    
    // Aggiorna l'URL senza ricaricare la pagina
    window.history.pushState({}, '', url);
}

// Aggiungi queste funzioni alla fine del file app.js

// Funzione per visualizzare i dettagli di un progetto
function showProgettoDetails(progettoId) {
    console.log(`Visualizzazione dettagli progetto: ${progettoId}`);
    
    // Trova il progetto
    const progetto = window.appData.progetti.find(p => p.id == progettoId);
    if (!progetto) {
        console.error(`Progetto con ID ${progettoId} non trovato`);
        return;
    }
    
    // Naviga alla vista progetti con un filtro che mostra solo progetti "In Corso" e "In Attesa"
    navigateTo('progetti', 'list', null, { filter: 'daFare', selectedId: progettoId });
}

// Funzione per visualizzare i dettagli di una fattura
function showFatturaDetails(fatturaId) {
    console.log(`Visualizzazione dettagli fattura: ${fatturaId}`);
    
    // Trova la fattura
    const fattura = window.appData.fatture.find(f => f.id == fatturaId);
    if (!fattura) {
        console.error(`Fattura con ID ${fatturaId} non trovata`);
        return;
    }
    
    // Naviga alla vista fatture
    navigateTo('fatture');
    
    // Qui puoi implementare la logica per mostrare i dettagli della fattura
    // Per esempio, selezionare la fattura nella lista o aprire un modal
    
    // Per ora, mostriamo un alert con alcune informazioni
    setTimeout(() => {
        alert(`Dettagli Fattura #${fattura.numero || fattura.id}:\nImporto: ${formatCurrency(fattura.importo)}\nStato: ${fattura.stato}\nData: ${formatDate(fattura.data)}`);
    }, 500);
}

// Rendi le funzioni disponibili globalmente
window.showProgettoDetails = showProgettoDetails;
window.showFatturaDetails = showFatturaDetails;

// Aggiungi questa funzione per mantenere la compatibilità con il codice esistente
function viewProgetto(progettoId) {
    console.log(`viewProgetto chiamata per ID: ${progettoId}`);
    // Qui potremmo richiamare la tua showProgettoDetails
    showProgettoDetails(progettoId);
}

// Rendi la funzione globale se ti serve
window.viewProgetto = viewProgetto;


// Aggiungi questa funzione per navigare ai progetti in corso
function navigateToProgettiInCorso() {
    // Prima naviga alla pagina progetti
    navigateTo('progetti');
    
    // Imposta una variabile globale per indicare che dobbiamo filtrare per progetti in corso
    window.applyProgettiInCorsoFilter = true;
}

// Rendi la funzione disponibile globalmente
window.navigateToProgettiInCorso = navigateToProgettiInCorso;


// Improved initialization function
function initApp() {
    console.log("Inizializzazione applicazione...");
    
    // Initialize the application data structure if it doesn't exist
    if (!window.appData) {
        window.appData = {
            clienti: [],
            progetti: [],
            materiali: [],
            preventivi: [],
            fatture: [],
            impostazioni: {}
        };
    }
    
    // Make saveAppData and loadAppData available globally
    window.saveAppData = saveAppData;
    window.loadAppData = loadAppData;
    
    // Try to load saved data first
    if (!loadAppData()) {
        // If no saved data exists, initialize with sample data
        initSampleData();
        // Save the sample data immediately
        saveAppData();
    }
    
    // Initialize settings
    initImpostazioni();
    
    // Apply theme
    applyTheme();
    
    // Setup events
    setupEvents();
    
    // Render the initial view (dashboard)
    renderCurrentView();
    
    console.log("Applicazione inizializzata");
}

// Add event listener to save data before page unload
window.addEventListener('beforeunload', () => {
    saveAppData();
});

