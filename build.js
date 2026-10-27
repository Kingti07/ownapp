// Baut die App zu einer einzigen Datei zusammen: dist/ownapp.html
// Ausführen mit: node build.js
const fs = require("fs");
const path = require("path");
const src = p => fs.readFileSync(path.join(__dirname, "src", p), "utf8");

// Reihenfolge ist wichtig: core zuerst, home zuletzt (startet die App)
const MODULES = ["core.js", "budget.js", "film.js", "training.js", "ziele.js", "home.js"];

const html = src("index.html")
  .replace("/*STYLES*/", () => src("styles.css"))
  .replace("/*SCRIPTS*/", () => MODULES.map(src).join("\n"));

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist", "ownapp.html"), html);
console.log("dist/ownapp.html gebaut (" + Math.round(html.length / 1024) + " KB)");
