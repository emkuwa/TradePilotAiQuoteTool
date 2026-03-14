# Uthibitisho: GitHub → Vercel → Cloudflare

Tumia orodha hii kuthibitisha kuwa mfumo uko sawa na invitation link inafanya kazi.

---

## 1. GitHub (msimbo)

- [ ] Repo iko na msimbo wa sasa (app.js ina `__tpaiInviteSearch` na `checkInviteLink`).
- [ ] Umepush mabadiliko: `git add .` → `git commit -m "Invite link fix"` → `git push origin main`.

**Kuthibitisha:** Buka repo kwenye GitHub → faili `app.js` → mstari wa 1–2 unaona `invite fix v2024-03` na `__tpaiInviteSearch`.

---

## 2. Vercel (deploy)

- [ ] Project imeunganishwa na repo yako ya GitHub (Settings → Git).
- [ ] Branch ya Production ni `main` (au ile unayopush).
- [ ] Deploy ya hivi karibuni imekwisha (Overview → "Ready", si "Building").
- [ ] Domain: **tradepilotai.zanzibaba.com** iko kwenye Settings → Domains (na ikiwa unatumia www, ongeza **www.tradepilotai.zanzibaba.com**).
- [ ] Vercel amekupatia target ya DNS (k.m. `cname.vercel-dns.com` au `xxx.vercel-dns-017.com`).

**Kuthibitisha:** Vercel → Deployments → bofya deploy ya hivi karibuni → "Visit" → ukurasa unafunguka. Kisha "View Page Source" (au Ctrl+U) → tafuta `invite fix v2024-03` au `__tpaiInviteSearch`. Ikiwa ipo, Vercel inatumia msimbo mpya.

---

## 3. Cloudflare (DNS)

- [ ] Rekodi ya **tradepilotai** (CNAME) inaelekeza kwenye target ya Vercel (sio Vultr au host nyingine).
  - **Name:** `tradepilotai` (au `www.tradepilotai` kwa www).
  - **Target:** thamani kutoka Vercel (k.m. `cname.vercel-dns.com` au `251941385c596c37.vercel-dns-017.com`).
- [ ] Proxy: "DNS only" (grey cloud) au "Proxied" (orange) – zote mbili zinaweza kufanya kazi.

**Kuthibitisha:** Buka **https://tradepilotai.zanzibaba.com** (bila invite param). "View Page Source" → tafuta `invite fix v2024-03`. Ikiwa unaona, DNS inaelekeza kwenye Vercel na deploy ni ya sasa.

---

## 4. Invitation link

- [ ] Fungua kiungo kamili (na `?invite=...` na `%3D%3D` mwishoni) kwenye tab mpya au private window.
- [ ] Inapaswa kuonyesha **"Invitation" / "Mialiko"** na kitufe **"Accept"**, si "Welcome" na "Continue".
- [ ] Ikiwa bado unaona "Welcome": ondoa cache (Ctrl+Shift+R) au jaribu device / browser nyingine.

---

## Mchoro wa mwendo

```
[GitHub repo]  ---- push main ---->  [Vercel]  ---- build/deploy ---->  [Vercel URL]
                                                                                ^
[Cloudflare DNS]  tradepilotai CNAME ---->  target (Vercel) ___________________|
                                                                                |
[Mtumiaji]  tradepilotai.zanzibaba.com  --------------------------------------->
```

---

## Tatizo la kawaida

| Tatizo | Kichocheo | Suluhu |
|--------|-----------|--------|
| Bado "Welcome" na kiungo cha invite | Msimbo mpya haujapush / Vercel haijadeploy | Push GitHub, subiri Vercel deploy, hard refresh |
| 503 / Server Not Found | DNS inaelekeza kwenye host sio Vercel | Cloudflare: CNAME → target ya Vercel tu |
| Kiungo kimekatwa | Copy/paste kukata base64 | Tumia "Generate invitation link" (format fupi ?i=) au "Copy link" bila kukata |
