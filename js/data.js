// Sample data for the application
const appData = {
    clienti: [
        { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@email.it', telefono: '333-1234567', indirizzo: 'Via Roma 123, Milano', dataRegistrazione: '2022-05-10' },
        { id: 2, nome: 'Giuseppe', cognome: 'Verdi', email: 'giuseppe.verdi@email.it', telefono: '333-7654321', indirizzo: 'Via Milano 45, Roma', dataRegistrazione: '2022-08-15' },
        { id: 3, nome: 'Anna', cognome: 'Bianchi', email: 'anna.bianchi@email.it', telefono: '333-9876543', indirizzo: 'Via Napoli 67, Firenze', dataRegistrazione: '2023-01-20' },
        { id: 4, nome: 'Laura', cognome: 'Ferrari', email: 'laura.ferrari@email.it', telefono: '333-3456789', indirizzo: 'Via Torino 89, Bologna', dataRegistrazione: '2023-03-05' },
        { id: 5, nome: 'Marco', cognome: 'Neri', email: 'marco.neri@email.it', telefono: '333-6789012', indirizzo: 'Via Palermo 12, Genova', dataRegistrazione: '2023-06-18' }
    ],
    
    materiali: [
        { id: 1, codice: 'MAR-001', nome: 'Marmo di Carrara', categoria: 'Marmo', fornitore: 'Cava Toscana S.r.l.', quantita: 15, unitaMisura: 'Lastre', prezzoUnitario: 450.00 },
        { id: 2, codice: 'MAR-002', nome: 'Marmo Nero Marquina', categoria: 'Marmo', fornitore: 'Importazioni Pietra S.p.A.', quantita: 8, unitaMisura: 'Lastre', prezzoUnitario: 580.00 },
        { id: 3, codice: 'GRA-001', nome: 'Granito Rosa Beta', categoria: 'Granito', fornitore: 'Graniti Italia S.r.l.', quantita: 12, unitaMisura: 'Lastre', prezzoUnitario: 320.00 },
        { id: 4, codice: 'GRA-002', nome: 'Granito Nero Africa', categoria: 'Granito', fornitore: 'Importazioni Pietra S.p.A.', quantita: 6, unitaMisura: 'Lastre', prezzoUnitario: 490.00 },
        { id: 5, codice: 'QUA-001', nome: 'Quarzo Bianco', categoria: 'Quarzo', fornitore: 'Superfici Moderne S.r.l.', quantita: 20, unitaMisura: 'Lastre', prezzoUnitario: 280.00 }
    ],
    
    progetti: [
        { id: 1, titolo: 'Piano Cucina in Marmo', descrizione: 'Realizzazione di un piano cucina in marmo di Carrara con lavello integrato.', dataInizio: '2023-10-15', dataFine: null, stato: 'In Corso', clienteId: 1, costoTotale: 2500.00 },
        { id: 2, titolo: 'Pavimentazione in Granito', descrizione: 'Pavimentazione in granito per salone di 50mq.', dataInizio: '2023-09-20', dataFine: '2023-11-05', stato: 'Completato', clienteId: 2, costoTotale: 4800.00 },
        { id: 3, titolo: 'Rivestimento Bagno', descrizione: 'Rivestimento completo bagno in marmo bianco di Carrara.', dataInizio: '2023-11-01', dataFine: null, stato: 'In Corso', clienteId: 3, costoTotale: 1800.00 },
        { id: 4, titolo: 'Scala in Marmo', descrizione: 'Realizzazione scala interna in marmo con 15 gradini.', dataInizio: '2023-11-10', dataFine: null, stato: 'In Attesa', clienteId: 4, costoTotale: 3200.00 }
    ],
    
    preventivi: [
        { id: 1, numero: 'P-2022-001', data: '2022-11-10', dataScadenza: '2022-12-10', descrizione: 'Piano cucina in marmo di Carrara con lavello integrato', importo: 2500.00, aliquotaIVA: 22, stato: 'In Attesa', clienteId: 1, progettoId: 1 },
        { id: 2, numero: 'P-2023-001', data: '2023-10-25', dataScadenza: '2023-11-25', descrizione: 'Pavimentazione in granito per salone di 50mq', importo: 4800.00, aliquotaIVA: 22, stato: 'Approvato', clienteId: 2, progettoId: 2 },
        { id: 3, numero: 'P-2023-002', data: '2023-10-30', dataScadenza: '2023-11-30', descrizione: 'Rivestimento completo bagno in marmo bianco di Carrara', importo: 1800.00, aliquotaIVA: 22, stato: 'Approvato', clienteId: 3, progettoId: 3 },
        { id: 4, numero: 'P-2023-003', data: '2023-11-05', dataScadenza: '2023-12-05', descrizione: 'Realizzazione scala interna in marmo con 15 gradini', importo: 3200.00, aliquotaIVA: 22, stato: 'In Attesa', clienteId: 4, progettoId: 4 },
        { id: 5, numero: 'P-2023-004', data: '2023-10-15', dataScadenza: '2023-11-15', descrizione: 'Top bagno in marmo con doppio lavabo', importo: 1200.00, aliquotaIVA: 22, stato: 'Rifiutato', clienteId: 5, progettoId: null }
    ],
    
    fatture: [
        { id: 1, numero: 'F-2023-001', data: '2023-10-30', dataScadenza: '2023-11-30', descrizione: 'Pavimentazione in granito per salone di 50mq', importo: 4800.00, aliquotaIVA: 22, stato: 'Pagata', clienteId: 2, progettoId: 2, preventivoId: 2, dataPagamento: '2023-11-15', metodoPagamento: 'Bonifico Bancario' },
        { id: 2, numero: 'F-2023-002', data: '2023-11-05', dataScadenza: '2023-12-05', descrizione: 'Rivestimento completo bagno in marmo bianco di Carrara', importo: 1800.00, aliquotaIVA: 22, stato: 'In Attesa', clienteId: 3, progettoId: 3, preventivoId: 3, dataPagamento: null, metodoPagamento: null },
        { id: 3, numero: 'F-2022-002', data: '2022-09-15', dataScadenza: '2022-10-15', descrizione: 'Fornitura e posa in opera di davanzali in marmo', importo: 2000.00, aliquotaIVA: 22, stato: 'Scaduta', clienteId: 5, progettoId: null, preventivoId: null, dataPagamento: null, metodoPagamento: null }
    ],
    
    impostazioni: {
        nomeAzienda: 'Marmeria Sample S.r.l.',
        partitaIVA: '12345678901',
        indirizzo: 'Via Roma 123, 00100 Roma',
        telefono: '06-1234567',
        email: 'info@marmeriasample.it',
        logoPath: 'img/logo.png',
        aliquotaIVA: 22,
        valuta: 'Euro (€)',
        lingua: 'Italiano',
        temaScuro: false,
        finestreMultiple: true,
        percorsoBackup: 'C:\\Backup\\',
        ultimoBackup: '2023-11-01 10:30'
    }
};

// Helper functions for data manipulation
function getClienteById(id) {
    return appData.clienti.find(cliente => cliente.id === id);
}

function getProgettoById(id) {
    return appData.progetti.find(progetto => progetto.id === id);
}

function getMaterialeById(id) {
    return appData.materiali.find(materiale => materiale.id === id);
}

function getPreventivoById(id) {
    return appData.preventivi.find(preventivo => preventivo.id === id);
}

function getFatturaById(id) {
    return appData.fatture.find(fattura => fattura.id === id);
}

function getNextId(collection) {
    return Math.max(...collection.map(item => item.id), 0) + 1;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

function getStatusClass(status) {
    switch(status) {
        case 'Completato':
        case 'Approvato':
        case 'Pagata':
            return 'status-success';
        case 'In Corso':
        case 'In Attesa':
            return 'status-warning';
        case 'Rifiutato':
        case 'Annullato':
        case 'Scaduta':
            return 'status-danger';
        default:
            return '';
    }
}


// Gestione dei dati dell'applicazione

// Inizializza i dati di esempio se non esistono
function initSampleData() {
    if (!localStorage.getItem('appData')) {
        const sampleData = {
            clienti: [
                { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@example.com', telefono: '3331234567', indirizzo: 'Via Roma 123, Milano' },
                { id: 2, nome: 'Laura', cognome: 'Bianchi', email: 'laura.bianchi@example.com', telefono: '3339876543', indirizzo: 'Via Verdi 45, Roma' }
            ],
            progetti: [
                { id: 1, titolo: 'Cucina in marmo', descrizione: 'Installazione piano cucina in marmo bianco', clienteId: 1, stato: 'In Corso', dataInizio: '2023-05-10', dataFine: null, costoTotale: 2500 },
                { id: 2, titolo: 'Pavimento in granito', descrizione: 'Pavimentazione in granito per salone', clienteId: 2, stato: 'Completato', dataInizio: '2023-04-15', dataFine: '2023-05-01', costoTotale: 4800 }
            ],
            materiali: [
                { id: 1, codice: 'M001', nome: 'Marmo Carrara', categoria: 'Marmo', fornitore: 'Marmi SpA', quantita: 15, unitaMisura: 'mq', prezzoUnitario: 120 },
                { id: 2, codice: 'G001', nome: 'Granito Nero', categoria: 'Granito', fornitore: 'Pietre Italia', quantita: 8, unitaMisura: 'mq', prezzoUnitario: 150 }
            ],
            fornitori: [
                { id: 1, nome: 'Marmi SpA', email: 'info@marmispa.it', telefono: '0221234567', indirizzo: 'Via Industria 10, Carrara' },
                { id: 2, nome: 'Pietre Italia', email: 'contatti@pietreitalia.it', telefono: '0659876543', indirizzo: 'Via delle Cave 5, Tivoli' }
            ],
            preventivi: [],
            fatture: []
        };
        
        localStorage.setItem('appData', JSON.stringify(sampleData));
    }
    
    // Rendi i dati disponibili globalmente
    window.appData = JSON.parse(localStorage.getItem('appData'));
}

// Salva i dati dell'applicazione
function saveAppData() {
    localStorage.setItem('appData', JSON.stringify(window.appData));
}

// Esporta i dati come file JSON
function exportData() {
    const dataStr = JSON.stringify(window.appData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'backup-marmeria-' + new Date().toISOString().slice(0, 10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Importa i dati da un file JSON
function importData(file, callback) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Verifica che i dati importati abbiano la struttura corretta
                if (importedData.clienti && importedData.progetti && importedData.materiali) {
                    localStorage.setItem('appData', JSON.stringify(importedData));
                    window.appData = importedData;
                    callback(true, 'Dati importati con successo!');
                } else {
                    callback(false, 'Il file non contiene dati validi.');
                }
            } catch (error) {
                callback(false, 'Errore durante l\'importazione: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        callback(false, 'Seleziona un file da importare.');
    }
}