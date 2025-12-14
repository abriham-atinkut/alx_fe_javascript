// =======================
// DOM References
// =======================
const quoteDisplay = document.getElementById("quoteDisplay");
const listOfQuote = document.getElementById("list-of-quote");
const newQuoteBtn = document.getElementById("newQuote");

// =======================
// Storage Keys
// =======================
const STORAGE_KEY = "myQuote";
const SESSION_KEY = "lastViewedQuote";

// =======================
// State Initialization
// =======================
let quotes = loadQuotes();
restoreLastViewedQuote();

// =======================
// Storage Utilities
// =======================
function loadQuotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// =======================
// Quote Display
// =======================
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const displayText = `"${quote.text}" — (${quote.category})`;
  quoteDisplay.textContent = displayText;

  // Save session-specific data
  sessionStorage.setItem(SESSION_KEY, displayText);
}

// Restore last viewed quote (Session Storage)
function restoreLastViewedQuote() {
  const lastQuote = sessionStorage.getItem(SESSION_KEY);
  if (lastQuote) {
    quoteDisplay.textContent = lastQuote;
  }
}

// =======================
// Add Quote
// =======================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Both fields required");
    return;
  }

  quotes.push({
    id: Date.now(),
    text,
    category,
    updatedAt: Date.now()
  });

  saveQuotes();
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
}


// =======================
// Display All Quotes
// =======================
function displayAllQuotes() {
  listOfQuote.innerHTML = "";

  const ul = document.createElement("ul");

  quotes.forEach((quote) => {
    const li = document.createElement("li");
    li.textContent = `"${quote.text}" — ${quote.category}`;
    ul.appendChild(li);
  });

  listOfQuote.appendChild(ul);
}

// =======================
// Remove All Quotes
// =======================
function removeAllQuotes() {
  quotes = [];
  saveQuotes();
  listOfQuote.innerHTML = "";
  quoteDisplay.textContent = "";
  sessionStorage.removeItem(SESSION_KEY);
}

// =======================
// JSON Export
// =======================
function exportQuotes() {
  if (quotes.length === 0) {
    alert("No quotes to export.");
    return;
  }

  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// =======================
// JSON Import
// =======================
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      importedQuotes.forEach((q) => {
        if (q.text && q.category) {
          quotes.push(q);
        }
      });

      saveQuotes();
      displayAllQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// =======================
// Events
// =======================
newQuoteBtn.addEventListener("click", showRandomQuote);

const FILTER_KEY = "selectedCategory";
function populateCategories() {
  const select = document.getElementById("categoryFilter");

  // Clear existing options (keep "All")
  select.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map((q) => q.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  // Restore saved filter
  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) {
    select.value = savedFilter;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem(FILTER_KEY, selectedCategory);

  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  renderFilteredQuotes(filteredQuotes);
}
function renderFilteredQuotes(filteredQuotes) {
  listOfQuote.innerHTML = "";

  if (filteredQuotes.length === 0) {
    listOfQuote.textContent = "No quotes in this category.";
    return;
  }

  const ul = document.createElement("ul");

  filteredQuotes.forEach((quote) => {
    const li = document.createElement("li");
    li.textContent = `"${quote.text}" — ${quote.category}`;
    ul.appendChild(li);
  });

  listOfQuote.appendChild(ul);
}



const SERVER_API = "https://jsonplaceholder.typicode.com/posts";


async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_API);
  const data = await response.json();

  return data.slice(0, 5).map((item) => ({
    id: item.id,
    text: item.title,
    category: item.body.substring(0, 20),
    updatedAt: Date.now(),
  }));
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let conflictsResolved = false;

    serverQuotes.forEach((serverQuote) => {
      const localIndex = quotes.findIndex((q) => q.id === serverQuote.id);

      if (localIndex === -1) {
        quotes.push(serverQuote);
      } else {
        // Conflict resolution: server takes precedence
        quotes[localIndex] = serverQuote;
        conflictsResolved = true;
      }
    });

    saveQuotes();
    populateCategories();
    filterQuotes();

    notifySync(conflictsResolved);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}
function notifySync(conflictResolved) {
  const status = document.getElementById("syncStatus");

  if (conflictResolved) {
    status.textContent =
      "Server sync completed. Conflicts were resolved using server data.";
  } else {
    status.textContent = "Server sync completed. No conflicts detected.";
  }

  setTimeout(() => (status.textContent = ""), 5000);
}
// Sync every 30 seconds
setInterval(syncQuotes, 30000);

// Initial render
displayAllQuotes();
populateCategories();
filterQuotes();

// I'll add method", "POST", "headers", "Content-Type" syncQuote


