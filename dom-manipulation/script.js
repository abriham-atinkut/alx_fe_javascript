// =======================
// State & Initialization
// =======================
const quoteDisplay = document.getElementById("quoteDisplay");
const listOfQuote = document.getElementById("list-of-quote");
const newQuoteBtn = document.getElementById("newQuote");

let quotes = loadQuotes();

// =======================
// Utilities
// =======================
function loadQuotes() {
  try {
    return JSON.parse(localStorage.getItem("myQuote")) || [];
  } catch {
    return [];
  }
}

function saveQuotes() {
  localStorage.setItem("myQuote", JSON.stringify(quotes));
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

  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
}

// =======================
// Add Quote (Dynamic)
// =======================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Both quote text and category are required.");
    return;
  }

  const newQuote = {
    text,
    category,
  };

  quotes.push(newQuote);
  saveQuotes();
  displayAllQuotes();

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
}

// =======================
// Event Listeners
// =======================
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initial render
displayAllQuotes();
