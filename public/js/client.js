/*
Global Variables
*/

let keyeventlistener = null;
let clickoutsideevent = null;
let entereventlistener = null;
/*
Realtime Communication connection
*/

console.log("Connecting to AccounterServices...");
const socket = io();
socket.on("connect", () => {
  document.getElementById("statusText").innerHTML =
    "Retrieving transactions...";
  console.log("Connected!");
  console.log("Requesting Data...");
  socket.emit("queryData");
  socket.on("receiveData", (result) => {
    document.getElementsByClassName("loadingwrapper")[0].style.display = "none";
    console.log("Data Received!");
    renderIncomeTable(result);
    renderExpensesTable(result);
    rendertotal(result);
  });
  socket.on("responseMsg", (data) => {
    setStatus(data);
  });
});
function setStatus(data) {
  document.getElementById("statusAlertWrapper").removeAttribute("class");
  document.getElementById("statusAlerticns").removeAttribute("class");
  document.getElementById("statusAlertText").removeAttribute("class");
  document.getElementById("warning_icn").style.display = "none";
  document.getElementById("success-icn").style.display = "none";
  document
    .getElementsByClassName("statusAlert")[0]
    .classList.remove("animated");
  if (data.status) {
    document.getElementById("statusAlerticns").classList.add("icn_suc");
    document.getElementById("statusAlertWrapper").classList.add("status_suc");
    document
      .getElementById("statusAlertText")
      .classList.add("statusAlertText_suc");
    document.getElementById("success-icn").style.display = "block";
    document.getElementsByClassName("statusAlert")[0].style.backgroundColor =
      "green";
    document.getElementsByClassName("statusAlert")[0].style.borderColor =
      "green";
  } else {
    document.getElementById("statusAlerticns").classList.add("icn_warn");
    document.getElementById("statusAlertWrapper").classList.add("status_warn");
    document
      .getElementById("statusAlertText")
      .classList.add("statusAlertText_warn");
    document.getElementById("warning_icn").style.display = "block";
    document.getElementsByClassName("statusAlert")[0].style.backgroundColor =
      "orange";
    document.getElementsByClassName("statusAlert")[0].style.borderColor =
      "orange";
  }
  document.getElementById("alertText").innerHTML = data.msg;
  document.getElementsByClassName("statusAlert")[0].style.display = "block";
  document.getElementsByClassName("statusAlert")[0].classList.add("animated");
  setTimeout(() => {
    document.getElementsByClassName("statusAlert")[0].style.display = "none";
  }, 5000);
}
socket.on("disconnect", () => {
  console.log("Connection lost!");
  setStatus({ status: false, msg: "Connection lost!" });
  document.getElementById("statusText").innerHTML =
    "Reconnecting to AccounterServices...";
  document.getElementsByClassName("loadingwrapper")[0].style.display = "grid";
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
    tr.classList.add("dataRow");

    let amounttd = document.createElement("td");
    let amountinput = document.createElement("input");
    let amountspan = document.createElement("span");
    amountinput.type = "text";
    amountinput.classList.add("editinput");
    amountinput.min = 0;
    amountinput.name = "usage";
    amountinput.value = parseFloat(transaction.amount).toFixed(2);
    amountinput.step = 0.01;
    amountinput.style.display = "none";
    amountspan.innerHTML = parseFloat(transaction.amount).toFixed(2) + " €";
    amountspan.classList.add("showspan");
    amounttd.appendChild(amountinput);
    amounttd.appendChild(amountspan);
    amounttd.ondblclick = function () {
      editincometd(this, "amount", transaction);
    };
    amounttd.classList.add("bdLeft");
    tr.appendChild(amounttd);

    let usagetd = document.createElement("td");
    let usageinput = document.createElement("input");
    let usagespan = document.createElement("span");
    usageinput.type = "text";
    usageinput.classList.add("editinput");
    usageinput.name = "usage";
    usageinput.value = transaction.usage;
    usageinput.style.display = "none";
    usagespan.innerHTML = transaction.usage;
    usagespan.classList.add("showspan");
    usagetd.appendChild(usageinput);
    usagetd.appendChild(usagespan);
    usagetd.ondblclick = function () {
      editincometd(this, "usage", transaction);
    };
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    let dateinput = document.createElement("input");
    let datespan = document.createElement("span");
    dateinput.type = "date";
    dateinput.classList.add("editinput");
    dateinput.name = "date";
    dateinput.value = transaction.date;
    dateinput.style.display = "none";
    //let date = new Date(transaction.date);
    dateinput.value = transaction.date;
    datespan.innerHTML = transaction.date;
    datespan.classList.add("showspan");
    datetd.appendChild(dateinput);
    datetd.appendChild(datespan);
    datetd.ondblclick = function () {
      editincometd(this, "date", transaction);
    };
    tr.appendChild(datetd);

    let deltd = document.createElement("td");
    deltd.classList.add("bdRight");
    let delbtn = document.createElement("img");
    delbtn.src = "./img/xmark.svg";
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
    tr.classList.add("dataRow");

    let amounttd = document.createElement("td");
    let amountinput = document.createElement("input");
    let amountspan = document.createElement("span");
    amountinput.type = "text";
    amountinput.classList.add("editinput");
    amountinput.min = 0;
    amountinput.name = "usage";
    amountinput.value = parseFloat(transaction.amount).toFixed(2);
    amountinput.step = 0.01;
    amountinput.style.display = "none";
    amountspan.innerHTML = parseFloat(transaction.amount).toFixed(2) + " €";
    amountspan.classList.add("showspan");
    amounttd.appendChild(amountinput);
    amounttd.appendChild(amountspan);
    amounttd.ondblclick = function () {
      editexpensetd(this, "amount", transaction);
    };
    amounttd.classList.add("bdLeft");
    tr.appendChild(amounttd);

    let usagetd = document.createElement("td");
    let usageinput = document.createElement("input");
    let usagespan = document.createElement("span");
    usageinput.type = "text";
    usageinput.classList.add("editinput");
    usageinput.name = "usage";
    usageinput.value = transaction.usage;
    usageinput.style.display = "none";
    usagespan.innerHTML = transaction.usage;
    usagespan.classList.add("showspan");
    usagetd.appendChild(usageinput);
    usagetd.appendChild(usagespan);
    usagetd.ondblclick = function () {
      editexpensetd(this, "usage", transaction);
    };
    tr.appendChild(usagetd);

    let datetd = document.createElement("td");
    let dateinput = document.createElement("input");
    let datespan = document.createElement("span");
    dateinput.type = "date";
    dateinput.classList.add("editinput");
    dateinput.name = "date";
    dateinput.value = transaction.date;
    dateinput.style.display = "none";
    //let date = new Date(transaction.date);
    dateinput.value = transaction.date;
    datespan.innerHTML = transaction.date;
    datespan.classList.add("showspan");
    datetd.appendChild(dateinput);
    datetd.appendChild(datespan);
    datetd.ondblclick = function () {
      editexpensetd(this, "date", transaction);
    };
    tr.appendChild(datetd);

    let deltd = document.createElement("td");
    deltd.classList.add("bdRight");
    let delbtn = document.createElement("img");
    delbtn.src = "./img/xmark.svg";
    delbtn.classList.add("delbtn");
    delbtn.onclick = function () {
      deleteExpense(transaction._id);
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

function editexpensetd(td, column, transaction) {
  td.getElementsByClassName("editinput")[0].style.display = "block";
  td.getElementsByClassName("editinput")[0].focus();
  td.getElementsByClassName("showspan")[0].style.display = "none";
  clickoutsideevent = document.body.addEventListener("click", (e) => {
    if (!td.contains(e.target)) {
      finishexpenseedit(td, column, transaction);
      clickoutsideevent = null;
    }
  });

  entereventlistener = document.body.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
      finishexpenseedit(td, column, transaction);
    }
  });

  keyeventlistener = document.body.addEventListener("keyup", (e) => {
    if (e.key == "Escape") {
      td.getElementsByClassName("editinput")[0].style.display = "none";
      td.getElementsByClassName("showspan")[0].style.display = "block";
      removeEventListener("keyup", keyeventlistener);
    }
  });
}

