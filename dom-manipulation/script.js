// Local Storage Keys
const LOCAL_STORAGE_KEY = 'dynamicQuoteGeneratorQuotes';
const LOCAL_STORAGE_FILTER_KEY = 'quoteCategoryFilter';
const SESSION_STORAGE_KEY = 'lastViewedQuote'; // From Task 1

// Initial default quotes
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// DOM References
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('addQuoteFormContainer');
const categoryFilterSelect = document.getElementById('categoryFilter');

// --- Web Storage Management (Task 1 & 2) ---

/**
 * Loads quotes and the last selected filter from Local Storage.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Save defaults if nothing is stored
        saveQuotes();
    }
    
    // Load last selected filter
    const lastFilter = localStorage.getItem(LOCAL_STORAGE_FILTER_KEY);
    if (lastFilter) {
        categoryFilterSelect.value = lastFilter;
    }
}

/**
 * Saves the current quotes array to Local Storage.
 */
function saveQuotes() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
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
    populateCategories(); // Update the filter dropdown
    
    alert('Local storage and all quotes have been cleared.');
}


// --- Category Filtering and Display (Task 2) ---

/**
 * Extracts unique categories and dynamically populates the filter dropdown.
 */
function populateCategories() {
    // 1. Clear existing options (except the "All Categories" option)
    categoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';
    
    // 2. Extract unique categories using a Set for efficiency
    const uniqueCategories = new Set(quotes.map(quote => quote.category));
    
    // 3. Create and append new option elements
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterSelect.appendChild(option);
    });
    
    // 4. Restore the saved filter selection
    const lastFilter = localStorage.getItem(LOCAL_STORAGE_FILTER_KEY);
    if (lastFilter && Array.from(uniqueCategories).includes(lastFilter)) {
        categoryFilterSelect.value = lastFilter;
    } else {
         // Reset filter if the stored category no longer exists
        categoryFilterSelect.value = 'all'; 
    }
}

/**
 * Filters the quotes and updates the display with a random quote from the filtered list.
 * This function is called on the 'onchange' event of the dropdown.
 */
function filterQuotes() {
    const selectedCategory = categoryFilterSelect.value;
    
    // 1. Save the current filter setting to Local Storage
    localStorage.setItem(LOCAL_STORAGE_FILTER_KEY, selectedCategory);

    // 2. Get the filtered quotes
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    // 3. Display a random quote from the filtered list
    showRandomQuote(filteredQuotes);
}

/**
 * Generates and displays a random quote. Can accept a specific array to pick from.
 * @param {Array} quoteArray - The array of quotes to pick from (filtered or all).
 */
function showRandomQuote(quoteArray = null) {
    // If no array is passed, use the quotes array filtered by the current selection
    const currentCategory = categoryFilterSelect.value;
    const quotesToDisplay = quoteArray || (currentCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === currentCategory));
        
    if (quotesToDisplay.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes available for the category: **${currentCategory}**.</p>`;
        return;
    }
    
    quoteDisplay.innerHTML = ''; 

    const randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
    const quote = quotesToDisplay[randomIndex];

    // Store last viewed quote in Session Storage
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

// --- Dynamic Quote Addition (Task 1 & 2) ---

/**
 * Dynamically creates and injects the "Add Quote" form. (Same as Task 1)
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
        // 1. Update the data array
        quotes.push({ text: text, category: category });

        // 2. Save the updated array to Local Storage
        saveQuotes(); 
        
        // 3. IMPORTANT: Update the categories dropdown to include the new category
        populateCategories(); 

        // 4. Clear inputs and show success message
        newQuoteTextEl.value = '';
        newQuoteCategoryEl.value = '';
        alert(`Quote "${text}" added and saved to Local Storage!`);

        // 5. Update the display based on the current filter
        filterQuotes();
    } else {
        alert('Please enter both the quote text and the category.');
    }
}


// --- JSON Data Import and Export (Task 1) ---

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

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) { return; }
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                quotes.push(...importedQuotes); 
                saveQuotes(); 
                event.target.value = ''; 
                populateCategories(); // Update categories after import
                filterQuotes(); // Update display
                alert(`Successfully imported ${importedQuotes.length} quotes!`);
            } else {
                alert('Error: Imported file does not contain a valid array of quotes.');
            }
        } catch (error) {
            alert('Error parsing JSON file. Please ensure the file format is correct.');
        }
    };
    fileReader.readAsText(file);
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data from Local Storage
    loadQuotes(); 

    // 2. Populate the category filter dropdown based on the loaded data
    populateCategories();
    
    // 3. Set up event listeners
    newQuoteButton.addEventListener('click', filterQuotes); // Clicking 'New Quote' just re-runs the filter logic
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    
    // 4. Initial DOM rendering based on the loaded filter
    createAddQuoteForm();
    filterQuotes(); // Initial display based on the saved filter setting
});