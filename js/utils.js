// Funzioni di utilità per l'applicazione

// Formatta un valore numerico come valuta
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Formatta una data in formato italiano
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT').format(date);
}

// Restituisce la classe CSS in base allo stato
// Ottieni la classe CSS per lo stato
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

// Calcola il totale di una voce (quantità * prezzo)
function calcolaTotaleVoce(quantitaInput, prezzoInput, totaleInput) {
    const quantita = parseFloat(quantitaInput.value) || 0;
    const prezzo = parseFloat(prezzoInput.value) || 0;
    const totale = quantita * prezzo;
    
    totaleInput.value = totale.toFixed(2);
}

// Calcola il totale di un preventivo
function calcolaTotalePreventivo() {
    const totaliVoci = document.querySelectorAll('#voci-preventivo .totale-input');
    let totalePreventivo = 0;
    
    totaliVoci.forEach(input => {
        totalePreventivo += parseFloat(input.value) || 0;
    });
    
    document.getElementById('totale-preventivo').value = totalePreventivo.toFixed(2);
}

// Calcola il totale di una fattura
function calcolaTotaleFattura() {
    const totaliVoci = document.querySelectorAll('#voci-fattura .totale-input');
    let totaleFattura = 0;
    
    totaliVoci.forEach(input => {
        totaleFattura += parseFloat(input.value) || 0;
    });
    
    document.getElementById('totale-fattura').value = totaleFattura.toFixed(2);
}

// Ottiene il prossimo ID disponibile per una collezione
// Funzioni di utilità comune

// Funzioni di utilità

// Salva i dati dell'applicazione
// Improved function to save application data
function saveAppData() {
    try {
        console.log("Salvataggio dati applicazione...");
        localStorage.setItem('marmeriaData', JSON.stringify(window.appData));
        console.log("Dati salvati con successo");
        return true;
    } catch (error) {
        console.error("Errore durante il salvataggio dei dati:", error);
        showNotification('Errore durante il salvataggio dei dati', 'error');
        return false;
    }
}

// Improved function to load application data
function loadAppData() {
    try {
        console.log("Caricamento dati applicazione...");
        const data = localStorage.getItem('marmeriaData');
        if (data) {
            window.appData = JSON.parse(data);
            console.log("Dati caricati con successo");
            return true;
        }
        console.log("Nessun dato trovato, inizializzazione con dati predefiniti");
        return false;
    } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        showNotification('Errore durante il caricamento dei dati', 'error');
        return false;
    }
}

// Ottieni il prossimo ID disponibile
function getNextId(collection) {
    if (collection.length === 0) return 1;
    const maxId = Math.max(...collection.map(item => item.id));
    return maxId + 1;
}

// Genera un numero di documento
function generateDocumentNumber(prefix, collection) {
    const year = new Date().getFullYear();
    const count = collection.length + 1;
    return `${prefix}-${year}-${count.toString().padStart(3, '0')}`;
}

// Mostra una notifica
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Rimuovi la notifica dopo 3 secondi
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Apri un modale
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'flex'; // Cambiato da 'block' a 'flex' per centrare
}

// Chiudi un modale
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Funzione per confermare un'azione
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Esporta le funzioni
// export { ... }  <-- Rimuovi questa riga

// Invece, rendi le funzioni disponibili globalmente
window.saveAppData = saveAppData;
window.getNextId = getNextId;
window.generateDocumentNumber = generateDocumentNumber;
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmAction = confirmAction;


// Aggiungi questa funzione alla fine del file utils.js

// Funzione di debug per verificare lo stato dell'applicazione
function debugAppStatus() {
    console.log("=== DEBUG APP STATUS ===");
    console.log("window.appData:", window.appData);
    console.log("Clienti:", window.appData?.clienti?.length || 0);
    console.log("Progetti:", window.appData?.progetti?.length || 0);
    console.log("Materiali:", window.appData?.materiali?.length || 0);
    
    console.log("=== DOM STRUCTURE ===");
    console.log("Main container:", document.querySelector('.main-container') || document.getElementById('main-content'));
    console.log("View clienti:", document.getElementById('view-clienti'));
    console.log("Clienti list:", document.getElementById('clienti-list'));
    
    console.log("=== VISIBILITY ===");
    const viewClienti = document.getElementById('view-clienti');
    if (viewClienti) {
        console.log("View clienti display:", window.getComputedStyle(viewClienti).display);
        console.log("View clienti visibility:", window.getComputedStyle(viewClienti).visibility);
        console.log("View clienti height:", window.getComputedStyle(viewClienti).height);
    }
    
    console.log("=== END DEBUG ===");
}

// Esporta la funzione globalmente
window.debugAppStatus = debugAppStatus;


// Utility functions

// Helper function to format currency
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '-';
    
    const valuta = window.appData?.impostazioni?.valuta || 'EUR';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: valuta }).format(amount);
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT').format(date);
}

// Helper function to get status class
function getStatusClass(status) {
    switch(status) {
        case 'In Corso':
            return 'status-in-progress';
        case 'Completato':
        case 'Pagata':
        case 'Approvato':
            return 'status-completed';
        case 'In Attesa':
            return 'status-pending';
        case 'Annullato':
        case 'Rifiutato':
            return 'status-cancelled';
        default:
            return '';
    }
}

// Helper function to render view content
function renderViewContent(viewId, content) {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return null;
    
    // Create view container if it doesn't exist
    let viewContainer = document.getElementById(viewId);
    if (!viewContainer) {
        viewContainer = document.createElement('div');
        viewContainer.id = viewId;
        viewContainer.className = 'view-container';
        contentContainer.appendChild(viewContainer);
    }
    
    // Set content
    viewContainer.innerHTML = content;
    
    return viewContainer;
}

// Generate PDF for preventivi and fatture
function generatePDF(id, type) {
    // This is a placeholder for PDF generation functionality
    // In a real application, you would use a library like jsPDF or pdfmake
    alert(`Funzionalità di generazione PDF per ${type} in fase di sviluppo.`);
}
