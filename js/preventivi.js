// Gestione dei preventivi
// Renderizza la lista dei preventivi
function renderPreventivi() {
    try {
        const preventiviList = document.getElementById('preventivi-list');
        if (!preventiviList) {
            console.log("Elemento preventivi-list non trovato");
            return;
        }
        
        // Aggiungi spazio tra il titolo e il bottone
        const viewHeader = document.querySelector('#view-preventivi .view-header');
        if (viewHeader) {
            viewHeader.style.marginBottom = '15px';
        }
        
        // Aggiungi spazio tra il bottone e la tabella
        const btnAddPreventivo = document.getElementById('btn-add-preventivo');
        if (btnAddPreventivo) {
            btnAddPreventivo.style.marginTop = '15px';
            btnAddPreventivo.style.marginBottom = '15px';
        }
        
        // Aggiungi spazio alla tabella
        const tableContainer = document.querySelector('#view-preventivi .table-container');
        if (tableContainer) {
            tableContainer.style.marginTop = '15px';
        }
        
        preventiviList.innerHTML = '';
        
        window.appData.preventivi.forEach(preventivo => {
            const cliente = window.appData.clienti.find(c => c.id === preventivo.clienteId) || { nome: 'N/D', cognome: '' };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${preventivo.numero}</td>
                <td>${cliente.nome} ${cliente.cognome}</td>
                <td>${formatDate(preventivo.data)}</td>
                <td>${formatCurrency(preventivo.totale)}</td>
                <td>${preventivo.stato}</td>
                <td>
                    <button class="btn-view" data-id="${preventivo.id}">👁️</button>
                    <button class="btn-edit" data-id="${preventivo.id}">✏️</button>
                    <button class="btn-delete" data-id="${preventivo.id}">🗑️</button>
                </td>
            `;
            preventiviList.appendChild(row);
        });
        
        // Aggiungi gli event listener dopo aver creato gli elementi
        setupPreventivoButtons();
        console.log("Preventivi renderizzati con successo");
    } catch (error) {
        console.error("Errore durante il rendering dei preventivi:", error);
    }
}

// Gestione del form preventivo
function setupPreventivoFormHandlers() {
    // Gestisci il pulsante per aprire il modal di aggiunta
    const btnAddPreventivo = document.getElementById('btn-add-preventivo');
    if (btnAddPreventivo) {
        btnAddPreventivo.addEventListener('click', function() {
            // Crea il modal se non esiste
            createPreventivoModal();
            // Resetta il form
            resetPreventivoForm();
            // Cambia il titolo del modal
            document.querySelector('#modal-preventivo .modal-title').textContent = 'Nuovo Preventivo';
            // Mostra il modal
            openModal('modal-preventivo');
        });
    }
}

// Resetta il form preventivo
function resetPreventivoForm() {
    const form = document.getElementById('form-preventivo');
    if (form) {
        form.reset();
        document.getElementById('preventivo-id').value = '';
        
        // Genera un nuovo numero di preventivo
        const numeroPreventivo = generateDocumentNumber('PREV', window.appData.preventivi);
        document.getElementById('numero-preventivo').value = numeroPreventivo;
        
        // Imposta la data odierna
        const oggi = new Date().toISOString().split('T')[0];
        document.getElementById('data-preventivo').value = oggi;
        
        // Popola il select dei clienti
        const clienteSelect = document.getElementById('cliente-preventivo');
        if (clienteSelect) {
            clienteSelect.innerHTML = '<option value="">Seleziona un cliente</option>';
            window.appData.clienti.forEach(cliente => {
                clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome} ${cliente.cognome}</option>`;
            });
        }
        
        // Resetta le voci del preventivo
        const vociContainer = document.getElementById('voci-preventivo');
        if (vociContainer) {
            vociContainer.innerHTML = '';
            aggiungiVocePreventivo(); // Aggiungi una voce vuota
        }
        
        // Resetta il totale
        document.getElementById('totale-preventivo').value = '0.00';
    }
}

