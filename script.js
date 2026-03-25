const API = "http://localhost:8000";
 
async function lagreNotat() {
  const tittelInput = document.getElementById("tittel");
  const innholdInput = document.getElementById("innhold");
  const tittel = tittelInput.value.trim();
  const innhold = innholdInput.value.trim();
 
  if (!tittel || !innhold) {
    alert("Fyll inn både tittel og innhold.");
    return;
  }
 
  await fetch(API + "/notater", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tittel, innhold })
  });
 
  tittelInput.value = "";
  innholdInput.value = "";
  hentNotater();
}
 
function leggTilOppgave() {
  const oppgaveContainer = document.getElementById("oppgaver");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = '<input placeholder="Oppgave"><button type="button" onclick="fjernOppgave(this)">✕</button><br>';
  oppgaveContainer.appendChild(wrapper);
}
 
function fjernOppgave(knapp) {
  knapp.parentElement.remove();
}
 
async function lagreTodo() {
  const todoTittelInput = document.getElementById("todoTittel");
  const todoTittel = todoTittelInput.value.trim();
 
  if (!todoTittel) {
    alert("Fyll inn tittel på todo-listen.");
    return;
  }
 
  const oppgaveInputs = document.querySelectorAll("#oppgaver input");
  let oppgaveListe = [];
 
  oppgaveInputs.forEach(input => {
    if (input.value.trim()) {
      oppgaveListe.push({ tekst: input.value.trim(), fullfort: false });
    }
  });
 
  if (oppgaveListe.length === 0) {
    alert("Legg til minst én oppgave.");
    return;
  }
 
  await fetch(API + "/todolister", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tittel: todoTittel, oppgaver: oppgaveListe })
  });
 
  todoTittelInput.value = "";
  document.getElementById("oppgaver").innerHTML = '<input placeholder="Oppgave"><br>';
  hentTodolister();
}
 
async function hentNotater() {
  const response = await fetch(API + "/notater");
  const notater = await response.json();
 
  const output = document.getElementById("output");
 
  if (notater.length === 0) {
    output.innerHTML = "<p><em>Ingen notater lagret ennå.</em></p>";
    return;
  }
 
  let visning = "<h3>Notater</h3>";
 
  notater.forEach((notat, i) => {
    visning += `
      <div class="kort">
        <strong>${notat.tittel}</strong>
        <p>${notat.innhold}</p>
        <button onclick="endreNotat(${i})">✏️ Endre</button>
        <button onclick="slettNotat(${i})">🗑️ Slett</button>
      </div>
    `;
  });
 
  output.innerHTML = visning;
}
 
async function hentTodolister() {
  const response = await fetch(API + "/todolister");
  const todolister = await response.json();
 
  const output = document.getElementById("output");
 
  if (todolister.length === 0) {
    output.innerHTML = "<p><em>Ingen todo-lister lagret ennå.</em></p>";
    return;
  }
 
  let visning = "<h3>Todo-lister</h3>";
 
  todolister.forEach((liste, i) => {
    visning += `
      <div class="kort">
        <strong>${liste.tittel}</strong>
        <ul>
    `;
 
    liste.oppgaver.forEach((oppgave, j) => {
      const fullfort = oppgave.fullfort ? "line-through" : "none";
      visning += `
        <li style="text-decoration:${fullfort}">
          <input type="checkbox" ${oppgave.fullfort ? "checked" : ""}
            onchange="toggleOppgave(${i}, ${j}, this.checked)">
          ${oppgave.tekst}
        </li>
      `;
    });
 
    visning += `
        </ul>
        <button onclick="endreTodo(${i})">✏️ Endre tittel</button>
        <button onclick="slettTodo(${i})">🗑️ Slett</button>
      </div>
    `;
  });
 
  output.innerHTML = visning;
}
 
async function slettNotat(i) {
  if (!confirm("Vil du slette dette notatet?")) return;
  await fetch(`${API}/notater/${i}`, { method: "DELETE" });
  hentNotater();
}
 
async function endreNotat(i) {
  const tittel = prompt("Ny tittel:");
  if (tittel === null) return;
  const innhold = prompt("Nytt innhold:");
  if (innhold === null) return;
 
  await fetch(`${API}/notater/${i}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tittel, innhold })
  });
  hentNotater();
}
 
async function slettTodo(i) {
  if (!confirm("Vil du slette denne todo-listen?")) return;
  await fetch(`${API}/todolister/${i}`, { method: "DELETE" });
  hentTodolister();
}
 
async function endreTodo(i) {
  const tittel = prompt("Ny tittel:");
  if (tittel === null) return;
 
  await fetch(`${API}/todolister/${i}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tittel })
  });
  hentTodolister();
}
 
async function toggleOppgave(listeIndex, oppgaveIndex, fullfort) {
  const response = await fetch(API + "/todolister");
  const todolister = await response.json();
 
  const liste = todolister[listeIndex];
  liste.oppgaver[oppgaveIndex].fullfort = fullfort;
 
  await fetch(`${API}/todolister/${listeIndex}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oppgaver: liste.oppgaver })
  });
 
  hentTodolister();
}