// Gestione dei documenti (preventivi e fatture)
// Rimuoviamo la riga di import
// import { saveAppData } from './utils.js';

// Mostra i dettagli di un documento (preventivo o fattura)
function showDocumentDetails(tipo, id) {
    const collection = tipo === 'preventivi' ? window.appData.preventivi : window.appData.fatture;
    const documento = collection.find(d => d.id === id);
    
    if (!documento) return;
    
    const cliente = window.appData.clienti.find(c => c.id === documento.clienteId);
    const clienteNome = cliente ? `${cliente.nome} ${cliente.cognome}` : 'Cliente non trovato';
    
    let html = `
        <div class="document-details">
            <div class="document-header">
                <h2>${tipo === 'preventivi' ? 'Preventivo' : 'Fattura'} #${documento.numero}</h2>
                <p>Data: ${documento.data}</p>
                <p>Cliente: ${clienteNome}</p>
                ${tipo === 'preventivi' ? `<p>Stato: ${documento.stato}</p>` : `<p>Pagata: ${documento.pagata ? 'Sì' : 'No'}</p>`}
            </div>
            <div class="document-body">
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
    `;
    
    documento.voci.forEach(voce => {
        html += `
            <tr>
                <td>${voce.descrizione}</td>
                <td>${voce.quantita}</td>
                <td>${voce.prezzo.toFixed(2)}</td>
                <td>${voce.totale.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right"><strong>Totale:</strong></td>
                            <td><strong>${documento.importoTotale.toFixed(2)} €</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="document-footer">
                ${documento.note ? `<p><strong>Note:</strong> ${documento.note}</p>` : ''}
                <div class="document-actions">
                    <button class="app-button btn-print" data-id="${documento.id}">Stampa</button>
                    <button class="app-button btn-close-modal">Chiudi</button>
                </div>
            </div>
        </div>
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = html;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Gestisci la chiusura del modale
    modal.querySelector('.btn-close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Gestisci la stampa
    modal.querySelector('.btn-print').addEventListener('click', function() {
        printDocument(tipo, documento);
    });
    
    // Chiudi il modale cliccando fuori
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Stampa un documento
// Gestione dei documenti
// Rimuovi qualsiasi riga di import all'inizio del file

// Funzione per stampare un documento
function printDocument(tipo, documento) {
    console.log(`Stampa documento ${tipo} #${documento.numero}`);
    
    let contenuto = '';
    let titolo = '';
    
    // Ottieni i dati del cliente
    const cliente = window.appData.clienti.find(c => c.id === documento.clienteId);
    const clienteNome = cliente ? `${cliente.nome} ${cliente.cognome}` : 'Cliente non trovato';
    
    // Prepara il contenuto in base al tipo di documento
    if (tipo === 'preventivi') {
        titolo = `Preventivo #${documento.numero}`;
        // Resto del codice per i preventivi...
    } else if (tipo === 'fatture') {
        titolo = `Fattura #${documento.numero}`;
        // Resto del codice per le fatture...
    }
    
    // Apri una nuova finestra per la stampa
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${titolo}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { margin-bottom: 20px; }
                .document-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .client-info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { font-weight: bold; text-align: right; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="document-title">${titolo}</div>
                <div>Data: ${documento.data}</div>
            </div>
            <div class="client-info">
                <div><strong>Cliente:</strong> ${clienteNome}</div>
            </div>
            ${contenuto}
            <div class="footer">
                <p>Grazie per aver scelto i nostri servizi.</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Funzione per generare un PDF
function generatePDF(tipo, documento) {
    console.log(`Generazione PDF per ${tipo} #${documento.numero}`);
    // Implementazione futura per la generazione di PDF
    alert('Funzionalità di generazione PDF in sviluppo');
}

// Funzione per inviare un documento via email
function sendDocumentByEmail(tipo, documento) {
    console.log(`Invio email per ${tipo} #${documento.numero}`);
    // Implementazione futura per l'invio di email
    alert('Funzionalità di invio email in sviluppo');
}