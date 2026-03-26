const API = "http://192.168.20.79:8000";

async function lagreNotat() {
  const tittel = document.getElementById("tittel").value;
  const innhold = document.getElementById("innhold").value;

  await fetch(API + "/notater", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ tittel: tittel, innhold: innhold })
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
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ tittel: todoTittel, oppgaver: oppgaveListe })
  });
}

async function hentNotater() {
  const response = await fetch(API + "/notater");
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
  const response = await fetch(API + "/todolister");
  const todolister = await response.json();
  
  let visning = "";

  todolister.forEach((liste, i) => {
    visning += `<p>${liste.tittel}
<button onclick="slettTodo(${i})">Slett</button>
<button onclick="endreTodo(${i})">Endre</button><br>`;

    liste.oppgaver.forEach((oppgave, j) => {
      visning += `<input type="checkbox" ${oppgave.fullfort ? "checked" : ""} onchange="toggleOppgave(${i}, ${j}, this.checked)">
      <span style="text-decoration:${oppgave.fullfort ? "line-through" : "none"}">${oppgave.tekst}</span><br>`;
    });

    visning += "</p>";
  });

  document.getElementById("output").innerHTML = visning;
}

async function toggleOppgave(listeIndex, oppgaveIndex, fullfort) {
  const response = await fetch(API + "/todolister");
  const todolister = await response.json();

  todolister[listeIndex].oppgaver[oppgaveIndex].fullfort = fullfort;

  await fetch(`${API}/todolister/${listeIndex}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oppgaver: todolister[listeIndex].oppgaver })
  });

  hentTodolister();
}

async function slettNotat(i) {
  await fetch(`${API}/notater/${i}`, { method: "DELETE" });
  hentNotater();
}

async function endreNotat(i) {
  const tittel = prompt("Ny tittel:");
  const innhold = prompt("Nytt innhold:");
  await fetch(`${API}/notater/${i}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tittel, innhold })
  });
  hentNotater();
}

async function slettTodo(i) {
  await fetch(`${API}/todolister/${i}`, { method: "DELETE" });
  hentTodolister();
}

async function endreTodo(i) {
  const tittel = prompt("Ny tittel:");
  await fetch(`${API}/todolister/${i}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tittel })
  });
  hentTodolister();
}