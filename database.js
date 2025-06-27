const sqlite3 = require('sqlite3').verbose(); // Das SQLite3-Modul wird eingebunden, 'verbose()' aktiviert ausführlichere Fehlermeldungen

// Verbindung zur Datenbank herstellen
const db = new sqlite3.Database('./spiele.db', (err) => { // Erstellt (oder öffnet) eine SQLite-Datenbankdatei namens 'spiele.db'
  if (err) {                                               // Wenn ein Fehler beim Öffnen/Aufbauen der Verbindung auftritt ...
    console.error('Fehler beim Verbinden zur Datenbank:', err.message); // ... wird eine Fehlermeldung ausgegeben
  } else {                                                 // Wenn keine Fehler auftreten ...
    console.log('Erfolgreich mit der SQLite-Datenbank verbunden.'); // ... wird eine Erfolgsmeldung ausgegeben
  }
});

module.exports = db; // Exportiert das Datenbankobjekt, damit es in anderen Dateien (z. B. server.js) verwendet werden kann
