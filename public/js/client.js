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
    amounttd.innerHTML = transaction.amount.toFixed(2) + " €";
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
    delbtn.src = "./img/x.jpg";
    delbtn.classList.add("delbtn");
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
  console.log("left!");
}

function renderExpensesTable(data) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  //Header for date, usage and amount
  let headtr = document.createElement("tr");

  let amountth = document.createElement("th");
  amountth.innerText = "Amount";
  headtr.appendChild(amountth);

  let usageth = document.createElement("th");
  usageth.innerText = "Usage";
  headtr.appendChild(usageth);

  let dateth = document.createElement("th");
  dateth.innerText = "Date";
  headtr.appendChild(dateth);

  thead.appendChild(headtr);
  table.appendChild(thead);

  //Display every transaction in its own tr
  data.expenses.forEach((transaction) => {
    let tr = document.createElement("tr");

    let amounttd = document.createElement("td");
    amounttd.innerHTML = transaction.amount.toFixed(2) + " €";
    amounttd.classList.add("bdLeft");
    tr.appendChild(amounttd.toFixed(2));

    let usagetd = document.createElement("td");
    usagetd.innerHTML = transaction.usage;
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    datetd.innerHTML = transaction.date;
    datetd.classList.add("bdRight");
    tr.appendChild(datetd);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  document.getElementsByClassName("accountExpenses")[0].innerHTML = "";
  document.getElementsByClassName("accountExpenses")[0].appendChild(table);
}

function rendertotal(data) {
  let total = 0;
  data.income.forEach((transaction) => {
    total += transaction.amount;
  });
  data.expenses.forEach((transaction) => {
    total -= transaction.amount;
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

function addIncome() {
  renderAddOverlay("income");
}

function addExpense() {
  renderAddOverlay("expense");
}

Object.values(document.getElementsByClassName("addPopupWrapper")).forEach(
  (element) => {
    element.addEventListener("click", (e) => {
      if (e.target == e.currentTarget) {
        element.style.display = "none";
      }
    });
  }
);

function renderAddOverlay(type) {
  document.getElementsByClassName("addPopupWrapper")[0].style.display = "flex";
  document.getElementsByClassName("addHead")[0].innerHTML = "Add " + type;
}

console.log("Connecting to AccounterServices...");
const socket = io();
socket.on("connect", () => {
  socket.emit("queryData");
  socket.on("receiveData", (result) => {
    console.log(result);
    renderIncomeTable(result);
    renderExpensesTable(result);
    rendertotal(result);
  });
});
