// ===== GESTIONE IMPOSTAZIONI =====
// Struttura dati per le impostazioni predefinite
const defaultSettings = {
    azienda: {
        nome: '',
        indirizzo: '',
        citta: '',
        cap: '',
        provincia: '',
        telefono: '',
        email: '',
        sito: '',
        piva: '',
        cf: '',
        rea: '',
        logo: '' // Base64 del logo
    },
    documenti: {
        intestazioneFattura: 'FATTURA',
        intestazionePreventivo: 'PREVENTIVO',
        pieDiPagina: '© Tutti i diritti riservati',
        mostraLogo: true,
        formatoCarta: 'A4',
        orientamento: 'portrait',
        valuta: '€',
        formatoData: 'DD/MM/YYYY'
    },
    fiscali: {
        aliquotaIvaPredefinita: 22,
        regime: 'Ordinario',
        contoCorrente: {
            banca: '',
            iban: '',
            intestatario: ''
        },
        scadenzaFatturePredefinita: 30 // giorni
    },
    backup: {
        autoBackup: true,
        frequenzaBackup: 'settimanale', // giornaliero, settimanale, mensile
        percorsoBackup: ''
    },
    utenti: {
        multiUtente: false,
        utenti: [] // array di oggetti utente
    },
    interfaccia: {
        tema: 'chiaro', // chiaro, scuro
        colorePrimario: '#4a6da7',
        coloreSecondario: '#f0f0f0',
        fontPrincipale: 'Arial',
        dimensioneFont: 'media' // piccola, media, grande
    },
    magazzino: {
        gestioneMagazzino: false,
        avvisoScortaMinima: true,
        unitaMisuraPredefinita: 'mq'
    },
    notifiche: {
        notificheAttive: true,
        notificaScadenzaFatture: true,
        giorniPromemoria: 3,
        notificaScortaMinima: true
    }
};

// ===== FUNZIONI PRINCIPALI =====

// Funzione principale per renderizzare le impostazioni
function renderImpostazioni() {
    console.log("Rendering impostazioni");
    
    // Inizializza le impostazioni se non esistono
    initImpostazioni();
    
    // Ottieni il container delle impostazioni
    const settingsContainer = document.getElementById('settings-container');
    if (!settingsContainer) {
        console.error("Container impostazioni non trovato");
        return;
    }
    
    // Genera l'HTML per le schede e i pannelli
    settingsContainer.innerHTML = generateSettingsHTML();
    
    // Aggiungi gli stili per i toggle switch
    addToggleSwitchStyles();
    
    // Configura gli handler per le schede
    setupTabHandlers();
    
    // Configura gli handler per i form
    setupFormHandlers();
    
    // Verifica che tutti gli elementi siano presenti
    setTimeout(checkSettingsElements, 500);
    
    console.log("Impostazioni renderizzate con successo");
}

// Inizializza le impostazioni
function initImpostazioni() {
    if (!window.appData.impostazioni) {
        console.log("Inizializzazione impostazioni predefinite");
        window.appData.impostazioni = JSON.parse(JSON.stringify(defaultSettings));
        
        // Carica i dati dell'azienda dal localStorage (per retrocompatibilità)
        const aziendaData = JSON.parse(localStorage.getItem('aziendaData') || '{}');
        if (aziendaData.nome) {
            window.appData.impostazioni.azienda.nome = aziendaData.nome || '';
            window.appData.impostazioni.azienda.indirizzo = aziendaData.indirizzo || '';
            window.appData.impostazioni.azienda.telefono = aziendaData.telefono || '';
            window.appData.impostazioni.azienda.email = aziendaData.email || '';
            window.appData.impostazioni.azienda.piva = aziendaData.piva || '';
        }
        
        saveAppData();
    }
}

// ===== GENERAZIONE HTML =====

// Genera l'HTML completo per le impostazioni
function generateSettingsHTML() {
    return `
        <div class="settings-tabs">
            <button class="settings-tab active" data-tab="azienda">Dati Aziendali</button>
            <button class="settings-tab" data-tab="documenti">Documenti</button>
            <button class="settings-tab" data-tab="fiscali">Impostazioni Fiscali</button>
            <button class="settings-tab" data-tab="backup">Backup & Ripristino</button>
            <button class="settings-tab" data-tab="interfaccia">Interfaccia</button>
            <button class="settings-tab" data-tab="magazzino">Magazzino</button>
            <button class="settings-tab" data-tab="notifiche">Notifiche</button>
        </div>
        
        <div class="settings-content">
            ${generateAziendaPanel()}
            ${generateDocumentiPanel()}
            ${generateFiscaliPanel()}
            ${generateBackupPanel()}
            ${generateInterfacciaPanel()}
            ${generateMagazzinoPanel()}
            ${generateNotifichePanel()}
        </div>
    `;
}

