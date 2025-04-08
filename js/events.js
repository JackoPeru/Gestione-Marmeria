// Gestione degli eventi dell'applicazione

// Nota: Le funzioni loadView e navigateTo sono già definite in app.js
// Quindi qui non le ridefiniremo per evitare conflitti

// Funzione per gestire gli eventi dei pulsanti
function setupEventHandlers() {
    // Gestisci i pulsanti di chiusura dei modal
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Gestisci i click fuori dal modal per chiuderlo
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    console.log("Event handlers configurati");
}

// Assicurati che le funzioni siano disponibili globalmente
// ma non ridefinirle se già esistono
if (!window.setupEventHandlers) {
    window.setupEventHandlers = setupEventHandlers;
}
