// Initial data structure: an array of quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" }
];

// Reference to the main display container
const quoteDisplay = document.getElementById('quoteDisplay');
// Reference to the button
const newQuoteButton = document.getElementById('newQuote');
// Reference to the container for the form
const formContainer = document.getElementById('addQuoteFormContainer');

/**
 * Generates and displays a random quote in the DOM.
 * Advanced DOM Manipulation: Uses createElement, textContent, appendChild.
 */
function showRandomQuote() {
    // Clear previous content using innerHTML for simplicity in clearing children
    quoteDisplay.innerHTML = ''; 

    // 1. Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // 2. Create the quote text element
    const quoteTextEl = document.createElement('p');
    // Add a class for styling (best practice)
    quoteTextEl.classList.add('quote-text'); 
    quoteTextEl.textContent = `"${quote.text}"`;

    // 3. Create the category element
    const categoryEl = document.createElement('p');
    categoryEl.classList.add('quote-category');
    categoryEl.textContent = `— Category: ${quote.category}`;

    // 4. Append the newly created elements to the display container
    quoteDisplay.appendChild(quoteTextEl);
    quoteDisplay.appendChild(categoryEl);
}

/**
 * Dynamically creates and injects the "Add Quote" form into the DOM.
 * Advanced DOM Manipulation: Builds a complex structure from scratch.
 */
function createAddQuoteForm() {
    // Clear the container before re-creating
    formContainer.innerHTML = ''; 

    // Create the main wrapper div
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('add-quote-section');

    // Create the title/header
    const header = document.createElement('h3');
    header.textContent = 'Add New Quote';

    // Create the Quote Text input
    const quoteInput = document.createElement('input');
    // Set attributes dynamically
    quoteInput.setAttribute('id', 'newQuoteText');
    quoteInput.setAttribute('type', 'text');
    quoteInput.setAttribute('placeholder', 'Enter a new quote');

    // Create the Category input
    const categoryInput = document.createElement('input');
    categoryInput.setAttribute('id', 'newQuoteCategory');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('placeholder', 'Enter quote category');

    // Create the Add button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    // Use addEventListener instead of inline onclick for better separation of concerns
    addButton.addEventListener('click', addQuote); 

    // Append all elements to the wrapper div
    wrapperDiv.appendChild(header);
    wrapperDiv.appendChild(quoteInput);
    wrapperDiv.appendChild(categoryInput);
    wrapperDiv.appendChild(addButton);

    // Append the fully constructed form to the main container
    formContainer.appendChild(wrapperDiv);
}

/**
 * Handles the logic for adding a new quote based on user input.
 * DOM Manipulation: Uses querySelector and value to read input; updates the underlying data array.
 */
function addQuote() {
    // Get values from the dynamically created input fields using their IDs
    const newQuoteTextEl = document.getElementById('newQuoteText');
    const newQuoteCategoryEl = document.getElementById('newQuoteCategory');

    const text = newQuoteTextEl.value.trim();
    const category = newQuoteCategoryEl.value.trim();

    if (text && category) {
        // 1. Update the data array
        quotes.push({ text: text, category: category });

        // 2. Provide feedback to the user (optional, but good practice)
        alert(`Quote "${text}" added to the ${category} category!`);

        // 3. Clear the input fields for a clean state
        newQuoteTextEl.value = '';
        newQuoteCategoryEl.value = '';

        // 4. Show the new quote instantly
        showRandomQuote();
    } else {
        alert('Please enter both the quote text and the category.');
    }
}

// --- Initialization and Event Listeners ---

// 1. Set up the event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// 2. Initial DOM generation upon page load
document.addEventListener('DOMContentLoaded', () => {
    // Display the first random quote
    showRandomQuote(); 
    // Dynamically create and render the add quote form
    createAddQuoteForm();
});