// Genera il pannello dei dati aziendali
function generateAziendaPanel() {
    const azienda = window.appData.impostazioni.azienda;
    return `
        <div id="azienda-settings" class="settings-panel active">
            <h2>Dati Aziendali</h2>
            <form id="form-azienda" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nome-azienda">Nome Azienda</label>
                        <input type="text" id="nome-azienda" class="app-input" value="${azienda.nome}">
                    </div>
                    <div class="form-group">
                        <label for="logo-azienda">Logo Azienda</label>
                        <div class="logo-upload">
                            <input type="file" id="logo-azienda" accept="image/*" style="display: none;">
                            <button type="button" id="btn-upload-logo" class="btn-secondary">Carica Logo</button>
                            <div id="logo-preview" class="logo-preview">
                                ${azienda.logo ? `<img src="${azienda.logo}" alt="Logo Azienda">` : 'Nessun logo caricato'}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="indirizzo-azienda">Indirizzo</label>
                        <input type="text" id="indirizzo-azienda" class="app-input" value="${azienda.indirizzo}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="citta-azienda">Città</label>
                        <input type="text" id="citta-azienda" class="app-input" value="${azienda.citta}">
                    </div>
                    <div class="form-group" style="width: 100px;">
                        <label for="cap-azienda">CAP</label>
                        <input type="text" id="cap-azienda" class="app-input" value="${azienda.cap}">
                    </div>
                    <div class="form-group" style="width: 100px;">
                        <label for="provincia-azienda">Provincia</label>
                        <input type="text" id="provincia-azienda" class="app-input" value="${azienda.provincia}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="telefono-azienda">Telefono</label>
                        <input type="tel" id="telefono-azienda" class="app-input" value="${azienda.telefono}">
                    </div>
                    <div class="form-group">
                        <label for="email-azienda">Email</label>
                        <input type="email" id="email-azienda" class="app-input" value="${azienda.email}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="sito-azienda">Sito Web</label>
                        <input type="url" id="sito-azienda" class="app-input" value="${azienda.sito}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="piva-azienda">Partita IVA</label>
                        <input type="text" id="piva-azienda" class="app-input" value="${azienda.piva}">
                    </div>
                    <div class="form-group">
                        <label for="cf-azienda">Codice Fiscale</label>
                        <input type="text" id="cf-azienda" class="app-input" value="${azienda.cf}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="rea-azienda">REA</label>
                        <input type="text" id="rea-azienda" class="app-input" value="${azienda.rea}">
                    </div>
                </div>
                <button type="submit" class="btn-primary">Salva Dati Aziendali</button>
            </form>
        </div>
    `;
}

// Genera il pannello dei documenti
function generateDocumentiPanel() {
    const documenti = window.appData.impostazioni.documenti;
    return `
        <div id="documenti-settings" class="settings-panel">
            <h2>Impostazioni Documenti</h2>
            <form id="form-documenti" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="intestazione-fattura">Intestazione Fattura</label>
                        <input type="text" id="intestazione-fattura" class="app-input" value="${documenti.intestazioneFattura}">
                    </div>
                    <div class="form-group">
                        <label for="intestazione-preventivo">Intestazione Preventivo</label>
                        <input type="text" id="intestazione-preventivo" class="app-input" value="${documenti.intestazionePreventivo}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="piede-pagina">Piè di Pagina</label>
                        <input type="text" id="piede-pagina" class="app-input" value="${documenti.pieDiPagina}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="mostra-logo">Mostra Logo nei Documenti</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="mostra-logo" ${documenti.mostraLogo ? 'checked' : ''}>
                            <label for="mostra-logo"></label>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="formato-carta">Formato Carta</label>
                        <select id="formato-carta" class="app-input">
                            <option value="A4" ${documenti.formatoCarta === 'A4' ? 'selected' : ''}>A4</option>
                            <option value="A5" ${documenti.formatoCarta === 'A5' ? 'selected' : ''}>A5</option>
                            <option value="Letter" ${documenti.formatoCarta === 'Letter' ? 'selected' : ''}>Letter</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="orientamento">Orientamento</label>
                        <select id="orientamento" class="app-input">
                            <option value="portrait" ${documenti.orientamento === 'portrait' ? 'selected' : ''}>Verticale</option>
                            <option value="landscape" ${documenti.orientamento === 'landscape' ? 'selected' : ''}>Orizzontale</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="valuta">Valuta</label>
                        <select id="valuta" class="app-input">
                            <option value="€" ${documenti.valuta === '€' ? 'selected' : ''}>Euro (€)</option>
                            <option value="$" ${documenti.valuta === '$' ? 'selected' : ''}>Dollaro ($)</option>
                            <option value="£" ${documenti.valuta === '£' ? 'selected' : ''}>Sterlina (£)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="formato-data">Formato Data</label>
                        <select id="formato-data" class="app-input">
                            <option value="DD/MM/YYYY" ${documenti.formatoData === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY" ${documenti.formatoData === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD" ${documenti.formatoData === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Salva Impostazioni Documenti</button>
            </form>
        </div>
    `;
}

