// --- Configuration & Keys ---
const LOCAL_STORAGE_KEY = 'dynamicQuoteGeneratorQuotes';
const LOCAL_STORAGE_FILTER_KEY = 'quoteCategoryFilter';
const SESSION_STORAGE_KEY = 'lastViewedQuote'; 
const SYNC_INTERVAL_MS = 15000; // Sync every 15 seconds

// Mock Server Data for simulation (Task 3)
const MOCK_SERVER_DATA = [
    { id: 101, text: "Server Quote: Conflict is inevitable, but combat is optional.", category: "Philosophy" },
    { id: 102, text: "Server Quote: Sync your data, sync your life.", category: "Technology" }
];

// --- Global State & DOM References ---
let quotes = []; 
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('addQuoteFormContainer');
const categoryFilterSelect = document.getElementById('categoryFilter');
const syncStatusEl = document.getElementById('syncStatus');


// #################################################
// # SECTION 1: Web Storage & Data Management (Task 2)
// #################################################

/**
 * Loads quotes from Local Storage.
 * @param {boolean} updateGlobal - Whether to update the global 'quotes' array.
 * @returns {Array} The loaded quote array.
 */
function loadQuotes(updateGlobal = true) {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    // If nothing is in local storage, start with the server's mock data
    const loadedQuotes = storedQuotes ? JSON.parse(storedQuotes) : MOCK_SERVER_DATA; 
    
    if (updateGlobal) {
        quotes = loadedQuotes;
    }
    return loadedQuotes;
}

/**
 * Saves the current quotes array to Local Storage.
 */
function saveQuotes() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
    console.log('Quotes saved to Local Storage.');
}

/**
 * Clears all data from Local and Session Storage.
 */
function clearLocalStorage() {
    quotes = []; 
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_FILTER_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    
    quoteDisplay.innerHTML = '<p>All quotes cleared. Start adding new ones!</p>';
    populateCategories();
    
    alert('Local storage and all quotes have been cleared.');
}


// #################################################
// # SECTION 2: Server Sync & Conflict Resolution (Task 3)
// #################################################

/**
 * Updates the sync status element in the UI (Notification System).
 */
function updateSyncStatus(message, color = '#ffc') {
    syncStatusEl.style.backgroundColor = color;
    syncStatusEl.innerHTML = `🔄 **Sync Status:** ${message}`;
}

/**
 * RENAMED: Simulates fetching data from the server using a mock API.
 */
async function fetchQuotesFromServer() {
    updateSyncStatus('Fetching data from server using mock API...', '#e0f7fa');
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // This return simulates the response from the server after a successful fetch.
    return MOCK_SERVER_DATA;
}

/**
 * RENAMED: Synchronizes local data with server data, including conflict resolution.
 * This function also SIMULATES the "posting data" step.
 */
async function syncQuotes() {
    updateSyncStatus('Simulating post/sync of local changes...', '#fff3e0');
    
    // 1. SIMULATE posting local data to the server (Task 3 requirement: posting data)
    // In a real app: await fetch('/api/quotes', { method: 'POST', body: JSON.stringify(quotes) });
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate post delay

    // 2. Fetch the canonical, merged data from the server (Task 3 requirement: fetching data)
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = loadQuotes(false); 

    // 3. Check for conflicts/updates (Task 3 requirement: conflict resolution)
    if (serverQuotes.length !== localQuotes.length || JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
        
        // --- CONFLICT RESOLUTION: SERVER WINS ---
        quotes = serverQuotes; // Update local data with server data
        saveQuotes(); // Update local storage with server data

        const message = `Sync complete. **${serverQuotes.length - localQuotes.length}** updates received. Server data took precedence.`;
        updateSyncStatus(message, '#e8f5e9'); // Green success notification (Task 3 requirement: UI notification)

        // Update UI
        populateCategories();
        filterQuotes();
    } else {
        updateSyncStatus('Sync complete. Local data is up-to-date with the server.', '#e8f5e9');
    }
}

/**
 * Initializes the periodic syncing (Task 3 requirement: periodically checking).
 */
function startPeriodicSync() {
    syncQuotes(); // Initial sync
    setInterval(syncQuotes, SYNC_INTERVAL_MS);
}


// #################################################
// # SECTION 3: DOM Manipulation & Filtering (Task 1 & 2)
// #################################################

/**
 * Extracts unique categories and dynamically populates the filter dropdown.
 */
function populateCategories() {
    categoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';
    
    const uniqueCategories = new Set(quotes.map(quote => quote.category));
    
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterSelect.appendChild(option);
    });
    
    // Restore the saved filter selection
    const lastFilter = localStorage.getItem(LOCAL_STORAGE_FILTER_KEY);
    if (lastFilter && Array.from(uniqueCategories).includes(lastFilter)) {
        categoryFilterSelect.value = lastFilter;
    } else {
        categoryFilterSelect.value = 'all'; 
    }
}

