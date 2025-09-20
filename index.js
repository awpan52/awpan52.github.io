// === Dynamic Counters Functions ===
function loadCounters(page) {
  return JSON.parse(localStorage.getItem("dynamicCounters_" + page)) || [];
}

function saveCounters(page, counters) {
  localStorage.setItem("dynamicCounters_" + page, JSON.stringify(counters));
}

function renderCounters(page) {
  const container = document.getElementById("countersContainer_" + page);
  if (!container) return;

  container.innerHTML = "";
  const counters = loadCounters(page);

  counters.forEach((counter, index) => {
    const counterDiv = document.createElement("div");
    counterDiv.className = "counter";

    const title = document.createElement("h3");
    title.textContent = counter.name;

    const label = document.createElement("span");
    label.textContent = counter.value;

    const br = document.createElement("br");

    const decBtn = document.createElement("button");
    decBtn.textContent = "-";
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "reset";
    const incBtn = document.createElement("button");
    incBtn.textContent = "+";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌ Delete";

    counterDiv.appendChild(title);
    counterDiv.appendChild(label);
    counterDiv.appendChild(br);
    counterDiv.appendChild(decBtn);
    counterDiv.appendChild(resetBtn);
    counterDiv.appendChild(incBtn);
    counterDiv.appendChild(deleteBtn);

    container.appendChild(counterDiv);

    decBtn.onclick = () => { counters[index].value--; saveCounters(page, counters); renderCounters(page); };
    resetBtn.onclick = () => { counters[index].value = 0; saveCounters(page, counters); renderCounters(page); };
    incBtn.onclick = () => { counters[index].value++; saveCounters(page, counters); renderCounters(page); };
    deleteBtn.onclick = () => { counters.splice(index,1); saveCounters(page, counters); renderCounters(page); };
  });
}

function setupAddCounterButton(page) {
  const addBtn = document.getElementById("addCounterBtn_" + page);
  if (!addBtn) return;

  addBtn.onclick = () => {
    let name = prompt("Enter a name for this counter:", "");
    if (!name) name = "Counter " + (loadCounters(page).length + 1);

    const counters = loadCounters(page);
    counters.push({ name: name, value: 0 });
    saveCounters(page, counters);
    renderCounters(page);
  };
}

// === Fulfillment Journal Functions ===
function loadJournal() {
  return JSON.parse(localStorage.getItem("fulfillmentJournal")) || [];
}

function saveJournal(entries) {
  localStorage.setItem("fulfillmentJournal", JSON.stringify(entries));
}

function renderJournal() {
  const container = document.getElementById("journalEntries");
  if (!container) return;

  container.innerHTML = "";
  const entries = loadJournal();

  entries.forEach((entry, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "journal-entry";

    const text = document.createElement("p");
    text.textContent = entry.text;

    const timestamp = document.createElement("small");
    timestamp.textContent = `🕒 ${entry.timestamp}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌ Delete";

    entryDiv.appendChild(text);
    entryDiv.appendChild(timestamp);
    entryDiv.appendChild(document.createElement("br"));
    entryDiv.appendChild(editBtn);
    entryDiv.appendChild(deleteBtn);

    container.appendChild(entryDiv);

    editBtn.onclick = () => {
      const newText = prompt("Edit your entry:", entry.text);
      if (newText !== null) {
        entry.text = newText;
        entry.timestamp = new Date().toLocaleString();
        saveJournal(entries);
        renderJournal();
      }
    };

    deleteBtn.onclick = () => {
      entries.splice(index,1);
      saveJournal(entries);
      renderJournal();
    };
  });
}

function setupJournal() {
  const saveBtn = document.getElementById("saveJournalBtn");
  const input = document.getElementById("journalInput");

  if (saveBtn && input) {
    saveBtn.onclick = () => {
      const text = input.value.trim();
      if (text) {
        const entries = loadJournal();
        entries.push({ text: text, timestamp: new Date().toLocaleString() });
        saveJournal(entries);
        input.value = "";
        renderJournal();
      }
    };
  }

  renderJournal();
}

// === Initialize everything on page load ===
window.addEventListener("load", () => {
  ["materials", "products"].forEach(page => {
    setupAddCounterButton(page);
    renderCounters(page);
  });

  setupJournal(); // setup fulfillment journal
});
