function renderIncomeTable(data) {
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
  data.income.forEach((transaction) => {
    let tr = document.createElement("tr");

    let amounttd = document.createElement("td");
    amounttd.innerHTML = transaction.amount;
    tr.appendChild(amounttd);

    let usagetd = document.createElement("td");
    usagetd.innerHTML = transaction.usage;
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    datetd.innerHTML = transaction.date;
    tr.appendChild(datetd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  document.getElementsByClassName("accountIncome")[0].appendChild(table);
}

function renderExpensesTable(data) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  //Header for date, usage and amount
  let dateth = document.createElement("th");
  dateth.innerText = "Date";
  thead.appendChild(dateth);

  let usageth = document.createElement("th");
  usageth.innerText = "Usage";
  thead.appendChild(usageth);

  let amounttd = document.createElement("th");
  amounttd.innerText = "Amount";
  thead.appendChild(amounttd);

  //Display every transaction in its own tr
  data.expenses.forEach((transaction) => {
    let tr = document.createElement("tr");

    let amounttd = document.createElement("td");
    amounttd.innerHTML = transaction.amount;
    tr.appendChild(amounttd);

    let usagetd = document.createElement("td");
    usagetd.innerHTML = transaction.usage;
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    datetd.innerHTML = transaction.date;
    tr.appendChild(datetd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
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
    "Total: " + total;
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

const socket = io();
socket.on("connect", () => {
  socket.emit("queryData", "I hätt gern die Daten");
  socket.on("");
});

let testTable = {
  income: [{ amount: 48, usage: "Food", date: "18.1.2022" }],
  expenses: [{ amount: 28, usage: "Dog", date: "19.2.2022" }],
};

renderIncomeTable(testTable);
renderExpensesTable(testTable);
rendertotal(testTable);
