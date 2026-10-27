# OwnApp

Tinos eigene App fürs iPhone: **Budget**, **Filmabend**, **Fire Trainer** (Minecraft-PvP) und die **Ziele-Challenge** in einer App.

Die App läuft als Claude-Artifact: https://claude.ai/artifact/SWN4wiTu6fisrx8AmRhLJf
(Der Link funktioniert nur für dich und für Leute, mit denen du die App teilst.)

---

## Anleitung: So bringst du die App aufs iPhone

### 1. Einmalig: In Safari bei Claude anmelden
1. Öffne **Safari** auf dem iPhone, nicht die Claude-App und nicht Chrome.
2. Geh auf **claude.ai** und melde dich mit deinem Claude-Konto an.

### 2. App öffnen und aufs Homescreen legen
1. Öffne in Safari den App-Link (oben).
2. Tippe unten auf das **Teilen-Symbol** (Quadrat mit Pfeil nach oben).
3. Scroll runter und tippe auf **«Zum Home-Bildschirm»**.
4. Gib als Namen **OwnApp** ein (oder was du willst) und tippe auf **Hinzufügen**.

Jetzt hast du ein Icon auf dem Homescreen. Tippen öffnet die App direkt.

### 3. Beim ersten Öffnen: Erlaubnisse geben
Beim ersten Mal fragt Claude nach Erlaubnissen:
- **Daten speichern:** Erlauben, damit Budget, Training und Ziele gespeichert werden.
- **Claude fragen:** Erlauben, damit Filmsuche, Streaming-Info und der Coach funktionieren.

Die Fragen kommen erst, wenn du die Funktion zum ersten Mal benutzt.

### 4. Mit deiner Freundin teilen (Filmabend)
1. Öffne die App auf claude.ai, idealerweise am Computer, weil es dort am einfachsten geht.
2. Klick oben auf **Teilen**.
3. Lade sie mit ihrer E-Mail-Adresse ein, so dass sie die App **benutzen** darf, nicht nur ansehen.
4. Sie braucht ein (gratis) **Claude-Konto** und macht dann die Schritte 1–3 auf ihrem Handy.

### 5. Mit Levin und Yanic teilen (Ziele-Challenge)
Genau gleich wie bei Schritt 4. Danach öffnen sie den Bereich **Ziele**, wählen ihre Ziele und tippen auf **«Challenge starten»**. Ab dann erscheinen sie in der Rangliste.

### Wer sieht was?

| Bereich | Wer sieht es? |
|---|---|
| Budget | Nur du |
| Fire Trainer | Nur du |
| Filmabend-Liste | Alle, mit denen du die App teilst |
| Ziele-Challenge | Alle, mit denen du die App teilst. Jeder kann aber nur seine **eigenen** Ziele abhaken. |

Achtung: Levin und Yanic sehen auch eure Filmliste. Wenn das nicht passt, sag Claude Bescheid, dann lässt sich das trennen.

---

## Updates

Updates kommen **automatisch**. Wenn du im Chat mit Claude etwas ändern lässt, ist es beim nächsten Öffnen der App da. Der Link und das Icon bleiben gleich, und deine Daten bleiben erhalten.

Falls eine Änderung nicht sofort sichtbar ist: App schliessen (nach oben wischen) und neu öffnen.

---

## Wenn etwas nicht geht

| Problem | Lösung |
|---|---|
| Rote Meldung «nicht über Claude angemeldet» | In Safari auf claude.ai neu anmelden, dann App neu öffnen |
| Filmsuche / Coach antwortet nicht | Erlaubnis «Claude fragen» geben. Bei «Zu viele Anfragen» kurz warten |
| Freundin oder Freunde sehen die App nicht | Prüfen, ob du sie über «Teilen» eingeladen hast und sie die App **benutzen** dürfen |
| Daten fehlen | Prüfen, ob du mit dem richtigen Claude-Konto angemeldet bist |

---

## Für Entwickler: Aufbau

```
src/
  index.html   Grundgerüst mit Navigation
  styles.css   Design (hell, eine Akzentfarbe pro Modul)
  core.js      Speicher, Navigation, Hilfsfunktionen
  budget.js    Modul Budget (privat)
  film.js      Modul Filmabend (geteilt)
  training.js  Modul Fire Trainer (privat)
  ziele.js     Modul Ziele-Challenge (geteilt)
  home.js      Startseite und Start der App
build.js       baut alles zu dist/ownapp.html zusammen
```

Bauen: `node build.js`. Danach wird `dist/ownapp.html` als Claude-Artifact veröffentlicht.

Daten liegen in der Datenbank des Artifacts:
- `data/users/<id>/budget` und `data/users/<id>/pvp`: privat
- `movies/*`: geteilt
- `challenge/<id>`: alle lesen, nur der Besitzer schreibt
