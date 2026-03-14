# Auto push on edit

Kila edit/save kwenye Cursor inaweza ku-push moja kwa moja kwenye GitHub.

## Kuendesha automatikali (unapofungua project)

Project hii iko na **task** inayowasha script **automatic** unapofungua folder kwenye Cursor:

1. **Mar ya kwanza:** Cursor inaweza kuuliza “Allow Automatic Tasks in Folder”. Chagua **Allow**.
2. **Kila kufungua:** Script inaanza kwenye terminal (inaweza kuonekana chini). Kila utakapohifadhi file, baada ya sekunde 4 itafanya `git add .` → `git commit` → `git push origin main`.
3. **Kusimamisha:** Fungua terminal ile na ubonyeze **Ctrl+C**.

Ikiwa task haianzi:  
- Run **Command Palette** (Ctrl+Shift+P / Cmd+Shift+P) → andika **Tasks: Allow Automatic Tasks in Folder** → Enter.  
- Fungua project tena (File → Close Folder, kisha Open Folder).

## Kuendesha manual

1. Fungua **terminal** kwenye project (Cursor: Terminal → New Terminal).
2. Andika:
   ```bash
   node scripts/auto-push-on-edit.js
   ```
3. Acha terminal wazi. Kusimamisha: **Ctrl+C**.

## Kumbuka

- Script inaangalia mabadiliko; baada ya ~4 s inafanya commit + push.
- Ikiwa hakuna mabadiliko (au tayari umefanya commit), hakuna push.
- Branch ni **main**. Ikiwa unatumia branch nyingine, badilisha ndani ya `auto-push-on-edit.js`: `git push origin BRANCH`.

## Kwenye project nyingine (GitHub)

Ili auto-push ifanye kazi kwenye project nyingine:

1. Copy folder **scripts** (na `auto-push-on-edit.js`) kwenye root ya project ile.
2. Copy folder **.vscode** (na `tasks.json`) kwenye root ya project ile.
3. Fungua project ile kwenye Cursor; ruhusu “Automatic Tasks” ikiwa inaulizwa.
4. Ikiwa branch si **main**, badilisha mstari wa `git push origin main` ndani ya `scripts/auto-push-on-edit.js`.
