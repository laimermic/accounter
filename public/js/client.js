function rendertable(data) {
  var table = document.createElement("table");
  var thead = document.createElement("thead");
  // Betrag, Verwendungszweck, Datum
  var amounttd = document.createElement("th");
  amounttd.innerText = "Amount";
  thead.appendChild(amounttd);

  var usageth = document.createElement("th");
  usageth.innerText = "Usage";
  thead.appendChild(usageth);

  var dateth = document.createElement("th");
  dateth.innerText = "Date";
  thead.appendChild(dateth);

  var tbody = document.createElement("tbody");
  //Display every transaction in its own tr
  data.forEach((transaction) => {
    var tr = document.createElement("tr");

    var amounttd = document.createElement("td");
    amounttd.innerHTML = transaction.amount;
    tr.appendChild(amounttd);

    var usagetd = document.createElement("td");
    usagetd.innerHTML = transaction.usage;
    tr.appendChild(usagetd);

    var datetd = document.createElement("td");
    datetd.innerHTML = transaction.date;
    tr.appendChild(datetd);
  });
}

const socket = io();
socket.on("connect", () =>
  socket.emit("hello", `Hi there! I am ${window.navigator.userAgent}`)
);