/**
 * Filters the quotes based on the selected category and updates the display.
 */
function filterQuotes() {
    const selectedCategory = categoryFilterSelect.value;
    localStorage.setItem(LOCAL_STORAGE_FILTER_KEY, selectedCategory);

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    showRandomQuote(filteredQuotes);
}

/**
 * Generates and displays a random quote (Advanced DOM Manipulation).
 */
function showRandomQuote(quotesToDisplay) {
    const currentCategory = categoryFilterSelect.value;
        
    if (quotesToDisplay.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes available for the category: **${currentCategory}**.</p>`;
        return;
    }
    
    quoteDisplay.innerHTML = ''; 

    const randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
    const quote = quotesToDisplay[randomIndex];

    // Store last viewed quote in Session Storage (Task 2 - optional)
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));

    // Dynamic DOM creation
    const quoteTextEl = document.createElement('p');
    quoteTextEl.classList.add('quote-text'); 
    quoteTextEl.textContent = `"${quote.text}"`;

    const categoryEl = document.createElement('p');
    categoryEl.classList.add('quote-category');
    categoryEl.textContent = `— Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteTextEl);
    quoteDisplay.appendChild(categoryEl);
}

/**
 * Dynamically creates and injects the "Add Quote" form.
 */
function createAddQuoteForm() {
    formContainer.innerHTML = ''; 

    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('add-quote-section');

    const header = document.createElement('h3');
    header.textContent = 'Add New Quote';

    const quoteInput = document.createElement('input');
    quoteInput.setAttribute('id', 'newQuoteText');
    quoteInput.setAttribute('type', 'text');
    quoteInput.setAttribute('placeholder', 'Enter a new quote');

    const categoryInput = document.createElement('input');
    categoryInput.setAttribute('id', 'newQuoteCategory');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('placeholder', 'Enter quote category');

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote); 

    wrapperDiv.appendChild(header);
    wrapperDiv.appendChild(quoteInput);
    wrapperDiv.appendChild(categoryInput);
    wrapperDiv.appendChild(addButton);

    formContainer.appendChild(wrapperDiv);
}

/**
 * Handles the logic for adding a new quote.
 */
function addQuote() {
    const newQuoteTextEl = document.getElementById('newQuoteText');
    const newQuoteCategoryEl = document.getElementById('newQuoteCategory');

    const text = newQuoteTextEl.value.trim();
    const category = newQuoteCategoryEl.value.trim();

    if (text && category) {
        // 1. Update local data
        quotes.push({ text: text, category: category });

        // 2. Persist locally
        saveQuotes(); 
        
        // 3. Update UI
        populateCategories(); 
        newQuoteTextEl.value = '';
        newQuoteCategoryEl.value = '';
        updateSyncStatus('Local change detected. Triggering sync...', '#fff8e1');

        // 4. Update display
        filterQuotes();
        
        // 5. Trigger an immediate sync (Simulated push)
        syncQuotes(); 
    } else {
        alert('Please enter both the quote text and the category.');
    }
}


// #################################################
// # SECTION 4: JSON Import and Export (Task 2)
// #################################################

/**
 * Exports the current quotes array to a downloadable JSON file.
 */
function exportToJsonFile() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Quotes exported successfully!');
}

/**
 * Imports quotes from a selected JSON file and updates the array.
 */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) { return; }
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                
                // 1. Update local data
                quotes.push(...importedQuotes); 
                
                // 2. Persist locally
                saveQuotes(); 
                
                // 3. Update UI and display
                event.target.value = ''; 
                populateCategories(); 
                filterQuotes(); 
                
                alert(`Successfully imported ${importedQuotes.length} quotes! Triggering sync.`);
                
                // 4. Trigger sync after successful import
                syncQuotes(); 
            } else {
                alert('Error: Imported file does not contain a valid array of quotes (text and category are required).');
            }
        } catch (error) {
            alert('Error parsing JSON file. Please ensure the file format is correct.');
            console.error('JSON parsing error:', error);
        }
    };
    fileReader.readAsText(file);
}


// #################################################
// # SECTION 5: Initialization
// #################################################

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data from Local Storage
    loadQuotes(); 

    // 2. Start the periodic server sync process (Task 3)
    startPeriodicSync();
    
    // 3. Populate categories (Task 2) and set up listeners
    populateCategories();
    newQuoteButton.addEventListener('click', filterQuotes);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    
    // 4. Initial DOM rendering (Task 1 & 2)
    createAddQuoteForm();
    filterQuotes(); 
});