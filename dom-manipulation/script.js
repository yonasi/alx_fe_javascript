// Key for Local Storage
const LOCAL_STORAGE_KEY = 'dynamicQuoteGeneratorQuotes';
// Key for Session Storage
const SESSION_STORAGE_KEY = 'lastViewedQuote';

// Initial data structure (will be overwritten by local storage if available)
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
];

// --- Web Storage Management ---

/**
 * Loads quotes from Local Storage upon initialization.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQuotes) {
        // Parse the JSON string back into a JavaScript object (array)
        quotes = JSON.parse(storedQuotes);
        console.log('Quotes loaded from Local Storage.');
    } else {
        // Save the initial default quotes if local storage is empty
        saveQuotes();
    }
}

/**
 * Saves the current quotes array to Local Storage.
 */
function saveQuotes() {
    // Stringify the JavaScript object (array) into a JSON string
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
    console.log('Quotes saved to Local Storage.');
}

/**
 * Clears all quotes from the array and Local Storage.
 */
function clearLocalStorage() {
    // Clear the array
    quotes = []; 
    // Clear Local Storage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Clear Session Storage (optional clean up)
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    
    // Update the display
    document.getElementById('quoteDisplay').innerHTML = '<p>All quotes cleared. Start adding new ones!</p>';
    
    alert('Local storage and all quotes have been cleared.');
}


// --- Main Application Logic (Modified) ---

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('addQuoteFormContainer');

/**
 * Generates and displays a random quote.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add a new one!</p>';
        return;
    }
    
    quoteDisplay.innerHTML = ''; 

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    const quoteTextEl = document.createElement('p');
    quoteTextEl.classList.add('quote-text'); 
    quoteTextEl.textContent = `"${quote.text}"`;

    const categoryEl = document.createElement('p');
    categoryEl.classList.add('quote-category');
    categoryEl.textContent = `— Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteTextEl);
    quoteDisplay.appendChild(categoryEl);

    // Demonstration of Session Storage: Store the last viewed quote
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
    console.log('Last viewed quote saved to Session Storage.');
}

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

        // 3. Clear inputs and show success message
        newQuoteTextEl.value = '';
        newQuoteCategoryEl.value = '';
        alert(`Quote "${text}" added and saved to Local Storage!`);

        // 4. Show the new quote instantly
        showRandomQuote();
    } else {
        alert('Please enter both the quote text and the category.');
    }
}


// --- JSON Data Import and Export ---

/**
 * Exports the current quotes array to a downloadable JSON file.
 * Uses Blob and URL.createObjectURL.
 */
function exportToJsonFile() {
    // Convert the JavaScript array to a JSON string
    const jsonString = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element for download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    
    // Programmatically click the link to trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up: remove the link and revoke the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Quotes exported successfully!');
}

/**
 * Imports quotes from a selected JSON file and updates the array and storage.
 * Uses FileReader.
 * @param {Event} event - The file input change event.
 */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    const fileReader = new FileReader();
    
    // The onload event fires when the file has been successfully read
    fileReader.onload = function(e) {
        try {
            // Parse the JSON string from the file
            const importedQuotes = JSON.parse(e.target.result);

            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                 // Spread the imported quotes into the existing array
                quotes.push(...importedQuotes); 

                // Save the combined array back to Local Storage
                saveQuotes(); 
                
                // Reset the file input value (optional)
                event.target.value = ''; 
                
                alert(`Successfully imported ${importedQuotes.length} quotes!`);
                showRandomQuote(); // Update display
            } else {
                alert('Error: Imported file does not contain a valid array of quotes.');
            }
        } catch (error) {
            alert('Error parsing JSON file. Please ensure the file format is correct.');
            console.error('JSON parsing error:', error);
        }
    };
    
    // Start reading the file as text
    fileReader.readAsText(file);
}

// --- Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load quotes from Local Storage first
    loadQuotes(); 

    // 2. Set up event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    
    // 3. Initial DOM rendering
    showRandomQuote(); 
    createAddQuoteForm();
    
    // OPTIONAL: Check and display last viewed quote from Session Storage on load
    const lastQuote = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (lastQuote) {
        const quoteObj = JSON.parse(lastQuote);
        console.log(`Loaded last viewed quote from Session Storage: "${quoteObj.text}"`);
    }
});