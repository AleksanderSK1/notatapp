const API = "http://localhost:8000";

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
  oppgaveContainer.innerHTML += '<input placeholder="Oppgave"><br>';
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

  notater.forEach(notat => {
    visning += "<p>" + notat.tittel + ": " + notat.innhold + "</p>";
  });

  document.getElementById("output").innerHTML = visning;
}

async function hentTodolister() {
  const response = await fetch(API + "/todolister");
  const todolister = await response.json();

  let visning = "";

  todolister.forEach(liste => {
    visning += "<p>" + liste.tittel + "<br>";

    liste.oppgaver.forEach(oppgave => {
      visning += "- " + oppgave.tekst + "<br>";
    });

    visning += "</p>";
  });

  document.getElementById("output").innerHTML = visning;
}