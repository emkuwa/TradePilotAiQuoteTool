// TradePilotAI Document Generator - Vanilla JS

const STORAGE_KEYS = {
  COMPANY: "tpai_company_profile",
  DOC_COUNTERS: "tpai_doc_counters",
  HISTORY: "tpai_doc_history",
};

const USER_STORAGE_KEYS = {
  SIMPLE_USER: "tpai_simple_user",   // { name, password } one user per browser
  CURRENT_USER: "tpai_current_user_id",
};
const LANG_STORAGE = "tpai_lang"; // "en" | "sw"

const DEFAULT_TERMS =
  "Payment due within agreed period\nPrice subject to change depending on shipment conditions";

const DEFAULT_COMPANY = {
  name: "Core Logistics Limited",
  address:
    "Kurasini, Mivinjeni Plot No.321\nP.O.Box 13878 Dar es Salaam Tanzania",
  phone: "+255 784 715963",
  email: "info@corelogistics.example",
  sector: "logistics",
  website: "https://corelogistics.example",
  socials: "@corelogistics",
  dealers: "Dealers in international freight forwarding, customs clearance and logistics services",
  bankDetails:
    "Bank: Example Bank Plc\nAccount Name: Core Logistics Limited\nAccount No: 0000000000\nBranch: Main Branch",
  currency: "TZS",
  logoDataUrl: null,
  extraFields: [],
};

// Simple vector-style fallback logo (text, not binary)
const FALLBACK_LOGO_DATA_URL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="104" height="104" rx="22" fill="url(#g)"/>
      <text x="50%" y="44%" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="26" fill="#e5e7eb" font-weight="600">CORE</text>
      <text x="50%" y="68%" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="14" fill="#e5e7eb">LOGISTICS</text>
    </svg>`
  );

const DOC_TYPE_CONFIG = {
  quotation: { label: "QUOTATION", prefix: "CL" },
  invoice: { label: "INVOICE", prefix: "INV" },
  "delivery-note": { label: "DELIVERY NOTE", prefix: "DN" },
  proforma: { label: "PROFORMA INVOICE", prefix: "PF" },
   letterhead: { label: "LETTERHEAD", prefix: "LH" },
   receipt: { label: "RECEIPT", prefix: "RC" },
   "credit-note": { label: "CREDIT NOTE", prefix: "CN" },
   "purchase-order": { label: "PURCHASE ORDER", prefix: "PO" },
};

const SECTOR_ITEMS = {
  logistics: [
    "Freight charges",
    "Handling fees",
    "Customs clearance",
    "Delivery charges",
    "Port charges",
  ],
  retail: ["Product supply", "Delivery fee", "Packaging", "Installation"],
  services: [
    "Consulting fee",
    "Service retainer",
    "Training session",
    "Implementation support",
  ],
  construction: [
    "Materials supply",
    "Labour charges",
    "Site inspection",
    "Equipment hire",
  ],
  hospitality: [
    "Accommodation",
    "Conference package",
    "Catering service",
    "Event hall hire",
  ],
  healthcare: [
    "Consultation fee",
    "Laboratory tests",
    "Medication supply",
    "Procedure fee",
  ],
  agriculture: [
    "Fertilizers",
    "Seeds supply",
    "Farm consultancy",
    "Transport to market",
  ],
  generic: ["Professional services", "Goods supplied", "Service fee"],
};

function formatMoney(value, currency) {
  const num = Number(value) || 0;
  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${formatted}` : formatted;
}

function numberToWords(n) {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "zero";
  const units = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function chunkToWords(num) {
    let str = "";
    if (num >= 100) {
      str += units[Math.floor(num / 100)] + " hundred";
      num %= 100;
      if (num) str += " ";
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)];
      num %= 10;
      if (num) str += "-" + units[num];
    } else if (num > 0) {
      str += units[num];
    }
    return str;
  }

  let result = "";
  const parts = [
    { value: 1_000_000_000, name: "billion" },
    { value: 1_000_000, name: "million" },
    { value: 1_000, name: "thousand" },
  ];
  let remaining = n;
  parts.forEach((part) => {
    if (remaining >= part.value) {
      const chunk = Math.floor(remaining / part.value);
      remaining %= part.value;
      result += chunkToWords(chunk) + " " + part.name + (remaining ? " " : "");
    }
  });
  if (remaining) {
    result += chunkToWords(remaining);
  }
  return result;
}