// Genera il pannello delle impostazioni fiscali
function generateFiscaliPanel() {
    const fiscali = window.appData.impostazioni.fiscali;
    return `
        <div id="fiscali-settings" class="settings-panel">
            <h2>Impostazioni Fiscali</h2>
            <form id="form-fiscali" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="aliquota-iva">Aliquota IVA Predefinita (%)</label>
                        <input type="number" id="aliquota-iva" class="app-input" min="0" max="100" step="0.1" value="${fiscali.aliquotaIvaPredefinita}">
                    </div>
                    <div class="form-group">
                        <label for="regime-fiscale">Regime Fiscale</label>
                        <select id="regime-fiscale" class="app-input">
                            <option value="Ordinario" ${fiscali.regime === 'Ordinario' ? 'selected' : ''}>Ordinario</option>
                            <option value="Forfettario" ${fiscali.regime === 'Forfettario' ? 'selected' : ''}>Forfettario</option>
                            <option value="Semplificato" ${fiscali.regime === 'Semplificato' ? 'selected' : ''}>Semplificato</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="banca">Banca</label>
                        <input type="text" id="banca" class="app-input" value="${fiscali.contoCorrente.banca}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="iban">IBAN</label>
                        <input type="text" id="iban" class="app-input" value="${fiscali.contoCorrente.iban}">
                    </div>
                    <div class="form-group">
                        <label for="intestatario">Intestatario Conto</label>
                        <input type="text" id="intestatario" class="app-input" value="${fiscali.contoCorrente.intestatario}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="scadenza-fatture">Scadenza Fatture Predefinita (giorni)</label>
                        <input type="number" id="scadenza-fatture" class="app-input" min="0" value="${fiscali.scadenzaFatturePredefinita}">
                    </div>
                </div>
                <button type="submit" class="btn-primary">Salva Impostazioni Fiscali</button>
            </form>
        </div>
    `;
}

// Genera il pannello di backup e ripristino
function generateBackupPanel() {
    const backup = window.appData.impostazioni.backup;
    return `
        <div id="backup-settings" class="settings-panel">
            <h2>Backup & Ripristino</h2>
            <form id="form-backup" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="auto-backup">Backup Automatico</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="auto-backup" ${backup.autoBackup ? 'checked' : ''}>
                            <label for="auto-backup"></label>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="frequenza-backup">Frequenza Backup</label>
                        <select id="frequenza-backup" class="app-input" ${!backup.autoBackup ? 'disabled' : ''}>
                            <option value="giornaliero" ${backup.frequenzaBackup === 'giornaliero' ? 'selected' : ''}>Giornaliero</option>
                            <option value="settimanale" ${backup.frequenzaBackup === 'settimanale' ? 'selected' : ''}>Settimanale</option>
                            <option value="mensile" ${backup.frequenzaBackup === 'mensile' ? 'selected' : ''}>Mensile</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="percorso-backup">Percorso Backup</label>
                        <div class="path-selector">
                            <input type="text" id="percorso-backup" class="app-input" value="${backup.percorsoBackup}" readonly>
                            <button type="button" id="btn-select-path" class="btn-secondary">Seleziona</button>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="file-import">Importa Backup</label>
                        <div class="file-import-container">
                            <input type="file" id="file-import" accept=".json">
                            <button type="button" id="btn-import" class="btn-secondary">Importa</button>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Salva Impostazioni Backup</button>
                    <button type="button" id="btn-backup" class="btn-secondary">Esegui Backup Ora</button>
                </div>
            </form>
        </div>
    `;
}

// Genera il pannello dell'interfaccia
function generateInterfacciaPanel() {
    const interfaccia = window.appData.impostazioni.interfaccia;
    return `
        <div id="interfaccia-settings" class="settings-panel">
            <h2>Impostazioni Interfaccia</h2>
            <form id="form-interfaccia" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="tema">Tema</label>
                        <select id="tema" class="app-input">
                            <option value="chiaro" ${interfaccia.tema === 'chiaro' ? 'selected' : ''}>Chiaro</option>
                            <option value="scuro" ${interfaccia.tema === 'scuro' ? 'selected' : ''}>Scuro</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="colore-primario">Colore Primario</label>
                        <input type="color" id="colore-primario" class="app-input color-input" value="${interfaccia.colorePrimario}">
                    </div>
                    <div class="form-group">
                        <label for="colore-secondario">Colore Secondario</label>
                        <input type="color" id="colore-secondario" class="app-input color-input" value="${interfaccia.coloreSecondario}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="font-principale">Font Principale</label>
                        <select id="font-principale" class="app-input">
                            <option value="Arial" ${interfaccia.fontPrincipale === 'Arial' ? 'selected' : ''}>Arial</option>
                            <option value="Helvetica" ${interfaccia.fontPrincipale === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                            <option value="Verdana" ${interfaccia.fontPrincipale === 'Verdana' ? 'selected' : ''}>Verdana</option>
                            <option value="Times New Roman" ${interfaccia.fontPrincipale === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                            <option value="Georgia" ${interfaccia.fontPrincipale === 'Georgia' ? 'selected' : ''}>Georgia</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dimensione-font">Dimensione Font</label>
                        <select id="dimensione-font" class="app-input">
                            <option value="piccola" ${interfaccia.dimensioneFont === 'piccola' ? 'selected' : ''}>Piccola</option>
                            <option value="media" ${interfaccia.dimensioneFont === 'media' ? 'selected' : ''}>Media</option>
                            <option value="grande" ${interfaccia.dimensioneFont === 'grande' ? 'selected' : ''}>Grande</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <button type="button" id="btn-reset-theme" class="btn-secondary">Ripristina Tema Predefinito</button>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Salva Impostazioni Interfaccia</button>
            </form>
        </div>
    `;
}

