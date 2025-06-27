const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Statische Dateien bereitstellen (HTML, CSS, JS)

// Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database('spiele.db', (err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
  } else {
    console.log('Verbindung zur SQLite-Datenbank hergestellt.');
  }
});

// Route für die Startseite
app.get('/', (req, res) => {
  res.send('Willkommen auf der Spiele-API!');
});

// Endpunkt: Spiele abrufen
app.get('/spiele', (req, res) => {
  db.all('SELECT * FROM spiele', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Fehler beim Abrufen der Spiele' });
    } else {
      res.json(rows);
    }
  });
});

// Endpunkt: Spiel hinzufügen
app.post('/speichern', (req, res) => {
  const { titel, genre, modus, plattform } = req.body;

  if (!titel || !genre || !modus || !plattform) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  db.run(
    'INSERT INTO spiele (titel, genre, modus, plattform) VALUES (?, ?, ?, ?)',
    [titel, genre, modus, plattform],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Fehler beim Speichern des Spiels' });
      } else {
        res.json({ message: 'Spiel erfolgreich gespeichert', id: this.lastID });
      }
    }
  );
});

// Endpunkt: Spiel zur Merkliste hinzufügen
app.post('/merkliste-hinzufuegen', (req, res) => {
  const { titel, genre, modus, plattform } = req.body;

  if (!titel || !genre || !modus || !plattform) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  db.run(
    'INSERT INTO merkliste (titel, genre, modus, plattform) VALUES (?, ?, ?, ?)',
    [titel, genre, modus, plattform],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Fehler beim Hinzufügen zur Merkliste' });
      } else {
        res.json({ message: 'Spiel erfolgreich zur Merkliste hinzugefügt', id: this.lastID });
      }
    }
  );
});

// Endpunkt: Merkliste abrufen
app.get('/merkliste', (req, res) => {
  db.all('SELECT * FROM merkliste', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Fehler beim Abrufen der Merkliste' });
    } else {
      res.json(rows);
    }
  });
});

// Endpunkt: Spiel aus der Merkliste entfernen
app.delete('/merkliste-loeschen/:titel', (req, res) => {
  const { titel } = req.params;

  db.run('DELETE FROM merkliste WHERE titel = ?', [titel], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Fehler beim Entfernen des Spiels aus der Merkliste' });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Spiel nicht in der Merkliste gefunden' });
    } else {
      res.json({ message: 'Spiel erfolgreich aus der Merkliste entfernt' });
    }
  });
});

// Endpunkt: Spiel löschen
app.delete('/spiel-loeschen/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM spiele WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Fehler beim Löschen des Spiels' });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Spiel nicht gefunden' });
    } else {
      res.json({ message: 'Spiel erfolgreich gelöscht' });
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});