function amountToWords(amount) {
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const whole = Math.floor(rounded);
  const cents = Math.round((rounded - whole) * 100);
  const wholeWords = numberToWords(whole);
  if (cents > 0) {
    const centsWords = numberToWords(cents);
    return `${wholeWords} and ${centsWords} cents`;
  }
  return wholeWords;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSimpleUser() {
  return loadJSON(USER_STORAGE_KEYS.SIMPLE_USER, null);
}

function saveSimpleUser(user) {
  saveJSON(USER_STORAGE_KEYS.SIMPLE_USER, user);
}

function getCurrentUserId() {
  return localStorage.getItem(USER_STORAGE_KEYS.CURRENT_USER) || null;
}

function setCurrentUserId(id) {
  if (id) localStorage.setItem(USER_STORAGE_KEYS.CURRENT_USER, id);
  else localStorage.removeItem(USER_STORAGE_KEYS.CURRENT_USER);
}

function getScopedKey(baseKey) {
  const id = getCurrentUserId() || "default";
  return `${baseKey}__${id}`;
}

function loadCompanyProfile() {
  return loadJSON(getScopedKey(STORAGE_KEYS.COMPANY), DEFAULT_COMPANY);
}

function saveCompanyProfile(company) {
  saveJSON(getScopedKey(STORAGE_KEYS.COMPANY), company);
}

function loadDocCounters() {
  return loadJSON(getScopedKey(STORAGE_KEYS.DOC_COUNTERS), {});
}

function saveDocCounters(counters) {
  saveJSON(getScopedKey(STORAGE_KEYS.DOC_COUNTERS), counters);
}

function loadHistory() {
  return loadJSON(getScopedKey(STORAGE_KEYS.HISTORY), []);
}

function saveHistory(history) {
  saveJSON(getScopedKey(STORAGE_KEYS.HISTORY), history);
}

function getSectorItemsKey() {
  return `tpai_sector_items__${getCurrentUserId() || "default"}`;
}

function currentLang() {
  return localStorage.getItem(LANG_STORAGE) || "en";
}

function setLang(lang) {
  localStorage.setItem(LANG_STORAGE, lang);
  applyLanguage();
}

const I18N = {
  en: {
    authWelcome: "Welcome to TradePilotAI Document Studio",
    authSetProfile: "Set your name and password. Next time we will only ask for your password.",
    authYourName: "Your name",
    authPassword: "Password",
    authContinue: "Continue",
    authEnterPassword: "Enter your password",
    authUnlock: "Unlock",
    navCreate: "Create Document",
    createNewDoc: "Create New Document",
    navHistory: "History",
    navSettings: "Settings",
    companySettings: "Company Settings",
    documentOptions: "Document Options",
    preparedBy: "Prepared By",
    actions: "Actions",
    print: "Print",
    downloadPdf: "Download PDF",
    save: "Save",
    sendEmail: "Send via Email",
    sendWhatsApp: "Send via WhatsApp",
    shareTool: "Share this Tool",
    clientDetails: "Client Details",
    items: "Items",
    termsConditions: "Terms & Conditions",
    documentPreview: "Document Preview",
    documentHistory: "Document History",
    searchDocuments: "Search documents",
    searchPlaceholder: "Search by client, number, type or date",
    summary: "Summary",
    noDocumentsYet: "No documents yet.",
    historyEmptyLong: "No documents saved yet. Generate and save a document to see it here.",
    historyOpen: "Open",
    historyDuplicate: "Duplicate",
    historyDelete: "Delete",
    historySavedAs: "Saved locally as",
    historyDocsCount: "document(s), total value approx.",
    documentFrom: "Document from",
    historyIntro: "Recently generated documents are stored locally in your browser. You can search, reopen, duplicate or delete them from here.",
  },
  sw: {
    authWelcome: "Karibu TradePilotAI Document Studio",
    authSetProfile: "Weka jina na nenosiri lako. Wakati ujao tutaomba nenosiri tu.",
    authYourName: "Jina lako",
    authPassword: "Nenosiri",
    authContinue: "Endelea",
    authEnterPassword: "Ingiza nenosiri lako",
    authUnlock: "Fungua",
    navCreate: "Tengeneza Hati",
    createNewDoc: "Tengeneza Hati Mpya",
    navHistory: "Historia",
    navSettings: "Mipangilio",
    companySettings: "Mipangilio ya Kampuni",
    documentOptions: "Chaguo za Hati",
    preparedBy: "Imetayarishwa na",
    actions: "Vitendo",
    print: "Print",
    downloadPdf: "Pakua PDF",
    save: "Hifadhi",
    sendEmail: "Tuma kwa Barua pepe",
    sendWhatsApp: "Tuma kwa WhatsApp",
    shareTool: "Shiriki Chombo hiki",
    clientDetails: "Maelezo ya Mteja",
    items: "Vitu",
    termsConditions: "Masharti na Vigezo",
    documentPreview: "Onyesho la Hati",
    documentHistory: "Historia ya Hati",
    searchDocuments: "Tafuta hati",
    searchPlaceholder: "Tafuta kwa mteja, nambari, aina au tarehe",
    summary: "Muhtasari",
    noDocumentsYet: "Hakuna hati bado.",
    historyEmptyLong: "Hakuna hati zilizohifadhiwa. Tengeneza na hifadhi hati ili kuona hapa.",
    historyOpen: "Fungua",
    historyDuplicate: "Nakili",
    historyDelete: "Futa",
    historySavedAs: "Imehifadhiwa kama",
    historyDocsCount: "hati, jumla ya thamani takriban",
    documentFrom: "Hati kutoka",
    historyIntro: "Hati zilizotengenezwa hivi karibuni zinahifadhiwa kwenye kivinjari chako. Unaweza kutafuta, kufungua tena, kunakili au kufuta.",
  },
};

function applyLanguageToElements() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const lang = currentLang();
    if (I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key];
  });
}

function applyLanguage() {
  applyLanguageToElements();
  const placeholderKeys = { "history-search": "searchPlaceholder" };
  Object.entries(placeholderKeys).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && I18N[currentLang()] && I18N[currentLang()][key]) el.placeholder = I18N[currentLang()][key];
  });
  updateDocumentFromLabel();
}

function updateDocumentFromLabel() {
  const el = document.getElementById("document-from-label");
  if (!el) return;
  const company = getCurrentCompany();
  const from = (company && company.name) ? company.name : "";
  const key = currentLang() === "sw" ? "documentFrom" : "documentFrom";
  const label = (I18N[currentLang()] && I18N[currentLang()].documentFrom) || "Document from";
  el.textContent = from ? `${label}: ${from}` : "";
}

