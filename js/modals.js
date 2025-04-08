// Gestione dei form modali e dei filtri

document.addEventListener('DOMContentLoaded', function() {
    // Crea l'overlay per i modali se non esiste
    if (!document.querySelector('.modal-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
    }

    // Aggiungi stili globali per i modal
    if (!document.getElementById('modal-global-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'modal-global-styles';
        styleElement.textContent = `
            .modal-content {
                width: 90% !important;
                max-width: 800px !important;
                display: flex;
                flex-direction: column;
                max-height: 90vh;
            }
            .modal-header, .modal-footer {
                padding: 20px !important;
                flex-shrink: 0;
            }
            .modal-body {
                padding: 20px !important;
                overflow-y: auto;
                flex-grow: 1;
            }
            .modal {
                overflow: hidden !important;
            }
            .modal input, .modal select, .modal textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border-radius: 4px;
                border: 1px solid #444;
                background-color: #333;
                color: #fff;
            }
            /* Stili per uniformare i popup di dettaglio */
            .popup-info, .popup-details {
                position: fixed !important;
                z-index: 1000 !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background-color: rgba(0,0,0,0.5) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .popup-info .popup-content, .popup-details .popup-content {
                background-color: #222 !important;
                width: 90% !important;
                max-width: 800px !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
                display: flex !important;
                flex-direction: column !important;
                max-height: 90vh !important;
            }
            .popup-info .popup-header, .popup-details .popup-header {
                padding: 20px !important;
                border-bottom: 1px solid #444 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                flex-shrink: 0 !important;
            }
            .popup-info .popup-body, .popup-details .popup-body {
                padding: 20px !important;
                overflow-y: auto !important;
                flex-grow: 1 !important;
            }
            .popup-info .popup-footer, .popup-details .popup-footer {
                padding: 20px !important;
                border-top: 1px solid #444 !important;
                text-align: right !important;
                flex-shrink: 0 !important;
            }
            .popup-info h2, .popup-details h2 {
                margin: 0 !important;
                color: #fff !important;
            }
            .popup-info .close-popup, .popup-details .close-popup {
                color: #aaa !important;
                font-size: 28px !important;
                font-weight: bold !important;
                cursor: pointer !important;
            }
            .popup-info .close-popup:hover, .popup-details .close-popup:hover {
                color: #fff !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Chiudi il modale quando si clicca sull'overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Gestione universale per la chiusura dei popup al click esterno
    document.addEventListener('click', function(e) {
        // Verifica se l'elemento cliccato è un modal o è all'interno di un modal
        const isModal = e.target.classList.contains('modal') && !e.target.closest('.modal-content');
        
        if (isModal) {
            // Se è un modal dinamico (creato con insertAdjacentHTML)
            if (e.target.id && document.getElementById(e.target.id)) {
                try {
                    document.body.removeChild(e.target);
                } catch (error) {
                    console.log("Impossibile rimuovere il modal:", error);
                }
            } else {
                // Per i modal standard
                closeModal();
            }
        }
    });
});

// Funzione per aprire un modale
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.modal-overlay').classList.add('active');
    }
}

// Funzione per chiudere tutti i modali
function closeModal() {
    // Chiudi i modali standard
    document.querySelectorAll('.modal').forEach(modal => {
        // Se il modal è stato creato dinamicamente (ha un parent)
        if (modal.parentNode === document.body) {
            modal.style.display = 'none';
        }
    });
    
    // Chiudi i form attivi
    document.querySelectorAll('.nuovo-elemento-form.active, .add-form.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Nascondi l'overlay
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Funzione per confermare un'azione
function confirmAction(message, callback) {
    // Crea il modal di conferma se non esiste
    if (!document.getElementById('confirm-modal')) {
        const modalHTML = `
            <div id="confirm-modal" class="modal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2>Conferma</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p id="confirm-message"></p>
                    </div>
                    <div class="modal-footer">
                        <button id="confirm-yes" class="btn-primary">Sì</button>
                        <button id="confirm-no" class="btn-secondary">No</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Gestisci la chiusura del modal
        document.querySelector('#confirm-modal .close-modal').addEventListener('click', function() {
            closeModal();
        });
        
        // Gestisci il pulsante No
        document.getElementById('confirm-no').addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Imposta il messaggio
    document.getElementById('confirm-message').textContent = message;
    
    // Gestisci il pulsante Sì
    const yesButton = document.getElementById('confirm-yes');
    // Rimuovi eventuali listener precedenti
    const newYesButton = yesButton.cloneNode(true);
    yesButton.parentNode.replaceChild(newYesButton, yesButton);
    
    newYesButton.addEventListener('click', function() {
        closeModal();
        if (typeof callback === 'function') {
            callback();
        }
    });
    
    // Mostra il modal
    openModal('confirm-modal');
}

// Funzioni per gestire i pulsanti di aggiunta
function setupAddButtons() {
    // Nuovo cliente
    document.getElementById('btn-nuovo-cliente')?.addEventListener('click', function() {
        document.getElementById('nuovoCliente').classList.add('active');
        document.querySelector('.modal-overlay').classList.add('active');
    });
    
    // Nuovo progetto
    document.getElementById('btn-nuovo-progetto')?.addEventListener('click', function() {
        document.getElementById('nuovoProgetto').classList.add('active');
        document.querySelector('.modal-overlay').classList.add('active');
    });
    
    // Nuovo materiale
    document.getElementById('btn-nuovo-materiale')?.addEventListener('click', function() {
        document.getElementById('nuovoMateriale').classList.add('active');
        document.querySelector('.modal-overlay').classList.add('active');
    });
    
    // Nuovo preventivo
    document.getElementById('btn-nuovo-preventivo')?.addEventListener('click', function() {
        document.getElementById('nuovoPreventivo').classList.add('active');
        document.querySelector('.modal-overlay').classList.add('active');
    });
    
    // Nuova fattura
    document.getElementById('btn-nuova-fattura')?.addEventListener('click', function() {
        document.getElementById('nuovaFattura').classList.add('active');
        document.querySelector('.modal-overlay').classList.add('active');
    });
    
    // Pulsanti annulla
    document.querySelectorAll('.btn-cancel').forEach(button => {
        button.addEventListener('click', closeModal);
    });
}

// Funzioni per gestire i filtri
function setupFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            const filterOptions = this.nextElementSibling;
            filterOptions.classList.toggle('active');
        });
    });
    
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            const table = this.closest('.filter-container').nextElementSibling;
            
            // Implementa la logica di filtro
            console.log('Filtro selezionato:', filter);
            
            // Chiudi il menu dei filtri
            this.closest('.filter-options').classList.remove('active');
        });
    });
}