// Genera il pannello del magazzino (modifica per aggiornare l'etichetta dell'unità di misura)
function generateMagazzinoPanel() {
    const magazzino = window.appData.impostazioni.magazzino;
    return `
        <div id="magazzino-settings" class="settings-panel">
            <h2>Impostazioni Magazzino</h2>
            <form id="form-magazzino" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="gestione-magazzino">Abilita Gestione Magazzino</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="gestione-magazzino" ${magazzino.gestioneMagazzino ? 'checked' : ''}>
                            <label for="gestione-magazzino"></label>
                        </div>
                    </div>
                </div>
                <div id="magazzino-options" ${!magazzino.gestioneMagazzino ? 'style="display: none;"' : ''}>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="avviso-scorta">Avviso Scorta Minima</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="avviso-scorta" ${magazzino.avvisoScortaMinima ? 'checked' : ''}>
                                <label for="avviso-scorta"></label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="unita-misura">Unità di Misura Predefinita</label>
                            <select id="unita-misura" class="app-input">
                                <option value="mq" ${magazzino.unitaMisuraPredefinita === 'mq' ? 'selected' : ''}>Metro Quadro (m²)</option>
                                <option value="ml" ${magazzino.unitaMisuraPredefinita === 'ml' ? 'selected' : ''}>Metro Lineare (m)</option>
                                <option value="lastra" ${(magazzino.unitaMisuraPredefinita === 'pz' || magazzino.unitaMisuraPredefinita === 'lastra') ? 'selected' : ''}>Lastra (lastra)</option>
                                <option value="kg" ${magazzino.unitaMisuraPredefinita === 'kg' ? 'selected' : ''}>Chilogrammo (kg)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Salva Impostazioni Magazzino</button>
            </form>
        </div>
    `;
}

// Genera il pannello delle notifiche
function generateNotifichePanel() {
    const notifiche = window.appData.impostazioni.notifiche;
    return `
        <div id="notifiche-settings" class="settings-panel">
            <h2>Impostazioni Notifiche</h2>
            <form id="form-notifiche" class="app-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="notifiche-attive">Abilita Notifiche</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="notifiche-attive" ${notifiche.notificheAttive ? 'checked' : ''}>
                            <label for="notifiche-attive"></label>
                        </div>
                    </div>
                </div>
                <div id="notifiche-options" ${!notifiche.notificheAttive ? 'style="display: none;"' : ''}>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="notifica-scadenza">Notifica Scadenza Fatture</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifica-scadenza" ${notifiche.notificaScadenzaFatture ? 'checked' : ''}>
                                <label for="notifica-scadenza"></label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="giorni-promemoria">Giorni di Promemoria</label>
                            <input type="number" id="giorni-promemoria" class="app-input" min="1" value="${notifiche.giorniPromemoria}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="notifica-scorta-minima">Notifica Scorta Minima</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifica-scorta-minima" ${notifiche.notificaScortaMinima ? 'checked' : ''}>
                                <label for="notifica-scorta-minima"></label>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Salva Impostazioni Notifiche</button>
            </form>
        </div>
    `;
}

// ===== GESTIONE EVENTI =====

// Configura gli handler per le schede
function setupTabHandlers() {
    console.log("Configurazione handler delle schede");
    
    const tabs = document.querySelectorAll('.settings-tab');
    const panels = document.querySelectorAll('.settings-panel');
    
    console.log(`Trovate ${tabs.length} schede e ${panels.length} pannelli`);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            console.log(`Cliccata scheda: ${tabName}`);
            
            // Rimuovi la classe active da tutte le schede
            tabs.forEach(t => t.classList.remove('active'));
            // Aggiungi la classe active alla scheda cliccata
            this.classList.add('active');
            
            // Nascondi tutti i pannelli
            panels.forEach(panel => panel.classList.remove('active'));
            
            // Mostra il pannello corrispondente
            const targetPanel = document.getElementById(`${tabName}-settings`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log(`Attivato pannello: ${tabName}-settings`);
            } else {
                console.error(`Pannello non trovato: ${tabName}-settings`);
            }
        });
    });
}

