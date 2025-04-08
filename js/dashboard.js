// Dichiara progettiInScadenza come variabile globale all'inizio del file
let progettiInScadenza = [];
// Rimuovo la dichiarazione di fattureInAttesa
let fattureInAttesa = [];

// Dashboard principale dell'applicazione
// Nella funzione che crea le card della dashboard, modifica l'event listener per la card dei progetti in corso

// Aggiungi un flag per tracciare se la dashboard è già stata inizializzata
let dashboardInitialized = false;

function renderDashboard() {
    console.log("Rendering dashboard");
    
    // Verifica se la dashboard è già stata inizializzata in questa sessione
    if (dashboardInitialized) {
        console.log("Dashboard già inizializzata, aggiornamento dati");
        // Aggiorna solo i dati dinamici invece di ricreare tutta la dashboard
        updateDashboardData();
        return;
    }
    
    // Imposta il flag a true per evitare reinizializzazioni complete
    dashboardInitialized = true;
    
    // Verifica che window.appData esista
    if (!window.appData) {
        console.error("window.appData non è definito!");
        return;
    }
    
    const dashboardView = document.getElementById('view-dashboard');
    if (!dashboardView) {
        console.error("Elemento view-dashboard non trovato");
        return;
    }
    
    // Assicurati che tutte le strutture dati necessarie esistano
    if (!window.appData.fatture) {
        window.appData.fatture = [];
    }
    
    // Ottieni i dati necessari per la dashboard
    const clientiCount = window.appData.clienti.length;
    const progettiCount = window.appData.progetti.length;
    const progettiAttivi = window.appData.progetti.filter(p => p.stato !== 'Completato').length;
    const progettiCompletati = window.appData.progetti.filter(p => p.stato === 'Completato').length;
    const materialiCount = window.appData.materiali.length;
    
    // Calcola i progetti in scadenza (entro 7 giorni)
    // Calcola i progetti in scadenza (entro 7 giorni o già scaduti ma non completati)
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0); // Resetta l'ora a mezzanotte per confrontare solo le date
    
    const settimanaFutura = new Date(oggi);
    settimanaFutura.setDate(oggi.getDate() + 7);
    
    console.log("Data oggi:", oggi);
    console.log("Data limite:", settimanaFutura);
    
    // Aggiorna la variabile globale progettiInScadenza
    progettiInScadenza = window.appData.progetti.filter(p => {
        // Escludi progetti completati
        if (p.stato === 'Completato') return false;
        
        // Controlla sia dataConsegna che dataInizio
        let dataProgetto = null;
        
        if (p.dataConsegna) {
            dataProgetto = new Date(p.dataConsegna);
        } else if (p.dataInizio) {
            dataProgetto = new Date(p.dataInizio);
        } else {
            console.log("Progetto senza data:", p.nome);
            return false;
        }
        
        dataProgetto.setHours(0, 0, 0, 0);
        
        console.log(`Progetto: ${p.nome}, Data: ${dataProgetto}, Stato: ${p.stato}`);
        
        // Includi tutti i progetti non completati
        return p.stato !== 'Completato';
    });
    
    console.log("Progetti in scadenza trovati:", progettiInScadenza.length);
    
    // Ordina i progetti: prima quelli già scaduti, poi quelli in scadenza
    progettiInScadenza.sort((a, b) => {
        const dataA = new Date(a.dataInizio || a.dataConsegna);
        const dataB = new Date(b.dataInizio || b.dataConsegna);
        return dataA - dataB;
    });
    
    // Calcola i pagamenti in scadenza
    const pagamentiInScadenza = window.appData.fatture
        ? window.appData.fatture.filter(f => f.stato !== 'Pagata').length
        : 0;
    
    // Calcola il fatturato totale dell'anno corrente
    const annoCorrente = oggi.getFullYear();
    // Sostituisci questo calcolo con la chiamata alla funzione calcolaFatturatoAnnuale()
    const fatturato = calcolaFatturatoAnnuale();
    
    // Recupera gli appunti della dashboard
    if (!window.appData.dashboardNotes) {
        window.appData.dashboardNotes = {
            notes: [],
            lastId: 0
        };
    }
    
    // Genera il contenuto HTML della dashboard con un design migliorato e più compatto
    // Nella funzione renderDashboard, aggiorna la sezione dei progetti in scadenza
    // e la sezione dei pagamenti in attesa
    
    dashboardView.innerHTML = `
        <div class="dashboard-container">
            <h1 class="dashboard-main-title">Dashboard</h1>
            
            
            <div class="stats-container">
                <div class="stat-card clickable" onclick="navigateTo('clienti')">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-value">${clientiCount}</div>
                    <div class="stat-label">Clienti</div>
                </div>
                
                <div class="stat-card clickable" onclick="navigateTo('progetti')">
                    <div class="stat-icon"><i class="fas fa-project-diagram"></i></div>
                    <div class="stat-value">${progettiCount}</div>
                    <div class="stat-label">Progetti Totali</div>
                </div>
                
                
                <div class="stat-card clickable" onclick="navigateTo('progetti', 'list', null, { filter: 'inCorso' })">
                    <div class="stat-icon"><i class="fas fa-tasks"></i></div>
                    <div class="stat-value">${window.appData.progetti.filter(p => p.stato === 'In Corso').length}</div>
                    <div class="stat-label">Progetti In Corso</div>
                </div>
                
                <div class="stat-card clickable" onclick="navigateTo('fatture', 'list', null, { filter: 'nonPagate' })">
                    <div class="stat-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                    <div class="stat-value">${window.appData.fatture ? window.appData.fatture.filter(f => f.stato !== 'Pagata' && f.stato !== 'Annullata').length : 0}</div>
                    <div class="stat-label">Fatture da Pagare</div>
                </div>
                
                <div class="stat-card clickable" onclick="navigateTo('materiali')">
                    <div class="stat-icon"><i class="fas fa-cubes"></i></div>
                    <div class="stat-value">${materialiCount}</div>
                    <div class="stat-label">Materiali</div>
                </div>
                
                <div class="stat-card highlight clickable" onclick="navigateTo('fatture')">
                    <div class="stat-icon"><i class="fas fa-euro-sign"></i></div>
                    <div class="stat-value">${formatCurrency(fatturato)}</div>
                    <div class="stat-label">Fatturato ${annoCorrente}</div>
                </div>
            </div>
            
            <!-- Sezioni con bordi ben definiti -->
            <div class="dashboard-section">
                <div class="section-header">
                    <i class="fas fa-clock"></i> Progetti in Scadenza (7 giorni)
                </div>
                
                <div class="section-content" id="progetti-scadenza-container">
                    ${progettiInScadenza.length > 0 ? `
                        <div class="progetti-scadenza-wrapper">
                            <ul class="dashboard-list progetti-list">
                                ${progettiInScadenza.map(p => {
                                    const cliente = window.appData.clienti.find(c => c.id === p.clienteId) || { nome: 'N/D', cognome: '' };
                                    const dataVisualizzata = p.dataConsegna ? formatDate(p.dataConsegna) : formatDate(p.dataInizio);
                                    return `
                                        <li class="dashboard-list-item">
                                            <div class="list-item-content">
                                                <div class="list-item-title">${p.id}</div>
                                                <div class="list-item-subtitle">Cliente: ${cliente.nome} ${cliente.cognome}</div>
                                                <div class="list-item-date">Data: ${dataVisualizzata}</div>
                                                <div class="list-item-status">Stato: ${p.stato}</div>
                                            </div>
                                            <div class="list-item-actions">
                                                <button class="btn-view" onclick="navigateTo('progetti', 'view', ${p.id})">👁️</button>
                                                <button class="btn-complete" onclick="completaProgetto(${p.id})">✓</button>
                                            </div>
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                        </div>
                    ` : `
                        <div class="empty-list">Nessun progetto in scadenza nei prossimi 7 giorni</div>
                    `}
                </div>
            </div>
            
            <!-- Rimuovo la sezione "Pagamenti in Attesa" -->
            
            <div class="dashboard-section">
                <div class="section-header">
                    <i class="fas fa-sticky-note"></i> Appunti
                </div>
                <div class="section-content">
                    <div id="dashboard-notes-list" class="notes-list-wrapper">
                        ${window.appData.dashboardNotes.notes.length > 0 ? 
                            // Invertiamo l'array prima di mapparlo per mostrare i più vecchi prima
                            [...window.appData.dashboardNotes.notes].reverse().map(note => `
                                <div class="note-item" data-id="${note.id}">
                                    <div class="note-content">${note.content}</div>
                                    <div class="note-date">${formatDate(note.date)}</div>
                                    <button class="delete-note">🗑️</button>
                                </div>
                            `).join('') : 
                            '<div class="empty-list">Nessun appunto. Aggiungi il tuo primo appunto!</div>'
                        }
                    </div>
                    <div class="note-form">
                        <textarea id="new-note" placeholder="Scrivi un nuovo appunto..."></textarea>
                        <button id="add-note" class="btn-primary">Aggiungi</button>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-section">
                <div class="section-header">
                    <i class="fas fa-chart-pie"></i> Progetti per Stato
                </div>
                <div class="section-content chart-container">
                    <canvas id="progetti-stato-chart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Add this function to create and initialize the charts
    // Nella funzione initCharts, modifica i colori per gli stati
    function initCharts() {
        console.log("Initializing dashboard charts");
        
        try {
            const progettiStatoChart = document.getElementById('progetti-stato-chart');
            if (!progettiStatoChart) {
                console.error("Chart canvas element not found");
                return;
            }
            
            // Count projects by status
            const statiProgetti = {};
            window.appData.progetti.forEach(progetto => {
                if (!statiProgetti[progetto.stato]) {
                    statiProgetti[progetto.stato] = 0;
                }
                statiProgetti[progetto.stato]++;
            });
            
            // Prepare data for the chart
            const labels = Object.keys(statiProgetti);
            const data = Object.values(statiProgetti);
            
            // Define colors for different statuses - inverti i colori di Pagato e Completato
            const backgroundColors = {
                'In Corso': '#3498db',    // Blue
                'Completato': '#9b59b6',  // Purple (era verde)
                'In Attesa': '#f39c12',   // Orange
                'Annullato': '#e74c3c',   // Red
                'Pagato': '#2ecc71'       // Green (era viola)
            };
            
            // Create background colors array based on labels
            const colors = labels.map(label => backgroundColors[label] || '#95a5a6');
            
            // Create the chart
            new Chart(progettiStatoChart, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
            
            console.log("Chart initialized successfully");
        } catch (error) {
            console.error("Error initializing charts:", error);
        }
    }
    
    // Funzione per configurare gli handler degli appunti
    function setupNotesHandlers() {
        console.log("Inizializzazione handler appunti");
        
        const addNoteBtn = document.getElementById('add-note');
        const newNoteText = document.getElementById('new-note');
        const notesList = document.getElementById('dashboard-notes-list');
        
        if (!addNoteBtn || !newNoteText || !notesList) {
            console.error("Elementi per gli appunti non trovati");
            return;
        }
        
        // Modifica nella funzione setupNotesHandlers per aggiungere l'appunto alla fine
        // Handler per aggiungere un nuovo appunto
        addNoteBtn.addEventListener('click', function() {
            const noteText = newNoteText.value.trim();
            if (!noteText) {
                return; // Non aggiungere appunti vuoti
            }
            
            // Crea un nuovo appunto
            const newNote = {
                id: ++window.appData.dashboardNotes.lastId,
                content: noteText,
                date: new Date().toISOString()
            };
            
            // Aggiungi l'appunto all'array (alla fine invece che all'inizio)
            window.appData.dashboardNotes.notes.push(newNote);
            
            // Salva i dati
            saveAppData();
            
            // Aggiorna la visualizzazione
            if (window.appData.dashboardNotes.notes.length === 1) {
                // Se questo è il primo appunto, sostituisci il messaggio "nessun appunto"
                notesList.innerHTML = '';
            }
            
            // Crea l'elemento HTML per il nuovo appunto
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.dataset.id = newNote.id;
            noteElement.innerHTML = `
                <div class="note-content">${newNote.content}</div>
                <div class="note-date">${formatDate(newNote.date)}</div>
                <button class="delete-note">🗑️</button>
            `;
            
            // Aggiungi l'elemento alla fine della lista
            notesList.appendChild(noteElement);
            
            // Pulisci il campo di input
            newNoteText.value = '';
            
            // Configura l'handler per l'eliminazione del nuovo appunto
            setupDeleteNoteHandlers();
            
            // Scorri automaticamente verso il basso per mostrare il nuovo appunto
            notesList.scrollTop = notesList.scrollHeight;
        });
        
        // Configura gli handler per l'eliminazione degli appunti esistenti
        setupDeleteNoteHandlers();
    }
    
    // Funzione per configurare gli handler di eliminazione degli appunti
    function setupDeleteNoteHandlers() {
        const deleteButtons = document.querySelectorAll('.delete-note');
        
        deleteButtons.forEach(button => {
            // Rimuovi eventuali listener precedenti per evitare duplicati
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                const noteItem = this.closest('.note-item');
                const noteId = parseInt(noteItem.dataset.id);
                
                // Chiedi conferma all'utente
                if (confirm('Sei sicuro di voler eliminare questo appunto?')) {
                    // Rimuovi l'appunto dall'array
                    window.appData.dashboardNotes.notes = window.appData.dashboardNotes.notes.filter(note => note.id !== noteId);
                    
                    // Salva i dati
                    saveAppData();
                    
                    // Rimuovi l'elemento dalla DOM
                    noteItem.remove();
                    
                    // Se non ci sono più appunti, mostra il messaggio "nessun appunto"
                    if (window.appData.dashboardNotes.notes.length === 0) {
                        document.getElementById('dashboard-notes-list').innerHTML = 
                            '<div class="empty-list">Nessun appunto. Aggiungi il tuo primo appunto!</div>';
                    }
                }
            });
        });
    }
    
    // Alla fine della funzione renderDashboard, modifichiamo il gestore dei click sulle card
    
    // Inizializza i grafici
    initCharts();
    
    // Inizializza gli handler per gli appunti
    setupNotesHandlers();
    
    // Assicurati che i click sulle card funzionino
    document.querySelectorAll('.stat-card.clickable').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(event) {
            // Previeni la propagazione dell'evento
            event.stopPropagation();
            event.preventDefault();
            
            // Ottieni la sezione di destinazione dall'attributo onclick
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                // Estrai il nome della sezione dall'attributo onclick
                const sectionMatch = onclickAttr.match(/navigateTo\('([^']+)'/);
                if (sectionMatch && sectionMatch[1]) {
                    const section = sectionMatch[1];
                    console.log(`Navigazione diretta alla sezione: ${section}`);
                    
                    // Nascondi tutte le viste
                    document.querySelectorAll('.view').forEach(view => {
                        view.style.display = 'none';
                    });
                    
                    // Mostra la vista richiesta
                    const viewElement = document.getElementById(`view-${section}`);
                    if (viewElement) {
                        viewElement.style.display = 'block';
                        
                        // Aggiorna la classe attiva nel menu
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('data-view') === section) {
                                link.classList.add('active');
                            }
                        });
                        
                        // Esegui la funzione di rendering appropriata
                        switch (section) {
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
                    } else {
                        console.error(`Vista ${section} non trovata`);
                    }
                } else {
                    // Se non riusciamo a estrarre la sezione, eseguiamo l'onclick originale
                    eval(onclickAttr);
                }
            }
        });
    });
}

