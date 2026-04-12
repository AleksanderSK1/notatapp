const API = "http://192.168.20.79:8000";
const API_KEY = "notatapp-api";

let TOKEN = ""

async function login() {
  const brukernavn = document.getElementById("brukernavn").value;
  const passord = document.getElementById("passord").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brukernavn, passord })
  });

  const data = await res.json();
  TOKEN = data.token;
}

async function lagreNotat() {
  const tittel = document.getElementById("tittel").value;
  const innhold = document.getElementById("innhold").value;

  await fetch(API + "/notater", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-token": TOKEN
    },
    body: JSON.stringify({ tittel, innhold })
  });
}

function leggTilOppgave() {
  const oppgaveContainer = document.getElementById("oppgaver");
  const div = document.createElement("div");
  div.innerHTML = '<input placeholder="Oppgave"><br>';
  oppgaveContainer.appendChild(div);
}

async function lagreTodo() {
  const todoTittel = document.getElementById("todoTittel").value;
  const oppgaveInputs = document.querySelectorAll("#oppgaver input");

  let oppgaveListe = [];

  oppgaveInputs.forEach(input => {
    oppgaveListe.push({ tekst: input.value, fullfort: false });
  });

  await fetch(API + "/todolister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-token": TOKEN
    },
    body: JSON.stringify({ tittel: todoTittel, oppgaver: oppgaveListe })
  });
}

async function hentNotater() {
  const response = await fetch(API + "/notater", {
    headers: {
      "x-api-key": API_KEY,
      "x-token": TOKEN
    }
  });

  const notater = await response.json();

  let visning = "";

  notater.forEach((notat, i) => {
    visning += `<p>${notat.tittel}: ${notat.innhold}
    <button onclick="slettNotat(${i})">Slett</button>
    <button onclick="endreNotat(${i})">Endre</button>
    </p>`;
  });

  document.getElementById("output").innerHTML = visning;
}

async function hentTodolister() {
  const response = await fetch(API + "/todolister", {
    headers: {
      "x-api-key": API_KEY,
      "x-token": TOKEN
    }
  });

  const todolister = await response.json();

  let visning = "";

  todolister.forEach((liste, i) => {
    visning += `<p>${liste.tittel}
<button onclick="slettTodo(${i})">Slett</button>
<button onclick="endreTodo(${i})">Endre</button><br>`;

    liste.oppgaver.forEach((oppgave, j) => {
      visning += `<input type="checkbox" ${oppgave.fullfort ? "checked" : ""}>
      <span style="text-decoration:${oppgave.fullfort ? "line-through" : "none"}">${oppgave.tekst}</span><br>`;
    });

    visning += "</p>";
  });

  document.getElementById("output").innerHTML = visning;
}

async function slettNotat(i) {
  await fetch(`${API}/notater/${i}`, {
    method: "DELETE",
    headers: {
      "x-api-key": API_KEY,
      "x-token": TOKEN
    }
  });

  hentNotater();
}

async function endreNotat(i) {
  const tittel = prompt("Ny tittel:");
  const innhold = prompt("Nytt innhold:");

  await fetch(`${API}/notater/${i}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-token": TOKEN
    },
    body: JSON.stringify({ tittel, innhold })
  });

  hentNotater();
}

async function slettTodo(i) {
  await fetch(`${API}/todolister/${i}`, {
    method: "DELETE",
    headers: {
      "x-api-key": API_KEY,
      "x-token": TOKEN
    }
  });

  hentTodolister();
}

async function endreTodo(i) {
  const tittel = prompt("Ny tittel:");

  await fetch(`${API}/todolister/${i}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-token": TOKEN
    },
    body: JSON.stringify({ tittel })
  });

  hentTodolister();
}