// Configura gli handler per i form
function setupFormHandlers() {
    console.log("Configurazione handler dei form");
    
    // Form dati aziendali
    const formAzienda = document.getElementById('form-azienda');
    if (formAzienda) {
        formAzienda.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAziendaSettings();
        });
        
        // Setup caricamento logo
        setupLogoUpload();
    } else {
        console.warn("Form azienda non trovato");
    }
    
    // Form documenti
    const formDocumenti = document.getElementById('form-documenti');
    if (formDocumenti) {
        formDocumenti.addEventListener('submit', function(e) {
            e.preventDefault();
            saveDocumentiSettings();
        });
    } else {
        console.warn("Form documenti non trovato");
    }
    
    // Form impostazioni fiscali
    const formFiscali = document.getElementById('form-fiscali');
    if (formFiscali) {
        formFiscali.addEventListener('submit', function(e) {
            e.preventDefault();
            saveFiscaliSettings();
        });
    } else {
        console.warn("Form fiscali non trovato");
    }
    
    // Form backup
    const formBackup = document.getElementById('form-backup');
    if (formBackup) {
        formBackup.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBackupSettings();
        });
        
        // Toggle per abilitare/disabilitare frequenza backup
        const autoBackup = document.getElementById('auto-backup');
        const frequenzaBackup = document.getElementById('frequenza-backup');
        
        if (autoBackup && frequenzaBackup) {
            autoBackup.addEventListener('change', function() {
                frequenzaBackup.disabled = !this.checked;
            });
        } else {
            console.warn("Elementi auto-backup o frequenza-backup non trovati");
        }
        
        // Pulsante backup manuale
        const btnBackup = document.getElementById('btn-backup');
        if (btnBackup) {
            btnBackup.addEventListener('click', function() {
                executeBackup();
            });
        } else {
            console.warn("Pulsante backup non trovato");
        }
        
        // Pulsante importa backup
        const btnImport = document.getElementById('btn-import');
        const fileImport = document.getElementById('file-import');
        if (btnImport && fileImport) {
            btnImport.addEventListener('click', function() {
                if (fileImport.files.length === 0) {
                    fileImport.click(); // Apri il selettore file se non è stato selezionato alcun file
                } else {
                    importBackup();
                }
            });
            
            // Aggiungi anche un listener per il cambio di file
            fileImport.addEventListener('change', function() {
                if (this.files.length > 0) {
                    btnImport.textContent = `Importa "${this.files[0].name}"`;
                }
            });
        } else {
            console.warn("Elementi btn-import o file-import non trovati");
        }
        
        // Pulsante seleziona percorso
        const btnSelectPath = document.getElementById('btn-select-path');
        if (btnSelectPath) {
            btnSelectPath.addEventListener('click', function() {
                selectBackupPath();
            });
        } else {
            console.warn("Pulsante select-path non trovato");
        }
    } else {
        console.warn("Form backup non trovato");
    }
    
    // Form interfaccia
    const formInterfaccia = document.getElementById('form-interfaccia');
    if (formInterfaccia) {
        formInterfaccia.addEventListener('submit', function(e) {
            e.preventDefault();
            saveInterfacciaSettings();
        });
        
        // Aggiungi preview in tempo reale per i colori
        const colorePrimario = document.getElementById('colore-primario');
        const coloreSecondario = document.getElementById('colore-secondario');
        
        if (colorePrimario) {
            colorePrimario.addEventListener('input', function() {
                document.documentElement.style.setProperty('--color-primary', this.value);
            });
        }
        
        if (coloreSecondario) {
            coloreSecondario.addEventListener('input', function() {
                document.documentElement.style.setProperty('--color-secondary', this.value);
            });
        }
        
        // Pulsante reset tema
        const btnResetTheme = document.getElementById('btn-reset-theme');
        if (btnResetTheme) {
            btnResetTheme.addEventListener('click', function() {
                resetTheme();
            });
        } else {
            console.warn("Pulsante reset-theme non trovato");
        }
        
        // Cambio tema chiaro/scuro
        const temaSelect = document.getElementById('tema');
        if (temaSelect) {
            temaSelect.addEventListener('change', function() {
                if (this.value === 'scuro') {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            });
        }
    } else {
        console.warn("Form interfaccia non trovato");
    }
    
    // Form magazzino
    const formMagazzino = document.getElementById('form-magazzino');
    if (formMagazzino) {
        formMagazzino.addEventListener('submit', function(e) {
            e.preventDefault();
            saveMagazzinoSettings();
        });
        
        // Toggle per abilitare/disabilitare opzioni magazzino
        const gestioneMagazzino = document.getElementById('gestione-magazzino');
        const magazzinoOptions = document.getElementById('magazzino-options');
        
        if (gestioneMagazzino && magazzinoOptions) {
            gestioneMagazzino.addEventListener('change', function() {
                magazzinoOptions.style.display = this.checked ? 'block' : 'none';
            });
        } else {
            console.warn("Elementi gestione-magazzino o magazzino-options non trovati");
        }
        
        // Aggiorna l'unità di misura predefinita
        const unitaMisura = document.getElementById('unita-misura');
        if (unitaMisura) {
            // Aggiorna l'opzione "pz" a "lastra" per coerenza con la sezione materiali
            const pzOption = Array.from(unitaMisura.options).find(opt => opt.value === 'pz');
            if (pzOption) {
                pzOption.textContent = 'Lastra (lastra)';
            }
        }
    } else {
        console.warn("Form magazzino non trovato");
    }
    
    // Form notifiche
    const formNotifiche = document.getElementById('form-notifiche');
    if (formNotifiche) {
        formNotifiche.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNotificheSettings();
        });
        
        // Toggle per abilitare/disabilitare opzioni notifiche
        const notificheAttive = document.getElementById('notifiche-attive');
        const notificheOptions = document.getElementById('notifiche-options');
        
        if (notificheAttive && notificheOptions) {
            notificheAttive.addEventListener('change', function() {
                notificheOptions.style.display = this.checked ? 'block' : 'none';
            });
        } else {
            console.warn("Elementi notifiche-attive o notifiche-options non trovati");
        }
    } else {
        console.warn("Form notifiche non trovato");
    }
}

