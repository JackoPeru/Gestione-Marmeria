// Funzioni per creare le viste dell'applicazione

// Funzione per ottenere la classe CSS in base allo stato
function getStatusClass(stato) {
    switch (stato) {
        case 'In Corso':
            return 'status-in-progress';
        case 'Completato':
            return 'status-completed';
        case 'In Attesa':
            return 'status-pending';
        case 'Annullato':
            return 'status-cancelled';
        default:
            return '';
    }
}

// Funzione per formattare la valuta
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Funzione per formattare la data
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

function createDashboardView() {
    return `
        <h1 class="dashboard-title">Dashboard</h1>
        <div class="dashboard-stats">
            <div class="stat-card">
                <h3>Clienti</h3>
                <p class="stat-number">${window.appData.clienti.length}</p>
            </div>
            <div class="stat-card">
                <h3>Progetti</h3>
                <p class="stat-number">${window.appData.progetti.length}</p>
            </div>
            <div class="stat-card">
                <h3>Materiali</h3>
                <p class="stat-number">${window.appData.materiali.length}</p>
            </div>
        </div>
        <div class="recent-projects">
            <h2>Progetti Recenti</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titolo</th>
                        <th>Cliente</th>
                        <th>Stato</th>
                    </tr>
                </thead>
                <tbody>
                    ${window.appData.progetti.slice(0, 5).map(progetto => {
                        const cliente = window.appData.clienti.find(c => c.id === progetto.clienteId);
                        return `
                            <tr>
                                <td>${progetto.id}</td>
                                <td>${progetto.titolo}</td>
                                <td>${cliente ? cliente.nome + ' ' + cliente.cognome : 'N/A'}</td>
                                <td><span class="${getStatusClass(progetto.stato)}">${progetto.stato}</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function createClientiView() {
    const clienti = window.appData.clienti;
    
    let html = `
        <div class="view-header">
            <h1>Clienti</h1>
            <button class="btn-add" id="btn-add-cliente">Nuovo Cliente</button>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    clienti.forEach(cliente => {
        html += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cognome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefono}</td>
                <td>
                    <button class="btn-edit" data-id="${cliente.id}">Modifica</button>
                    <button class="btn-delete" data-id="${cliente.id}">Elimina</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <!-- Modal per aggiungere un nuovo cliente -->
        <div id="modal-add-cliente" class="modal" style="display: none;">
            <div class="modal-content">
                <h2>Aggiungi Nuovo Cliente</h2>
                <form id="form-add-cliente" class="app-form">
                    <div class="form-group">
                        <label for="nome" style="display: block; margin-bottom: 5px; color: #333;">Nome</label>
                        <input type="text" id="nome" name="nome" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff; min-height: 42px; font-size: 16px;" required>
                    </div>
                    <div class="form-group">
                        <label for="cognome" style="display: block; margin-bottom: 5px; color: #333;">Cognome</label>
                        <input type="text" id="cognome" name="cognome" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff; min-height: 42px; font-size: 16px;" required>
                    </div>
                    <div class="form-group">
                        <label for="email" style="display: block; margin-bottom: 5px; color: #333;">Email</label>
                        <input type="email" id="email" name="email" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff; min-height: 42px; font-size: 16px;" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono" style="display: block; margin-bottom: 5px; color: #333;">Telefono</label>
                        <input type="text" id="telefono" name="telefono" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff; min-height: 42px; font-size: 16px;" required>
                    </div>
                    <div class="form-group">
                        <label for="indirizzo" style="display: block; margin-bottom: 5px; color: #333;">Indirizzo</label>
                        <input type="text" id="indirizzo" name="indirizzo" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff; min-height: 42px; font-size: 16px;" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel btn-close-modal">Annulla</button>
                        <button type="submit" class="btn-primary">Salva</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Modal per modificare un cliente -->
        <div id="modal-edit-cliente" class="modal" style="display: none;">
            <div class="modal-content">
                <h2>Modifica Cliente</h2>
                <form id="form-edit-cliente" class="app-form">
                    <input type="hidden" id="edit-id" name="id">
                    <div class="form-group">
                        <label for="edit-nome" style="display: block; margin-bottom: 5px; color: #333;">Nome</label>
                        <input type="text" id="edit-nome" name="nome" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff;" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-cognome" style="display: block; margin-bottom: 5px; color: #333;">Cognome</label>
                        <input type="text" id="edit-cognome" name="cognome" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff;" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email" style="display: block; margin-bottom: 5px; color: #333;">Email</label>
                        <input type="email" id="edit-email" name="email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff;" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-telefono" style="display: block; margin-bottom: 5px; color: #333;">Telefono</label>
                        <input type="text" id="edit-telefono" name="telefono" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff;" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-indirizzo" style="display: block; margin-bottom: 5px; color: #333;">Indirizzo</label>
                        <input type="text" id="edit-indirizzo" name="indirizzo" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; color: #333; background-color: #fff;" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel btn-close-modal">Annulla</button>
                        <button type="submit" class="btn-primary">Aggiorna</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    return html;
}

function createProgettiView() {
    return `
        <div class="view-header">
            <h1>Progetti</h1>
            <button class="btn-primary" id="btn-nuovo-progetto">+ Nuovo Progetto</button>
        </div>
        <div class="filter-container">
            <button class="filter-button" id="btn-filtra-progetti">Filtra</button>
            <div class="filter-options">
                <a href="#" class="filter-option" data-filter="tutti">Tutti</a>
                <a href="#" class="filter-option" data-filter="in-corso">In Corso</a>
                <a href="#" class="filter-option" data-filter="completati">Completati</a>
                <a href="#" class="filter-option" data-filter="in-attesa">In Attesa</a>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titolo</th>
                    <th>Descrizione</th>
                    <th>Cliente</th>
                    <th>Stato</th>
                    <th>Data Inizio</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                ${window.appData.progetti.map(progetto => {
                    const cliente = window.appData.clienti.find(c => c.id === progetto.clienteId);
                    // Tronca la descrizione se è troppo lunga
                    const descrizioneBreve = progetto.descrizione ? 
                        (progetto.descrizione.length > 50 ? 
                            progetto.descrizione.substring(0, 50) + '...' : 
                            progetto.descrizione) : 
                        'N/A';
                    return `
                        <tr>
                            <td>${progetto.id}</td>
                            <td>${progetto.titolo}</td>
                            <td>${descrizioneBreve}</td>
                            <td>${cliente ? cliente.nome + ' ' + cliente.cognome : 'N/A'}</td>
                            <td><span class="${getStatusClass(progetto.stato)}">${progetto.stato}</span></td>
                            <td>${progetto.dataInizio}</td>
                            <td class="actions-cell">
                                <button class="btn-view" data-id="${progetto.id}" title="Visualizza dettagli">👁️</button>
                                <button class="btn-edit" data-id="${progetto.id}" title="Modifica">✏️</button>
                                <button class="btn-delete" data-id="${progetto.id}" title="Elimina">🗑️</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <!-- Modal per aggiungere/modificare un progetto -->
        <div id="nuovoProgetto" class="modal">
            <div class="modal-content">
                <h2>Nuovo Progetto</h2>
                <form id="form-progetto">
                    <div class="form-group">
                        <label for="titolo">Titolo</label>
                        <input type="text" id="titolo" name="titolo" class="app-input" required>
                    </div>
                    <div class="form-group">
                        <label for="descrizione">Descrizione</label>
                        <textarea id="descrizione" name="descrizione" class="app-input" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="cliente">Cliente</label>
                        <select id="cliente" name="cliente" class="app-input" required>
                            <option value="">Seleziona cliente</option>
                            ${window.appData.clienti.map(cliente => `
                                <option value="${cliente.id}">${cliente.nome} ${cliente.cognome}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="stato">Stato</label>
                        <select id="stato" name="stato" class="app-input" required>
                            <option value="In Attesa">In Attesa</option>
                            <option value="In Corso">In Corso</option>
                            <option value="Completato">Completato</option>
                            <option value="Annullato">Annullato</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dataInizio">Data Inizio</label>
                        <input type="date" id="dataInizio" name="dataInizio" class="app-input" required>
                    </div>
                    <div class="form-group">
                        <label for="dataInizio">Data Inizio</label>
                        <input type="date" id="dataInizio" name="dataInizio" class="app-input" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel btn-close-modal">Annulla</button>
                        <button type="submit" class="btn-primary">Salva</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Modal per visualizzare i dettagli del progetto -->
        <div id="dettagliProgetto" class="modal">
            <div class="modal-content">
                <div id="project-details-container"></div>
            </div>
        </div>
    `;
}

function createMaterialiView() {
    return `
        <div class="view-header">
            <h1>Materiali</h1>
            <button class="btn-primary" id="btn-nuovo-materiale">+ Nuovo Materiale</button>
        </div>
        <div class="filter-container">
            <button class="filter-button" id="btn-filtra-materiali">Categoria</button>
            <div class="filter-options">
                <a href="#" class="filter-option" data-filter="tutti">Tutte</a>
                <a href="#" class="filter-option" data-filter="marmo">Marmo</a>
                <a href="#" class="filter-option" data-filter="granito">Granito</a>
                <a href="#" class="filter-option" data-filter="quarzo">Quarzo</a>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Codice</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Fornitore</th>
                    <th>Quantità</th>
                    <th>Prezzo</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                ${window.appData.materiali.map(materiale => `
                    <tr>
                        <td>${materiale.codice}</td>
                        <td>${materiale.nome}</td>
                        <td>${materiale.categoria}</td>
                        <td>${materiale.fornitore}</td>
                        <td>${materiale.quantita} ${materiale.unitaMisura}</td>
                        <td>${formatCurrency(materiale.prezzoUnitario)}</td>
                        <td>
                            <button class="btn-edit" data-id="${materiale.id}">Modifica</button>
                            <button class="btn-delete" data-id="${materiale.id}">Elimina</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div id="nuovoMateriale" class="nuovo-elemento-form">
            <h2>Nuovo Materiale</h2>
            <form id="form-materiale">
                <div class="form-group">
                    <label for="codice">Codice</label>
                    <input type="text" id="codice" name="codice" class="app-input" required>
                </div>
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="app-input" required>
                </div>
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select id="categoria" name="categoria" class="app-input" required>
                        <option value="Marmo">Marmo</option>
                        <option value="Granito">Granito</option>
                        <option value="Quarzo">Quarzo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fornitore">Fornitore</label>
                    <input type="text" id="fornitore" name="fornitore" class="app-input" required>
                </div>
                <div class="form-group">
                    <label for="quantita">Quantità</label>
                    <input type="number" id="quantita" name="quantita" class="app-input" required>
                </div>
                <div class="form-group">
                    <label for="unitaMisura">Unità di Misura</label>
                    <select id="unitaMisura" name="unitaMisura" class="app-input" required>
                        <option value="mq">mq</option>
                        <option value="ml">ml</option>
                        <option value="pz">pz</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="prezzoUnitario">Prezzo Unitario (€)</label>
                    <input type="number" id="prezzoUnitario" name="prezzoUnitario" class="app-input" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" id="btn-annulla-materiale">Annulla</button>
                    <button type="submit" class="btn-primary">Salva</button>
                </div>
            </form>
        </div>
    `;
}

function createPreventiviView() {
    return `
        <div class="view-header">
            <h1>Preventivi</h1>
            <button class="btn-primary" id="btn-nuovo-preventivo">+ Nuovo Preventivo</button>
        </div>
        <div class="filter-container">
            <button class="filter-button" id="btn-filtra-preventivi">Stato</button>
            <div class="filter-options">
                <a href="#" class="filter-option" data-filter="tutti">Tutti</a>
                <a href="#" class="filter-option" data-filter="in-attesa">In Attesa</a>
                <a href="#" class="filter-option" data-filter="approvati">Approvati</a>
                <a href="#" class="filter-option" data-filter="rifiutati">Rifiutati</a>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Numero</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Importo</th>
                    <th>Stato</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                ${window.appData.preventivi ? window.appData.preventivi.map(preventivo => {
                    const cliente = window.appData.clienti.find(c => c.id === preventivo.clienteId);
                    return `
                        <tr>
                            <td>${preventivo.numero}</td>
                            <td>${cliente ? cliente.nome + ' ' + cliente.cognome : 'N/A'}</td>
                            <td>${formatDate(preventivo.data)}</td>
                            <td>${formatCurrency(preventivo.importoTotale)}</td>
                            <td><span class="${getStatusClass(preventivo.stato)}">${preventivo.stato}</span></td>
                            <td>
                                <button class="btn-view" data-id="${preventivo.id}">Visualizza</button>
                                <button class="btn-edit" data-id="${preventivo.id}">Modifica</button>
                                <button class="btn-delete" data-id="${preventivo.id}">Elimina</button>
                            </td>
                        </tr>
                    `;
                }).join('') : ''}
            </tbody>
        </table>
        <div id="nuovoPreventivo" class="nuovo-elemento-form">
            <h2>Nuovo Preventivo</h2>
            <form id="form-preventivo">
                <div class="form-group">
                    <label for="cliente-preventivo">Cliente</label>
                    <select id="cliente-preventivo" name="cliente" class="app-input" required>
                        <option value="">Seleziona un cliente</option>
                        ${window.appData.clienti.map(cliente => `
                            <option value="${cliente.id}">${cliente.nome} ${cliente.cognome}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="data-preventivo">Data</label>
                    <input type="date" id="data-preventivo" name="data" class="app-input" required>
                </div>
                <div class="form-group">
                    <label>Voci Preventivo</label>
                    <div id="voci-preventivo">
                        <div class="voce-preventivo">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="materiale-1">Materiale</label>
                                    <select id="materiale-1" name="materiale[]" class="app-input materiale-select">
                                        <option value="">Seleziona materiale</option>
                                        ${window.appData.materiali.map(materiale => `
                                            <option value="${materiale.id}" data-prezzo="${materiale.prezzoUnitario}">${materiale.nome} (${materiale.categoria})</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="descrizione-1">Descrizione</label>
                                    <input type="text" id="descrizione-1" name="descrizione[]" class="app-input">
                                </div>
                                <div class="form-group">
                                    <label for="quantita-1">Quantità</label>
                                    <input type="number" id="quantita-1" name="quantita[]" class="app-input quantita-input" step="0.01" min="0">
                                </div>
                                <div class="form-group">
                                    <label for="prezzo-1">Prezzo (€)</label>
                                    <input type="number" id="prezzo-1" name="prezzo[]" class="app-input prezzo-input" step="0.01" min="0">
                                </div>
                                <div class="form-group">
                                    <label for="totale-1">Totale (€)</label>
                                    <input type="number" id="totale-1" name="totale[]" class="app-input totale-input" readonly>
                                </div>
                                <button type="button" class="btn-remove-voce">-</button>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="btn-add-voce" class="btn-secondary">+ Aggiungi Voce</button>
                </div>
                <div class="form-group">
                    <label for="totale-preventivo">Totale Preventivo (€)</label>
                    <input type="number" id="totale-preventivo" name="totalePreventivo" class="app-input" readonly>
                </div>
                <div class="form-group">
                    <label for="note-preventivo">Note</label>
                    <textarea id="note-preventivo" name="note" class="app-input" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" id="btn-annulla-preventivo">Annulla</button>
                    <button type="submit" class="btn-primary">Salva</button>
                </div>
            </form>
        </div>
    `;
}

function createFattureView() {
    return `
        <div class="view-header">
            <h1>Fatture</h1>
            <button class="btn-primary" id="btn-nuova-fattura">+ Nuova Fattura</button>
        </div>
        <div class="filter-container">
            <button class="filter-button" id="btn-filtra-fatture">Stato</button>
            <div class="filter-options">
                <a href="#" class="filter-option" data-filter="tutti">Tutte</a>
                <a href="#" class="filter-option" data-filter="pagate">Pagate</a>
                <a href="#" class="filter-option" data-filter="non-pagate">Non Pagate</a>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Numero</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Importo</th>
                    <th>Stato</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                ${window.appData.fatture ? window.appData.fatture.map(fattura => {
                    const cliente = window.appData.clienti.find(c => c.id === fattura.clienteId);
                    return `
                        <tr>
                            <td>${fattura.numero}</td>
                            <td>${cliente ? cliente.nome + ' ' + cliente.cognome : 'N/A'}</td>
                            <td>${formatDate(fattura.data)}</td>
                            <td>${formatCurrency(fattura.importoTotale)}</td>
                            <td><span class="${fattura.pagata ? 'status-completed' : 'status-pending'}">${fattura.pagata ? 'Pagata' : 'Non Pagata'}</span></td>
                            <td>
                                <button class="btn-view" data-id="${fattura.id}">Visualizza</button>
                                <button class="btn-edit" data-id="${fattura.id}">Modifica</button>
                                <button class="btn-delete" data-id="${fattura.id}">Elimina</button>
                            </td>
                        </tr>
                    `;
                }).join('') : ''}
            </tbody>
        </table>
        <div id="nuovaFattura" class="nuovo-elemento-form">
            <h2>Nuova Fattura</h2>
            <form id="form-fattura">
                <div class="form-group">
                    <label for="cliente-fattura">Cliente</label>
                    <select id="cliente-fattura" name="cliente" class="app-input" required>
                        <option value="">Seleziona un cliente</option>
                        ${window.appData.clienti.map(cliente => `
                            <option value="${cliente.id}">${cliente.nome} ${cliente.cognome}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="data-fattura">Data</label>
                    <input type="date" id="data-fattura" name="data" class="app-input" required>
                </div>
                <div class="form-group">
                    <label>Voci Fattura</label>
                    <div id="voci-fattura">
                        <div class="voce-fattura">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="descrizione-fattura-1">Descrizione</label>
                                    <input type="text" id="descrizione-fattura-1" name="descrizione[]" class="app-input">
                                </div>
                                <div class="form-group">
                                    <label for="quantita-fattura-1">Quantità</label>
                                    <input type="number" id="quantita-fattura-1" name="quantita[]" class="app-input quantita-input" step="0.01" min="0">
                                </div>
                                <div class="form-group">
                                    <label for="prezzo-fattura-1">Prezzo (€)</label>
                                    <input type="number" id="prezzo-fattura-1" name="prezzo[]" class="app-input prezzo-input" step="0.01" min="0">
                                </div>
                                <div class="form-group">
                                    <label for="totale-fattura-1">Totale (€)</label>
                                    <input type="number" id="totale-fattura-1" name="totale[]" class="app-input totale-input" readonly>
                                </div>
                                <button type="button" class="btn-remove-voce">-</button>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="btn-add-voce-fattura" class="btn-secondary">+ Aggiungi Voce</button>
                </div>
                <div class="form-group">
                    <label for="totale-fattura">Totale Fattura (€)</label>
                    <input type="number" id="totale-fattura" name="totaleFattura" class="app-input" readonly>
                </div>
                <div class="form-group">
                    <label for="pagata">Pagata</label>
                    <input type="checkbox" id="pagata" name="pagata">
                </div>
                <div class="form-group">
                    <label for="note-fattura">Note</label>
                    <textarea id="note-fattura" name="note" class="app-input" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" id="btn-annulla-fattura">Annulla</button>
                    <button type="submit" class="btn-primary">Salva</button>
                </div>
            </form>
        </div>
    `;
}

function createImpostazioniView() {
    // Carica i dati aziendali esistenti dal localStorage
    let aziendaData = {};
    try {
        const savedData = localStorage.getItem('aziendaData');
        if (savedData) {
            aziendaData = JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Errore nel caricamento dei dati aziendali:', error);
    }

    return `
        <div class="view-header">
            <h1>Impostazioni</h1>
        </div>
        <div class="settings-container">
            <div class="settings-section">
                <h2>Dati Azienda</h2>
                <form id="form-azienda">
                    <div style="margin-bottom: 15px;">
                        <label for="nome-azienda" style="display: block; margin-bottom: 5px; font-weight: 500;">Nome Azienda</label>
                        <input type="text" id="nome-azienda" name="nomeAzienda" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; display: block;" value="${aziendaData.nome || 'Marmeria'}" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="indirizzo-azienda" style="display: block; margin-bottom: 5px; font-weight: 500;">Indirizzo</label>
                        <input type="text" id="indirizzo-azienda" name="indirizzoAzienda" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; display: block;" value="${aziendaData.indirizzo || 'Via Roma 123, 00100 Roma'}" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="telefono-azienda" style="display: block; margin-bottom: 5px; font-weight: 500;">Telefono</label>
                        <input type="text" id="telefono-azienda" name="telefonoAzienda" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; display: block;" value="${aziendaData.telefono || '06 12345678'}" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="email-azienda" style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
                        <input type="email" id="email-azienda" name="emailAzienda" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; display: block;" value="${aziendaData.email || 'info@marmeria.it'}" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="piva-azienda" style="display: block; margin-bottom: 5px; font-weight: 500;">Partita IVA</label>
                        <input type="text" id="piva-azienda" name="pivaAzienda" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; display: block;" value="${aziendaData.piva || 'IT12345678901'}" required>
                    </div>
                    <div style="margin-top: 20px; text-align: right;">
                        <button type="submit" style="background-color: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Salva Impostazioni</button>
                    </div>
                </form>
            </div>
            <div class="settings-section">
                <h2>Backup Dati</h2>
                <button id="btn-backup" class="btn-primary">Esporta Backup</button>
                <div style="margin-top: 20px;">
                    <p>Importa Backup</p>
                    <input type="file" id="file-import" name="fileImport" accept=".json">
                    <button id="btn-import" class="btn-primary" style="margin-top: 10px;">Importa</button>
                </div>
            </div>
        </div>
    `;
}

// Aggiungi questa funzione se non esiste già
function setupImpostazioniHandlers() {
    // Gestisci il salvataggio delle impostazioni aziendali
    document.getElementById('form-azienda')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Qui puoi salvare i dati dell'azienda
        const aziendaData = {
            nome: document.getElementById('nome-azienda').value,
            indirizzo: document.getElementById('indirizzo-azienda').value,
            telefono: document.getElementById('telefono-azienda').value,
            email: document.getElementById('email-azienda').value,
            piva: document.getElementById('piva-azienda').value
        };
        
        // Salva i dati nel localStorage
        localStorage.setItem('aziendaData', JSON.stringify(aziendaData));
        
        showNotification('Impostazioni aziendali salvate con successo!');
    });
    
    // Gestisci l'esportazione dei dati
    document.getElementById('btn-backup')?.addEventListener('click', function() {
        exportData();
    });
    
    // Gestisci l'importazione dei dati
    document.getElementById('btn-import')?.addEventListener('click', function() {
        const fileInput = document.getElementById('file-import');
        if (fileInput.files.length > 0) {
            importData(fileInput.files[0]);
        } else {
            showNotification('Seleziona un file da importare!', 'error');
        }
    });
}

// Carica una vista specifica
function loadView(viewName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    let viewContent = '';
    
    switch (viewName) {
        case 'dashboard':
            viewContent = createDashboardView();
            break;
        case 'clienti':
            viewContent = createClientiView();
            break;
        case 'progetti':
            viewContent = createProgettiView();
            break;
        case 'materiali':
            viewContent = createMaterialiView();
            break;
        case 'preventivi':
            viewContent = createPreventiviView();
            break;
        case 'fatture':
            viewContent = createFattureView();
            break;
        default:
            viewContent = '<div class="error-message">Vista non trovata</div>';
    }
    
    mainContent.innerHTML = viewContent;
    
    // Imposta gli handler dei form in base alla vista caricata
    switch (viewName) {
        case 'clienti':
            setupClienteFormHandlers();
            break;
        case 'progetti':
            setupProgettoFormHandlers();
            break;
        case 'materiali':
            setupMaterialeFormHandlers();
            break;
        case 'preventivi':
            setupPreventivoFormHandlers();
            break;
        case 'fatture':
            setupFatturaFormHandlers();
            break;
    }
    
    // Aggiorna la classe attiva nella navigazione
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