// Gestisci i pulsanti di visualizzazione, modifica ed eliminazione
function setupPreventivoButtons() {
    // Gestisci i pulsanti di visualizzazione
    document.querySelectorAll('#preventivi-list .btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const preventivoId = parseInt(this.getAttribute('data-id'));
            showPreventivoDetails(preventivoId);
        });
    });

    // Gestisci i pulsanti di modifica
    document.querySelectorAll('#preventivi-list .btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const preventivoId = parseInt(this.getAttribute('data-id'));
            editPreventivo(preventivoId);
        });
    });

    // Gestisci i pulsanti di eliminazione
    document.querySelectorAll('#preventivi-list .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const preventivoId = parseInt(this.getAttribute('data-id'));
            deletePreventivo(preventivoId);
        });
    });
}

// Crea il modal per l'aggiunta/modifica del preventivo se non esiste
function createPreventivoModal() {
    if (document.getElementById('modal-preventivo')) return;
    
    const modalHTML = `
        <div id="modal-preventivo" class="modal" style="display: none;">
            <div class="modal-content" style="width: 90%; max-width: 800px;">
                <div class="modal-header">
                    <h2 class="modal-title">Nuovo Preventivo</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-preventivo" class="app-form">
                        <input type="hidden" id="preventivo-id">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="numero-preventivo">Numero Preventivo</label>
                                <input type="text" id="numero-preventivo" name="numero-preventivo" class="app-input" editable>
                            </div>
                            <div class="form-group">
                                <label for="data-preventivo">Data</label>
                                <input type="date" id="data-preventivo" name="data-preventivo" class="app-input" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cliente-preventivo">Cliente</label>
                                <select id="cliente-preventivo" name="cliente-preventivo" class="app-input" required>
                                    <option value="">Seleziona un cliente</option>
                                    <!-- I clienti verranno caricati dinamicamente -->
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="stato-preventivo">Stato</label>
                                <select id="stato-preventivo" name="stato-preventivo" class="app-input" required>
                                    <option value="In Attesa">In Attesa</option>
                                    <option value="Approvato">Approvato</option>
                                    <option value="Rifiutato">Rifiutato</option>
                                </select>
                            </div>
                        </div>
                        
                        <h3>Voci del Preventivo</h3>
                        <div id="voci-preventivo">
                            <!-- Le voci verranno aggiunte dinamicamente -->
                        </div>
                        
                        <button type="button" id="btn-add-voce" class="btn-secondary">Aggiungi Voce</button>
                        
                        <div class="form-row" style="margin-top: 20px; justify-content: flex-end;">
                            <div class="form-group">
                                <label for="totale-preventivo">Totale Complessivo (€)</label>
                                <input type="text" id="totale-preventivo" name="totale-preventivo" class="app-input" readonly>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="note-preventivo">Note</label>
                            <textarea id="note-preventivo" name="note-preventivo" class="app-input" rows="3"></textarea>
                        </div>
                        
                        <button type="submit" class="btn-primary">Salva Preventivo</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Gestisci la chiusura del modal
    document.querySelector('#modal-preventivo .close-modal').addEventListener('click', function() {
        closeModal();
    });
    
    // Gestisci il submit del form
    document.getElementById('form-preventivo').addEventListener('submit', function(e) {
        e.preventDefault();
        savePreventivo();
    });
    
    // Gestisci l'aggiunta di una nuova voce
    document.getElementById('btn-add-voce').addEventListener('click', function() {
        aggiungiVocePreventivo();
    });
}

// Aggiungi una voce al preventivo
function aggiungiVocePreventivo(voce = null) {
    const vociContainer = document.getElementById('voci-preventivo');
    const voceIndex = vociContainer.children.length;
    
    const voceHTML = document.createElement('div');
    voceHTML.className = 'voce-preventivo';
    voceHTML.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 3;">
                <label for="descrizione-${voceIndex}">Descrizione</label>
                <input type="text" id="descrizione-${voceIndex}" name="descrizione-${voceIndex}" class="app-input descrizione-input" required value="${voce ? voce.descrizione : ''}">
            </div>
            <div class="form-group" style="flex: 1;">
                <label for="quantita-${voceIndex}">Quantità</label>
                <input type="number" id="quantita-${voceIndex}" name="quantita-${voceIndex}" class="app-input quantita-input" step="0.01" min="0" required value="${voce ? voce.quantita : '1'}" onchange="calcolaTotaleVoce(this, document.getElementById('prezzo-${voceIndex}'), document.getElementById('totale-${voceIndex}'))">
            </div>
            <div class="form-group" style="flex: 1;">
                <label for="prezzo-${voceIndex}">Prezzo (€)</label>
                <input type="number" id="prezzo-${voceIndex}" name="prezzo-${voceIndex}" class="app-input prezzo-input" step="0.01" min="0" required value="${voce ? voce.prezzo : '0.00'}" onchange="calcolaTotaleVoce(document.getElementById('quantita-${voceIndex}'), this, document.getElementById('totale-${voceIndex}'))">
            </div>
            <div class="form-group" style="flex: 1;">
                <label for="totale-${voceIndex}">Importo (€)</label>
                <input type="text" id="totale-${voceIndex}" name="totale-${voceIndex}" class="app-input totale-input" readonly value="${voce ? (voce.quantita * voce.prezzo).toFixed(2) : '0.00'}">
            </div>
            <div class="form-group" style="flex: 0; align-self: flex-end; margin-bottom: 10px;">
                <button type="button" class="btn-delete-voce" onclick="rimuoviVocePreventivo(this)">🗑️</button>
            </div>
        </div>
    `;
    
    vociContainer.appendChild(voceHTML);
    
    // Calcola il totale se è una nuova voce con valori
    if (voce) {
        calcolaTotalePreventivo();
    }
}

