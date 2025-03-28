// Componente di ricerca e filtri riutilizzabile per tutte le sezioni
function createSearchAndFilterComponent(options) {
    const {
        containerId,       // ID del contenitore dove inserire il componente
        searchFields,      // Array di campi su cui cercare
        filterOptions,     // Opzioni di filtro specifiche per la sezione
        onSearch,          // Callback quando la ricerca cambia
        onFilter           // Callback quando i filtri cambiano
    } = options;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Crea il contenitore per la ricerca e i filtri
    const searchFilterContainer = document.createElement('div');
    searchFilterContainer.className = 'search-filter-container';
    
    // Crea il campo di ricerca
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Cerca...';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search search-icon';
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    // Crea il contenitore dei filtri se ci sono opzioni di filtro
    let filterContainer = null;
    if (filterOptions && filterOptions.length > 0) {
        filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        const filterButton = document.createElement('button');
        filterButton.className = 'filter-button';
        filterButton.innerHTML = '<i class="fas fa-filter"></i> Filtri';
        
        const filterDropdown = document.createElement('div');
        filterDropdown.className = 'filter-dropdown';
        
        // Aggiungi le opzioni di filtro
        filterOptions.forEach(option => {
            const filterGroup = document.createElement('div');
            filterGroup.className = 'filter-group';
            
            const filterLabel = document.createElement('label');
            filterLabel.textContent = option.label;
            filterGroup.appendChild(filterLabel);
            
            if (option.type === 'select') {
                const select = document.createElement('select');
                select.className = 'filter-select';
                select.dataset.field = option.field;
                
                // Aggiungi l'opzione "Tutti"
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Tutti';
                select.appendChild(defaultOption);
                
                // Aggiungi le altre opzioni
                option.options.forEach(opt => {
                    const optElement = document.createElement('option');
                    optElement.value = opt.value;
                    optElement.textContent = opt.label;
                    select.appendChild(optElement);
                });
                
                select.addEventListener('change', () => {
                    if (onFilter) onFilter(collectFilterValues());
                });
                
                filterGroup.appendChild(select);
            } else if (option.type === 'date') {
                const dateContainer = document.createElement('div');
                dateContainer.className = 'date-filter-container';
                
                const fromDate = document.createElement('input');
                fromDate.type = 'date';
                fromDate.className = 'filter-date';
                fromDate.dataset.field = option.field;
                fromDate.dataset.operator = 'from';
                
                const toDate = document.createElement('input');
                toDate.type = 'date';
                toDate.className = 'filter-date';
                toDate.dataset.field = option.field;
                toDate.dataset.operator = 'to';
                
                const fromLabel = document.createElement('span');
                fromLabel.textContent = 'Da:';
                
                const toLabel = document.createElement('span');
                toLabel.textContent = 'A:';
                
                dateContainer.appendChild(fromLabel);
                dateContainer.appendChild(fromDate);
                dateContainer.appendChild(toLabel);
                dateContainer.appendChild(toDate);
                
                fromDate.addEventListener('change', () => {
                    if (onFilter) onFilter(collectFilterValues());
                });
                
                toDate.addEventListener('change', () => {
                    if (onFilter) onFilter(collectFilterValues());
                });
                
                filterGroup.appendChild(dateContainer);
            }
            
            filterDropdown.appendChild(filterGroup);
        });
        
        // Aggiungi pulsante per resettare i filtri
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-filters-button';
        resetButton.textContent = 'Resetta Filtri';
        resetButton.addEventListener('click', () => {
            resetFilters();
            if (onFilter) onFilter({});
        });
        
        filterDropdown.appendChild(resetButton);
        
        // Gestisci l'apertura/chiusura del dropdown
        filterButton.addEventListener('click', () => {
            filterDropdown.classList.toggle('show');
        });
        
        // Chiudi il dropdown quando si clicca fuori
        document.addEventListener('click', (e) => {
            if (!filterButton.contains(e.target) && !filterDropdown.contains(e.target)) {
                filterDropdown.classList.remove('show');
            }
        });
        
        filterContainer.appendChild(filterButton);
        filterContainer.appendChild(filterDropdown);
    }
    
    // Aggiungi gli elementi al contenitore
    searchFilterContainer.appendChild(searchContainer);
    if (filterContainer) {
        searchFilterContainer.appendChild(filterContainer);
    }
    
    // Inserisci il contenitore nella pagina
    container.insertBefore(searchFilterContainer, container.firstChild);
    
    // Gestisci l'evento di ricerca
    searchInput.addEventListener('input', () => {
        if (onSearch) onSearch(searchInput.value);
    });
    
    // Funzione per raccogliere i valori dei filtri
    function collectFilterValues() {
        const filters = {};
        
        if (!filterContainer) return filters;
        
        // Raccogli i valori dei select
        filterContainer.querySelectorAll('.filter-select').forEach(select => {
            if (select.value) {
                filters[select.dataset.field] = select.value;
            }
        });
        
        // Raccogli i valori delle date
        const dateFilters = {};
        filterContainer.querySelectorAll('.filter-date').forEach(date => {
            if (date.value) {
                const field = date.dataset.field;
                const operator = date.dataset.operator;
                
                if (!dateFilters[field]) {
                    dateFilters[field] = {};
                }
                
                dateFilters[field][operator] = date.value;
            }
        });
        
        // Aggiungi i filtri di data
        Object.keys(dateFilters).forEach(field => {
            filters[field] = dateFilters[field];
        });
        
        return filters;
    }
    
    // Funzione per resettare i filtri
    function resetFilters() {
        if (!filterContainer) return;
        
        // Resetta i select
        filterContainer.querySelectorAll('.filter-select').forEach(select => {
            select.value = '';
        });
        
        // Resetta le date
        filterContainer.querySelectorAll('.filter-date').forEach(date => {
            date.value = '';
        });
    }
    
    // Restituisci un oggetto con metodi utili
    return {
        getSearchValue: () => searchInput.value,
        getFilterValues: collectFilterValues,
        resetFilters: resetFilters,
        resetSearch: () => { searchInput.value = ''; }
    };
}

