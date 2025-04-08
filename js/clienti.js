// File: clienti.js
// Gestione dei clienti

// Funzione per ottenere il container principale dove inserire le view
function getMainContainer() {
    // Se esiste un elemento con id "content" (come in alcune versioni dell'HTML), usalo;
    // altrimenti prova con "main-content", o come fallback un elemento con classe ".main-content"
    return document.getElementById('content') ||
           document.getElementById('main-content') ||
           document.querySelector('.main-content');
  }
  // Aggiungi questa funzione per configurare la ricerca e i filtri per i clienti
// Modifica la funzione setupClienteSearchAndFilters per correggere l'errore di insertBefore
function setupClienteSearchAndFilters() {
    console.log("Configurazione ricerca e filtri per clienti");
    
    // Crea il container per la ricerca e i filtri
    const searchFilterContainer = document.createElement('div');
    searchFilterContainer.className = 'search-filter-container';
    
    // Crea il campo di ricerca
    searchFilterContainer.innerHTML = `
        <div class="search-container">
            <input type="text" id="search-cliente" class="search-input" placeholder="Cerca cliente...">
        </div>
        <div class="filter-container">
            <select id="filter-cliente" class="filter-select">
                <option value="tutti">Tutti i clienti</option>
                <option value="conPartitaIva">Con Partita IVA</option>
                <option value="senzaPartitaIva">Senza Partita IVA</option>
            </select>
        </div>
    `;
    
    // Inserisci il container nella pagina
    const viewClienti = document.getElementById('view-clienti');
    if (viewClienti) {
        // Trova il container della tabella
        const tableContainer = viewClienti.querySelector('.table-container');
        if (tableContainer) {
            // Inserisci il container di ricerca prima della tabella
            viewClienti.querySelector('.view-container').insertBefore(searchFilterContainer, tableContainer);
        } else {
            // Fallback: aggiungi alla fine del view-container
            const viewContainer = viewClienti.querySelector('.view-container');
            if (viewContainer) {
                viewContainer.appendChild(searchFilterContainer);
            }
        }
    }
    
    // Aggiungi l'event listener per la ricerca
    const searchInput = document.getElementById('search-cliente');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyClienteFilters();
        });
    }
    
    // Aggiungi l'event listener per il filtro
    const filterSelect = document.getElementById('filter-cliente');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            applyClienteFilters();
        });
    }
}