function initAuth(readyCallback) {
  setCurrentUserId(null); // every new open asks for password
  const simpleUser = getSimpleUser();

  let overlay = document.getElementById("auth-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    document.body.appendChild(overlay);
  }

  function showFirstTimeSetup() {
    overlay.innerHTML = `
      <div class="auth-overlay-backdrop"></div>
      <div class="auth-dialog">
        <h2 data-i18n="authWelcome">Welcome to TradePilotAI Document Studio</h2>
        <p class="auth-intro" data-i18n="authSetProfile">Set your name and password. Next time we will only ask for your password.</p>
        <div class="auth-form">
          <label>
            <span data-i18n="authYourName">Your name</span>
            <input type="text" id="auth-name" placeholder="">
          </label>
          <label>
            <span data-i18n="authPassword">Password</span>
            <input type="password" id="auth-password" placeholder="">
          </label>
          <button id="auth-continue" class="btn primary full-width" data-i18n="authContinue">Continue</button>
        </div>
      </div>
    `;
    applyLanguageToElements();
    document.getElementById("auth-continue").addEventListener("click", () => {
      const name = (document.getElementById("auth-name").value || "").trim();
      const password = (document.getElementById("auth-password").value || "").trim();
      if (!password) {
        alert(currentLang() === "sw" ? "Tafadhali weka nenosiri." : "Please enter a password.");
        return;
      }
      saveSimpleUser({ name: name || "User", password });
      setCurrentUserId("default");
      overlay.remove();
      if (typeof readyCallback === "function") readyCallback();
    });
  }

  function showPasswordOnly() {
    overlay.innerHTML = `
      <div class="auth-overlay-backdrop"></div>
      <div class="auth-dialog">
        <h2 data-i18n="authEnterPassword">Enter your password</h2>
        <p class="auth-intro" data-i18n="authHelloName">Hello, ${(simpleUser && simpleUser.name) || "User"}.</p>
        <div class="auth-form">
          <label>
            <span data-i18n="authPassword">Password</span>
            <input type="password" id="auth-password" placeholder="">
          </label>
          <button id="auth-unlock" class="btn primary full-width" data-i18n="authUnlock">Unlock</button>
        </div>
      </div>
    `;
    applyLanguageToElements();
    const helloEl = overlay.querySelector(".auth-intro");
    if (helloEl && simpleUser && simpleUser.name) {
      helloEl.textContent = (currentLang() === "sw" ? "Karibu, " : "Hello, ") + simpleUser.name + ".";
    }
    document.getElementById("auth-unlock").addEventListener("click", () => {
      const password = (document.getElementById("auth-password").value || "").trim();
      if (password !== (simpleUser && simpleUser.password)) {
        alert(currentLang() === "sw" ? "Nenosiri si sahihi." : "Wrong password.");
        return;
      }
      setCurrentUserId("default");
      overlay.remove();
      if (typeof readyCallback === "function") readyCallback();
    });
  }

  if (!simpleUser) showFirstTimeSetup();
  else showPasswordOnly();
}

function initTabs() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = tab.dataset.tab;
      document.querySelectorAll(".tab-view").forEach((view) => {
        view.classList.toggle("active", view.id === targetId);
      });
    });
  });
}

