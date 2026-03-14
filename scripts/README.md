# Auto push on edit

Kila edit/save kwenye Cursor inaweza ku-push moja kwa moja kwenye GitHub.

## Kuendesha

1. Fungua **terminal** kwenye project (Cursor: Terminal → New Terminal).
2. Andika:
   ```bash
   node scripts/auto-push-on-edit.js
   ```
3. Acha terminal wazi – script inaangalia mabadiliko. Kila utakapohifadhi file, baada ya sekunde 4 itafanya:
   - `git add .`
   - `git commit -m "Auto: save from Cursor"`
   - `git push origin main`
4. Kusimamisha: **Ctrl+C** kwenye terminal.

## Kumbuka

- Script inaendesha kwenye **background** (terminal moja); unabaki kufanya kazi kwenye Cursor kama kawaida.
- Ikiwa hakuna mabadiliko (au tayari umefanya commit), hakuna push.
- Branch ni **main**. Ikiwa unatumia branch nyingine, badilisha ndani ya `auto-push-on-edit.js`: `git push origin BRANCH`.