// Funzione per filtrare i dati in base alla ricerca e ai filtri
function filterData(data, searchValue, searchFields, filters) {
    if (!data || !data.length) return [];
    
    // Filtra per ricerca
    let filteredData = data;
    if (searchValue && searchFields && searchFields.length) {
        const searchLower = searchValue.toLowerCase();
        filteredData = data.filter(item => {
            return searchFields.some(field => {
                const fieldValue = getNestedValue(item, field);
                if (fieldValue === null || fieldValue === undefined) return false;
                return String(fieldValue).toLowerCase().includes(searchLower);
            });
        });
    }
    
    // Filtra per filtri
    if (filters && Object.keys(filters).length) {
        filteredData = filteredData.filter(item => {
            return Object.keys(filters).every(field => {
                const filterValue = filters[field];
                
                // Gestisci filtri di data (range)
                if (filterValue && typeof filterValue === 'object' && (filterValue.from || filterValue.to)) {
                    const itemDate = new Date(getNestedValue(item, field));
                    
                    if (filterValue.from) {
                        const fromDate = new Date(filterValue.from);
                        if (itemDate < fromDate) return false;
                    }
                    
                    if (filterValue.to) {
                        const toDate = new Date(filterValue.to);
                        toDate.setHours(23, 59, 59, 999); // Fine della giornata
                        if (itemDate > toDate) return false;
                    }
                    
                    return true;
                }
                
                // Gestisci filtri normali
                const itemValue = getNestedValue(item, field);
                return itemValue == filterValue; // Usa == per gestire confronti tra stringhe e numeri
            });
        });
    }
    
    return filteredData;
}

// Funzione per ottenere un valore annidato da un oggetto
function getNestedValue(obj, path) {
    if (!obj || !path) return null;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
        if (value === null || value === undefined) return null;
        value = value[key];
    }
    
    return value;
}