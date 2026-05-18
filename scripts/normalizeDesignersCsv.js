const fs = require("fs");

const inputFile = "./csv/designers_1.csv";
const outputFile = "./csv/designers_1_cleaned.csv";

const allowedCountries = [
  "United States", "United Kingdom", "France", "Italy", "Canada",
  "Netherlands", "Australia", "Spain", "Germany", "Japan", "India",
  "Ukraine", "Poland", "Switzerland", "Denmark", "Belgium",
  "United Arab Emirates", "Austria", "Greece", "Brazil", "New Zealand",
  "Serbia", "Portugal", "South Africa", "Argentina", "Sweden", "Croatia",
  "Indonesia", "Czech Republic", "Israel", "Turkey", "Mexico",
  "South Korea", "Colombia", "Iceland", "Romania", "Singapore",
  "Pakistan", "Saudi Arabia", "Chile", "China", "Cyprus", "Estonia",
  "Georgia", "Hong Kong – Macau", "Ireland", "Luxembourg", "Malaysia",
  "Russia", "Slovenia", "Sri Lanka", "Uruguay", "Vietnam", "Bulgaria",
  "Finland", "Hungary", "Latvia", "Lithuania", "Nigeria", "Norway",
  "Thailand", "Belarus", "Egypt", "Kenya", "Malta", "Montenegro",
  "Peru", "Slovakia", "Venezuela", "Algeria", "Armenia", "Bangladesh",
  "Bolivia", "Cayman Islands", "Isle of Man", "Jamaica", "Kazakhstan",
  "Kosovo", "Lebanon", "Mauritius", "Mongolia", "Nepal", "Philippines",
  "Qatar", "Réunion", "Taiwan", "Trinidad and Tobago"
];

const aliases = {
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  england: "United Kingdom",
  scotland: "United Kingdom",
  wales: "United Kingdom",
  britain: "United Kingdom",
  "great britain": "United Kingdom",
  "united kingdom": "United Kingdom",

  usa: "United States",
  us: "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  america: "United States",
  "united states": "United States",

  holland: "Netherlands",
  "the netherlands": "Netherlands",
  netherlands: "Netherlands",

  uae: "United Arab Emirates",
  dubai: "United Arab Emirates",
  "abu dhabi": "United Arab Emirates",

  korea: "South Korea",
  "south korea": "South Korea",

  "hong kong": "Hong Kong – Macau",
  macau: "Hong Kong – Macau",

  czechia: "Czech Republic",
  "czech republic": "Czech Republic",

  reunion: "Réunion",

  bangalore: "India",
  bengaluru: "India",

  yogya: "Indonesia",
  yogyakarta: "Indonesia",

  "salem ma": "United States",
  "salem massachusetts": "United States",
  "orlando fl usa": "United States",
};

function cleanCell(value = "") {
  return String(value).trim().replace(/^"|"$/g, "");
}

function normalizeText(value = "") {
  return cleanCell(value)
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeCountry(value = "") {
  const raw = normalizeText(value);

  if (!raw) return "";
  if (aliases[raw]) return aliases[raw];

  for (const country of allowedCountries) {
    if (normalizeText(country) === raw) return country;
  }

  for (const [alias, country] of Object.entries(aliases)) {
    const pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
    if (pattern.test(raw)) return country;
  }

  for (const country of allowedCountries) {
    const normalizedCountry = normalizeText(country);
    const pattern = new RegExp(`\\b${escapeRegex(normalizedCountry)}\\b`, "i");
    if (pattern.test(raw)) return country;
  }

  return "";
}

function normalizeInstagram(value = "") {
  let raw = cleanCell(value);

  if (!raw) return "";

  raw = raw
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/^instagram\.com\//i, "")
    .replace(/^instagr\.am\//i, "")
    .split("?")[0]
    .replace(/\/$/g, "")
    .trim();

  if (!raw) return "";

  return `https://instagram.com/${raw}`;
}

function normalizeWebsite(value = "") {
  let raw = cleanCell(value);

  if (!raw) return "";
  if (/no website/i.test(raw)) return "";

  raw = raw
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("?")[0]
    .replace(/\/$/g, "")
    .trim();

  if (!raw) return "";

  return `https://${raw}`;
}

function isLevelZeroWebsite(value = "") {
  const raw = cleanCell(value).toLowerCase();

  return [
    "behance",
    "linktr.ee",
    "carrd.co",
    "lnk.bio",
    "adobe",
  ].some((blocked) => raw.includes(blocked));
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function toCsvValue(value = "") {
  const str = String(value);

  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Could not find ${inputFile}`);
  process.exit(1);
}

const csv = fs.readFileSync(inputFile, "utf8").trim();
const lines = csv.split(/\r?\n/);

const originalHeaders = parseCsvLine(lines[0]).map(cleanCell);
const normalizedHeaders = originalHeaders.map((h) => h.toLowerCase().trim());

const countryIndex = normalizedHeaders.findIndex((h) => h === "country");

const instagramIndex = normalizedHeaders.findIndex((h) =>
  ["instagram", "insta", "instagram_url"].includes(h)
);

const websiteIndex = normalizedHeaders.findIndex((h) =>
  ["website", "website_url", "site"].includes(h)
);

let levelIndex = normalizedHeaders.findIndex((h) =>
  ["level", "designer_level"].includes(h)
);

if (countryIndex === -1 || instagramIndex === -1) {
  console.error("❌ Could not find required columns.");
  console.error("Need columns: Country and Instagram");
  process.exit(1);
}

const outputHeaders = [...originalHeaders];

if (levelIndex === -1) {
  outputHeaders.push("Level");
  levelIndex = outputHeaders.length - 1;
}

const output = [];
const unmatchedCountries = [];

output.push(outputHeaders.map(toCsvValue).join(","));

for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);

  while (row.length < outputHeaders.length) {
    row.push("");
  }

  const originalCountry = cleanCell(row[countryIndex]);
  const country = normalizeCountry(originalCountry);

  const instagram = normalizeInstagram(row[instagramIndex]);
  const website = websiteIndex >= 0 ? normalizeWebsite(row[websiteIndex]) : "";

  row[countryIndex] = country;
  row[instagramIndex] = instagram;

  if (websiteIndex >= 0) {
    row[websiteIndex] = website;
  }

  if (!country && originalCountry) {
    unmatchedCountries.push(originalCountry);
  }

  let level = "";

  if (website && isLevelZeroWebsite(website)) {
    level = "level_0";
  } else if (instagram && website) {
    level = "level_2";
  } else if (instagram) {
    level = "level_1";
  }

  row[levelIndex] = level;

  output.push(row.map(toCsvValue).join(","));
}

fs.writeFileSync(outputFile, output.join("\n"));

console.log(`✅ Cleaned CSV created: ${outputFile}`);
console.log("✅ Original columns preserved");
console.log("✅ Country, Instagram, Website cleaned");
console.log("✅ Level added/updated");

if (unmatchedCountries.length) {
  console.log("\n⚠️ Unmatched countries found:");
  [...new Set(unmatchedCountries)].forEach((country) => {
    console.log(`- ${country}`);
  });
}