// Funzione per applicare i filtri alla tabella dei clienti
function applyClienteFilters() {
    const searchTerm = document.getElementById('search-cliente').value.toLowerCase();
    const filterValue = document.getElementById('filter-cliente').value;
    
    const clientiList = document.getElementById('clienti-list');
    if (!clientiList) return;
    
    const rows = clientiList.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) return; // Salta le righe di intestazione
        
        const nome = cells[0].textContent.toLowerCase();
        const partitaIva = cells[1].textContent.toLowerCase();
        const email = cells[2].textContent.toLowerCase();
        const telefono = cells[3].textContent.toLowerCase();
        
        // Applica il filtro di ricerca
        const matchesSearch = nome.includes(searchTerm) || 
                             partitaIva.includes(searchTerm) || 
                             email.includes(searchTerm) || 
                             telefono.includes(searchTerm);
        
        // Applica il filtro di selezione
        let matchesFilter = true;
        if (filterValue === 'conPartitaIva') {
            matchesFilter = partitaIva !== '-';
        } else if (filterValue === 'senzaPartitaIva') {
            matchesFilter = partitaIva === '-';
        }
        
        // Mostra o nascondi la riga in base ai filtri
        if (matchesSearch && matchesFilter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Funzione per aggiungere gli stili per i filtri
function addFilterStyles() {
    const styleId = 'filter-styles';
    let existingStyle = document.getElementById(styleId);
    if (existingStyle) { existingStyle.remove(); }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .search-filter-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            gap: 10px;
        }
        
        .search-container {
            position: relative;
            flex: 1;
        }
        
        .search-input {
            width: 100%;
            padding: 8px 30px 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .search-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
        }
        
        .filter-container {
            width: 200px;
        }
        
        .filter-select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .filter-indicator {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #f0f8ff;
            padding: 8px 12px;
            border-radius: 4px;
            margin-bottom: 15px;
            border-left: 3px solid #4a90e2;
        }
        
        .btn-clear-filter {
            background: none;
            border: none;
            color: #666;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
        }
        
        .btn-clear-filter:hover {
            color: #333;
        }
    `;
    
    document.head.appendChild(style);
}
  // Renderizza la lista dei clienti
  // Nella funzione renderClienti, aggiungi la colonna Partita IVA nella tabella
  function renderClienti() {
      console.log("Caricamento vista: clienti");
  
      // Ottieni o crea la view dei clienti come elemento fratello
      let viewClienti = document.getElementById('view-clienti');
      if (!viewClienti) {
          console.log("Elemento view-clienti non trovato, creazione...");
  
          const mainContainer = getMainContainer();
          if (!mainContainer) {
              console.error("Contenitore principale non trovato");
              return;
          }
          viewClienti = document.createElement('div');
          viewClienti.id = 'view-clienti';
          viewClienti.className = 'view';
          // Inserisci la view come figlio del container principale
          mainContainer.appendChild(viewClienti);
          console.log("Vista clienti creata e aggiunta al contenitore principale");
      }
  
      // Nascondi tutte le view e mostra quella dei clienti
      document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
      viewClienti.style.display = 'block';
  
      // Svuota il contenuto esistente
      viewClienti.innerHTML = '';
  
      // Crea la struttura HTML della view Clienti
      viewClienti.innerHTML = `
          <div class="view-container">
              <div class="view-header">
                  <h1>Gestione Clienti</h1>
              </div>
              <button id="btn-add-cliente" class="btn-primary">Nuovo Cliente</button>
              <div class="table-container">
                  <table class="data-table">
                      <thead>
                          <tr>
                              <th>Nome</th>
                              <th>Partita IVA</th>
                              <th>Email</th>
                              <th>Telefono</th>
                              <th>Azioni</th>
                          </tr>
                      </thead>
                      <tbody id="clienti-list">
                          <!-- I clienti verranno inseriti qui -->
                      </tbody>
                  </table>
              </div>
          </div>
      `;
  
      // Associa l'handler per il pulsante "Nuovo Cliente"
      const btnAddCliente = document.getElementById('btn-add-cliente');
      if (btnAddCliente) {
          btnAddCliente.addEventListener('click', function() {
              // Sostituisci questa riga
              // mostraModalCliente();
              
              // Con queste righe che usano funzioni già definite nel tuo codice
              createClienteModal();
              resetClienteForm();
              // Correggi il selettore per il titolo del modal
              document.querySelector('#modal-cliente .modal-header h2').textContent = 'Nuovo Cliente';
              openModal('modal-cliente');
          });
      }
  
      // Popola la lista dei clienti
      const clientiList = document.getElementById('clienti-list');
      if (!clientiList) {
          console.error("Elemento clienti-list non trovato dopo la creazione");
          return;
      }
      clientiList.innerHTML = '';
  
      if (!window.appData) {
          console.error("window.appData non è definito!");
          clientiList.innerHTML = '<tr><td colspan="5" class="no-results">Errore: dati non disponibili</td></tr>';
          applyClientiStyles();
          addFilterStyles();
          setupClienteSearchAndFilters();
          return;
      }
      if (!window.appData.clienti) {
          console.log("Inizializzazione array clienti");
          window.appData.clienti = [];
      }
      console.log("Numero di clienti:", window.appData.clienti.length);
      if (window.appData.clienti.length === 0) {
          clientiList.innerHTML = '<tr><td colspan="5" class="no-results">Nessun cliente trovato</td></tr>';
          applyClientiStyles();
          addFilterStyles();
          setupClienteSearchAndFilters();
          return;
      }
      window.appData.clienti.forEach(cliente => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${cliente.nome || '-'}</td>
              <td>${cliente.partitaIva || '-'}</td>
              <td>${cliente.email || '-'}</td>
              <td>${cliente.telefono || '-'}</td>
              <td class="actions-cell">
                  <button class="btn-view" data-id="${cliente.id}">👁️</button>
                  <button class="btn-edit" data-id="${cliente.id}">✏️</button>
                  <button class="btn-delete" data-id="${cliente.id}">🗑️</button>
              </td>
          `;
          clientiList.appendChild(row);
      });
      setupClienteButtons();
  
      // Applica gli stili specifici per la view Clienti
      applyClientiStyles();
      addFilterStyles();
      setupClienteSearchAndFilters();
  
      console.log("Vista clienti renderizzata con successo");
  }
  
  // Funzione per applicare gli stili specifici alla view Clienti
  function applyClientiStyles() {
      const styleId = 'clienti-layout-fix';
      let existingStyle = document.getElementById(styleId);
      if (existingStyle) { existingStyle.remove(); }
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
          /* Stili specifici per la sezione Clienti */
          #view-clienti {
              width: 100%;
              box-sizing: border-box;
              padding: 20px;
          }
          #view-clienti .view-container {
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              padding: 20px;
              margin-bottom: 20px;
          }
          /* Aggiunto spazio tra header e search container */
          #view-clienti .view-header {
              margin-bottom: 20px;
          }
          #view-clienti #btn-add-cliente {
              margin-bottom: 20px;
          }
          #view-clienti .search-filter-container {
              margin-bottom: 20px;
          }
      `;
      document.head.appendChild(style);
  }

  
  
  // Mantenuta la funzione setupClienteFormHandlers
  function setupClienteFormHandlers() {
      const btnAddCliente = document.getElementById('btn-add-cliente');
      if (btnAddCliente) {
          btnAddCliente.addEventListener('click', function() {
              createClienteModal();
              resetClienteForm();
              document.querySelector('#modal-cliente .modal-title').textContent = 'Nuovo Cliente';
              openModal('modal-cliente');
          });
      }
  }
  
  // Resetta il form cliente
  function resetClienteForm() {
      const form = document.getElementById('form-cliente');
      if (form) {
          form.reset();
          document.getElementById('cliente-id').value = '';
      }
  }
  
  // Configura gli event listener per i pulsanti (visualizza, modifica, elimina)
  function setupClienteButtons() {
      document.querySelectorAll('.btn-view').forEach(button => {
          button.addEventListener('click', function() {
              const clienteId = parseInt(this.getAttribute('data-id'));
              showClienteDetails(clienteId);
          });
      });
      document.querySelectorAll('.btn-edit').forEach(button => {
          button.addEventListener('click', function() {
              const clienteId = parseInt(this.getAttribute('data-id'));
              editCliente(clienteId);
          });
      });
      document.querySelectorAll('.btn-delete').forEach(button => {
          button.addEventListener('click', function() {
              const clienteId = parseInt(this.getAttribute('data-id'));
              deleteCliente(clienteId);
          });
      });
  }
  
  // Crea il modal per l'aggiunta/modifica del cliente (se non esiste)
  // Nella funzione createClienteModal, aggiungi il campo Partita IVA
  function createClienteModal(cliente = null) {
      if (document.getElementById('modal-cliente')) return;
  
      if (!document.getElementById('modal-styles')) {
          const styleElement = document.createElement('style');
          styleElement.id = 'modal-styles';
          styleElement.textContent = `
              .modal {
                  display: none;
                  position: fixed;
                  z-index: 1000;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0,0,0,0.5);
                  overflow: auto;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .modal-content {
                  background-color: #fefefe;
                  margin: auto;
                  padding: 0;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                  width: 80%;
                  max-width: 600px;
                  animation: modalopen 0.3s;
              }
              .modal-header {
                  padding: 15px;
                  border-bottom: 1px solid #ddd;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              .modal-body {
                  padding: 20px;
              }
              .modal-footer {
                  padding: 15px;
                  border-top: 1px solid #ddd;
                  text-align: right;
              }
              .close-modal {
                  color: #aaa;
                  font-size: 28px;
                  font-weight: bold;
                  cursor: pointer;
              }
              .close-modal:hover {
                  color: #333;
              }
              @keyframes modalopen {
                  from {opacity: 0; transform: translateY(-50px);}
                  to {opacity: 1; transform: translateY(0);}
              }
              #btn-add-cliente {
                  margin-bottom: 20px;
              }
              .view-header {
                  margin-bottom: 20px;
              }
          `;
          document.head.appendChild(styleElement);
      }
  
      const modalHTML = `
          <div id="modal-cliente" class="modal">
              <div class="modal-content">
                  <div class="modal-header">
                      <h2>${cliente ? 'Modifica Cliente' : 'Nuovo Cliente'}</h2>
                      <span class="close-modal">&times;</span>
                  </div>
                  <div class="modal-body">
                      <form id="form-cliente" class="app-form">
                          <input type="hidden" id="cliente-id" value="${cliente ? cliente.id : ''}">
                          <div class="form-row">
                              <div class="form-group">
                                  <label for="nome-cliente">Nome*</label>
                                  <input type="text" id="nome-cliente" class="app-input" value="${cliente ? cliente.nome : ''}" required>
                              </div>
                              <div class="form-group">
                                  <label for="cognome-cliente">Cognome*</label>
                                  <input type="text" id="cognome-cliente" class="app-input" value="${cliente ? cliente.cognome : ''}" required>
                              </div>
                          </div>
                          <div class="form-row">
                              <div class="form-group">
                                  <label for="email-cliente">Email</label>
                                  <input type="email" id="email-cliente" class="app-input" value="${cliente ? cliente.email || '' : ''}">
                              </div>
                              <div class="form-group">
                                  <label for="telefono-cliente">Telefono</label>
                                  <input type="tel" id="telefono-cliente" class="app-input" value="${cliente ? cliente.telefono || '' : ''}">
                              </div>
                          </div>
                          <div class="form-row">
                              <div class="form-group">
                                  <label for="partitaiva-cliente">Partita IVA</label>
                                  <input type="text" id="partitaiva-cliente" class="app-input" value="${cliente ? cliente.partitaIva || '' : ''}">
                              </div>
                          </div>
                          <div class="form-row">
                              <div class="form-group">
                                  <label for="indirizzo-cliente">Indirizzo</label>
                                  <input type="text" id="indirizzo-cliente" class="app-input" value="${cliente ? cliente.indirizzo || '' : ''}">
                              </div>
                          </div>
                          <div class="form-row">
                              <div class="form-group">
                                  <label for="citta-cliente">Città</label>
                                  <input type="text" id="citta-cliente" class="app-input" value="${cliente ? cliente.citta || '' : ''}">
                              </div>
                              <div class="form-group" style="width: 100px;">
                                  <label for="cap-cliente">CAP</label>
                                  <input type="text" id="cap-cliente" class="app-input" value="${cliente ? cliente.cap || '' : ''}">
                              </div>
                              <div class="form-group" style="width: 100px;">
                                  <label for="provincia-cliente">Provincia</label>
                                  <input type="text" id="provincia-cliente" class="app-input" value="${cliente ? cliente.provincia || '' : ''}">
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="note-cliente">Note</label>
                              <textarea id="note-cliente" class="app-input" rows="3">${cliente ? cliente.note || '' : ''}</textarea>
                          </div>
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button id="btn-save-cliente" class="btn-primary">Salva</button>
                      <button class="btn-secondary btn-close">Annulla</button>
                  </div>
              </div>
          </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      document.querySelector('#modal-cliente .close-modal').addEventListener('click', function() {
          closeModal();
      });
      document.getElementById('form-cliente').addEventListener('submit', function(e) {
          e.preventDefault();
          saveCliente();
      });
  }
  
  function showClienteDetails(clienteId) {
      const cliente = window.appData.clienti.find(c => c.id === clienteId);
      if (!cliente) {
          showNotification('Cliente non trovato', 'error');
          return;
      }
      const modalHTML = `
          <div id="modal-cliente-details" class="modal">
              <div class="modal-content">
                  <div class="modal-header">
                      <h2>Dettagli Cliente</h2>
                      <span class="close-modal">&times;</span>
                  </div>
                  <div class="modal-body">
                      <div class="cliente-details">
                          <p><strong>Nome:</strong> ${cliente.nome}</p>
                          <p><strong>Cognome:</strong> ${cliente.cognome}</p>
                          <p><strong>Email:</strong> ${cliente.email}</p>
                          <p><strong>Telefono:</strong> ${cliente.telefono}</p>
                          <p><strong>Indirizzo:</strong> ${cliente.indirizzo || 'Non specificato'}</p>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button class="btn-primary btn-close">Chiudi</button>
                  </div>
              </div>
          </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      const modal = document.getElementById('modal-cliente-details');
      modal.style.display = 'flex';
      const closeButtons = modal.querySelectorAll('.close-modal, .btn-close');
      closeButtons.forEach(button => {
          button.addEventListener('click', function() {
              document.body.removeChild(modal);
          });
      });
      modal.addEventListener('click', function(e) {
          if (e.target === modal) {
              document.body.removeChild(modal);
          }
      });
  }
  
  function editCliente(clienteId) {
      const cliente = window.appData.clienti.find(c => c.id === clienteId);
      if (!cliente) {
          showNotification('Cliente non trovato', 'error');
          return;
      }
      createClienteModal(cliente);
      document.getElementById('cliente-id').value = cliente.id;
      
      // Correzione: usa gli ID corretti che corrispondono a quelli nel form
      document.getElementById('nome-cliente').value = cliente.nome || '';
      document.getElementById('cognome-cliente').value = cliente.cognome || '';
      document.getElementById('email-cliente').value = cliente.email || '';
      document.getElementById('telefono-cliente').value = cliente.telefono || '';
      document.getElementById('partitaiva-cliente').value = cliente.partitaIva || '';
      document.getElementById('indirizzo-cliente').value = cliente.indirizzo || '';
      document.getElementById('citta-cliente').value = cliente.citta || '';
      document.getElementById('cap-cliente').value = cliente.cap || '';
      document.getElementById('provincia-cliente').value = cliente.provincia || '';
      document.getElementById('note-cliente').value = cliente.note || '';
      
      // Aggiorna il titolo del modal
      document.querySelector('#modal-cliente .modal-header h2').textContent = 'Modifica Cliente';
      
      // Apri il modal
      openModal('modal-cliente');
  }
  
  function deleteCliente(clienteId) {
      confirmAction('Sei sicuro di voler eliminare questo cliente?', function() {
          const clienteIndex = window.appData.clienti.findIndex(c => c.id === clienteId);
          if (clienteIndex !== -1) {
              window.appData.clienti.splice(clienteIndex, 1);
              saveAppData();
              renderClienti();
              showNotification('Cliente eliminato con successo!');
          }
      });
  }
  
  // Nella funzione saveCliente, aggiungi il salvataggio della Partita IVA
  function saveCliente() {
      // Raccogli i dati dal form
      const clienteId = document.getElementById('cliente-id').value;
      const nome = document.getElementById('nome-cliente').value.trim();
      const cognome = document.getElementById('cognome-cliente').value.trim();
      const email = document.getElementById('email-cliente').value.trim();
      const telefono = document.getElementById('telefono-cliente').value.trim();
      const partitaIva = document.getElementById('partitaiva-cliente').value.trim();
      const indirizzo = document.getElementById('indirizzo-cliente').value.trim();
      const citta = document.getElementById('citta-cliente').value.trim();
      const cap = document.getElementById('cap-cliente').value.trim();
      const provincia = document.getElementById('provincia-cliente').value.trim();
      const note = document.getElementById('note-cliente').value.trim();
      
      // Validazione base
      if (!nome || !cognome) {
          alert('Nome e cognome sono campi obbligatori');
          return;
      }
      
      // Crea l'oggetto cliente
      const cliente = {
          nome,
          cognome,
          email,
          telefono,
          partitaIva,
          indirizzo,
          citta,
          cap,
          provincia,
          note
      };
      
      // Controlla se è un nuovo cliente o una modifica
      if (clienteId) {
          // Modifica cliente esistente
          cliente.id = parseInt(clienteId);
          const index = window.appData.clienti.findIndex(c => c.id === cliente.id);
          if (index !== -1) {
              window.appData.clienti[index] = cliente;
          }
      } else {
          // Nuovo cliente
          cliente.id = Date.now(); // Usa timestamp come ID univoco
          if (!window.appData.clienti) {
              window.appData.clienti = [];
          }
          window.appData.clienti.push(cliente);
      }
      
      // Salva i dati e aggiorna la vista
      saveAppData();
      renderClienti();
      closeModal();
  }
  
  // Aggiungi la funzione openModal se non esiste
  function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
          modal.style.display = 'flex';
          
          // Aggiungi event listener per i pulsanti nel modal
          const closeButtons = modal.querySelectorAll('.close-modal, .btn-close');
          closeButtons.forEach(button => {
              button.addEventListener('click', closeModal);
          });
          
          // Aggiungi event listener per il pulsante Salva
          const saveButton = modal.querySelector('#btn-save-cliente');
          if (saveButton) {
              saveButton.addEventListener('click', saveCliente);
          }
          
          // Chiudi il modal cliccando fuori
          modal.addEventListener('click', function(e) {
              if (e.target === modal) {
                  closeModal();
              }
          });
      }
  }
  
  // Aggiungi la funzione closeModal se non esiste
  function closeModal() {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
          modal.style.display = 'none';
      });
  }
  
  // Aggiungi la funzione saveAppData se non esiste
  function saveAppData() {
      localStorage.setItem('appData', JSON.stringify(window.appData));
  }
  
  // Aggiungi la funzione showNotification se non esiste
  function showNotification(message, type = 'success') {
      alert(message); // Versione semplice usando alert
      // In futuro potresti implementare una notifica più elegante
  }
  
  // Aggiungi la funzione confirmAction se non esiste
  function confirmAction(message, callback) {
      if (confirm(message)) {
          callback();
      }
  }

// Add a new client
function addCliente(cliente) {
    try {
        // Generate a unique ID
        cliente.id = generateUniqueId();
        
        // Add the client to the array
        window.appData.clienti.push(cliente);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderClienti();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiunta del cliente:", error);
        return false;
    }
}

// Update an existing client
function updateCliente(id, updatedCliente) {
    try {
        // Find the index of the client
        const index = window.appData.clienti.findIndex(c => c.id === id);
        
        if (index === -1) {
            console.error("Cliente non trovato:", id);
            return false;
        }
        
        // Keep the original ID
        updatedCliente.id = id;
        
        // Update the client
        window.appData.clienti[index] = updatedCliente;
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderClienti();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'aggiornamento del cliente:", error);
        return false;
    }
}

// Delete a client
function deleteCliente(id) {
    try {
        // Filter the array to remove the client
        window.appData.clienti = window.appData.clienti.filter(c => c.id !== id);
        
        // Save the data
        saveAppData();
        
        // Update the view
        renderClienti();
        
        return true;
    } catch (error) {
        console.error("Errore durante l'eliminazione del cliente:", error);
        return false;
    }
}