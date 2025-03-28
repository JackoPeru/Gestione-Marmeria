// Gestione dei materiali

// Renderizza la lista dei materiali
function renderMateriali() {
    try {
        const materialiList = document.getElementById('materiali-list');
        if (!materialiList) {
            console.log("Elemento materiali-list non trovato");
            return;
        }
        
        // Aggiungi spazio tra il titolo e il bottone
        const viewHeader = document.querySelector('#view-materiali .view-header');
        if (viewHeader) {
            viewHeader.style.marginBottom = '15px';
        }
        
        // Aggiungi spazio tra il bottone e la tabella
        const btnAddMateriale = document.getElementById('btn-add-materiale');
        if (btnAddMateriale) {
            btnAddMateriale.style.marginTop = '15px';
            btnAddMateriale.style.marginBottom = '15px';
        }
        
        // Aggiungi spazio alla tabella
        const tableContainer = document.querySelector('#view-materiali .table-container');
        if (tableContainer) {
            tableContainer.style.marginTop = '15px';
        }
        
        materialiList.innerHTML = '';
        
        window.appData.materiali.forEach(materiale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${materiale.nome}</td>
                <td>${materiale.tipo}</td>
                <td>${formatCurrency(materiale.prezzo)}</td>
                <td>${materiale.quantita} ${materiale.unitaMisura}</td>
                <td>${materiale.spessore || ''}</td>
                <td>
                    <button class="btn-view" data-id="${materiale.id}">👁️</button>
                    <button class="btn-edit" data-id="${materiale.id}">✏️</button>
                    <button class="btn-delete" data-id="${materiale.id}">🗑️</button>
                </td>
            `;
            materialiList.appendChild(row);
        });
        
        // Aggiungi gli event listener dopo aver creato gli elementi
        setupMaterialeButtons();
        console.log("Materiali renderizzati con successo");
    } catch (error) {
        console.error("Errore durante il rendering dei materiali:", error);
    }
}

// Gestione del form materiale
function setupMaterialeFormHandlers() {
    // Gestisci il pulsante per aprire il modal di aggiunta
    const btnAddMateriale = document.getElementById('btn-add-materiale');
    if (btnAddMateriale) {
        btnAddMateriale.addEventListener('click', function() {
            // Crea il modal se non esiste
            createMaterialeModal();
            // Resetta il form
            resetMaterialeForm();
            // Cambia il titolo del modal
            document.querySelector('#modal-materiale .modal-title').textContent = 'Nuovo Materiale';
            // Mostra il modal
            openModal('modal-materiale');
        });
    }
}

// Resetta il form materiale
function resetMaterialeForm() {
    const form = document.getElementById('form-materiale');
    if (form) {
        form.reset();
        document.getElementById('materiale-id').value = '';
    }
}

// Gestisci i pulsanti di visualizzazione, modifica ed eliminazione
function setupMaterialeButtons() {
    // Gestisci i pulsanti di visualizzazione
    document.querySelectorAll('#materiali-list .btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const materialeId = parseInt(this.getAttribute('data-id'));
            showMaterialeDetails(materialeId);
        });
    });

    // Gestisci i pulsanti di modifica
    document.querySelectorAll('#materiali-list .btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const materialeId = parseInt(this.getAttribute('data-id'));
            editMateriale(materialeId);
        });
    });

    // Gestisci i pulsanti di eliminazione
    document.querySelectorAll('#materiali-list .btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const materialeId = parseInt(this.getAttribute('data-id'));
            deleteMateriale(materialeId);
        });
    });
}

// Crea il modal per l'aggiunta/modifica del materiale se non esiste
function createMaterialeModal() {
    if (document.getElementById('modal-materiale')) return;
    
    const modalHTML = `
        <div id="modal-materiale" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Nuovo Materiale</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-materiale" class="app-form">
                        <input type="hidden" id="materiale-id">
                        <div class="form-group">
                            <label for="nome-materiale">Nome Materiale</label>
                            <input type="text" id="nome-materiale" name="nome-materiale" class="app-input" required>
                        </div>
                        <div class="form-group">
                            <label for="tipo-materiale">Tipo</label>
                            <select id="tipo-materiale" name="tipo-materiale" class="app-input" required>
                                <option value="">Seleziona un tipo</option>
                                <option value="Marmo">Marmo</option>
                                <option value="Granito">Granito</option>
                                <option value="Pietra">Pietra</option>
                                <option value="Quarzo">Quarzo</option>
                                <option value="Ceramica">Ceramica</option>
                                <option value="Altro">Altro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="spessore-materiale">Spessore (cm)</label>
                            <input type="number" id="spessore-materiale" name="spessore-materiale" class="app-input" step="0.1" min="0">
                        </div>
                        <div class="form-group">
                            <label for="prezzo-materiale">Prezzo (€)</label>
                            <input type="number" id="prezzo-materiale" name="prezzo-materiale" class="app-input" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="quantita-materiale">Quantità</label>
                            <input type="number" id="quantita-materiale" name="quantita-materiale" class="app-input" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="unita-misura">Unità di Misura</label>
                            <select id="unita-misura" name="unita-misura" class="app-input" required>
                                <option value="m²">m² (metri quadri)</option>
                                <option value="m³">m³ (metri cubi)</option>
                                <option value="lastra">lastra</option>
                                <option value="kg">kg (chilogrammi)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="fornitore-materiale">Fornitore</label>
                            <input type="text" id="fornitore-materiale" name="fornitore-materiale" class="app-input">
                        </div>
                        <div class="form-group">
                            <label for="note-materiale">Note</label>
                            <textarea id="note-materiale" name="note-materiale" class="app-input" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Salva</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Gestisci la chiusura del modal
    document.querySelector('#modal-materiale .close-modal').addEventListener('click', function() {
        closeModal();
    });
    
    // Gestisci il submit del form
    document.getElementById('form-materiale').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMateriale();
    });
}

