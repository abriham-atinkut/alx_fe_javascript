const quoteDisplay = document.getElementById("quoteDisplay");
// const newQuote = document.getElementById("newQuote");
let storedQuote;
try {
  storedQuote = JSON.parse(localStorage.getItem("myQuote") || []);
} catch (e) {
  storedQuote = [];
}

async function featchData() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random/1");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const dataQuote = data[0].quote;
    quoteDisplay.innerText = dataQuote;

    // i want to make sure new quote is saved in localStorage and
    // also a that i need to print in below

    function saveQuotes() {
      localStorage.setItem("myQuote", JSON.stringify(storedQuote));
    }

    function addQuote(q) {
      storedQuote.push(q);
      saveQuotes();
    }

    if (!(dataQuote instanceof Error)) {
      addQuote(dataQuote);
    }

    for (let quote of storedQuote) console.log(quote);
  } catch (err) {
    console.error("Error fetching data: ", err);
  }
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;

  function saveQuotes() {
    localStorage.setItem("myQuote", JSON.stringify(storedQuote));
  }

  function addQuote(q) {
    storedQuote.push(q);
    saveQuotes();
  }

  if (!(newQuoteText instanceof Error)) {
    addQuote(newQuoteText);
  }

  for (let quote of storedQuote) console.log(quote);
}

function removeAllQuotes() {
  localStorage.removeItem("myQuote");
  console.log(localStorage.getItem("myQuote"));
}

// ["text", "category"]