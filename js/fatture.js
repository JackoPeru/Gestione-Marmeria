// Gestione delle fatture

// Funzione per renderizzare le fatture con filtro
function renderFatture(options = {}) {
    // Verifica che appData esista e contenga fatture
    if (!window.appData || !window.appData.fatture) {
        console.warn('Dati delle fatture non disponibili');
        return;
    }
    
    // Ottieni tutte le fatture
    let fatture = [...window.appData.fatture];
    
    // Applica il filtro se specificato
    if (options.filter === 'nonPagate') {
        fatture = fatture.filter(f => f.stato !== 'Pagata' && f.stato !== 'Annullata');
        
        // Aggiungi un indicatore di filtro
        const viewContent = document.querySelector('#view-fatture .view-content');
        
        if (viewContent) {
            const filterIndicator = document.createElement('div');
            filterIndicator.className = 'filter-indicator';
            filterIndicator.innerHTML = `
                <span>Filtro attivo: Fatture da pagare</span>
                <button class="btn-clear-filter" title="Rimuovi filtro">×</button>
            `;
            
            const existingIndicator = viewContent.querySelector('.filter-indicator');
            
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            viewContent.insertBefore(filterIndicator, viewContent.firstChild);
            
            // Aggiungi event listener per rimuovere il filtro
            filterIndicator.querySelector('.btn-clear-filter').addEventListener('click', function() {
                renderFatture();
            });
        }
    }
    
    // Ordina le fatture (più recenti prima)
    fatture.sort((a, b) => {
        return new Date(b.data) - new Date(a.data);
    });
    
    // Ottieni l'elemento della lista
    const fattureList = document.getElementById('fatture-list');
    if (!fattureList) {
        return;
    }
    
    // Svuota la lista
    fattureList.innerHTML = '';
    
    // Se non ci sono fatture
    if (fatture.length === 0) {
        fattureList.innerHTML = '<tr><td colspan="6" class="no-results">Nessuna fattura trovata</td></tr>';
        return;
    }
    
    // Popola la lista con le fatture
    fatture.forEach(fattura => {
        const cliente = window.appData.clienti.find(c => c.id === fattura.clienteId) || { nome: 'N/D', cognome: '' };
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fattura.numero || 'N/D'}</td>
            <td>${cliente.nome} ${cliente.cognome}</td>
            <td>${fattura.data || 'N/D'}</td>
            <td>${formatCurrency(fattura.importo)}</td>
            <td>${fattura.stato}</td>
            <td>
                <button class="btn-view" data-id="${fattura.id}">👁️</button>
                <button class="btn-edit" data-id="${fattura.id}">✏️</button>
                <button class="btn-delete" data-id="${fattura.id}">🗑️</button>
                <button class="btn-paid" data-id="${fattura.id}">💰</button>
                <button class="btn-cancel" data-id="${fattura.id}">❌</button>
            </td>
        `;
        fattureList.appendChild(row);
    });
    
    // Aggiungi gli event listener ai pulsanti
    setupFatturaButtons();
}

// Aggiungi queste funzioni per gestire lo stato delle fatture
function impostaFatturaPagata(fatturaId) {
    console.log(`Impostazione fattura ${fatturaId} come pagata`);
    
    // Trova la fattura nell'array
    const fattura = window.appData.fatture.find(f => f.id === fatturaId);
    if (!fattura) {
        console.error(`Fattura con ID ${fatturaId} non trovata`);
        return;
    }
    
    // Chiedi conferma all'utente
    if (confirm(`Sei sicuro di voler impostare la fattura "${fattura.numero || fattura.id}" come pagata?`)) {
        // Imposta lo stato a "Pagata"
        fattura.stato = 'Pagata';
        
        // Salva i dati
        saveData();
        
        // Aggiorna la visualizzazione delle fatture
        renderFatture();
        
        // Mostra un messaggio di conferma
        showNotification('Fattura impostata come pagata con successo!');
    }
}

function impostaFatturaAnnullata(fatturaId) {
    console.log(`Impostazione fattura ${fatturaId} come annullata`);
    
    // Trova la fattura nell'array
    const fattura = window.appData.fatture.find(f => f.id === fatturaId);
    if (!fattura) {
        console.error(`Fattura con ID ${fatturaId} non trovata`);
        return;
    }
    
    // Chiedi conferma all'utente
    if (confirm(`Sei sicuro di voler annullare la fattura "${fattura.numero || fattura.id}"?`)) {
        // Imposta lo stato a "Annullata"
        fattura.stato = 'Annullata';
        
        // Salva i dati
        saveData();
        
        // Aggiorna la visualizzazione delle fatture
        renderFatture();
        
        // Mostra un messaggio di conferma
        showNotification('Fattura annullata con successo!');
    }
}

// Rendi le funzioni disponibili globalmente
window.impostaFatturaPagata = impostaFatturaPagata;
window.impostaFatturaAnnullata = impostaFatturaAnnullata;

// Funzione per caricare i dati dal localStorage
function loadData() {
    try {
        const savedData = localStorage.getItem('marmeriaData');
        if (savedData) {
            window.appData = JSON.parse(savedData);
            console.log('Dati caricati con successo');
        } else {
            // Inizializza con dati vuoti se non ci sono dati salvati
            window.appData = { 
                fatture: [],
                clienti: [],
                preventivi: []
            };
            console.log('Nessun dato salvato trovato, inizializzati dati vuoti');
        }
    } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
        // Inizializza con dati vuoti in caso di errore
        window.appData = { 
            fatture: [],
            clienti: [],
            preventivi: []
        };
    }
}

// Funzione per salvare i dati nel localStorage
function saveData() {
    try {
        localStorage.setItem('marmeriaData', JSON.stringify(window.appData));
        console.log('Dati salvati con successo');
    } catch (error) {
        console.error('Errore durante il salvataggio dei dati:', error);
    }
}

// Inizializza la gestione delle fatture
document.addEventListener('DOMContentLoaded', function() {
    // Carica i dati prima di tutto
    loadData();
    
    // Inizializza i gestori degli eventi
    setupFatturaFormHandlers();
    
    // Renderizza le fatture
    renderFatture();
    
    // Aggiungi event listener per i filtri
    const btnApplyFilters = document.getElementById('btn-apply-fatture-filters');
    if (btnApplyFilters) {
        btnApplyFilters.addEventListener('click', applyFattureFilters);
    }
    
    const btnResetFilters = document.getElementById('btn-reset-fatture-filters');
    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', resetFattureFilters);
    }
    
    // Aggiungi event listener per il pulsante di aggiunta
    const btnAddFattura = document.getElementById('btn-add-fattura');
    if (btnAddFattura) {
        btnAddFattura.addEventListener('click', function() {
            createFatturaModal();
            resetFatturaForm();
            openModal('modal-fattura');
        });
    }
});

// Funzione di utilità per formattare la valuta
function formatCurrency(value) {
    return parseFloat(value).toFixed(2);
}

// Funzione di utilità per formattare la data
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

// Funzione di utilità per ottenere la classe CSS in base allo stato
function getStatusClass(stato) {
    switch (stato) {
        case 'Pagata':
            return 'status-success';
        case 'Emessa':
            return 'status-warning';
        case 'Scaduta':
            return 'status-danger';
        case 'Annullata':
            return 'status-muted';
        default:
            return '';
    }
}

// Funzione per gestire gli eventi del form delle fatture
function setupFatturaFormHandlers() {
    console.log('Inizializzazione gestori eventi form fatture');
    
    // Gestisci il pulsante per aggiungere una nuova fattura
    const btnAddFattura = document.getElementById('btn-add-fattura');
    if (btnAddFattura) {
        btnAddFattura.addEventListener('click', function() {
            createFatturaModal();
            resetFatturaForm();
            openModal('modal-fattura');
        });
    }
    
    // Gestisci il pulsante "Nuova Fattura" nella vista fatture
    const btnNuovaFattura = document.querySelector('.btn-primary[onclick="navigateTo(\'fatture\', \'new\')"]');
    if (btnNuovaFattura) {
        btnNuovaFattura.addEventListener('click', function(e) {
            e.preventDefault();
            createFatturaModal();
            resetFatturaForm();
            openModal('modal-fattura');
        });
    }
}

// Gestisci i pulsanti di visualizzazione, modifica ed eliminazione
function setupFatturaButtons() {
    // Gestisci i pulsanti di visualizzazione
    document.querySelectorAll('#fatture-list .btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const fatturaId = parseInt(this.getAttribute('data-id'));
            viewFattura(fatturaId);
        });
    });

    // Gestisci i pulsanti di modifica
    document.querySelectorAll('#fatture-list .btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const fatturaId = parseInt(this.getAttribute('data-id'));
            editFattura(fatturaId);
        });
    });

    // Gestisci i pulsanti di eliminazione
    document.querySelectorAll('#fatture-list .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const fatturaId = parseInt(this.getAttribute('data-id'));
            deleteFattura(fatturaId);
        });
    });
    
    // Gestisci i pulsanti per impostare come pagata
    document.querySelectorAll('#fatture-list .btn-paid').forEach(button => {
        button.addEventListener('click', function() {
            const fatturaId = parseInt(this.getAttribute('data-id'));
            impostaFatturaPagata(fatturaId);
        });
    });
    
    // Gestisci i pulsanti per impostare come annullata
    document.querySelectorAll('#fatture-list .btn-cancel').forEach(button => {
        button.addEventListener('click', function() {
            const fatturaId = parseInt(this.getAttribute('data-id'));
            impostaFatturaAnnullata(fatturaId);
        });
    });
}

// Add a new invoice
function addFattura(fattura) {
    try {
        // Generate a unique ID
        fattura.id = generateUniqueId();
        
        // Add the invoice to the array
        window.appData.fatture.push(fattura);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderFatture();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiunta della fattura:", error);
        return false;
    }
}

// Update an existing invoice
function updateFattura(id, updatedFattura) {
    try {
        // Find the index of the invoice
        const index = window.appData.fatture.findIndex(f => f.id === id);
        
        if (index === -1) {
            console.error("Fattura non trovata:", id);
            return false;
        }
        
        // Keep the original ID
        updatedFattura.id = id;
        
        // Update the invoice
        window.appData.fatture[index] = updatedFattura;
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderFatture();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiornamento della fattura:", error);
        return false;
    }
}

// Delete an invoice
function deleteFattura(id) {
    try {
        // Filter the array to remove the invoice
        window.appData.fatture = window.appData.fatture.filter(f => f.id !== id);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderFatture();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'eliminazione della fattura:", error);
        return false;
    }
}
