/*
Global Variables
*/

let keyeventlistener = null;

/*
Realtime Communication connection
*/

console.log("Connecting to AccounterServices...");
const socket = io();
socket.on("connect", () => {
  console.log("Connected!");
  console.log("Requesting Data...");
  socket.emit("queryData");
  socket.on("receiveData", (result) => {
    console.log("Data Received!");
    console.log(result);
    renderIncomeTable(result);
    renderExpensesTable(result);
    rendertotal(result);
  });
  socket.on("delete", (data) => {
    alert("Deletion successful!");
  });
});

function renderIncomeTable(data) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  //Header for date, usage and amount
  let headtr = document.createElement("tr");

  let amountth = document.createElement("th");
  amountth.innerText = "Amount";
  amountth.classList.add("amountcol");
  headtr.appendChild(amountth);

  let usageth = document.createElement("th");
  usageth.innerText = "Usage";
  usageth.classList.add("usagecol");
  headtr.appendChild(usageth);

  let dateth = document.createElement("th");
  dateth.innerText = "Date";
  dateth.classList.add("datecol");
  headtr.appendChild(dateth);

  let buttondummyth = document.createElement("th");
  buttondummyth.innerHTML = "";
  buttondummyth.classList.add("delcol");
  headtr.appendChild(buttondummyth);

  thead.appendChild(headtr);
  table.appendChild(thead);

  //Display every transaction in its own tr
  data.income.forEach((transaction) => {
    let tr = document.createElement("tr");

    let amounttd = document.createElement("td");
    amounttd.innerHTML = parseFloat(transaction.amount).toFixed(2) + " €";
    amounttd.classList.add("bdLeft");
    tr.appendChild(amounttd);

    let usagetd = document.createElement("td");
    usagetd.innerHTML = transaction.usage;
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    datetd.innerHTML = transaction.date;
    tr.appendChild(datetd);

    let deltd = document.createElement("td");
    deltd.classList.add("bdRight");
    let delbtn = document.createElement("img");
    delbtn.src = "./img/x.png";
    delbtn.height = 24;
    delbtn.classList.add("delbtn");
    delbtn.onclick = function () {
      deleteincome(transaction._id);
    };
    deltd.appendChild(delbtn);
    tr.onmouseover = function () {
      rowhover(delbtn);
    };

    tr.onmouseout = function () {
      rowunhover(delbtn);
    };

    tr.appendChild(deltd);

    tbody.appendChild(tr);

    //add a tr for nice and clean design
    let dummytr = document.createElement("tr");
    dummytr.classList.add("spacerrow");
    tbody.appendChild(dummytr);
  });

  table.appendChild(tbody);
  document.getElementsByClassName("accountIncome")[0].innerHTML = "";
  document.getElementsByClassName("accountIncome")[0].appendChild(table);
}

function rowhover(delbtn) {
  delbtn.style.display = "block";
}

function rowunhover(delbtn) {
  delbtn.style.display = "none";
}

function renderExpensesTable(data) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  //Header for date, usage and amount
  let headtr = document.createElement("tr");

  let amountth = document.createElement("th");
  amountth.innerText = "Amount";
  amountth.classList.add("amountcol");
  headtr.appendChild(amountth);

  let usageth = document.createElement("th");
  usageth.innerText = "Usage";
  usageth.classList.add("usagecol");
  headtr.appendChild(usageth);

  let dateth = document.createElement("th");
  dateth.innerText = "Date";
  dateth.classList.add("datecol");
  headtr.appendChild(dateth);

  let buttondummyth = document.createElement("th");
  buttondummyth.innerHTML = "";
  buttondummyth.classList.add("delcol");
  headtr.appendChild(buttondummyth);

  thead.appendChild(headtr);
  table.appendChild(thead);

  //Display every transaction in its own tr
  data.expenses.forEach((transaction) => {
    let tr = document.createElement("tr");

    let amounttd = document.createElement("td");
    amounttd.innerHTML = parseFloat(transaction.amount).toFixed(2) + " €";
    amounttd.classList.add("bdLeft");
    tr.appendChild(amounttd);

    let usagetd = document.createElement("td");
    usagetd.innerHTML = transaction.usage;
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    datetd.innerHTML = transaction.date;
    tr.appendChild(datetd);

    let deltd = document.createElement("td");
    deltd.classList.add("bdRight");
    let delbtn = document.createElement("img");
    delbtn.src = "./img/x.png";
    delbtn.height = 24;
    delbtn.classList.add("delbtn");
    delbtn.onclick = function () {
      deleteincome(transaction._id);
    };
    deltd.appendChild(delbtn);
    tr.onmouseover = function () {
      rowhover(delbtn);
    };

    tr.onmouseout = function () {
      rowunhover(delbtn);
    };

    tr.appendChild(deltd);

    tbody.appendChild(tr);

    //add a tr for nice and clean design
    let dummytr = document.createElement("tr");
    dummytr.classList.add("spacerrow");
    tbody.appendChild(dummytr);
  });

  table.appendChild(tbody);
  document.getElementsByClassName("accountExpenses")[0].innerHTML = "";
  document.getElementsByClassName("accountExpenses")[0].appendChild(table);
}

