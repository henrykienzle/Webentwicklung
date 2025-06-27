const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('spiele.db');

db.serialize(() => {
  console.log('Datenbank wird initialisiert...');

  // Tabelle erstellen, falls sie nicht existiert
  db.run(`
    CREATE TABLE IF NOT EXISTS spiele (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titel TEXT NOT NULL,
      genre TEXT,
      modus TEXT,
      plattform TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Fehler beim Erstellen der Tabelle:', err.message);
    } else {
      console.log('Tabelle "spiele" wurde erstellt.');
    }
  });

  // Beispiel-Daten einfügen
  const beispielDaten = [
    { titel: 'God of War', genre: 'action', modus: 'singleplayer', plattform: 'pc' },
    { titel: 'Apex Legends', genre: 'action', modus: 'multiplayer', plattform: 'pc' },
    { titel: 'The Witcher 3', genre: 'adventure', modus: 'singleplayer', plattform: 'pc' },
    { titel: 'Sea of Thieves', genre: 'adventure', modus: 'multiplayer', plattform: 'pc' }
  ];

  const stmt = db.prepare('INSERT INTO spiele (titel, genre, modus, plattform) VALUES (?, ?, ?, ?)');
  beispielDaten.forEach((spiel) => {
    stmt.run(spiel.titel, spiel.genre, spiel.modus, spiel.plattform, (err) => {
      if (err) {
        console.error('Fehler beim Einfügen von Daten:', err.message);
      }
    });
  });

  // Zusätzliche Spiele aus der gameDatabase einfügen
  const gameDatabase = {
    action: {
      singleplayer: { pc: "God of War", ps5: "Spider-Man: Miles Morales", xbox: "Halo Infinite" },
      multiplayer: { pc: "Apex Legends", ps5: "CoD: Modern Warfare II", xbox: "Fortnite" }
    },
    adventure: {
      singleplayer: { pc: "The Witcher 3", ps5: "Horizon Forbidden West", xbox: "AC Valhalla" },
      multiplayer: { pc: "Sea of Thieves", ps5: "It Takes Two", xbox: "Minecraft" }
    },
    shooter: {
      singleplayer: { pc: "DOOM Eternal", ps5: "Ratchet & Clank", xbox: "Gears 5" },
      multiplayer: { pc: "CS:GO", ps5: "Battlefield V", xbox: "Warzone" }
    },
    simulation: {
      singleplayer: { pc: "The Sims 4", ps5: "Planet Coaster", xbox: "Flight Simulator" },
      multiplayer: { pc: "SimCity", ps5: "No Man's Sky", xbox: "ARK: Survival Evolved" }
    },
    strategy: {
      singleplayer: { pc: "Civilization VI", ps5: "XCOM 2", xbox: "Halo Wars" },
      multiplayer: { pc: "StarCraft II", ps5: "Total War", xbox: "C&C Remastered" }
    },
    sports: {
      singleplayer: { pc: "FIFA 22", ps5: "NBA 2K21", xbox: "Madden NFL 21" },
      multiplayer: { pc: "Rocket League", ps5: "WWE 2K", xbox: "PGA Tour 2K21" }
    }
  };

  for (const genre in gameDatabase) {
    for (const modus in gameDatabase[genre]) {
      for (const plattform in gameDatabase[genre][modus]) {
        const titel = gameDatabase[genre][modus][plattform];
        stmt.run(titel, genre, modus, plattform, (err) => {
          if (err) {
            console.error('Fehler beim Einfügen von Daten:', err.message);
          }
        });
      }
    }
  }

  stmt.finalize();
  console.log('Alle Spiele wurden eingefügt.');
});

db.close(() => {
  console.log('Datenbank geschlossen.');
});