function goToCreateDocument(resetForm) {
  const createTabBtn = document.querySelector('.nav-tab[data-tab="create-tab"]');
  if (createTabBtn) {
    createTabBtn.click();
  }
  if (!resetForm) return;
  const dateInput = document.getElementById("document-date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
  if (typeof window._tpaiAssignNewDocNumber === "function") {
    window._tpaiAssignNewDocNumber();
  }
  const clientIds = ["client-name", "client-company", "client-address", "client-phone"];
  clientIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const termsEl = document.getElementById("terms");
  if (termsEl) termsEl.value = DEFAULT_TERMS;
  const discountEl = document.getElementById("discount-rate");
  if (discountEl) discountEl.value = "0";
  const letterBody = document.getElementById("letter-body");
  const letterPrompt = document.getElementById("letter-ai-prompt");
  if (letterBody) letterBody.value = "";
  if (letterPrompt) letterPrompt.value = "";
  const tbody = document.getElementById("items-body");
  if (tbody && typeof window._tpaiAddItemRow === "function") {
    tbody.innerHTML = "";
    window._tpaiAddItemRow();
  }
  if (typeof updateItemsTotals === "function") updateItemsTotals();
  ["doc-client-name", "doc-client-company", "doc-client-address", "doc-client-phone"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  const termsPreview = document.getElementById("doc-terms-text");
  if (termsPreview) termsPreview.textContent = DEFAULT_TERMS;
  const letterPreview = document.getElementById("doc-letter-body");
  if (letterPreview) letterPreview.textContent = "";
}

function initCompanySettings() {
  const nameInput = document.getElementById("company-name");
  const addressInput = document.getElementById("company-address");
  const sectorSelect = document.getElementById("company-sector");
  const phoneInput = document.getElementById("company-phone");
  const emailInput = document.getElementById("company-email");
  const websiteInput = document.getElementById("company-website");
  const socialsInput = document.getElementById("company-socials");
  const dealersInput = document.getElementById("company-dealers");
  const bankInput = document.getElementById("company-bank-details");
  const currencyInput = document.getElementById("company-currency");
  const logoUpload = document.getElementById("logo-upload");
  const saveBtn = document.getElementById("save-company-settings");
  const resetBtn = document.getElementById("reset-company-settings");
  const addFieldBtn = document.getElementById("add-company-field");
  const extraListEl = document.getElementById("company-extra-list");

  let company = loadCompanyProfile();
  // Ensure new properties exist if loading old data
  company.sector ??= DEFAULT_COMPANY.sector;
  company.website ??= DEFAULT_COMPANY.website;
  company.socials ??= DEFAULT_COMPANY.socials;
  company.dealers ??= DEFAULT_COMPANY.dealers;
  company.bankDetails ??= DEFAULT_COMPANY.bankDetails;
  company.extraFields ??= [];

  function applyCompanyToForm() {
    nameInput.value = company.name || "";
    addressInput.value = company.address || "";
    sectorSelect.value = company.sector || "generic";
    phoneInput.value = company.phone || "";
    emailInput.value = company.email || "";
    websiteInput.value = company.website || "";
    socialsInput.value = company.socials || "";
    dealersInput.value = company.dealers || "";
    bankInput.value = company.bankDetails || "";
    currencyInput.value = company.currency || "";
  }

  function renderExtraList() {
    if (!extraListEl) return;
    extraListEl.innerHTML = "";
    if (!Array.isArray(company.extraFields) || !company.extraFields.length) {
      extraListEl.textContent = "No custom fields yet.";
      return;
    }
    company.extraFields.forEach((f, index) => {
      if (!f || !f.label || !f.value) return;
      const row = document.createElement("div");
      row.className = "company-extra-list-item";
      row.innerHTML = `<span>${f.label}</span><span>${f.value}</span>`;
      row.addEventListener("click", () => {
        const newLabel = prompt("Edit label:", f.label);
        if (newLabel === null) return;
        const trimmedLabel = newLabel.trim();
        if (!trimmedLabel) return;
        const newValue = prompt("Edit value:", f.value);
        if (newValue === null) return;
        const trimmedValue = newValue.trim();
        if (!trimmedValue) return;
        company.extraFields[index] = {
          ...f,
          label: trimmedLabel,
          value: trimmedValue,
        };
        saveCompanyProfile(company);
        applyCompanyToPreview();
        renderExtraList();
      });
      extraListEl.appendChild(row);
    });
  }

  function applyCompanyToPreview() {
    const nameEl = document.getElementById("doc-company-name");
    const addressEl = document.getElementById("doc-company-address");
    const contactEl = document.getElementById("doc-company-contact");
    const extraEl = document.getElementById("doc-company-extra");
    const dealersEl = document.getElementById("doc-dealers-footer");
    const bankEl = document.getElementById("doc-bank-text");
    const logoEl = document.getElementById("company-logo");

    nameEl.textContent = company.name || DEFAULT_COMPANY.name;
    addressEl.innerHTML = (company.address || DEFAULT_COMPANY.address)
      .split("\n")
      .join("<br>");
    const phoneText = company.phone || DEFAULT_COMPANY.phone;
    const emailText = company.email || "info@example.com";
    const contactLines = [];
    if (phoneText) contactLines.push(`Tel: ${phoneText}`);
    if (emailText) contactLines.push(`Email: ${emailText}`);
    contactEl.innerHTML = contactLines.join("<br>");

    const lines = [];
    if (company.website) {
      lines.push(`Website: ${company.website}`);
    }
    if (company.socials) {
      lines.push(company.socials);
    }
    if (Array.isArray(company.extraFields)) {
      company.extraFields.forEach((f) => {
        if (f && f.label && f.value) {
          lines.push(`${f.label}: ${f.value}`);
        }
      });
    }
    extraEl.innerHTML = lines.length ? lines.join("<br>") : "";

    if (dealersEl) {
      dealersEl.textContent = company.dealers || "";
    }
    if (bankEl) {
      bankEl.textContent = company.bankDetails || "";
    }

    if (company.logoDataUrl) {
      logoEl.src = company.logoDataUrl;
    } else {
      // Fallback to vector logo; keep PNG path as a hint but override visually
      logoEl.src = FALLBACK_LOGO_DATA_URL;
    }
    if (typeof updateDocumentFromLabel === "function") updateDocumentFromLabel();
  }

  // Fill inputs & preview initially
  applyCompanyToForm();
  applyCompanyToPreview();
  renderExtraList();
  window._tpaiGetSector = () => company.sector || "generic";
  updateItemSuggestionsForSector(window._tpaiGetSector());

  saveBtn.addEventListener("click", () => {
    company = {
      ...company,
      // For saved profile, respect empty values so fields can be hidden
      name: nameInput.value.trim() || DEFAULT_COMPANY.name,
      address: addressInput.value.trim() || DEFAULT_COMPANY.address,
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      sector: sectorSelect.value,
      website: websiteInput.value.trim(),
      socials: socialsInput.value.trim(),
      dealers: dealersInput.value.trim(),
      bankDetails: bankInput.value.trim(),
      currency: currencyInput.value.trim() || DEFAULT_COMPANY.currency,
    };
    saveCompanyProfile(company);
    applyCompanyToPreview();
    renderExtraList();
    alert("Company profile saved in this browser.");
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset company profile to demo Core Logistics data?")) return;
    company = { ...DEFAULT_COMPANY };
    saveCompanyProfile(company);
    applyCompanyToForm();
    applyCompanyToPreview();
    renderExtraList();
  });

  logoUpload.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      company.logoDataUrl = reader.result;
      saveJSON(STORAGE_KEYS.COMPANY, company);
      applyCompanyToPreview();
    };
    reader.readAsDataURL(file);
  });

  // Update preview live when typing
  [
    nameInput,
    addressInput,
    sectorSelect,
    phoneInput,
    emailInput,
    websiteInput,
    socialsInput,
    dealersInput,
    bankInput,
    currencyInput,
  ].forEach(
    (el) => {
      el.addEventListener("input", () => {
        company = {
          ...company,
          name: nameInput.value,
          address: addressInput.value,
          sector: sectorSelect.value,
          phone: phoneInput.value,
          email: emailInput.value,
          website: websiteInput.value,
          socials: socialsInput.value,
          dealers: dealersInput.value,
          bankDetails: bankInput.value,
          currency: currencyInput.value,
        };
        applyCompanyToPreview();
        if (el === sectorSelect) {
          updateItemSuggestionsForSector(sectorSelect.value || "generic");
        }
        updateMoneyDisplays();
      });
    }
  );

  addFieldBtn.addEventListener("click", () => {
    const label = prompt(
      "Enter field label (e.g. TIN, Branch, Registration No.):"
    );
    if (!label || !label.trim()) return;
    const value = prompt(`Enter value for "${label}":`);
    if (!value || !value.trim()) return;
    const field = { id: Date.now(), label: label.trim(), value: value.trim() };
    company.extraFields = Array.isArray(company.extraFields)
      ? [...company.extraFields, field]
      : [field];
    saveJSON(STORAGE_KEYS.COMPANY, company);
    applyCompanyToPreview();
    renderExtraList();
  });
}

function getCurrentCompany() {
  return loadCompanyProfile();
}

function loadSectorCustomItems() {
  return loadJSON(getSectorItemsKey(), {});
}

function saveSectorCustomItems(map) {
  saveJSON(getSectorItemsKey(), map);
}

function updateItemSuggestionsForSector(sector) {
  const key = sector || "generic";
  const base = SECTOR_ITEMS[key] || SECTOR_ITEMS.generic;
  const customMap = loadSectorCustomItems();
  const custom = customMap[key] || [];
  const all = Array.from(new Set([...(base || []), ...(custom || [])]));
  const datalist = document.getElementById("item-suggestions");
  if (!datalist) return;
  datalist.innerHTML = "";
  all.forEach((label) => {
    const opt = document.createElement("option");
    opt.value = label;
    datalist.appendChild(opt);
  });

  const chipsRoot = document.getElementById("common-items-chips");
  if (!chipsRoot) return;
  chipsRoot.innerHTML = "";
  all.forEach((label) => {
    const chip = document.createElement("div");
    chip.className = "common-item-chip";
    const textSpan = document.createElement("span");
    textSpan.textContent = label;
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const map = loadSectorCustomItems();
      const list = new Set(map[key] || []);
      list.delete(label);
      map[key] = Array.from(list);
      saveSectorCustomItems(map);
      updateItemSuggestionsForSector(key);
    });
    chip.appendChild(textSpan);
    chip.appendChild(deleteBtn);
    chip.addEventListener("click", () => {
      if (typeof window._tpaiAddItemRow === "function") {
        window._tpaiAddItemRow(label);
      }
    });
    chipsRoot.appendChild(chip);
  });
}