// Funzione per gestire lo scorrimento dei progetti in scadenza
// Modifica la funzione setupProgettiScadenzaScroll per rimuovere la ricerca dei pulsanti di navigazione
function setupProgettiScadenzaScroll() {
    console.log("Inizializzazione scorrimento progetti in scadenza");
    
    // Seleziona gli elementi corretti
    const progettiList = document.querySelector('.progetti-list');
    if (!progettiList) {
        console.log("Lista progetti non trovata");
        return;
    }
    
    const items = progettiList.querySelectorAll('.dashboard-list-item');
    const totalItems = items.length;
    
    console.log(`Trovati ${totalItems} progetti in scadenza`);
    
    // Non è necessario fare altro, poiché utilizziamo solo lo scroll verticale standard
    // Rimuoviamo tutta la logica dei pulsanti prev/next
}

// Modifica anche la funzione aggiornaProgettiInScadenza per rimuovere il riferimento a setupProgettiScadenzaScroll
function aggiornaProgettiInScadenza() {
    // Ottieni la data corrente
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    
    const settimanaFutura = new Date(oggi);
    settimanaFutura.setDate(oggi.getDate() + 7);
    
    // Aggiorna la variabile globale progettiInScadenza
    progettiInScadenza = window.appData.progetti.filter(p => {
        if (p.stato === 'Completato') return false;
        
        let dataProgetto = null;
        if (p.dataConsegna) {
            dataProgetto = new Date(p.dataConsegna);
        } else if (p.dataInizio) {
            dataProgetto = new Date(p.dataInizio);
        } else {
            return false;
        }
        
        dataProgetto.setHours(0, 0, 0, 0);
        return p.stato !== 'Completato';
    });
    
    // Ordina i progetti
    progettiInScadenza.sort((a, b) => {
        const dataA = new Date(a.dataInizio || a.dataConsegna);
        const dataB = new Date(b.dataInizio || b.dataConsegna);
        return dataA - dataB;
    });
    
    // Aggiorna la lista dei progetti in scadenza nel DOM
    const container = document.getElementById('progetti-scadenza-container');
    if (container) {
        container.innerHTML = progettiInScadenza.length > 0 ? `
            <div class="progetti-scadenza-wrapper">
                <ul class="dashboard-list progetti-list">
                    ${progettiInScadenza.map(p => {
                        const cliente = window.appData.clienti.find(c => c.id === p.clienteId) || { nome: 'N/D', cognome: '' };
                        const dataVisualizzata = p.dataConsegna ? formatDate(p.dataConsegna) : formatDate(p.dataInizio);
                        return `
                            <li class="dashboard-list-item">
                                <div class="list-item-content">
                                    <div class="list-item-title">${p.id}</div>
                                    <div class="list-item-subtitle">Cliente: ${cliente.nome} ${cliente.cognome}</div>
                                    <div class="list-item-date">Data: ${dataVisualizzata}</div>
                                    <div class="list-item-status">Stato: ${p.stato}</div>
                                </div>
                                <div class="list-item-actions">
                                    <button class="btn-view" onclick="navigateTo('progetti', 'view', ${p.id})">👁️</button>
                                    <button class="btn-complete" onclick="completaProgetto(${p.id})">✓</button>
                                </div>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        ` : `
            <div class="empty-list">Nessun progetto in scadenza nei prossimi 7 giorni</div>
        `;
        
        // Rimuoviamo la chiamata a setupProgettiScadenzaScroll
        // Non è più necessaria poiché utilizziamo solo lo scroll verticale standard
    }
}

// Funzione per aggiornare i grafici
function aggiornaGrafici() {
    const chartCanvas = document.getElementById('progetti-stato-chart');
    if (!chartCanvas) return;
    
    try {
        // Ottieni l'istanza del grafico se esiste
        const chartInstance = Chart.getChart(chartCanvas);
        if (!chartInstance) {
            // Se il grafico non esiste, inizializzalo
            initCharts();
            return;
        }
        
        // Conta i progetti per stato
        const statiProgetti = {};
        window.appData.progetti.forEach(progetto => {
            if (!statiProgetti[progetto.stato]) {
                statiProgetti[progetto.stato] = 0;
            }
            statiProgetti[progetto.stato]++;
        });
        
        // Aggiorna i dati del grafico
        chartInstance.data.labels = Object.keys(statiProgetti);
        chartInstance.data.datasets[0].data = Object.values(statiProgetti);
        chartInstance.update();
        
        console.log("Grafico aggiornato con successo");
    } catch (error) {
        console.error("Errore nell'aggiornamento del grafico:", error);
    }
}

// Funzione per calcolare il fatturato annuale
function calcolaFatturatoAnnuale() {
    console.log('Calcolo fatturato annuale...');
    
    // Verifica che i dati delle fatture esistano
    if (!window.appData || !window.appData.fatture) {
        console.log('Nessuna fattura trovata');
        return 0;
    }
    
    // Ottieni l'anno corrente
    const annoCorrente = new Date().getFullYear();
    
    // Filtra le fatture pagate dell'anno corrente
    const fatturePagate = window.appData.fatture.filter(fattura => {
        // Verifica che la fattura sia pagata
        if (fattura.stato !== 'Pagata') return false;
        
        // Estrai l'anno dalla data della fattura
        const dataFattura = new Date(fattura.data);
        const annoFattura = dataFattura.getFullYear();
        
        // Confronta con l'anno corrente
        return annoFattura === annoCorrente;
    });
    
    console.log('Fatture pagate trovate:', fatturePagate.length);
    
    // Calcola il totale
    const totale = fatturePagate.reduce((acc, fattura) => {
        // Usa importo invece di totale, poiché dalle immagini sembra che il campo si chiami importo
        const importo = parseFloat(fattura.importo) || 0;
        console.log(`Aggiunta al totale: ${importo}`);
        return acc + importo;
    }, 0);
    
    console.log('Totale fatturato calcolato:', totale);
    return totale;
}

// Aggiungi questa funzione per aggiornare i dati della dashboard senza ricrearla
function updateDashboardData() {
    console.log("Aggiornamento dati dashboard");
    
    // Aggiorna i contatori nelle card
    const dashboardView = document.getElementById('view-dashboard');
    if (!dashboardView) {
        console.error("Elemento view-dashboard non trovato");
        return;
    }
    
    // Aggiorna i contatori
    const clientiCount = window.appData.clienti ? window.appData.clienti.length : 0;
    const progettiCount = window.appData.progetti ? window.appData.progetti.length : 0;
    const progettiInCorsoCount = window.appData.progetti ? window.appData.progetti.filter(p => p.stato === 'In Corso').length : 0;
    const fattureNonPagateCount = window.appData.fatture ? window.appData.fatture.filter(f => f.stato !== 'Pagata' && f.stato !== 'Annullata').length : 0;
    const materialiCount = window.appData.materiali ? window.appData.materiali.length : 0;
    
    // Aggiorna i valori nelle card
    const clientiValueEl = dashboardView.querySelector('.stat-card:nth-child(1) .stat-value');
    const progettiValueEl = dashboardView.querySelector('.stat-card:nth-child(2) .stat-value');
    const progettiInCorsoValueEl = dashboardView.querySelector('.stat-card:nth-child(3) .stat-value');
    const fattureValueEl = dashboardView.querySelector('.stat-card:nth-child(4) .stat-value');
    const materialiValueEl = dashboardView.querySelector('.stat-card:nth-child(5) .stat-value');
    
    if (clientiValueEl) clientiValueEl.textContent = clientiCount;
    if (progettiValueEl) progettiValueEl.textContent = progettiCount;
    if (progettiInCorsoValueEl) progettiInCorsoValueEl.textContent = progettiInCorsoCount;
    if (fattureValueEl) fattureValueEl.textContent = fattureNonPagateCount;
    if (materialiValueEl) materialiValueEl.textContent = materialiCount;
    
    // Aggiorna il fatturato
    const fatturato = calcolaFatturatoAnnuale();
    const fatturatoValueEl = dashboardView.querySelector('.stat-card.highlight .stat-value');
    if (fatturatoValueEl) fatturatoValueEl.textContent = formatCurrency(fatturato);
    
    // Aggiorna i progetti in scadenza
    aggiornaProgettiInScadenza();
    
    // Aggiorna i grafici
    aggiornaGrafici();
}
    