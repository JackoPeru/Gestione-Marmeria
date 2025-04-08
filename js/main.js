// Global app data
/*let appData = {
    clienti: [],
    progetti: [],
    materiali: [],
    fornitori: []
};*/

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        // User is logged in, initialize app data and render main view
        initAppData();
        renderApp();
    } else {
        // User is not logged in, render auth view
        renderAuth();
    }
});

// Initialize app data
function initAppData() {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('appData');
    if (savedData) {
        appData = JSON.parse(savedData);
    } else {
        // Initialize with sample data
        initSampleData();
    }
}

// Save app data to localStorage
function saveAppData() {
    localStorage.setItem('appData', JSON.stringify(appData));
}

// Render authentication view
function renderAuth() {
    const mainContainer = document.getElementById('app-container');
    mainContainer.innerHTML = createAuthView();
    initAuthEvents();
}

// Render main application
function renderApp() {
    const mainContainer = document.getElementById('app-container');
    mainContainer.innerHTML = createMainView();
    initMainEvents();
    
    // Load dashboard by default
    loadView('dashboard');
}

// Load specific view
function loadView(viewName) {
    const contentContainer = document.getElementById('content-container');
    let viewContent = '';
    
    // Clear active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Set active class to current nav item
    document.querySelector(`.nav-item[data-view="${viewName}"]`).classList.add('active');
    
    // Load view content
    switch(viewName) {
        case 'dashboard':
            viewContent = createDashboardView();
            contentContainer.innerHTML = viewContent;
            initDashboardEvents();
            break;
        case 'clienti':
            viewContent = createClientiView();
            contentContainer.innerHTML = viewContent;
            initClientiEvents();
            break;
        case 'progetti':
            viewContent = createProgettiView();
            contentContainer.innerHTML = viewContent;
            initProgettiEvents();
            break;
        case 'materiali':
            viewContent = createMaterialiView();
            contentContainer.innerHTML = viewContent;
            initMaterialiEvents();
            break;
        case 'fornitori':
            viewContent = createFornitoriView();
            contentContainer.innerHTML = viewContent;
            initFornitoriEvents();
            break;
    }
}

// Helper function to get next ID for a collection
function getNextId(collection) {
    if (collection.length === 0) {
        return 1;
    }
    return Math.max(...collection.map(item => item.id)) + 1;
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT').format(date);
}

// Helper function to get status class
function getStatusClass(status) {
    switch(status) {
        case 'In Corso':
            return 'status-in-progress';
        case 'Completato':
            return 'status-completed';
        case 'In Attesa':
            return 'status-pending';
        default:
            return '';
    }
}

// Helper function to get cliente by ID
function getClienteById(id) {
    return appData.clienti.find(c => c.id === id);
}

// Initialize sample data for testing
function initSampleData() {
    // Sample clienti
    appData.clienti = [
        { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@example.com', telefono: '3331234567', indirizzo: 'Via Roma 123, Milano' },
        { id: 2, nome: 'Laura', cognome: 'Bianchi', email: 'laura.bianchi@example.com', telefono: '3339876543', indirizzo: 'Via Verdi 45, Roma' }
    ];
    
    // Sample progetti
    appData.progetti = [
        { id: 1, titolo: 'Cucina in marmo', descrizione: 'Installazione piano cucina in marmo bianco', clienteId: 1, stato: 'In Corso', dataInizio: '2023-05-10', dataFine: null, costoTotale: 2500 },
        { id: 2, titolo: 'Pavimento in granito', descrizione: 'Pavimentazione in granito per salone', clienteId: 2, stato: 'Completato', dataInizio: '2023-04-15', dataFine: '2023-05-01', costoTotale: 4800 }
    ];
    
    // Sample materiali
    appData.materiali = [
        { id: 1, codice: 'M001', nome: 'Marmo Carrara', categoria: 'Marmo', fornitore: 'Marmi SpA', quantita: 15, unitaMisura: 'mq', prezzoUnitario: 120 },
        { id: 2, codice: 'G001', nome: 'Granito Nero', categoria: 'Granito', fornitore: 'Pietre Italia', quantita: 8, unitaMisura: 'mq', prezzoUnitario: 150 }
    ];
    
    // Sample fornitori
    appData.fornitori = [
        { id: 1, nome: 'Marmi SpA', email: 'info@marmispa.it', telefono: '0221234567', indirizzo: 'Via Industria 10, Carrara' },
        { id: 2, nome: 'Pietre Italia', email: 'contatti@pietreitalia.it', telefono: '0659876543', indirizzo: 'Via delle Cave 5, Tivoli' }
    ];
    
    // Save to localStorage
    saveAppData();
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    renderAuth();
}