function editincometd(td, column, transaction) {
  td.getElementsByClassName("editinput")[0].style.display = "block";
  td.getElementsByClassName("editinput")[0].focus();
  td.getElementsByClassName("showspan")[0].style.display = "none";
  clickoutsideevent = document.body.addEventListener("click", (e) => {
    if (!td.contains(e.target)) {
      finishincomeedit(td, column, transaction);
    }
  });

  entereventlistener = document.body.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
      finishincomeedit(td, column, transaction);
    }
  });
  keyeventlistener = document.body.addEventListener("keyup", (e) => {
    if (e.key == "Escape") {
      td.getElementsByClassName("editinput")[0].style.display = "none";
      td.getElementsByClassName("showspan")[0].style.display = "block";
      removeEventListener("keyup", keyeventlistener);
    }
  });
}

function finishexpenseedit(td, column, transaction) {
  td.getElementsByClassName("editinput")[0].style.display = "none";
  td.getElementsByClassName("showspan")[0].style.display = "block";
  keyeventlistener = null;
  clickoutsideevent = null;
  let newval = td.getElementsByClassName("editinput")[0].value;
  if (newval != transaction[column]) {
    transaction[column] = newval;
    console.log("sending updated transaction:");
    console.log(transaction);
    socket.emit("editExpense", transaction);
  } else {
    console.log("not sending transaction. value not updated");
  }
  document
    .getElementsByClassName("accountWrapper")[0]
    .replaceWith(
      document.getElementsByClassName("accountWrapper").cloneNode(true)
    );
  //document.body.replaceWith(document.body.cloneNode(true));
  socket.emit("queryData");
}

