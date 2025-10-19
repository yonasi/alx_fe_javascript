// Local Storage Keys
const LOCAL_STORAGE_KEY = 'dynamicQuoteGeneratorQuotes';
const LOCAL_STORAGE_FILTER_KEY = 'quoteCategoryFilter';
const SESSION_STORAGE_KEY = 'lastViewedQuote'; 

// Mock API Endpoint (Simulated)
// We'll use a local JSON file or a persistent mock service in a real scenario.
// For this simulation, we'll assume a basic structure.
const MOCK_SERVER_DATA = [
    { id: 101, text: "Simulated Server Quote: Consistency is the key to mastery.", category: "Discipline" },
    { id: 102, text: "Simulated Server Quote: Code, Deploy, Repeat.", category: "Programming" }
];
const SYNC_INTERVAL_MS = 15000; // Sync every 15 seconds

// Global Data and DOM References
let quotes = []; // Quotes start empty, loaded from Local Storage or Server
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('addQuoteFormContainer');
const categoryFilterSelect = document.getElementById('categoryFilter');
const syncStatusEl = document.getElementById('syncStatus');


// --- Server Sync and Conflict Resolution (Task 3) ---

/**
 * Updates the sync status element in the UI.
 * @param {string} message - The status message.
 * @param {string} color - Optional color code or name for background.
 */
function updateSyncStatus(message, color = '#ffc') {
    syncStatusEl.style.backgroundColor = color;
    syncStatusEl.innerHTML = `🔄 **Sync Status:** ${message}`;
}

/**
 * Simulates fetching data from the server.
 * In a real application, this would be a 'fetch' call to a backend API.
 */
async function fetchServerQuotes() {
    updateSyncStatus('Fetching data from server...', '#e0f7fa');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // In a real scenario:
    /*
    const response = await fetch('/api/quotes');
    const serverQuotes = await response.json();
    return serverQuotes;
    */

    // Using mock data for simulation:
    return MOCK_SERVER_DATA;
}

/**
 * Simulates pushing local changes to the server.
 * The server must return the merged and canonical data.
 */
async function pushAndSync() {
    updateSyncStatus('Syncing local changes with server...', '#fff3e0');
    
    // Simulate API delay for push
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    // 1. Simulate getting the canonical data from the server 
    // (Server's latest data, often after merging our posted changes)
    const serverQuotes = await fetchServerQuotes();
    
    // 2. Conflict Resolution Strategy: Server Wins (Server's data is the source of truth)
    // We overwrite our local data with the server's canonical data.
    const localQuotes = loadQuotes(false); // Load local without affecting the global array yet
    
    if (serverQuotes.length !== localQuotes.length || JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
        // Conflict Detected or Update Found!
        quotes = serverQuotes; // Server data takes precedence
        saveQuotes(); // Persist the canonical server data locally

        const added = serverQuotes.filter(sQuote => !localQuotes.some(lQuote => lQuote.text === sQuote.text));
        const message = `Sync complete. ${added.length} updates received from server. **Server data took precedence.**`;
        updateSyncStatus(message, '#e8f5e9'); // Green success

        // Update UI to reflect the new canonical data
        populateCategories();
        filterQuotes();
    } else {
        updateSyncStatus('Sync complete. Local data is up-to-date with the server.', '#e8f5e9');
    }
}

/**
 * Initializes the periodic syncing.
 */
function startPeriodicSync() {
    // Perform initial sync immediately
    pushAndSync();
    
    // Set up the interval for subsequent syncing
    setInterval(pushAndSync, SYNC_INTERVAL_MS);
}


// --- Local Storage Management (Modified) ---

/**
 * Loads quotes from Local Storage.
 * @param {boolean} updateGlobal - Whether to update the global 'quotes' array.
 * @returns {Array} The loaded quote array.
 */
function loadQuotes(updateGlobal = true) {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    const loadedQuotes = storedQuotes ? JSON.parse(storedQuotes) : MOCK_SERVER_DATA; // Use server mock if empty
    
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

// ... (clearLocalStorage remains the same) ...


// --- Main Application Logic (Modified) ---

// ... (showRandomQuote and filterQuotes remain the same, relying on the global 'quotes' array) ...

/**
 * Filters the quotes and updates the display with a random quote from the filtered list.
 */
function filterQuotes() {
    const selectedCategory = categoryFilterSelect.value;
    localStorage.setItem(LOCAL_STORAGE_FILTER_KEY, selectedCategory);

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    showRandomQuote(filteredQuotes);
}

// ... (populateCategories and createAddQuoteForm remain the same) ...

/**
 * Handles the logic for adding a new quote and triggers a sync.
 */
function addQuote() {
    const newQuoteTextEl = document.getElementById('newQuoteText');
    const newQuoteCategoryEl = document.getElementById('newQuoteCategory');

    const text = newQuoteTextEl.value.trim();
    const category = newQuoteCategoryEl.value.trim();

    if (text && category) {
        // 1. Update the data array (local change)
        quotes.push({ text: text, category: category });

        // 2. Save the updated array to Local Storage
        saveQuotes(); 
        
        // 3. Update the categories dropdown 
        populateCategories(); 

        // 4. Clear inputs and show success message
        newQuoteTextEl.value = '';
        newQuoteCategoryEl.value = '';
        updateSyncStatus('Local change detected. Preparing for next sync.', '#fff8e1');

        // 5. Update the display 
        filterQuotes();
        
        // 6. Trigger an immediate sync after a local change (optional)
        pushAndSync(); 
    } else {
        alert('Please enter both the quote text and the category.');
    }
}

// ... (JSON Import/Export functions remain the same, but should call pushAndSync() after data modification) ...

// Updated Import function to trigger sync
function importFromJsonFile(event) {
    // ... (File reading and parsing logic) ...
    
    // INSIDE the success block:
    /*
    quotes.push(...importedQuotes); 
    saveQuotes(); 
    populateCategories(); 
    filterQuotes(); 
    alert(`Successfully imported ${importedQuotes.length} quotes!`);
    pushAndSync(); // <--- NEW LINE: Trigger sync after import
    */
    // ... (rest of the function)
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load quotes and filter from Local Storage
    loadQuotes(); 

    // 2. Start the periodic server sync process
    startPeriodicSync();
    
    // 3. Populate categories and set up listeners
    populateCategories();
    newQuoteButton.addEventListener('click', filterQuotes);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    
    // 4. Initial DOM rendering
    createAddQuoteForm();
    filterQuotes(); 
});