// Mostra i dettagli di un materiale
function showMaterialeDetails(materialeId) {
    const materiale = window.appData.materiali.find(m => m.id === materialeId);
    
    if (!materiale) {
        showNotification('Materiale non trovato', 'error');
        return;
    }
    
    // Crea il modal per i dettagli
    const modalHTML = `
        <div id="modal-materiale-details" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Dettagli Materiale</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="materiale-details">
                        <p><strong>Nome Materiale:</strong> ${materiale.nome}</p>
                        <p><strong>Tipo:</strong> ${materiale.tipo}</p>
                        <p><strong>Spessore:</strong> ${materiale.spessore ? materiale.spessore + ' cm' : 'Non specificato'}</p>
                        <p><strong>Prezzo:</strong> ${formatCurrency(materiale.prezzo)}</p>
                        <p><strong>Quantità:</strong> ${materiale.quantita} ${materiale.unitaMisura}</p>
                        <p><strong>Fornitore:</strong> ${materiale.fornitore || 'Non specificato'}</p>
                        <p><strong>Note:</strong> ${materiale.note || 'Nessuna nota'}</p>
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
    const modal = document.getElementById('modal-materiale-details');
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

// Modifica un materiale
function editMateriale(materialeId) {
    const materiale = window.appData.materiali.find(m => m.id === materialeId);
    
    if (!materiale) {
        showNotification('Materiale non trovato', 'error');
        return;
    }
    
    // Crea il modal se non esiste
    createMaterialeModal();
    
    // Popola il form con i dati del materiale
    document.getElementById('materiale-id').value = materiale.id;
    document.getElementById('nome-materiale').value = materiale.nome;
    document.getElementById('tipo-materiale').value = materiale.tipo;
    document.getElementById('spessore-materiale').value = materiale.spessore || '';
    document.getElementById('prezzo-materiale').value = materiale.prezzo;
    document.getElementById('quantita-materiale').value = materiale.quantita;
    document.getElementById('unita-misura').value = materiale.unitaMisura;
    document.getElementById('fornitore-materiale').value = materiale.fornitore || '';
    document.getElementById('note-materiale').value = materiale.note || '';
    
    // Cambia il titolo del modal
    document.querySelector('#modal-materiale .modal-title').textContent = 'Modifica Materiale';
    
    // Mostra il modal
    openModal('modal-materiale');
}

// Elimina un materiale
function deleteMateriale(materialeId) {
    confirmAction('Sei sicuro di voler eliminare questo materiale?', function() {
        const materialeIndex = window.appData.materiali.findIndex(m => m.id === materialeId);
        
        if (materialeIndex !== -1) {
            window.appData.materiali.splice(materialeIndex, 1);
            saveAppData();
            renderMateriali();
            showNotification('Materiale eliminato con successo!');
        }
    });
}

// Salva un materiale (nuovo o modificato)
function saveMateriale() {
    const materialeId = document.getElementById('materiale-id').value;
    
    const nuovoMateriale = {
        nome: document.getElementById('nome-materiale').value,
        tipo: document.getElementById('tipo-materiale').value,
        spessore: document.getElementById('spessore-materiale').value ? parseFloat(document.getElementById('spessore-materiale').value) : null,
        prezzo: parseFloat(document.getElementById('prezzo-materiale').value),
        quantita: parseFloat(document.getElementById('quantita-materiale').value),
        unitaMisura: document.getElementById('unita-misura').value,
        fornitore: document.getElementById('fornitore-materiale').value,
        note: document.getElementById('note-materiale').value
    };
    
    if (materialeId) {
        // Modifica materiale esistente
        const materialeIndex = window.appData.materiali.findIndex(m => m.id === parseInt(materialeId));
        
        if (materialeIndex !== -1) {
            nuovoMateriale.id = parseInt(materialeId);
            window.appData.materiali[materialeIndex] = nuovoMateriale;
            showNotification('Materiale aggiornato con successo!');
        }
    } else {
        // Nuovo materiale
        nuovoMateriale.id = getNextId(window.appData.materiali);
        window.appData.materiali.push(nuovoMateriale);
        showNotification('Materiale aggiunto con successo!');
    }
    
    saveAppData();
    closeModal();
    renderMateriali();
}

// Inizializza gli event handler quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    setupMaterialeFormHandlers();
});


// Implementazione della ricerca e filtri per i materiali
function setupMaterialiSearchAndFilters() {
    // Verifica se il componente di ricerca esiste già
    if (document.querySelector('#view-materiali .search-filter-container')) {
        return; // Se esiste già, esci dalla funzione
    }
    
    // Definisci i campi su cui cercare
    const searchFields = ['codice', 'nome', 'categoria', 'fornitore'];
    
    // Ottieni le categorie uniche dei materiali
    const categorieMateriali = [...new Set(window.appData.materiali.map(m => m.categoria))];
    
    // Ottieni i fornitori unici
    const fornitori = [...new Set(window.appData.materiali.map(m => m.fornitore))];
    
    // Definisci le opzioni di filtro
    // Modifica dei filtri per i materiali
    
    //Modifica i filtri per cambiare "categoria" in "tipo" e includerò gli stessi valori che si trovano nel form di aggiunta di un nuovo materiale.
    const filterOptions = [
        {
            type: 'select',
            field: 'tipo',
            label: 'Tipo',
            options: [
                { value: '', label: 'Tutti i tipi' },
                { value: 'Marmo', label: 'Marmo' },
                { value: 'Granito', label: 'Granito' },
                { value: 'Pietra', label: 'Pietra' },
                { value: 'Quarzo', label: 'Quarzo' },
                { value: 'Ceramica', label: 'Ceramica' },
                { value: 'Altro', label: 'Altro' }
            ]
        },
        {
            type: 'select',
            field: 'fornitore',
            label: 'Fornitore',
            options: fornitori.map(fornitore => ({ value: fornitore, label: fornitore }))
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
    searchInput.placeholder = 'Cerca materiali...';
    
    searchContainer.appendChild(searchInput);
    
    // Resto del codice rimane invariato
    
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
                filterMateriali();
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
        filterMateriali();
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
    const viewMateriali = document.getElementById('view-materiali');
    if (viewMateriali) {
        const viewHeader = viewMateriali.querySelector('.view-header');
        if (viewHeader) {
            viewMateriali.insertBefore(searchFilterContainer, viewHeader.nextSibling);
        } else {
            viewMateriali.insertBefore(searchFilterContainer, viewMateriali.firstChild);
        }
    }
    
    // Gestisci l'evento di ricerca
    searchInput.addEventListener('input', () => {
        filterMateriali();
    });
    
    // Funzione per filtrare i materiali
    function filterMateriali() {
        const materialiList = document.getElementById('materiali-list');
        if (!materialiList) return;
        
        const searchValue = searchInput.value.toLowerCase();
        const filters = collectFilterValues();
        
        // Filtra i dati
        let filteredData = window.appData.materiali;
        
        // Applica il filtro di ricerca
        if (searchValue) {
            filteredData = filteredData.filter(materiale => {
                return searchFields.some(field => {
                    const fieldValue = materiale[field];
                    if (fieldValue === null || fieldValue === undefined) return false;
                    return String(fieldValue).toLowerCase().includes(searchValue);
                });
            });
        }
        
        // Applica i filtri selezionati
        Object.keys(filters).forEach(field => {
            filteredData = filteredData.filter(materiale => {
                return materiale[field] === filters[field];
            });
        });
        
        // Aggiorna la tabella
        materialiList.innerHTML = '';
        
        // Mostra un messaggio se non ci sono risultati
        if (filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="7" class="no-results">Nessun materiale trovato</td>';
            materialiList.appendChild(emptyRow);
            return;
        }
        
        // Aggiorna la tabella con i dati filtrati
        filteredData.forEach(materiale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${materiale.codice}</td>
                <td>${materiale.nome}</td>
                <td>${materiale.categoria}</td>
                <td>${materiale.fornitore}</td>
                <td>${materiale.quantita} ${materiale.unitaMisura}</td>
                <td>${formatCurrency(materiale.prezzoUnitario)}</td>
                <td>
                    <button class="btn-view" data-id="${materiale.id}">👁️</button>
                    <button class="btn-edit" data-id="${materiale.id}">✏️</button>
                    <button class="btn-delete" data-id="${materiale.id}">🗑️</button>
                </td>
            `;
            materialiList.appendChild(row);
        });
        
        // Aggiorna il contatore dei risultati
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'filtered-results-info';
        resultsInfo.textContent = `Mostrati ${filteredData.length} di ${window.appData.materiali.length} materiali`;
        
        const tableContainer = materialiList.closest('.table-container');
        const existingInfo = tableContainer.querySelector('.filtered-results-info');
        if (existingInfo) {
            existingInfo.replaceWith(resultsInfo);
        } else {
            tableContainer.insertBefore(resultsInfo, tableContainer.firstChild);
        }
        
        // Ricollega gli event listener ai pulsanti
        setupMaterialeButtons();
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

