// Gestione dei progetti

// Renderizza la lista dei progetti
// Modifica la funzione renderProgetti per utilizzare il parametro filter
function renderProgetti(options = {}) {
    console.log("Rendering progetti con opzioni:", options);
    
    // Ottieni l'elemento della vista
    const viewElement = document.getElementById('view-progetti');
    if (!viewElement) {
        console.error("Elemento view-progetti non trovato");
        return;
    }
    
    // Ottieni i progetti
    let progetti = [...window.appData.progetti];
    
    // Applica i filtri se specificati
    if (options && options.filter) {
        console.log("Applicazione filtro:", options.filter);
        
        switch(options.filter) {
            case 'in-corso':  // Changed from 'inCorso' to 'in-corso' to match the value passed from dashboard
                progetti = progetti.filter(p => p.stato === 'In Corso');
                
                // Aggiungi un indicatore di filtro come in renderFatture
                const viewContent = document.querySelector('#view-progetti .view-content');
                if (viewContent) {
                    const filterIndicator = document.createElement('div');
                    filterIndicator.className = 'filter-indicator';
                    filterIndicator.innerHTML = `
                        <span>Filtro attivo: Progetti In Corso</span>
                        <button class="btn-clear-filter" title="Rimuovi filtro">×</button>
                    `;
                    
                    const existingIndicator = viewContent.querySelector('.filter-indicator');
                    if (existingIndicator) {
                        existingIndicator.remove();
                    }
                    
                    viewContent.insertBefore(filterIndicator, viewContent.firstChild);
                    
                    // Aggiungi event listener per rimuovere il filtro
                    filterIndicator.querySelector('.btn-clear-filter').addEventListener('click', function() {
                        renderProgetti();
                    });
                }
                break;
                
            case 'nonCompletati':
                progetti = progetti.filter(p => p.stato !== 'Completato');
                break;
                
            case 'daFare':
                progetti = progetti.filter(p => p.stato === 'In Corso' || p.stato === 'In Attesa');
                break;
                
            // Aggiungi altri casi di filtro se necessario
        }
    }
    
    // Ordina i progetti (ad esempio per data o ID)
    progetti.sort((a, b) => {
        // Priorità al progetto selezionato
        if (options.selectedId) {
            if (a.id == options.selectedId) return -1;
            if (b.id == options.selectedId) return 1;
        }
        
        // Altrimenti ordina per data o altro criterio
        const dateA = new Date(a.dataInizio || a.dataConsegna || 0);
        const dateB = new Date(b.dataInizio || b.dataConsegna || 0);
        return dateB - dateA; // Ordine decrescente (più recenti prima)
    });
    
    try {
        const progettiList = document.getElementById('progetti-list');
        if (!progettiList) {
            console.log("Elemento progetti-list non trovato");
            return;
        }
        
        // Aggiungi spazio tra il titolo e il bottone
        const viewHeader = document.querySelector('#view-progetti .view-header');
        if (viewHeader) {
            viewHeader.style.marginBottom = '15px';
        }
        
        // Aggiungi spazio tra il bottone e la tabella
        const btnAddProgetto = document.getElementById('btn-add-progetto');
        if (btnAddProgetto) {
            btnAddProgetto.style.marginTop = '15px';
            btnAddProgetto.style.marginBottom = '15px';
        }
        
        // Aggiungi spazio alla tabella
        const tableContainer = document.querySelector('#view-progetti .table-container');
        if (tableContainer) {
            tableContainer.style.marginTop = '15px';
        }
        
        progettiList.innerHTML = '';
        
        // Usa l'array progetti filtrato invece di window.appData.progetti
        progetti.forEach(progetto => {
            const cliente = window.appData.clienti.find(c => c.id === progetto.clienteId) || { nome: 'N/D', cognome: '' };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${progetto.nome}</td>
                <td>${cliente.nome} ${cliente.cognome}</td>
                <td>${progetto.dataInizio}</td>
                <td>${progetto.stato}</td>
                <td>
                    <button class="btn-view" data-id="${progetto.id}">👁️</button>
                    <button class="btn-edit" data-id="${progetto.id}">✏️</button>
                    <button class="btn-delete" data-id="${progetto.id}">🗑️</button>
                    <button class="btn-complete" data-id="${progetto.id}">✓</button>
                    <button class="btn-paid" data-id="${progetto.id}">💰</button>
                </td>
            `;
            progettiList.appendChild(row);
        });
        
        // Aggiungi gli event listener dopo aver creato gli elementi
        setupProgettoButtons();
        console.log("Progetti renderizzati con successo");
    } catch (error) {
        console.error("Errore durante il rendering dei progetti:", error);
    }
    
    // Se c'è un ID selezionato, evidenzia quel progetto
    if (options.selectedId) {
        const selectedElement = document.querySelector(`.progetto-item[data-id="${options.selectedId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('highlighted');
            // Scorri fino all'elemento selezionato
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Gestione del form progetto
function setupProgettoFormHandlers() {
    // Gestisci il pulsante per aprire il modal di aggiunta
    const btnAddProgetto = document.getElementById('btn-add-progetto');
    if (btnAddProgetto) {
        btnAddProgetto.addEventListener('click', function() {
            // Crea il modal se non esiste
            createProgettoModal();
            // Resetta il form
            resetProgettoForm();
            // Cambia il titolo del modal
            document.querySelector('#modal-progetto .modal-title').textContent = 'Nuovo Progetto';
            // Mostra il modal
            openModal('modal-progetto');
        });
    }
}

// Resetta il form progetto
function resetProgettoForm() {
    const form = document.getElementById('form-progetto');
    if (form) {
        form.reset();
        document.getElementById('progetto-id').value = '';
        
        // Popola il select dei clienti
        const clienteSelect = document.getElementById('cliente-id');
        if (clienteSelect) {
            clienteSelect.innerHTML = '<option value="">Seleziona un cliente</option>';
            window.appData.clienti.forEach(cliente => {
                clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome} ${cliente.cognome}</option>`;
            });
        }
    }
}

// Gestisci i pulsanti di visualizzazione, modifica ed eliminazione
function setupProgettoButtons() {
    // Gestisci i pulsanti di visualizzazione
    document.querySelectorAll('#progetti-list .btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const progettoId = parseInt(this.getAttribute('data-id'));
            showProgettoDetails(progettoId);
        });
    });

    // Gestisci i pulsanti di modifica
    document.querySelectorAll('#progetti-list .btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const progettoId = parseInt(this.getAttribute('data-id'));
            editProgetto(progettoId);
        });
    });

    // Gestisci i pulsanti di eliminazione
    document.querySelectorAll('#progetti-list .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const progettoId = parseInt(this.getAttribute('data-id'));
            deleteProgetto(progettoId);
        });
    });
    
    // Gestisci i pulsanti per impostare come completato
    document.querySelectorAll('#progetti-list .btn-complete').forEach(button => {
        button.addEventListener('click', function() {
            const progettoId = parseInt(this.getAttribute('data-id'));
            impostaProgettoCompletato(progettoId);
        });
    });
    
    // Gestisci i pulsanti per impostare come pagato
    document.querySelectorAll('#progetti-list .btn-paid').forEach(button => {
        button.addEventListener('click', function() {
            const progettoId = parseInt(this.getAttribute('data-id'));
            impostaProgettoPagato(progettoId);
        });
    });
}

// Crea il modal per l'aggiunta/modifica del progetto se non esiste
function createProgettoModal() {
    if (document.getElementById('modal-progetto')) return;
    
    const modalHTML = `
        <div id="modal-progetto" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Nuovo Progetto</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-progetto" class="app-form">
                        <input type="hidden" id="progetto-id">
                        <div class="form-group">
                            <label for="nome-progetto">Nome Progetto</label>
                            <input type="text" id="nome-progetto" name="nome-progetto" class="app-input" required>
                        </div>
                        <div class="form-group">
                            <label for="cliente-id">Cliente</label>
                            <select id="cliente-id" name="cliente-id" class="app-input" required>
                                <option value="">Seleziona un cliente</option>
                                <!-- I clienti verranno caricati dinamicamente -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="data-inizio">Data Inizio</label>
                            <input type="date" id="data-inizio" name="data-inizio" class="app-input" required>
                        </div>
                        <div class="form-group">
                            <label for="data-fine">Data Fine Prevista</label>
                            <input type="date" id="data-fine" name="data-fine" class="app-input">
                        </div>
                        <div class="form-group">
                            <label for="stato-progetto">Stato</label>
                            <select id="stato-progetto" name="stato-progetto" class="app-input" required>
                                <option value="In Corso">In Corso</option>
                                <option value="Completato">Completato</option>
                                <option value="In Attesa">In Attesa</option>
                                <option value="Annullato">Annullato</option>
                                <option value="Pagato">Pagato</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="descrizione-progetto">Descrizione</label>
                            <textarea id="descrizione-progetto" name="descrizione-progetto" class="app-input" rows="4"></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Salva</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Gestisci la chiusura del modal
    document.querySelector('#modal-progetto .close-modal').addEventListener('click', function() {
        closeModal();
    });
    
    // Gestisci il submit del form
    document.getElementById('form-progetto').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProgetto();
    });
    
    // Popola il select dei clienti
    resetProgettoForm();
}

// Mostra i dettagli di un progetto
function showProgettoDetails(progettoId) {
    const progetto = window.appData.progetti.find(p => p.id === progettoId);
    
    if (!progetto) {
        showNotification('Progetto non trovato', 'error');
        return;
    }
    
    const cliente = window.appData.clienti.find(c => c.id === progetto.clienteId) || { nome: 'N/D', cognome: '' };
    
    // Crea il modal per i dettagli
    const modalHTML = `
        <div id="modal-progetto-details" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Dettagli Progetto</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="progetto-details">
                        <p><strong>Nome Progetto:</strong> ${progetto.nome}</p>
                        <p><strong>Cliente:</strong> ${cliente.nome} ${cliente.cognome}</p>
                        <p><strong>Data Inizio:</strong> ${progetto.dataInizio}</p>
                        <p><strong>Data Fine Prevista:</strong> ${progetto.dataFine || 'Non specificata'}</p>
                        <p><strong>Stato:</strong> <span class="status ${getStatusClass(progetto.stato)}">${progetto.stato}</span></p>
                        <p><strong>Descrizione:</strong> ${progetto.descrizione || 'Nessuna descrizione'}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary btn-close">Chiudi</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostra il modal
    const modal = document.getElementById('modal-progetto-details');
    modal.style.display = 'flex';
    
    // Gestisci la chiusura del modal
    const closeButtons = modal.querySelectorAll('.close-modal, .btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    });
    
    // Chiudi il modal cliccando fuori
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Modifica un progetto
function editProgetto(progettoId) {
    const progetto = window.appData.progetti.find(p => p.id === progettoId);
    
    if (!progetto) {
        showNotification('Progetto non trovato', 'error');
        return;
    }
    
    // Crea il modal se non esiste
    createProgettoModal();
    
    // Popola il form con i dati del progetto
    document.getElementById('progetto-id').value = progetto.id;
    document.getElementById('nome-progetto').value = progetto.nome;
    document.getElementById('cliente-id').value = progetto.clienteId;
    document.getElementById('data-inizio').value = progetto.dataInizio;
    document.getElementById('data-fine').value = progetto.dataFine || '';
    document.getElementById('stato-progetto').value = progetto.stato;
    document.getElementById('descrizione-progetto').value = progetto.descrizione || '';
    
    // Cambia il titolo del modal
    document.querySelector('#modal-progetto .modal-title').textContent = 'Modifica Progetto';
    
    // Mostra il modal
    openModal('modal-progetto');
}

// Elimina un progetto
function deleteProgetto(progettoId) {
    confirmAction('Sei sicuro di voler eliminare questo progetto?', function() {
        const progettoIndex = window.appData.progetti.findIndex(p => p.id === progettoId);
        
        if (progettoIndex !== -1) {
            window.appData.progetti.splice(progettoIndex, 1);
            saveAppData();
            renderProgetti();
            showNotification('Progetto eliminato con successo!');
        }
    });
}

// Salva un progetto (nuovo o modificato)
function saveProgetto() {
    const progettoId = document.getElementById('progetto-id').value;
    
    const nuovoProgetto = {
        nome: document.getElementById('nome-progetto').value,
        clienteId: parseInt(document.getElementById('cliente-id').value),
        dataInizio: document.getElementById('data-inizio').value,
        dataFine: document.getElementById('data-fine').value || null,
        stato: document.getElementById('stato-progetto').value,
        descrizione: document.getElementById('descrizione-progetto').value
    };
    
    if (progettoId) {
        // Modifica progetto esistente
        const progettoIndex = window.appData.progetti.findIndex(p => p.id === parseInt(progettoId));
        
        if (progettoIndex !== -1) {
            nuovoProgetto.id = parseInt(progettoId);
            window.appData.progetti[progettoIndex] = nuovoProgetto;
            showNotification('Progetto aggiornato con successo!');
        }
    } else {
        // Nuovo progetto
        nuovoProgetto.id = getNextId(window.appData.progetti);
        window.appData.progetti.push(nuovoProgetto);
        showNotification('Progetto aggiunto con successo!');
    }
    
    saveAppData();
    closeModal();
    renderProgetti();
}

// Inizializza gli event handler quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    setupProgettoFormHandlers();
});


// Funzione per renderizzare la lista dei progetti con supporto per i filtri
function renderProgettiList(filter = null) {
    console.log("Rendering progetti list con filtro:", filter);
    
    // Filtra i progetti in base al parametro filter
    let progetti = [...window.appData.progetti];
    
    if (filter === 'attivi') {
        progetti = progetti.filter(p => p.stato !== 'Completato' && p.stato !== 'Annullato');
    } else if (filter === 'completati') {
        progetti = progetti.filter(p => p.stato === 'Completato');
    } else if (filter === 'inAttesa') {
        progetti = progetti.filter(p => p.stato === 'In Attesa');
    } else if (filter === 'inCorso') {
        progetti = progetti.filter(p => p.stato === 'In Corso');
    } else if (filter === 'annullati') {
        progetti = progetti.filter(p => p.stato === 'Annullato');
    } else if (filter === 'daFare') {
        progetti = progetti.filter(p => p.stato === 'In Corso' || p.stato === 'In Attesa');
    }
    
    // Ordina i progetti per data di creazione (più recenti prima)
    progetti.sort((a, b) => {
        // Se dataInizio è disponibile, usa quella
        const dateA = a.dataInizio ? new Date(a.dataInizio) : new Date(0);
        const dateB = b.dataInizio ? new Date(b.dataInizio) : new Date(0);
        return dateB - dateA;
    });
    
    // Ottieni l'elemento della lista
    const progettiList = document.getElementById('progetti-list');
    if (!progettiList) {
        console.error("Elemento progetti-list non trovato");
        return;
    }
    
    // Svuota la lista
    progettiList.innerHTML = '';
    
    // Aggiungi un titolo che mostra il filtro attivo
    let filterTitle = '';
    if (filter === 'attivi') filterTitle = 'Progetti Attivi';
    else if (filter === 'completati') filterTitle = 'Progetti Completati';
    else if (filter === 'inAttesa') filterTitle = 'Progetti In Attesa';
    else if (filter === 'inCorso') filterTitle = 'Progetti In Corso';
    else if (filter === 'annullati') filterTitle = 'Progetti Annullati';
    
    
    if (filterTitle) {
        // Rimuovi eventuali header di filtro precedenti
        const existingFilterHeader = document.querySelector('#view-progetti .filter-header');
        if (existingFilterHeader) {
            existingFilterHeader.remove();
        }
        
        const filterHeader = document.createElement('div');
        filterHeader.className = 'filter-header';
        filterHeader.innerHTML = `<h3>${filterTitle}</h3>`;
        
        // Verifica che l'elemento view-content esista prima di usare prepend
        const viewContent = document.querySelector('#view-progetti .view-content');
        if (viewContent) {
            viewContent.prepend(filterHeader);
        } else {
            // Alternativa: aggiungi al contenitore principale
            const viewProgetti = document.getElementById('view-progetti');
            if (viewProgetti) {
                viewProgetti.prepend(filterHeader);
            } else {
                console.error("Elemento #view-progetti non trovato");
            }
        }
    }
    
    // Popola la lista con i progetti filtrati
    progetti.forEach(progetto => {
        const cliente = window.appData.clienti.find(c => c.id === progetto.clienteId) || { nome: 'N/D', cognome: '' };
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${progetto.nome}</td>
            <td>${cliente.nome} ${cliente.cognome}</td>
            <td>${progetto.dataInizio || 'N/D'}</td>
            <td>${progetto.stato}</td>
            <td>
                <button class="btn-view" data-id="${progetto.id}">👁️</button>
                <button class="btn-edit" data-id="${progetto.id}">✏️</button>
                <button class="btn-delete" data-id="${progetto.id}">🗑️</button>
                <button class="btn-complete" data-id="${progetto.id}">✓</button>
                <button class="btn-paid" data-id="${progetto.id}">💰</button>
            </td>
        `;
        progettiList.appendChild(row);
    });
    
    // Aggiungi gli event listener dopo aver creato gli elementi
    setupProgettoButtons();
    console.log("Progetti renderizzati con successo");
}

// Modifica la funzione renderProgettis per aggiungere la chiamata a setupProgettisSearchAndFilters
const originalRenderProgetti = renderProgetti;
renderProgetti = function() {
    originalRenderProgetti();
    addFilterStyles();
    setupProgettisSearchAndFilters();
};

// Implementazione della ricerca e filtri per i progetti
// Nella funzione setupProgettisSearchAndFilters, assicurati che le opzioni del filtro stato siano corrette
function setupProgettisSearchAndFilters() {
    // Verifica se il componente di ricerca esiste già
    if (document.querySelector('#view-progetti .search-filter-container')) {
        return; // Se esiste già, esci dalla funzione
    }
    
    // Definisci i campi su cui cercare
    const searchFields = ['nome', 'descrizione', 'stato'];
    
    // Ottieni gli stati unici dei progetti
    const statiProgetti = ['Tutti', 'In Corso', 'Completato', 'In Attesa', 'Annullato', 'Da Fare'];
    
    // Definisci le opzioni di filtro
    // Nelle opzioni di filtro, assicurati che ci sia un'opzione con il valore 'in-corso'
    const filterOptions = [
        {
            type: 'select',
            field: 'stato',
            label: 'Stato',
            options: [
                { value: '', label: 'Tutti' },
                { value: 'In Corso', label: 'In Corso' },  // Assicurati che questo valore sia corretto
                { value: 'Completato', label: 'Completato' },
                { value: 'In Attesa', label: 'In Attesa' },
                { value: 'Annullato', label: 'Annullato' },
                { value: 'daFare', label: 'Da Fare (In Corso + In Attesa)' }
            ]
        },
        {
            type: 'select',
            field: 'clienteId',
            label: 'Cliente',
            options: window.appData.clienti.map(cliente => ({ 
                value: cliente.id, 
                label: `${cliente.nome} ${cliente.cognome}` 
            }))
        }
    ];
    
    // Crea il componente di ricerca e filtri
    const searchFilterContainer = document.createElement('div');
    searchFilterContainer.className = 'search-filter-container';
    
    // Crea il campo di ricerca
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Cerca progetti...';
    
    searchContainer.appendChild(searchInput);
    
    // Crea il contenitore dei filtri
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    
    const filterButton = document.createElement('button');
    filterButton.className = 'filter-button';
    filterButton.innerHTML = '<i class="fas fa-filter"></i> Filtri';
    
    const filterDropdown = document.createElement('div');
    filterDropdown.className = 'filter-dropdown';
    
    // Aggiungi le opzioni di filtro
    filterOptions.forEach(option => {
        const filterGroup = document.createElement('div');
        filterGroup.className = 'filter-group';
        
        const filterLabel = document.createElement('label');
        filterLabel.textContent = option.label;
        filterGroup.appendChild(filterLabel);
        
        if (option.type === 'select') {
            const select = document.createElement('select');
            select.className = 'filter-select';
            select.dataset.field = option.field;
            
            // Aggiungi l'opzione "Tutti"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Tutti';
            select.appendChild(defaultOption);
            
            // Aggiungi le altre opzioni
            option.options.forEach(opt => {
                const optElement = document.createElement('option');
                optElement.value = opt.value;
                optElement.textContent = opt.label;
                select.appendChild(optElement);
            });
            
            select.addEventListener('change', () => {
                filterProgetti();
            });
            
            filterGroup.appendChild(select);
        }
        
        filterDropdown.appendChild(filterGroup);
    });
    
    // Aggiungi pulsante per resettare i filtri
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-filters-button';
    resetButton.textContent = 'Resetta Filtri';
    resetButton.addEventListener('click', () => {
        resetFilters();
        filterProgetti();
    });
    
    filterDropdown.appendChild(resetButton);
    
    // Gestisci l'apertura/chiusura del dropdown
    filterButton.addEventListener('click', () => {
        filterDropdown.classList.toggle('show');
    });
    
    // Chiudi il dropdown quando si clicca fuori
    document.addEventListener('click', (e) => {
        if (!filterButton.contains(e.target) && !filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('show');
        }
    });
    
    filterContainer.appendChild(filterButton);
    filterContainer.appendChild(filterDropdown);
    
    // Aggiungi gli elementi al contenitore
    searchFilterContainer.appendChild(searchContainer);
    searchFilterContainer.appendChild(filterContainer);
    
    // Inserisci il contenitore nella pagina
    const viewProgetti = document.getElementById('view-progetti');
    if (viewProgetti) {
        const viewHeader = viewProgetti.querySelector('.view-header');
        if (viewHeader) {
            viewProgetti.insertBefore(searchFilterContainer, viewHeader.nextSibling);
        } else {
            viewProgetti.insertBefore(searchFilterContainer, viewProgetti.firstChild);
        }
    }
    
    // Gestisci l'evento di ricerca
    searchInput.addEventListener('input', () => {
        filterProgetti();
    });
    
    // Funzione per filtrare i progetti
    // Nella funzione filterProgetti all'interno di setupProgettisSearchAndFilters
    function filterProgetti() {
        const progettiList = document.getElementById('progetti-list');
        if (!progettiList) return;
        
        const searchValue = searchInput.value.toLowerCase();
        const filters = collectFilterValues();
        
        // Filtra i dati
        let filteredData = window.appData.progetti;
        
        // Applica il filtro di ricerca
        if (searchValue) {
            filteredData = filteredData.filter(progetto => {
                return searchFields.some(field => {
                    const fieldValue = progetto[field];
                    if (fieldValue === null || fieldValue === undefined) return false;
                    return String(fieldValue).toLowerCase().includes(searchValue);
                });
            });
        }
        
        // Applica i filtri selezionati
        Object.keys(filters).forEach(field => {
            if (field === 'stato' && filters[field] === 'daFare') {
                // Caso speciale per "Da Fare" che include "In Corso" e "In Attesa"
                filteredData = filteredData.filter(progetto => 
                    progetto.stato === 'In Corso' || progetto.stato === 'In Attesa'
                );
            } else {
                filteredData = filteredData.filter(progetto => {
                    return progetto[field] == filters[field]; // Usa == per gestire confronti tra stringhe e numeri
                });
            }
        });
        
        // Aggiorna la tabella
        progettiList.innerHTML = '';
        
        // Mostra un messaggio se non ci sono risultati
        if (filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="5" class="no-results">Nessun progetto trovato</td>';
            progettiList.appendChild(emptyRow);
            return;
        }
        
        // Aggiorna la tabella con i dati filtrati
        filteredData.forEach(progetto => {
            const cliente = window.appData.clienti.find(c => c.id === progetto.clienteId) || { nome: 'N/D', cognome: '' };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${progetto.nome}</td>
                <td>${cliente.nome} ${cliente.cognome}</td>
                <td>${progetto.dataInizio || 'N/D'}</td>
                <td>${progetto.stato}</td>
                <td>
                    <button class="btn-view" data-id="${progetto.id}">👁️</button>
                    <button class="btn-edit" data-id="${progetto.id}">✏️</button>
                    <button class="btn-delete" data-id="${progetto.id}">🗑️</button>
                    <button class="btn-complete" data-id="${progetto.id}">✓</button>
                    <button class="btn-paid" data-id="${progetto.id}">💰</button>
                </td>
            `;
            progettiList.appendChild(row);
        });
        
        // Aggiorna il contatore dei risultati
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'filtered-results-info';
        resultsInfo.textContent = `Mostrati ${filteredData.length} di ${window.appData.progetti.length} progetti`;
        
        const tableContainer = progettiList.closest('.table-container');
        const existingInfo = tableContainer.querySelector('.filtered-results-info');
        if (existingInfo) {
            existingInfo.replaceWith(resultsInfo);
        } else {
            tableContainer.insertBefore(resultsInfo, tableContainer.firstChild);
        }
        
        // Ricollega gli event listener ai pulsanti
        setupProgettoButtons();
    }
    
    // Funzione per raccogliere i valori dei filtri
    function collectFilterValues() {
        const filters = {};
        
        // Raccogli i valori dei select
        filterContainer.querySelectorAll('.filter-select').forEach(select => {
            if (select.value) {
                filters[select.dataset.field] = select.value;
            }
        });
        
        return filters;
    }
    
    // Funzione per resettare i filtri
    function resetFilters() {
        // Resetta i select
        filterContainer.querySelectorAll('.filter-select').forEach(select => {
            select.value = '';
        });
        
        // Resetta la ricerca
        searchInput.value = '';
    }
}

// Aggiungi gli stili CSS per i filtri se non esistono già
function addFilterStyles() {
    if (!document.getElementById('filter-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'filter-styles';
        styleElement.textContent = `
            /* Stili per il componente di ricerca e filtri */
            .search-filter-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                background-color: #fff;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .search-container {
                position: relative;
                flex: 1;
                max-width: 400px;
                display: flex;
                align-items: center;
            }
            
            .search-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            
            .search-input:focus {
                border-color: #3498db;
                outline: none;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }
            
            .filter-container {
                position: relative;
                margin-left: 15px;
            }
            
            .filter-button {
                background-color: #f8f9fa;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px 15px;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background-color 0.3s;
            }
            
            .filter-button:hover {
                background-color: #e9ecef;
            }
            
            .filter-button i {
                margin-right: 5px;
            }
            
            .filter-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 250px;
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 15px;
                z-index: 1000;
                display: none;
            }
            
            .filter-dropdown.show {
                display: block;
            }
            
            .filter-group {
                margin-bottom: 15px;
            }
            
            .filter-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                font-size: 14px;
            }
            
            .filter-select {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .reset-filters-button {
                background-color: #f8f9fa;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 14px;
                cursor: pointer;
                width: 100%;
                transition: background-color 0.3s;
            }
            
            .reset-filters-button:hover {
                background-color: #e9ecef;
            }
            
            .filtered-results-info {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 10px;
            }
            
            .no-results {
                text-align: center;
                padding: 20px;
                color: #6c757d;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .search-filter-container {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 10px;
                }
                
                .search-container {
                    max-width: 100%;
                }
                
                .filter-container {
                    margin-left: 0;
                    align-self: flex-end;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}
// Aggiungi questa funzione per impostare un progetto come "Pagato"
function impostaProgettoPagato(progettoId) {
    console.log(`Impostazione progetto ${progettoId} come pagato`);
    // Trova il progetto nell'array
    const progetto = window.appData.progetti.find(p => p.id === progettoId);
    if (!progetto) {
        console.error(`Progetto con ID ${progettoId} non trovato`);
        return;
    }
    // Chiedi conferma all'utente
     {
        // Imposta lo stato a "Pagato"
        progetto.stato = 'Pagato';
        // Salva i dati
        saveAppData();
        // Aggiorna la visualizzazione dei progetti
        renderProgetti();
        
    }
}
// Aggiungi questa funzione per impostare un progetto come "Completato"
function impostaProgettoCompletato(progettoId) {
    console.log(`Impostazione progetto ${progettoId} come completato`);
    // Trova il progetto nell'array
    const progetto = window.appData.progetti.find(p => p.id === progettoId);
    if (!progetto) {
        console.error(`Progetto con ID ${progettoId} non trovato`);
        return;
    }
    
     {
        // Imposta lo stato a "Completato"
        progetto.stato = 'Completato';
        // Salva i dati
        saveAppData();
        // Aggiorna la visualizzazione dei progetti
        renderProgetti();
    }
}
// Rendi le funzioni disponibili globalmente
window.impostaProgettoPagato = impostaProgettoPagato;
window.impostaProgettoCompletato = impostaProgettoCompletato;

// Add a new project
function addProgetto(progetto) {
    try {
        // Generate a unique ID
        progetto.id = generateUniqueId();
        
        // Add the project to the array
        window.appData.progetti.push(progetto);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderProgetti();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiunta del progetto:", error);
        return false;
    }
}

// Update an existing project
function updateProgetto(id, updatedProgetto) {
    try {
        // Find the index of the project
        const index = window.appData.progetti.findIndex(p => p.id === id);
        
        if (index === -1) {
            console.error("Progetto non trovato:", id);
            return false;
        }
        
        // Keep the original ID
        updatedProgetto.id = id;
        
        // Update the project
        window.appData.progetti[index] = updatedProgetto;
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderProgetti();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiornamento del progetto:", error);
        return false;
    }
}

// Delete a project
function deleteProgetto(id) {
    try {
        // Filter the array to remove the project
        window.appData.progetti = window.appData.progetti.filter(p => p.id !== id);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderProgetti();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'eliminazione del progetto:", error);
        return false;
    }
}

// Inizializza gli event handler quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    setupProgettoFormHandlers();
});
