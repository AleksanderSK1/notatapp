Notatapp

Dette prosjektet er en enkel notatapp laget med HTML, CSS og JavaScript. Den lar deg lagre både vanlige notater og todo-lister direkte i nettleseren.
Applikasjonen bruker en backend laget med Python og FastAPI. Når du lagrer eller henter data, sendes forespørsler fra nettsiden til serveren, som igjen lagrer alt i en lokal JSON-fil. Dette fungerer som en enkel database.
For sikkerhet bruker appen en API-nøkkel, slik at kun riktige forespørsler får tilgang til dataene. I tillegg er det lagt til innlogging med brukernavn og passord.
For deg som bruker, kan du skrive inn et notat eller lage en todo-liste, og deretter lagre det. Når du trykker på vis-knappene, hentes det du har lagret og vises på siden. Du kan også endre eller slette det som allerede er lagret.

Krav
Python 3
pip

Hvordan kjøre prosjektet:

Installer først nødvendige pakker:

python3 -m pip install fastapi uvicorn

Start deretter serveren:

python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload

Åpne nettleseren og gå til: http://192.168.20.79:8000