// Modifica la funzione renderMateriali per aggiungere la chiamata a setupMaterialiSearchAndFilters
const originalRenderMateriali = renderMateriali;
renderMateriali = function() {
    originalRenderMateriali();
    addFilterStyles();
    setupMaterialiSearchAndFilters();
};

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
                flex-direction: row;
            }
            
            .search-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 4px 0 0 4px;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            
            .search-input:focus {
                border-color: #3498db;
                outline: none;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }
            
            .search-button {
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 0 4px 4px 0;
                padding: 10px 15px;
                height: 38px;
                cursor: pointer;
                transition: background-color 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 45px;
            }
            
            .search-button:hover {
                background-color: #2980b9;
            }
            
            /* Resto degli stili rimane invariato */
            
            /* Responsive */
            @media (max-width: 768px) {
                .search-filter-container {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 10px;
                }
                
                .search-container {
                    max-width: 100%;
                    flex-direction: row;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}


// 4. Now, let's update the CRUD operations in materiali.js to ensure data is saved after each operation:
function addMateriale(materiale) {
    try {
        // Generate a unique ID
        materiale.id = generateUniqueId();
        
        // Add the material to the array
        window.appData.materiali.push(materiale);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderMateriali();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiunta del materiale:", error);
        return false;
    }
}

// Update an existing material
function updateMateriale(id, updatedMateriale) {
    try {
        // Find the index of the material
        const index = window.appData.materiali.findIndex(m => m.id === id);
        
        if (index === -1) {
            console.error("Materiale non trovato:", id);
            return false;
        }
        
        // Keep the original ID
        updatedMateriale.id = id;
        
        // Update the material
        window.appData.materiali[index] = updatedMateriale;
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderMateriali();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiornamento del materiale:", error);
        return false;
    }
}

// Delete a material
function deleteMateriale(id) {
    try {
        // Filter the array to remove the material
        window.appData.materiali = window.appData.materiali.filter(m => m.id !== id);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderMateriali();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'eliminazione del materiale:", error);
        return false;
    }
}