// Configura l'upload del logo
function setupLogoUpload() {
    const btnUploadLogo = document.getElementById('btn-upload-logo');
    const logoInput = document.getElementById('logo-azienda');
    const logoPreview = document.getElementById('logo-preview');
    
    if (btnUploadLogo && logoInput && logoPreview) {
        btnUploadLogo.addEventListener('click', function() {
            logoInput.click();
        });
        
        logoInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Logo Azienda';
                    
                    logoPreview.innerHTML = '';
                    logoPreview.appendChild(img);
                    
                    // Salva il logo in base64
                    window.appData.impostazioni.azienda.logo = e.target.result;
                    saveAppData();
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// ===== SALVATAGGIO IMPOSTAZIONI =====

// Salva le impostazioni dell'azienda
function saveAziendaSettings() {
    console.log("Salvataggio impostazioni azienda");
    
    window.appData.impostazioni.azienda.nome = document.getElementById('nome-azienda').value;
    window.appData.impostazioni.azienda.indirizzo = document.getElementById('indirizzo-azienda').value;
    window.appData.impostazioni.azienda.citta = document.getElementById('citta-azienda').value;
    window.appData.impostazioni.azienda.cap = document.getElementById('cap-azienda').value;
    window.appData.impostazioni.azienda.provincia = document.getElementById('provincia-azienda').value;
    window.appData.impostazioni.azienda.telefono = document.getElementById('telefono-azienda').value;
    window.appData.impostazioni.azienda.email = document.getElementById('email-azienda').value;
    window.appData.impostazioni.azienda.sito = document.getElementById('sito-azienda').value;
    window.appData.impostazioni.azienda.piva = document.getElementById('piva-azienda').value;
    window.appData.impostazioni.azienda.cf = document.getElementById('cf-azienda').value;
    window.appData.impostazioni.azienda.rea = document.getElementById('rea-azienda').value;
    
    saveAppData();
    showNotification('Dati aziendali salvati con successo');
}

// Salva le impostazioni dei documenti
function saveDocumentiSettings() {
    console.log("Salvataggio impostazioni documenti");
    
    window.appData.impostazioni.documenti.intestazioneFattura = document.getElementById('intestazione-fattura').value;
    window.appData.impostazioni.documenti.intestazionePreventivo = document.getElementById('intestazione-preventivo').value;
    window.appData.impostazioni.documenti.pieDiPagina = document.getElementById('piede-pagina').value;
    window.appData.impostazioni.documenti.mostraLogo = document.getElementById('mostra-logo').checked;
    window.appData.impostazioni.documenti.formatoCarta = document.getElementById('formato-carta').value;
    window.appData.impostazioni.documenti.orientamento = document.getElementById('orientamento').value;
    window.appData.impostazioni.documenti.valuta = document.getElementById('valuta').value;
    window.appData.impostazioni.documenti.formatoData = document.getElementById('formato-data').value;
    
    saveAppData();
    showNotification('Impostazioni documenti salvate con successo');
}

// Salva le impostazioni fiscali
function saveFiscaliSettings() {
    console.log("Salvataggio impostazioni fiscali");
    
    window.appData.impostazioni.fiscali.aliquotaIvaPredefinita = parseFloat(document.getElementById('aliquota-iva').value);
    window.appData.impostazioni.fiscali.regime = document.getElementById('regime-fiscale').value;
    window.appData.impostazioni.fiscali.contoCorrente.banca = document.getElementById('banca').value;
    window.appData.impostazioni.fiscali.contoCorrente.iban = document.getElementById('iban').value;
    window.appData.impostazioni.fiscali.contoCorrente.intestatario = document.getElementById('intestatario').value;
    window.appData.impostazioni.fiscali.scadenzaFatturePredefinita = parseInt(document.getElementById('scadenza-fatture').value);
    
    saveAppData();
    showNotification('Impostazioni fiscali salvate con successo');
}

// Salva le impostazioni di backup
function saveBackupSettings() {
    console.log("Salvataggio impostazioni backup");
    
    window.appData.impostazioni.backup.autoBackup = document.getElementById('auto-backup').checked;
    window.appData.impostazioni.backup.frequenzaBackup = document.getElementById('frequenza-backup').value;
    
    saveAppData();
    showNotification('Impostazioni backup salvate con successo');
}

// Salva le impostazioni dell'interfaccia
function saveInterfacciaSettings() {
    console.log("Salvataggio impostazioni interfaccia");
    
    window.appData.impostazioni.interfaccia.tema = document.getElementById('tema').value;
    window.appData.impostazioni.interfaccia.colorePrimario = document.getElementById('colore-primario').value;
    window.appData.impostazioni.interfaccia.coloreSecondario = document.getElementById('colore-secondario').value;
    window.appData.impostazioni.interfaccia.fontPrincipale = document.getElementById('font-principale').value;
    window.appData.impostazioni.interfaccia.dimensioneFont = document.getElementById('dimensione-font').value;
    
    saveAppData();
    applyTheme(); // Applica immediatamente il tema
    showNotification('Impostazioni interfaccia salvate con successo');
}

// Salva le impostazioni del magazzino (modifica per gestire correttamente l'unità di misura)
function saveMagazzinoSettings() {
    console.log("Salvataggio impostazioni magazzino");
    
    window.appData.impostazioni.magazzino.gestioneMagazzino = document.getElementById('gestione-magazzino').checked;
    window.appData.impostazioni.magazzino.avvisoScortaMinima = document.getElementById('avviso-scorta').checked;
    window.appData.impostazioni.magazzino.unitaMisuraPredefinita = document.getElementById('unita-misura').value;
    
    // Aggiorna l'interfaccia in base alle nuove impostazioni
    const magazzinoOptions = document.getElementById('magazzino-options');
    if (magazzinoOptions) {
        magazzinoOptions.style.display = window.appData.impostazioni.magazzino.gestioneMagazzino ? 'block' : 'none';
    }
    
    saveAppData();
    showNotification('Impostazioni magazzino salvate con successo');
}

// Salva le impostazioni delle notifiche
function saveNotificheSettings() {
    console.log("Salvataggio impostazioni notifiche");
    
    window.appData.impostazioni.notifiche.notificheAttive = document.getElementById('notifiche-attive').checked;
    window.appData.impostazioni.notifiche.notificaScadenzaFatture = document.getElementById('notifica-scadenza').checked;
    window.appData.impostazioni.notifiche.giorniPromemoria = parseInt(document.getElementById('giorni-promemoria').value);
    window.appData.impostazioni.notifiche.notificaScortaMinima = document.getElementById('notifica-scorta-minima').checked;
    
    saveAppData();
    showNotification('Impostazioni notifiche salvate con successo');
}

// ===== FUNZIONI AUSILIARIE =====

// Funzione per aggiungere gli stili CSS per i toggle switch
function addToggleSwitchStyles() {
    if (document.getElementById('toggle-switch-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'toggle-switch-styles';
    style.textContent = `
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .toggle-switch label {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        
        .toggle-switch label:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        .toggle-switch input:checked + label {
            background-color: var(--color-primary, #4a6da7);
        }
        
        .toggle-switch input:checked + label:before {
            transform: translateX(26px);
        }
        
        .logo-preview {
            margin-top: 10px;
            width: 100px;
            height: 100px;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .logo-preview img {
            max-width: 100%;
            max-height: 100%;
        }
        
        .color-input {
            height: 40px;
            padding: 0;
            width: 100px;
        }
        
        .file-import-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .path-selector {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .settings-panel {
            display: none;
        }
        
        .settings-panel.active {
            display: block;
        }
        
        .settings-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
            overflow-x: auto;
        }
        
        .settings-tab {
            padding: 10px 15px;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 14px;
            font-weight: 500;
            color: #666;
        }
        
        .settings-tab.active {
            color: var(--color-primary, #4a6da7);
            border-bottom: 2px solid var(--color-primary, #4a6da7);
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
    `;
    
    document.head.appendChild(style);
}

// Funzione per applicare il tema
function applyTheme() {
    const interfaccia = window.appData.impostazioni.interfaccia;
    
    document.documentElement.style.setProperty('--color-primary', interfaccia.colorePrimario);
    document.documentElement.style.setProperty('--color-secondary', interfaccia.coloreSecondario);
    document.documentElement.style.setProperty('--font-family', interfaccia.fontPrincipale);
    
    // Applica il tema chiaro/scuro
    if (interfaccia.tema === 'scuro') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Applica la dimensione del font
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${interfaccia.dimensioneFont}`);
}

// Funzione per ripristinare il tema predefinito
function resetTheme() {
    // Questa funzione ora è definita in theme.js
    if (window.resetTheme) {
        window.resetTheme();
    } else {
        console.error("Funzione resetTheme non trovata. Assicurati che theme.js sia caricato.");
    }
}

// Funzione per eseguire il backup
function executeBackup() {
    console.log("Esecuzione backup manuale");
    
    try {
        const dataStr = JSON.stringify(window.appData);
        
        if (isElectron()) {
            // Usa le API native di Electron
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('export-data', dataStr);
            
            ipcRenderer.once('export-data-result', (event, result) => {
                if (result.success) {
                    showNotification('Backup eseguito con successo');
                } else {
                    showNotification('Errore durante l\'esecuzione del backup: ' + result.error, 'error');
                }
            });
        } else {
            // Fallback per browser web
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `marmeria_backup_${new Date().toISOString().slice(0, 10)}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('Backup eseguito con successo');
        }
    } catch (error) {
        console.error("Errore durante l'esecuzione del backup:", error);
        showNotification('Errore durante l\'esecuzione del backup', 'error');
    }
}

// Modifica la funzione importBackup per utilizzare Electron quando disponibile
function importBackup() {
    console.log("Importazione backup");
    
    if (isElectron()) {
        // Usa le API native di Electron
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('import-data');
        
        ipcRenderer.once('import-data-result', (event, result) => {
            if (result.success) {
                try {
                    const importedData = JSON.parse(result.data);
                    
                    // Verifica che i dati importati siano validi
                    if (!importedData || typeof importedData !== 'object') {
                        throw new Error("Il file non contiene un oggetto JSON valido");
                    }
                    
                    // Backup dei dati attuali prima di sovrascriverli
                    const currentData = JSON.stringify(window.appData);
                    localStorage.setItem('marmeriaDataBackup', currentData);
                    
                    // Importa i dati
                    window.appData = importedData;
                    
                    saveAppData();
                    showNotification('Backup importato con successo. L\'applicazione verrà ricaricata.');
                    
                    // Ricarica l'applicazione dopo 2 secondi
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    console.error("Errore durante l'importazione del backup:", error);
                    showNotification('Errore durante l\'importazione del backup: ' + error.message, 'error');
                }
            } else {
                showNotification('Errore durante l\'importazione: ' + result.error, 'error');
            }
        });
    } else {
        // Versione browser
        const fileInput = document.getElementById('file-import');
        
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            showNotification('Seleziona un file di backup da importare', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        
        // Verifica che il file sia un JSON
        if (!file.name.endsWith('.json')) {
            showNotification('Il file deve essere in formato JSON', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Verifica che i dati importati siano validi
                if (!importedData || typeof importedData !== 'object') {
                    throw new Error("Il file non contiene un oggetto JSON valido");
                }
                
                // Backup dei dati attuali prima di sovrascriverli
                const currentData = JSON.stringify(window.appData);
                localStorage.setItem('marmeriaDataBackup', currentData);
                
                // Importa i dati
                window.appData = importedData;
                
                saveAppData();
                showNotification('Backup importato con successo. L\'applicazione verrà ricaricata.');
                
                // Ricarica l'applicazione dopo 2 secondi
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (error) {
                console.error("Errore durante l'importazione del backup:", error);
                showNotification('Errore durante l\'importazione del backup: ' + error.message, 'error');
            }
        };
        
        reader.onerror = function() {
            showNotification('Errore nella lettura del file', 'error');
        };
        
        reader.readAsText(file);
    }
}

// Modifica la funzione selectBackupPath per utilizzare Electron quando disponibile
function selectBackupPath() {
    if (isElectron()) {
        // Usa le API native di Electron
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('select-backup-path');
        
        ipcRenderer.once('backup-path-selected', (event, result) => {
            const percorsoBackup = document.getElementById('percorso-backup');
            if (percorsoBackup && result.path) {
                percorsoBackup.value = result.path;
                window.appData.impostazioni.backup.percorsoBackup = result.path;
                saveAppData();
            }
        });
    } else {
        // Versione browser (non supportata)
        showNotification('Selezione percorso non disponibile in questa versione', 'warning');
    }
}

// Funzione per verificare che tutti gli elementi siano presenti
function checkSettingsElements() {
    console.log("Verifica elementi impostazioni");
    
    const elements = [
        // Azienda
        'nome-azienda', 'indirizzo-azienda', 'citta-azienda', 'cap-azienda', 'provincia-azienda',
        'telefono-azienda', 'email-azienda', 'sito-azienda', 'piva-azienda', 'cf-azienda', 'rea-azienda',
        'logo-azienda', 'logo-preview', 'btn-upload-logo',
        
        // Documenti
        'intestazione-fattura', 'intestazione-preventivo', 'piede-pagina', 'mostra-logo',
        'formato-carta', 'orientamento', 'valuta', 'formato-data',
        
        // Fiscali
        'aliquota-iva', 'regime-fiscale', 'banca', 'iban', 'intestatario', 'scadenza-fatture',
        
        // Backup
        'auto-backup', 'frequenza-backup', 'percorso-backup', 'file-import', 'btn-import', 'btn-select-path', 'btn-backup',
        
        // Interfaccia
        'tema', 'colore-primario', 'colore-secondario', 'font-principale', 'dimensione-font', 'btn-reset-theme',
        
        // Magazzino
        'gestione-magazzino', 'avviso-scorta', 'unita-misura', 'magazzino-options',
        
        // Notifiche
        'notifiche-attive', 'notifica-scadenza', 'giorni-promemoria', 'notifica-scorta-minima', 'notifiche-options'
    ];
    
    let missingElements = [];
    
    elements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.warn("Elementi mancanti:", missingElements);
    } else {
        console.log("Tutti gli elementi sono presenti");
    }
}

// Funzione per verificare se siamo in Electron
function isElectron() {
    return window && window.process && window.process.type;
}