function initDocumentBasics() {
  const typeSelect = document.getElementById("document-type");
  const dateInput = document.getElementById("document-date");
  const numberInput = document.getElementById("document-number");

  const docTypeLabel = document.getElementById("doc-type-label");
  const docDateDisplay = document.getElementById("doc-date-display");
  const docNumberDisplay = document.getElementById("doc-number-display");
  const docNumberLabel = document.getElementById("doc-number-label");

  const today = new Date();
  dateInput.value = today.toISOString().slice(0, 10);

  function generateNextNumber(typeKey) {
    const cfg = DOC_TYPE_CONFIG[typeKey];
    if (!cfg) return "";
    const counters = loadDocCounters();
    const current = counters[typeKey] || 0;
    const next = current + 1;
    counters[typeKey] = next;
    saveDocCounters(counters);
    return `${cfg.prefix}-${String(next).padStart(3, "0")}`;
  }

  function updateDocMeta() {
    const typeKey = typeSelect.value;
    const cfg = DOC_TYPE_CONFIG[typeKey];
    docTypeLabel.textContent = cfg?.label || "";
    docDateDisplay.textContent = dateInput.value || "";
    docNumberDisplay.textContent = numberInput.value || "";
    if (docNumberLabel) {
      if (typeKey === "quotation") docNumberLabel.textContent = "Quote No.";
      else if (typeKey === "invoice") docNumberLabel.textContent = "Invoice No.";
      else if (typeKey === "delivery-note") docNumberLabel.textContent = "DN No.";
      else if (typeKey === "proforma") docNumberLabel.textContent = "Proforma No.";
      else if (typeKey === "letterhead") docNumberLabel.textContent = "Ref No.";
      else if (typeKey === "receipt") docNumberLabel.textContent = "Receipt No.";
      else if (typeKey === "credit-note") docNumberLabel.textContent = "Credit Note No.";
      else if (typeKey === "purchase-order") docNumberLabel.textContent = "PO No.";
      else docNumberLabel.textContent = "Document No.";
    }

    const letterPanel = document.getElementById("letterhead-ai-panel");
    if (letterPanel) {
      letterPanel.style.display = typeKey === "letterhead" ? "block" : "none";
    }
  }

  function assignNewDocNumber() {
    const typeKey = typeSelect.value;
    const num = generateNextNumber(typeKey);
    numberInput.value = num;
    updateDocMeta();
  }

  window._tpaiAssignNewDocNumber = assignNewDocNumber;

  // Initial doc number
  assignNewDocNumber();

  typeSelect.addEventListener("change", () => {
    assignNewDocNumber();
  });

  dateInput.addEventListener("change", () => {
    updateDocMeta();
  });

  // Expose some helpers globally for save/metadata
  window._tpaiGetDocMeta = () => ({
    typeKey: typeSelect.value,
    typeLabel: DOC_TYPE_CONFIG[typeSelect.value]?.label ?? "",
    date: dateInput.value,
    number: numberInput.value,
  });

  updateDocMeta();
}

function initClientBindings() {
  const bindings = [
    { inputId: "client-name", previewId: "doc-client-name" },
    { inputId: "client-company", previewId: "doc-client-company" },
    { inputId: "client-address", previewId: "doc-client-address" },
    { inputId: "client-phone", previewId: "doc-client-phone" },
  ];

  bindings.forEach(({ inputId, previewId }) => {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const update = () => {
      const val = input.value.trim();
      if (inputId === "client-address") {
        preview.innerHTML = val.split("\n").join("<br>");
      } else {
        preview.textContent = val;
      }
    };
    input.addEventListener("input", update);
  });
}

function initPreparedByBindings() {
  const preparedInput = document.getElementById("prepared-by");
  const authInput = document.getElementById("authorized-signature");
  const preparedPreview = document.getElementById("doc-prepared-by");
  const authPreview = document.getElementById("doc-authorized-signature");

  preparedInput.addEventListener("input", () => {
    preparedPreview.textContent = preparedInput.value.trim();
  });
  authInput.addEventListener("input", () => {
    authPreview.textContent = authInput.value.trim();
  });
}

function initTerms() {
  const termsInput = document.getElementById("terms");
  const termsPreview = document.getElementById("doc-terms-text");
  termsInput.value = DEFAULT_TERMS;
  termsPreview.textContent = DEFAULT_TERMS;
  termsInput.addEventListener("input", () => {
    termsPreview.textContent = termsInput.value || DEFAULT_TERMS;
  });

  const bodyInput = document.getElementById("letter-body");
  const bodyPreview = document.getElementById("doc-letter-body");
  if (bodyInput && bodyPreview) {
    bodyInput.addEventListener("input", () => {
      bodyPreview.textContent = bodyInput.value;
    });
  }

  const generateBtn = document.getElementById("letter-generate");
  const improveBtn = document.getElementById("letter-improve");
  const clearBtn = document.getElementById("letter-clear");
  const promptInput = document.getElementById("letter-ai-prompt");

  function buildLetter(promptText) {
    const meta = window._tpaiGetDocMeta?.() || {};
    const company = getCurrentCompany();
    const clientName = document.getElementById("client-name").value.trim();
    const number = meta.number || "";
    const date = meta.date || "";

    const greeting = clientName ? `Dear ${clientName},` : "Dear Sir/Madam,";
    let middle = "";
    const p = (promptText || "").toLowerCase();
    if (p.includes("quotation") || p.includes("quote")) {
      middle =
        `We are pleased to share our quotation ${number ? number + " " : ""}` +
        `dated ${date || "today"} for the requested services. ` +
        `The attached document outlines the items, pricing and terms in detail.`;
    } else if (p.includes("payment") || p.includes("invoice")) {
      middle =
        `This letter is to kindly remind you of the outstanding payment ` +
        `related to ${number || "our recent invoice"}. ` +
        `We would appreciate settlement at your earliest convenience as per the agreed terms.`;
    } else if (p.includes("delivery") || p.includes("shipment")) {
      middle =
        `We wish to confirm the delivery / shipment arrangements as per the attached document. ` +
        `Please review the schedule and consignment details and let us know if any adjustments are required.`;
    } else if (p.includes("thank") || p.includes("appreciation")) {
      middle =
        `We would like to sincerely thank you for your continued trust in our services. ` +
        `The attached document serves as a formal record for your reference.`;
    } else {
      middle =
        `Please find the attached document for your review. ` +
        `It summarises the key details related to our recent engagement as described above.`;
    }

    const closing =
      "\n\nIf you have any questions or need further clarification, please feel free to contact us.\n\n" +
      `Kind regards,\n${company.name || "Your company"}`;

    return `${greeting}\n\n${middle}\n${closing}`;
  }

  if (generateBtn && promptInput && bodyInput && bodyPreview) {
    generateBtn.addEventListener("click", () => {
      const draft = buildLetter(promptInput.value);
      bodyInput.value = draft;
      bodyPreview.textContent = draft;
    });
  }

  if (improveBtn && bodyInput && bodyPreview) {
    improveBtn.addEventListener("click", () => {
      const current = bodyInput.value.trim();
      if (!current) return;
      const improved =
        current +
        "\n\nThis letter has been structured for clarity and can be adjusted to match your company tone of voice.";
      bodyInput.value = improved;
      bodyPreview.textContent = improved;
    });
  }

  if (clearBtn && bodyInput && bodyPreview && promptInput) {
    clearBtn.addEventListener("click", () => {
      bodyInput.value = "";
      bodyPreview.textContent = "";
      promptInput.value = "";
    });
  }
}

