# OwnApp

Meine eigene App fürs iPhone: Budget, Filmabend, Fire Trainer (Minecraft-PvP) und Ziele-Challenge in einer App.
Reines HTML, CSS und JavaScript ohne Framework. Die App läuft als Claude-Artifact (Link im `README.md`).
Anleitung für Nutzer: `README.md`.

## Dateien
- `src/index.html`: Grundgerüst mit Navigation. Platzhalter `/*STYLES*/` und `/*SCRIPTS*/`.
- `src/styles.css`: Design. Hell, eine Akzentfarbe pro Modul.
- `src/core.js`: Speicher, Navigation, Hilfsfunktionen (`register(mod)`, `go(id)`, `rerender()`, `sheet()`, `toast()`).
- `src/budget.js`, `film.js`, `training.js`, `ziele.js`: je ein Modul. `src/home.js`: Startseite, startet die App.
- `build.js`: setzt alles zu `dist/ownapp.html` zusammen. Reihenfolge in `MODULES`: `core.js` zuerst, `home.js` zuletzt.
- `dist/ownapp.html`: das Build-Ergebnis. Nie von Hand ändern.

## Befehle
- Bauen: `node build.js`
- Danach `dist/ownapp.html` als neue Version des bestehenden Claude-Artifacts veröffentlichen
  (gleiches Artifact, damit Link, Icon und Daten bleiben).

## Daten (Datenbank des Artifacts)
- `data/users/<id>/budget` und `data/users/<id>/pvp`: privat.
- `movies/*`: geteilt mit allen, die die App benutzen dürfen.
- `challenge/<id>`: alle lesen, nur der Besitzer schreibt.

## Regeln
- Alles in der App ist auf Deutsch (Schweizer Schreibweise, kein ß). Beträge in CHF.
- Helles Design, kein schwarzer Hintergrund. Zuerst fürs iPhone bauen, mit dem Daumen bedienbar.
- Neues Modul: eigene Datei in `src/`, mit `register(...)` anmelden, in `MODULES` in `build.js` eintragen und
  einen Knopf in der Navigation in `src/index.html` ergänzen.
- Gespeicherte Daten dürfen bei einem Update nicht verloren gehen. Ändert sich ein Datenformat, alte Daten
  weiter lesen können.
- Private Daten (Budget, Training) nie in einen geteilten Pfad schreiben.
- Nach jeder Änderung in `src/`: `node build.js` laufen lassen und `dist/ownapp.html` mit committen.
- Das Repo ist öffentlich: keine Passwörter, keine privaten Daten und keine Namen anderer Personen in den Code.
- Code einfach und lesbar halten, kurze Kommentare auf Deutsch nur wo nötig.

## Aktueller Stand
- 2026-10-29: Trainer mit Profi-Niveau für Mace, Grundlagen ausblendbar, Medal-Link.
- Offene Punkte: hier eintragen.

## Diese Datei aktuell halten
- Am Ende jeder Session «Aktueller Stand» anpassen (was geändert wurde, was offen ist, Datum).
  Kurz halten und alte Zeilen ersetzen statt immer mehr anzuhängen.
- Ändern sich Dateien, Datenpfade oder Regeln, den passenden Abschnitt oben im gleichen Commit korrigieren.
- Eine neue Regel, die ich in einer Session nenne («immer …», «nie …»), kommt unter «Regeln».
