const quoteDisplay = document.getElementById("quoteDisplay");
// const newQuote = document.getElementById("newQuote");
const listOfQuote = document.getElementById("list-of-quote");

let storedQuote;
try {
  storedQuote = JSON.parse(localStorage.getItem("myQuote") || []);
} catch (e) {
  storedQuote = [];
}
// i'm give the some option to add category  
// ["text", "category"]
// showRandomQuote 
// Math.random 
// createAddQuoteForm
// for i'm skiping it 

async function featchData() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random/1");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const dataQuote = data[0].quote;
    quoteDisplay.innerText = dataQuote;

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
  } catch (err) {
    console.error("Error fetching data: ", err);
  }
}

function addQuote() {
  const inputQuote = document.getElementById("newQuoteText");
  const newQuoteText = inputQuote.value;

  function saveQuotes() {
    localStorage.setItem("myQuote", JSON.stringify(storedQuote));
  }

  function addQuote(q) {
    storedQuote.push(q);
    saveQuotes();
  }
  addQuote(newQuoteText);

  inputQuote.value = "";
}

// Remove all quotes form local storage and screen
function removeAllQuotes() {
  localStorage.removeItem("myQuote");
  listOfQuote.innerHTML = "";
  console.log(localStorage.getItem("myQuote"));
}

function displayQuote() {
  // frist select element that the quote is desplayed
  // second create new li tag in loop that singl Quote will be inserted
  // after that display it in screen in real time
  const unorderdList = document.createElement("ul");

  for (let quote of storedQuote) {
    const list = document.createElement("li");
    list.innerText = quote;
    unorderdList.appendChild(list);
  }
  listOfQuote.innerHTML = "";
  listOfQuote.append(unorderdList);
  // listOfQuote.innerText = storedQuote;
}

function allFeatchData() {
  featchData();
  displayQuote();
}
function allAddQuote() {
  addQuote();
  displayQuote();
}