function createItemRow(index) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="item-index">${index + 1}</td>
    <td><input type="text" class="item-desc" placeholder="Item description" list="item-suggestions"></td>
    <td><input type="number" class="item-qty" min="0" step="1"></td>
    <td><input type="number" class="item-unit-price" min="0" step="1"></td>
    <td><input type="text" class="item-total-cell" readonly></td>
    <td><button type="button" class="btn ghost small remove-row-btn">✕</button></td>
  `;

  const qtyInput = tr.querySelector(".item-qty");
  const priceInput = tr.querySelector(".item-unit-price");

  const onValueChange = () => {
    updateItemsTotals();
  };

  qtyInput.addEventListener("input", onValueChange);
  priceInput.addEventListener("input", onValueChange);

  tr.querySelector(".remove-row-btn").addEventListener("click", () => {
    tr.remove();
    renumberRows();
    updateItemsTotals();
  });

  return tr;
}

function renumberRows() {
  document.querySelectorAll("#items-body .item-index").forEach((cell, i) => {
    cell.textContent = i + 1;
  });
}

function updateItemsTotals() {
  const tbody = document.getElementById("items-body");
  const company = getCurrentCompany();
  let subtotal = 0;

  const previewBody = document.getElementById("doc-items-body");
  previewBody.innerHTML = "";

  Array.from(tbody.rows).forEach((row, i) => {
    const desc = row.querySelector(".item-desc").value.trim();
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
    const unit = parseFloat(row.querySelector(".item-unit-price").value) || 0;
    const lineTotal = qty * unit;
    subtotal += lineTotal;

    const totalInput = row.querySelector(".item-total-cell");
    if (totalInput) {
      totalInput.value = lineTotal ? formatMoney(lineTotal, company.currency) : "";
    }

    const previewRow = document.createElement("tr");
    previewRow.innerHTML = `
      <td>${i + 1}</td>
      <td>${desc || ""}</td>
      <td>${qty ? qty.toFixed(2) : ""}</td>
      <td>${unit ? formatMoney(unit, company.currency) : ""}</td>
      <td>${lineTotal ? formatMoney(lineTotal, company.currency) : ""}</td>
    `;
    previewBody.appendChild(previewRow);

    if (desc) {
      const sector = (window._tpaiGetSector && window._tpaiGetSector()) || "generic";
      const map = loadSectorCustomItems();
      const list = new Set(map[sector] || []);
      if (!list.has(desc)) {
        list.add(desc);
        map[sector] = Array.from(list).slice(0, 30);
        saveSectorCustomItems(map);
        updateItemSuggestionsForSector(sector);
      }
    }
  });

  const discountRateInput = document.getElementById("discount-rate");
  const discountRate = discountRateInput
    ? Math.max(0, Math.min(100, parseFloat(discountRateInput.value) || 0))
    : 0;
  const discountAmount = (subtotal * discountRate) / 100;
  const taxable = subtotal - discountAmount;
  const vat = taxable * 0.18;
  const grand = taxable + vat;

  document.getElementById("subtotal-display").textContent = formatMoney(
    subtotal,
    company.currency
  );
  const discountDisplay = document.getElementById("discount-display");
  if (discountDisplay) {
    discountDisplay.textContent = discountAmount
      ? "-" + formatMoney(discountAmount, company.currency)
      : formatMoney(0, company.currency);
  }
  document.getElementById("vat-display").textContent = formatMoney(
    vat,
    company.currency
  );
  document.getElementById("grand-total-display").textContent = formatMoney(
    grand,
    company.currency
  );

  document.getElementById("doc-subtotal").textContent = formatMoney(
    subtotal,
    company.currency
  );
  const docDiscountEl = document.getElementById("doc-discount");
  if (docDiscountEl) {
    docDiscountEl.textContent = discountAmount
      ? "-" + formatMoney(discountAmount, company.currency)
      : "";
  }
  document.getElementById("doc-vat").textContent = formatMoney(
    vat,
    company.currency
  );
  document.getElementById("doc-grand-total").textContent = formatMoney(
    grand,
    company.currency
  );

  const words = grand ? amountToWords(grand) : "";
  const wordsDisplay = document.getElementById("amount-words-display");
  const docWords = document.getElementById("doc-amount-words");
  if (wordsDisplay) {
    wordsDisplay.textContent = words ? words.charAt(0).toUpperCase() + words.slice(1) : "";
  }
  if (docWords) {
    docWords.textContent = words
      ? words.charAt(0).toUpperCase() + words.slice(1)
      : "";
  }
}

function updateMoneyDisplays() {
  // Recalculate to apply any currency change
  updateItemsTotals();
}

function initItemsTable() {
  const tbody = document.getElementById("items-body");
  const addBtn = document.getElementById("add-item-row");

  function addRow(prefillDesc) {
    const row = createItemRow(tbody.rows.length);
    tbody.appendChild(row);
    if (prefillDesc) {
      const descInput = row.querySelector(".item-desc");
      if (descInput) {
        descInput.value = prefillDesc;
      }
    }
    updateItemsTotals();
  }

  addBtn.addEventListener("click", addRow);

  // Start with 3 demo rows
  addRow();
  addRow();
  addRow();

  window._tpaiAddItemRow = (desc) => addRow(desc);
}

function getHistory() {
  return loadHistory();
}

function saveHistoryEntry(entry) {
  const history = getHistory();
  history.unshift(entry);
  saveHistory(history.slice(0, 100));
}

function renderHistory(filterTerm = "") {
  const list = document.getElementById("history-list");
  const history = getHistory();
  list.innerHTML = "";
  if (!history.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    const lang = currentLang();
    empty.textContent = (I18N[lang] && I18N[lang].historyEmptyLong) || "No documents saved yet. Generate and save a document to see it here.";
    list.appendChild(empty);
    const summaryEl = document.getElementById("history-summary");
    if (summaryEl) summaryEl.textContent = (I18N[lang] && I18N[lang].noDocumentsYet) || "No documents yet.";
    return;
  }

  const term = filterTerm.trim().toLowerCase();
  let filtered = history;
  if (term) {
    filtered = history.filter((h) => {
      return (
        (h.clientName || "").toLowerCase().includes(term) ||
        (h.number || "").toLowerCase().includes(term) ||
        (h.typeLabel || "").toLowerCase().includes(term) ||
        (h.date || "").toLowerCase().includes(term)
      );
    });
  }

  let totalAmount = 0;

  const lang = currentLang();
  const t = (key) => (I18N[lang] && I18N[lang][key]) || key;
  filtered.forEach((h) => {
    const card = document.createElement("div");
    card.className = "history-card";
    const numericTotal = parseFloat(
      String(h.totalFormatted || "")
        .replace(/[^\d.,-]/g, "")
        .replace(/,/g, "")
    );
    if (!isNaN(numericTotal)) totalAmount += numericTotal;
    card.innerHTML = `
      <div class="history-main-line">
        ${h.typeLabel} • <strong>${h.number}</strong>
      </div>
      <div class="history-meta">
        ${h.clientName || (lang === "sw" ? "Mteja" : "Client")} • ${h.date || ""}
      </div>
      <div class="history-total">
        ${h.totalFormatted || ""}
      </div>
      <div class="history-subtext">
        ${t("historySavedAs")} "${h.filename || "document"}.pdf"
      </div>
      <div class="history-actions">
        <button class="btn ghost small" data-hist-open="${h.id}">${t("historyOpen")}</button>
        <button class="btn secondary small" data-hist-duplicate="${h.id}">${t("historyDuplicate")}</button>
        <button class="btn ghost small" data-hist-delete="${h.id}">${t("historyDelete")}</button>
      </div>
    `;
    list.appendChild(card);
  });

  const summaryEl = document.getElementById("history-summary");
  if (summaryEl) {
    const company = getCurrentCompany();
    const countPhrase = (I18N[lang] && I18N[lang].historyDocsCount) || "document(s), total value approx.";
    summaryEl.textContent = `${filtered.length} ${countPhrase} ${formatMoney(
      totalAmount,
      company.currency
    )}`;
  }

  // Wire actions
  list.querySelectorAll("[data-hist-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-hist-open");
      openHistoryDocument(id, false);
    });
  });
  list.querySelectorAll("[data-hist-duplicate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-hist-duplicate");
      openHistoryDocument(id, true);
    });
  });
  list.querySelectorAll("[data-hist-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-hist-delete");
      deleteHistoryEntry(id);
    });
  });
}

function captureDocumentState() {
  const meta = window._tpaiGetDocMeta?.() || {};
  const client = {
    name: document.getElementById("client-name").value,
    company: document.getElementById("client-company").value,
    address: document.getElementById("client-address").value,
    phone: document.getElementById("client-phone").value,
  };
  const items = [];
  const rows = document.querySelectorAll("#items-body tr");
  rows.forEach((row) => {
    items.push({
      desc: row.querySelector(".item-desc")?.value || "",
      qty: row.querySelector(".item-qty")?.value || "",
      price: row.querySelector(".item-unit-price")?.value || "",
    });
  });
  const terms = document.getElementById("terms").value;
  const preparedBy = document.getElementById("prepared-by").value;
  const authSig = document.getElementById("authorized-signature").value;
  const discountRate =
    document.getElementById("discount-rate")?.value || "0";
  const letterBody = document.getElementById("letter-body")?.value || "";
  const letterPrompt = document.getElementById("letter-ai-prompt")?.value || "";

  return {
    meta,
    client,
    items,
    terms,
    preparedBy,
    authSig,
    discountRate,
    letterBody,
    letterPrompt,
  };
}

function applyDocumentState(state, duplicate = false) {
  if (!state || !state.meta) return;
  const typeSelect = document.getElementById("document-type");
  const dateInput = document.getElementById("document-date");
  const numberInput = document.getElementById("document-number");

  typeSelect.value = state.meta.typeKey || "quotation";
  dateInput.value = state.meta.date || dateInput.value;

  // If duplicating, let numbering logic assign new number
  if (duplicate) {
    const evt = new Event("change");
    typeSelect.dispatchEvent(evt);
  } else {
    numberInput.value = state.meta.number || "";
  }

  document.getElementById("client-name").value = state.client.name || "";
  document.getElementById("client-company").value = state.client.company || "";
  document.getElementById("client-address").value =
    state.client.address || "";
  document.getElementById("client-phone").value = state.client.phone || "";

  const tbody = document.getElementById("items-body");
  tbody.innerHTML = "";
  state.items.forEach((it, idx) => {
    const row = createItemRow(idx);
    tbody.appendChild(row);
    row.querySelector(".item-desc").value = it.desc || "";
    row.querySelector(".item-qty").value = it.qty || "";
    row.querySelector(".item-unit-price").value = it.price || "";
  });

  document.getElementById("terms").value = state.terms || DEFAULT_TERMS;
  document.getElementById("prepared-by").value = state.preparedBy || "";
  document.getElementById("authorized-signature").value =
    state.authSig || "";
  const discEl = document.getElementById("discount-rate");
  if (discEl) discEl.value = state.discountRate || "0";

  const bodyInput = document.getElementById("letter-body");
  const promptInput = document.getElementById("letter-ai-prompt");
  if (bodyInput) bodyInput.value = state.letterBody || "";
  if (promptInput) promptInput.value = state.letterPrompt || "";

  // Trigger bindings to refresh preview/totals
  updateItemsTotals();
  initClientBindings();
  initPreparedByBindings();
  initTerms();
}

function openHistoryDocument(id, duplicate) {
  const history = getHistory();
  const entry = history.find((h) => String(h.id) === String(id));
  if (!entry || !entry.state) return;
  applyDocumentState(entry.state, duplicate);
}

function deleteHistoryEntry(id) {
  let history = getHistory();
  history = history.filter((h) => String(h.id) !== String(id));
  saveJSON(STORAGE_KEYS.HISTORY, history);
  renderHistory(document.getElementById("history-search")?.value || "");
}

function initActions() {
  const printBtn = document.getElementById("print-document");
  const downloadBtn = document.getElementById("download-pdf");
  const saveBtn = document.getElementById("save-document");
  const shareBtn = document.getElementById("share-whatsapp");
  const emailBtn = document.getElementById("send-email");
  const shareToolBtn = document.getElementById("share-tool");

  printBtn.addEventListener("click", () => {
    window.print();
  });

  downloadBtn.addEventListener("click", () => {
    generatePdf("download");
  });

  saveBtn.addEventListener("click", async () => {
    const meta = window._tpaiGetDocMeta?.() || {};
    const defaultName = meta.number || "document";
    const filename = prompt(
      "Enter filename for this document (without extension):",
      defaultName
    );
    if (!filename) return;

    await generatePdf("save", filename);

    const company = getCurrentCompany();
    const grandDisplay = document.getElementById("doc-grand-total").textContent;
    const clientName = document.getElementById("client-name").value.trim();

    const historyEntry = {
      id: Date.now().toString(),
      typeLabel: meta.typeLabel,
      typeKey: meta.typeKey,
      number: meta.number,
      date: meta.date,
      clientName,
      totalFormatted: grandDisplay,
      filename,
      savedAt: new Date().toISOString(),
      currency: company.currency,
      state: captureDocumentState(),
    };

    saveHistoryEntry(historyEntry);
    renderHistory();
    alert("Document saved and recorded in local history.");
  });

  shareBtn.addEventListener("click", async () => {
    try {
      const blob = await generatePdf("blob");
      const meta = window._tpaiGetDocMeta?.() || {};
      const file = new File([blob], `${meta.number || "document"}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: meta.typeLabel || "Business Document",
          text:
            (meta.number
              ? `${meta.typeLabel || "Document"} ${meta.number}`
              : "Business document") +
            " generated via TradePilotAI.",
          files: [file],
        });
      } else {
        const message =
          encodeURIComponent(
            `Hello, please find ${
              meta.typeLabel || "the document"
            } ${meta.number || ""} generated via TradePilotAI.`
          ) + "%0A%0Ahttps://tradepilot.ai (demo link)";
        const url = `https://wa.me/?text=${message}`;
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("WhatsApp share failed:", err);
      alert(
        "Unable to share via WhatsApp automatically in this browser, but you can still download the PDF and attach it manually."
      );
    }
  });

  emailBtn.addEventListener("click", () => {
    const meta = window._tpaiGetDocMeta?.() || {};
    const company = getCurrentCompany();
    const clientName = document.getElementById("client-name").value.trim();
    const grand = document.getElementById("doc-grand-total").textContent;

    const subject = encodeURIComponent(
      `${meta.typeLabel || "DOCUMENT"} ${meta.number || ""} from ${
        company.name || "Our Company"
      }`
    );
    const bodyLines = [
      clientName ? `Dear ${clientName},` : "Dear client,",
      "",
      `Please find attached ${meta.typeLabel || "the document"} ${
        meta.number || ""
      } from ${company.name || "our company"}.`,
      grand ? `Total amount: ${grand}.` : "",
      "",
      "This document was generated using TradePilotAI Free Plan.",
      "",
      "Thank you.",
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  if (shareToolBtn) {
    shareToolBtn.addEventListener("click", async () => {
      const shareText =
        "Try this free-forever TradePilotAI business document generator for quotations, invoices, delivery notes and more.";
      const shareUrl = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: "TradePilotAI Free Document Tool",
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch {
          // ignore and fall back
        }
      }
      const waUrl =
        "https://wa.me/?text=" +
        encodeURIComponent(shareText + " " + shareUrl);
      window.open(waUrl, "_blank");
    });
  }
}

function generatePdf(mode, filenameBase) {
  const element = document.getElementById("document-preview");
  const meta = window._tpaiGetDocMeta?.() || {};
  const company = getCurrentCompany();

  const filename = `${
    filenameBase || meta.number || "document"
  }-${(company.name || "company")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 24)}.pdf`;

  const opt = {
    margin: [5, 5, 5, 5],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      letterRendering: true,
    },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    pagebreak: { mode: [] },
  };

  if (mode === "blob") {
    return html2pdf().set(opt).from(element).outputPdf("blob");
  }

  if (mode === "download" || mode === "save") {
    html2pdf().set(opt).from(element).save();
    return Promise.resolve();
  }
}

function initLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  function updateLabel() {
    btn.textContent = currentLang() === "en" ? "EN | SW" : "SW | EN";
    btn.title = currentLang() === "en" ? "Kiswahili" : "English";
  }
  updateLabel();
  btn.addEventListener("click", () => {
    const next = currentLang() === "en" ? "sw" : "en";
    setLang(next);
    updateLabel();
    applyLanguage();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAuth(() => {
    initTabs();
    initCompanySettings();
    initDocumentBasics();
    initClientBindings();
    initPreparedByBindings();
    initTerms();
    initItemsTable();
    initActions();
    renderHistory();
    initLangToggle();
    applyLanguage();

    const btnCreateNew = document.getElementById("btn-create-new-doc");
    if (btnCreateNew) {
      btnCreateNew.addEventListener("click", () => goToCreateDocument(true));
    }

    const searchInput = document.getElementById("history-search");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        renderHistory(searchInput.value);
      });
    }
  });
});

