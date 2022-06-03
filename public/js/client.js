function renderTable(data) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  // Betrag, Verwendungszweck, Datum
  let amounttd = document.createElement("th");
  amounttd.innerText = "Amount";
  thead.appendChild(amounttd);

  let usageth = document.createElement("th");
  usageth.innerText = "Usage";
  thead.appendChild(usageth);

  let dateth = document.createElement("th");
  dateth.innerText = "Date";
  thead.appendChild(dateth);

  let tbody = document.createElement("tbody");
  //Display every transaction in its own tr
  data.forEach((transaction) => {
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
}

const socket = io();
socket.on("connect", () =>
  socket.emit("hello", `Hi there! I am ${window.navigator.userAgent}`)
);

let testTable = [
  { amount: 48, usage: "Essen", date: "18.1.2022" },
  { amount: 28, usage: "Hund", date: "19.2.2022" },
];

renderTable(testTable);
