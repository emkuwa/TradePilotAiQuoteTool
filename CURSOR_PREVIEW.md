# Preview this project in Cursor

Cursor is based on VS Code. Use one of these to open the app in a browser **inside** or next to the editor.

## Option A — Live Preview (recommended)

1. Install the extension **Live Preview** (publisher: Microsoft, id `ms-vscode.live-preview`).
   - Open Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`), search **Live Preview**, install.
2. Open `index.html` in the editor.
3. Right‑click in the editor → **Show Preview**  
   or use the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → **Live Preview: Show Preview (External Browser)** or **Show Preview (Internal Browser)**.

The preview updates when you save files.

## Option B — Simple Browser (built-in)

1. Command Palette → **Simple Browser: Show**.
2. Enter a URL. For a local server, start one first (see below), e.g. `http://127.0.0.1:5500`.

## Option C — Open file in default browser

- Right‑click `index.html` in the file explorer → **Reveal in Finder** / **Reveal in File Explorer**, then double‑click the file.  
  Some features (e.g. modules) work better with a small local server.

## Quick local server (terminal)

From the project folder:

```bash
python3 -m http.server 5500
```

Then open `http://127.0.0.1:5500` in Simple Browser or your browser.

---

`.vscode/extensions.json` in this repo recommends **Live Preview** so Cursor may prompt you to install it when you open the workspace.