function finishincomeedit(td, column, transaction) {
  td.getElementsByClassName("editinput")[0].style.display = "none";
  td.getElementsByClassName("showspan")[0].style.display = "block";
  keyeventlistener = null;
  clickoutsideevent = null;
  let newval = td.getElementsByClassName("editinput")[0].value;
  if (newval != transaction[column]) {
    transaction[column] = newval;
    console.log("sending updated transaction:");
    console.log(transaction);
    socket.emit("editIncome", transaction);
  } else {
    console.log("not sending transaction. value not updated");
  }
  document
    .getElementsByClassName("accountWrapper")[0]
    .replaceWith(
      document.getElementsByClassName("accountWrapper").cloneNode(true)
    );
  socket.emit("queryData");
}

function deleteincome(id) {
  if (confirm("Do you really want to delete this transaction?")) {
    socket.emit("deleteIncome", id);
  }
}

function deleteExpense(id) {
  if (confirm("Do you really want to delete this transaction?")) {
    socket.emit("deleteExpense", id);
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

//Popup rendering
function renderAddOverlay(type) {
  document
    .getElementsByClassName("addPopupWrapper")[0]
    .addEventListener("click", closePopupOutside, true);
  document.getElementsByClassName("addPopupWrapper")[0].style.display = "flex";
  document.getElementsByClassName("addHead")[0].innerHTML = "Add " + type;
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);
  if (keyeventlistener != null) {
    removeEventListener("keyup", keyeventlistener, true);
  }

  keyeventlistener = document.addEventListener("keyup", (e) => {
    if (e.key == "Escape") {
      closePopup();
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
    .addEventListener("click", closePopup, true);
}

function insertData(type) {
  if (document.getElementById("num").value == NaN) {
    alert("Enter a amount to proceed!");
    return;
  }
  let amountValue = parseFloat(document.getElementById("num").value);
  if (document.getElementById("usage").value == "") {
    alert("Enter a usage to proceed!");
    return;
  }
  let usageValue = document.getElementById("usage").value;
  if (document.getElementById("date").value == "") {
    alert("Enter a date to proceed!");
    return;
  }
  let dateValue = document.getElementById("date").value;
  let data = { amount: amountValue, usage: usageValue, date: dateValue };
  console.log(data);
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
  socket.emit("queryData");
  closePopup();
}

function closePopup() {
  let e = document.getElementsByClassName("addPopupWrapper")[0];
  e.style.display = "none";
  e.removeEventListener("click", closePopup, true);
  e.removeEventListener("keyup", keyeventlistener, true);
  document
    .getElementsByClassName("cancelSubmit")[0]
    .removeEventListener("click", closePopup, true);
  document.getElementById("num").value = null;
  document.getElementById("date").value = null;
  document.getElementById("usage").value = null;
}

//Tap out of popup
function closePopupOutside(evt) {
  let e = document.getElementsByClassName("addPopupWrapper")[0];
  if (evt.target != e) {
    return;
  }
  e.style.display = "none";
  e.removeEventListener("click", closePopupOutside, true);
}