// Rimuovi una voce dal preventivo
function rimuoviVocePreventivo(button) {
    const voceElement = button.closest('.voce-preventivo');
    voceElement.parentNode.removeChild(voceElement);
    calcolaTotalePreventivo();
}

// Mostra i dettagli di un preventivo
function showPreventivoDetails(preventivoId) {
    const preventivo = window.appData.preventivi.find(p => p.id === preventivoId);
    
    if (!preventivo) {
        showNotification('Preventivo non trovato', 'error');
        return;
    }
    
    const cliente = window.appData.clienti.find(c => c.id === preventivo.clienteId) || { nome: 'N/D', cognome: '' };
    
    // Crea il modal per i dettagli
    const modalHTML = `
        <div id="modal-preventivo-details" class="modal">
            <div class="modal-content" style="width: 90%; max-width: 800px;">
                <div class="modal-header">
                    <h2>Dettagli Preventivo</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="preventivo-details">
                        <div class="form-row">
                            <div class="form-group">
                                <p><strong>Numero:</strong> ${preventivo.numero}</p>
                            </div>
                            <div class="form-group">
                                <p><strong>Data:</strong> ${formatDate(preventivo.data)}</p>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <p><strong>Cliente:</strong> ${cliente.nome} ${cliente.cognome}</p>
                            </div>
                            <div class="form-group">
                                <p><strong>Stato:</strong> <span class="status ${getStatusClass(preventivo.stato)}">${preventivo.stato}</span></p>
                            </div>
                        </div>
                        
                        <h3>Voci del Preventivo</h3>
                        <table class="app-table">
                            <thead>
                                <tr>
                                    <th>Descrizione</th>
                                    <th>Quantità</th>
                                    <th>Prezzo (€)</th>
                                    <th>Totale (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${preventivo.voci.map(voce => `
                                    <tr>
                                        <td>${voce.descrizione}</td>
                                        <td>${voce.quantita}</td>
                                        <td>${formatCurrency(voce.prezzo)}</td>
                                        <td>${formatCurrency(voce.quantita * voce.prezzo)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="text-align: right;"><strong>Totale:</strong></td>
                                    <td><strong>${formatCurrency(preventivo.totale)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                        
                        <p><strong>Note:</strong> ${preventivo.note || 'Nessuna nota'}</p>
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
    const modal = document.getElementById('modal-preventivo-details');
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

// Modifica un preventivo
function editPreventivo(preventivoId) {
    const preventivo = window.appData.preventivi.find(p => p.id === preventivoId);
    
    if (!preventivo) {
        showNotification('Preventivo non trovato', 'error');
        return;
    }
    
    // Crea il modal se non esiste
    createPreventivoModal();
    
    // Popola il select dei clienti prima di impostare il valore
    const clienteSelect = document.getElementById('cliente-preventivo');
    if (clienteSelect) {
        clienteSelect.innerHTML = '<option value="">Seleziona un cliente</option>';
        window.appData.clienti.forEach(cliente => {
            clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome} ${cliente.cognome}</option>`;
        });
    }
    
    // Popola il form con i dati del preventivo
    document.getElementById('preventivo-id').value = preventivo.id;
    document.getElementById('numero-preventivo').value = preventivo.numero;
    document.getElementById('data-preventivo').value = preventivo.data;
    document.getElementById('cliente-preventivo').value = preventivo.clienteId;
    document.getElementById('stato-preventivo').value = preventivo.stato;
    document.getElementById('note-preventivo').value = preventivo.note || '';
    
    // Popola le voci del preventivo
    const vociContainer = document.getElementById('voci-preventivo');
    vociContainer.innerHTML = '';
    
    preventivo.voci.forEach(voce => {
        aggiungiVocePreventivo(voce);
    });
    
    // Aggiorna il totale - Assicuriamoci che totale sia un numero
    const totale = typeof preventivo.totale === 'number' ? preventivo.totale : 0;
    document.getElementById('totale-preventivo').value = totale.toFixed(2);
    
    // Cambia il titolo del modal
    document.querySelector('#modal-preventivo .modal-title').textContent = 'Modifica Preventivo';
    
    // Mostra il modal
    openModal('modal-preventivo');
}

// Elimina un preventivo
function deletePreventivo(preventivoId) {
    confirmAction('Sei sicuro di voler eliminare questo preventivo?', function() {
        const preventivoIndex = window.appData.preventivi.findIndex(p => p.id === preventivoId);
        
        if (preventivoIndex !== -1) {
            window.appData.preventivi.splice(preventivoIndex, 1);
            saveAppData();
            renderPreventivi();
            showNotification('Preventivo eliminato con successo!');
        }
    });
}

// Salva un preventivo (nuovo o modificato)
function savePreventivo() {
    const preventivoId = document.getElementById('preventivo-id').value;
    
    // Raccogli le voci del preventivo
    const voci = [];
    const vociElements = document.querySelectorAll('.voce-preventivo');
    
    vociElements.forEach((voceElement, index) => {
        const descrizione = document.getElementById(`descrizione-${index}`).value;
        const quantita = parseFloat(document.getElementById(`quantita-${index}`).value);
        const prezzo = parseFloat(document.getElementById(`prezzo-${index}`).value);
        
        voci.push({
            descrizione,
            quantita,
            prezzo
        });
    });
    
    // Calcola il totale
    const totale = voci.reduce((sum, voce) => sum + (voce.quantita * voce.prezzo), 0);
    
    const nuovoPreventivo = {
        numero: document.getElementById('numero-preventivo').value,
        data: document.getElementById('data-preventivo').value,
        clienteId: parseInt(document.getElementById('cliente-preventivo').value),
        stato: document.getElementById('stato-preventivo').value,
        voci: voci,
        totale: totale,
        note: document.getElementById('note-preventivo').value
    };
    
    if (preventivoId) {
        // Modifica preventivo esistente
        const preventivoIndex = window.appData.preventivi.findIndex(p => p.id === parseInt(preventivoId));
        
        if (preventivoIndex !== -1) {
            nuovoPreventivo.id = parseInt(preventivoId);
            window.appData.preventivi[preventivoIndex] = nuovoPreventivo;
            showNotification('Preventivo aggiornato con successo!');
        }
    } else {
        // Nuovo preventivo
        nuovoPreventivo.id = getNextId(window.appData.preventivi);
        window.appData.preventivi.push(nuovoPreventivo);
        showNotification('Preventivo aggiunto con successo!');
    }
    
    saveAppData();
    closeModal();
    renderPreventivi();
}

// Inizializza gli event handler quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    setupPreventivoFormHandlers();
});


// Calcola il totale di una voce
function calcolaTotaleVoce(quantitaInput, prezzoInput, totaleInput) {
    const quantita = parseFloat(quantitaInput.value) || 0;
    const prezzo = parseFloat(prezzoInput.value) || 0;
    const totale = quantita * prezzo;
    totaleInput.value = totale.toFixed(2);
    
    // Aggiorna il totale complessivo
    calcolaTotalePreventivo();
}

// Calcola il totale complessivo del preventivo
function calcolaTotalePreventivo() {
    const totaliInputs = document.querySelectorAll('.totale-input');
    let totaleComplessivo = 0;
    
    totaliInputs.forEach(input => {
        totaleComplessivo += parseFloat(input.value) || 0;
    });
    
    document.getElementById('totale-preventivo').value = totaleComplessivo.toFixed(2);
}


// Aggiungi dopo la funzione renderPreventivi()

// Implementazione della ricerca e filtri per i preventivi
function setupPreventiviSearchAndFilters() {
    // Verifica se il componente di ricerca esiste già
    if (document.querySelector('#view-preventivi .search-filter-container')) {
        return; // Se esiste già, esci dalla funzione
    }
    
    // Definisci i campi su cui cercare
    const searchFields = ['numero', 'note', 'stato'];
    
    // Ottieni gli stati unici dei preventivi
    const statiPreventivi = ['In Attesa', 'Approvato', 'Rifiutato'];
    
    // Definisci le opzioni di filtro
    const filterOptions = [
        {
            type: 'select',
            field: 'stato',
            label: 'Stato',
            options: statiPreventivi.map(stato => ({ value: stato, label: stato }))
        },
        {
            type: 'select',
            field: 'clienteId',
            label: 'Cliente',
            options: window.appData.clienti.map(cliente => ({ 
                value: cliente.id, 
                label: `${cliente.nome} ${cliente.cognome}` 
            }))
        },
        {
            type: 'date',
            field: 'data',
            label: 'Data Preventivo'
        }
    ];
    
    // ... resto del codice rimane invariato
    
    // Crea il componente di ricerca e filtri
    const searchFilterContainer = document.createElement('div');
    searchFilterContainer.className = 'search-filter-container';
    
        // Crea il campo di ricerca
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Cerca preventivi...';
        
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
                filterPreventivi();
            });
            
            filterGroup.appendChild(select);
        } else if (option.type === 'date') {
            const dateContainer = document.createElement('div');
            dateContainer.className = 'date-filter-container';
            
            const fromDate = document.createElement('input');
            fromDate.type = 'date';
            fromDate.className = 'filter-date';
            fromDate.dataset.field = option.field;
            fromDate.dataset.operator = 'from';
            
            const toDate = document.createElement('input');
            toDate.type = 'date';
            toDate.className = 'filter-date';
            toDate.dataset.field = option.field;
            toDate.dataset.operator = 'to';
            
            const fromLabel = document.createElement('span');
            fromLabel.textContent = 'Da:';
            
            const toLabel = document.createElement('span');
            toLabel.textContent = 'A:';
            
            dateContainer.appendChild(fromLabel);
            dateContainer.appendChild(fromDate);
            dateContainer.appendChild(toLabel);
            dateContainer.appendChild(toDate);
            
            fromDate.addEventListener('change', () => {
                filterPreventivi();
            });
            
            toDate.addEventListener('change', () => {
                filterPreventivi();
            });
            
            filterGroup.appendChild(dateContainer);
        }
        
        filterDropdown.appendChild(filterGroup);
    });
    
    // Aggiungi pulsante per resettare i filtri
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-filters-button';
    resetButton.textContent = 'Resetta Filtri';
    resetButton.addEventListener('click', () => {
        resetFilters();
        filterPreventivi();
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
    const viewPreventivi = document.getElementById('view-preventivi');
    if (viewPreventivi) {
        const viewHeader = viewPreventivi.querySelector('.view-header');
        if (viewHeader) {
            viewPreventivi.insertBefore(searchFilterContainer, viewHeader.nextSibling);
        } else {
            viewPreventivi.insertBefore(searchFilterContainer, viewPreventivi.firstChild);
        }
    }
    
    // Gestisci l'evento di ricerca
    searchInput.addEventListener('input', () => {
        filterPreventivi();
    });
    
        // Funzione per filtrare i preventivi (around line 780)
        function filterPreventivi() {
            const searchValue = searchInput.value.toLowerCase();
            const filters = collectFilterValues();
            
            const preventiviList = document.getElementById('preventivi-list');
            if (!preventiviList) return;
            
            // Prepara i dati con le informazioni del cliente
            const preventiviConClienti = window.appData.preventivi.map(preventivo => {
                const cliente = window.appData.clienti.find(c => c.id === preventivo.clienteId) || { nome: 'N/D', cognome: '' };
                return { ...preventivo, cliente: { nome: cliente.nome, cognome: cliente.cognome } };
            });
            
            // Filtra per ricerca
            let filteredData = preventiviConClienti;
            if (searchValue) {
                filteredData = filteredData.filter(preventivo => {
                    // Cerca nei campi standard
                    const matchesStandardFields = searchFields.some(field => {
                        const fieldValue = preventivo[field];
                        if (fieldValue === null || fieldValue === undefined) return false;
                        return String(fieldValue).toLowerCase().includes(searchValue);
                    });
                    
                    // Cerca nel nome del cliente
                    const clienteNome = `${preventivo.cliente.nome} ${preventivo.cliente.cognome}`.toLowerCase();
                    const matchesClientName = clienteNome.includes(searchValue);
                    
                    return matchesStandardFields || matchesClientName;
                });
            }
        
        // Filtra per filtri
        if (Object.keys(filters).length) {
            filteredData = filteredData.filter(preventivo => {
                return Object.keys(filters).every(field => {
                    const filterValue = filters[field];
                    
                    // Gestisci filtri di data (range)
                    if (field === 'data' && (filterValue.from || filterValue.to)) {
                        const itemDate = new Date(preventivo.data);
                        
                        if (filterValue.from) {
                            const fromDate = new Date(filterValue.from);
                            if (itemDate < fromDate) return false;
                        }
                        
                        if (filterValue.to) {
                            const toDate = new Date(filterValue.to);
                            toDate.setHours(23, 59, 59, 999); // Fine della giornata
                            if (itemDate > toDate) return false;
                        }
                        
                        return true;
                    }
                    
                    // Gestisci filtri normali
                    return preventivo[field] == filterValue; // Usa == per gestire confronti tra stringhe e numeri
                });
            });
        }
        
        // Aggiorna la tabella
        preventiviList.innerHTML = '';
        
        // Mostra un messaggio se non ci sono risultati
        if (filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="6" class="no-results">Nessun preventivo trovato</td>';
            preventiviList.appendChild(emptyRow);
            return;
        }
        
        // Aggiorna la tabella con i dati filtrati
        filteredData.forEach(preventivo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${preventivo.numero}</td>
                <td>${preventivo.cliente.nome} ${preventivo.cliente.cognome}</td>
                <td>${formatDate(preventivo.data)}</td>
                <td>${formatCurrency(preventivo.totale)}</td>
                <td>${preventivo.stato}</td>
                <td>
                    <button class="btn-view" data-id="${preventivo.id}">👁️</button>
                    <button class="btn-edit" data-id="${preventivo.id}">✏️</button>
                    <button class="btn-delete" data-id="${preventivo.id}">🗑️</button>
                </td>
            `;
            preventiviList.appendChild(row);
        });
        
        // Aggiorna il contatore dei risultati
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'filtered-results-info';
        resultsInfo.textContent = `Mostrati ${filteredData.length} di ${window.appData.preventivi.length} preventivi`;
        
        const tableContainer = preventiviList.closest('.table-container');
        const existingInfo = tableContainer.querySelector('.filtered-results-info');
        if (existingInfo) {
            existingInfo.replaceWith(resultsInfo);
        } else {
            tableContainer.insertBefore(resultsInfo, tableContainer.firstChild);
        }
        
        // Ricollega gli event listener ai pulsanti
        setupPreventivoButtons();
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
        
        // Raccogli i valori delle date
        const dateFilters = {};
        filterContainer.querySelectorAll('.filter-date').forEach(date => {
            if (date.value) {
                const field = date.dataset.field;
                const operator = date.dataset.operator;
                
                if (!dateFilters[field]) {
                    dateFilters[field] = {};
                }
                
                dateFilters[field][operator] = date.value;
            }
        });
        
        // Aggiungi i filtri di data
        Object.keys(dateFilters).forEach(field => {
            filters[field] = dateFilters[field];
        });
        
        return filters;
    }
    
    // Funzione per resettare i filtri
    function resetFilters() {
        // Resetta i select
        filterContainer.querySelectorAll('.filter-select').forEach(select => {
            select.value = '';
        });
        
        // Resetta le date
        filterContainer.querySelectorAll('.filter-date').forEach(date => {
            date.value = '';
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
            }
            
            .search-input {
                width: 100%;
                padding: 10px 15px 10px 40px;
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
            
            .search-icon {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #777;
            }
            
            .filter-container {
                position: relative;
            }
            
            .filter-button {
                background-color: #e9ecef;
                border: 1px solid #ced4da;
                border-radius: 4px;
                padding: 10px 15px;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.3s;
                color: #333;
                font-weight: 500;
            }
            
            .filter-button:hover {
                background-color: #dde2e6;
            }
            
            .filter-dropdown {
                position: absolute;
                right: 0;
                top: 100%;
                margin-top: 5px;
                background-color: #fff;
                border-radius: 4px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                padding: 15px;
                min-width: 250px;
                z-index: 100;
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
                color: #333;
            }
            
            .filter-select {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .date-filter-container {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 8px;
                align-items: center;
            }
            
            .filter-date {
                padding: 8px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .reset-filters-button {
                width: 100%;
                padding: 8px 0;
                background-color: #f1f1f1;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 10px;
                transition: background-color 0.3s;
            }
            
            .reset-filters-button:hover {
                background-color: #e0e0e0;
            }
            
            .filtered-results-info {
                margin-bottom: 10px;
                font-size: 14px;
                color: #666;
            }
            
            .no-results {
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
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
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Modifica la funzione renderPreventivi per aggiungere la chiamata a setupPreventiviSearchAndFilters
const originalRenderPreventivi = renderPreventivi;
renderPreventivi = function() {
    originalRenderPreventivi();
    addFilterStyles();
    setupPreventiviSearchAndFilters();
};