function deleteincome(id) {
  if (confirm("Do you really want to delete this transaction?")) {
    socket.emit("deleteIncome", id);
  }
}

function rendertotal(data) {
  let total = 0.0;
  data.income.forEach((transaction) => {
    total += parseFloat(transaction.amount);
  });
  data.expenses.forEach((transaction) => {
    total -= parseFloat(transaction.amount);
  });

  document.getElementsByClassName("accountTotalspan")[0].innerHTML =
    "Total: " + total.toFixed(2) + " €";
  if (total < 0) {
    document.getElementsByClassName("accountTotalspan")[0].style.color = "red";
  } else if (total == 0) {
    document.getElementsByClassName("accountTotalspan")[0].style.color =
      "black";
  } else {
    document.getElementsByClassName("accountTotalspan")[0].style.color =
      "green";
  }
}

//Onclick adding income
function addIncome() {
  renderAddOverlay("income");
}

//Onclick adding expense
function addExpense() {
  renderAddOverlay("expense");
}

//Popup closing eventlistener
Object.values(document.getElementsByClassName("addPopupWrapper")).forEach(
  (element) => {
    element.addEventListener("click", (e) => {
      if (e.target == e.currentTarget) {
        element.style.display = "none";
        removeEventListener("keyup", keyeventlistener);
      }
    });
  }
);

//Popup rendering
function renderAddOverlay(type) {
  document.getElementsByClassName("addPopupWrapper")[0].style.display = "flex";
  document.getElementsByClassName("addHead")[0].innerHTML = "Add " + type;
  if (keyeventlistener != null) {
    removeEventListener("keyup", keyeventlistener);
  }

  keyeventlistener = document.addEventListener("keyup", (e) => {
    if (e.key == "Escape") {
      closePopup();
      removeEventListener("keyup", keyeventlistener);
    }
  });
  document.getElementsByClassName("addSubmit")[0].innerHTML = "Add " + type;
  document
    .getElementsByClassName("addSubmit")[0]
    .addEventListener("click", () => {
      insertData(type);
    });
  document
    .getElementsByClassName("cancelSubmit")[0]
    .addEventListener("click", () => {
      closePopup();
    });
}

function insertData(type) {
  if (!document.getElementById("num").value) {
    alert("Enter a amount to proceed!");
    return;
  }
  let amountValue = parseFloat(document.getElementById("num").value);
  if (!document.getElementById("usage").value) {
    alert("Enter a usage to proceed!");
    return;
  }
  let usageValue = document.getElementById("usage").value;
  if (!document.getElementById("date").value) {
    alert("Enter a date to proceed!");
    return;
  }
  let dateValue = document.getElementById("date").value;
  let data = { amount: amountValue, usage: usageValue, date: dateValue };
  switch (type) {
    case "income":
      socket.emit("insertIncomeData", data);
      console.log("Sending income: ", data);
      break;
    case "expense":
      socket.emit("insertExpenseData", data);
      console.log("Sending expense: ", data);
      break;
    default:
      console.log("Error occured...");
  }
  closePopup();
}

function closePopup() {
  document.getElementsByClassName("addPopupWrapper")[0].style.display = "none";
  document.getElementById("num").value = null;
  document.getElementById("date").value = null;
  document.getElementById("usage").value = null;
}