// Aggiungi questa funzione per creare un modal di dettaglio fattura
window.showFatturaDetails = function(fatturaId) {
    // Trova la fattura nei dati dell'applicazione
    const fattura = window.appData.fatture.find(f => f.id === fatturaId);
    if (!fattura) {
        console.error("Fattura non trovata:", fatturaId);
        return;
    }
    
    // Crea il contenuto del modal
    const content = `
        <div class="fattura-details">
            <p><strong>Numero:</strong> ${fattura.numero || '-'}</p>
            <p><strong>Data:</strong> ${fattura.data || '-'}</p>
            <p><strong>Cliente:</strong> ${fattura.cliente || '-'}</p>
            <p><strong>Importo:</strong> ${fattura.importo || 'NaN'} €</p>
            <p><strong>Stato:</strong> ${fattura.stato || '-'}</p>
            ${fattura.note ? `<p><strong>Note:</strong> ${fattura.note}</p>` : ''}
        </div>
    `;
    
    // Crea il modal
    const modalId = 'modal-fattura-details';
    const buttons = [
        {
            id: 'btn-close-fattura-details',
            text: 'Chiudi',
            class: 'btn-primary',
            callback: function() {
                closeModal();
            }
        }
    ];
    
    createModal(modalId, 'Dettagli Fattura', content, buttons);
    openModal(modalId);
};

// Modifica la funzione setupClienteButtons per includere anche i pulsanti delle fatture
function setupFatturaButtons() {
    document.querySelectorAll('.btn-view-fattura').forEach(button => {
        button.addEventListener('click', function() {
            const fatturaId = parseInt(this.getAttribute('data-id'));
            showFatturaDetails(fatturaId);
        });
    });
    
    // ... existing code for other buttons ...
}

// Esporta le funzioni per renderle disponibili ad altri file
window.openModal = openModal;
window.closeModal = closeModal;
window.showFatturaDetails = showFatturaDetails;
window.setupFatturaButtons = setupFatturaButtons;
