const fs = require("fs");
const path = require("path");

const inputFile = "./csv/designers_1_cleaned.csv";

const mdOutputDir = path.join("wiki", "designers", "_staging");
const assetsOutputDir = path.join("wiki", "assets", "designers");

function cleanCell(value = "") {
  return String(value).trim().replace(/^"|"$/g, "");
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

function yamlString(value = "") {
  const str = cleanCell(value);
  return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function getHeaderIndex(headers, names) {
  return headers.findIndex((h) => names.includes(h));
}

function getInstagramHandle(instagram = "") {
  return cleanCell(instagram)
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/^instagram\.com\//i, "")
    .replace(/^instagr\.am\//i, "")
    .split("?")[0]
    .replace(/\/$/g, "")
    .replace(/^@/, "")
    .trim();
}

function safeSlug(value = "") {
  return cleanCell(value)
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function rowValue(row, index) {
  return index >= 0 ? cleanCell(row[index] || "") : "";
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Could not find ${inputFile}`);
  console.error("Run normalizeDesignersCsv.js first.");
  process.exit(1);
}

const csv = fs.readFileSync(inputFile, "utf8").trim();
const lines = csv.split(/\r?\n/);

const headers = parseCsvLine(lines[0]).map(cleanCell);
const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

const appliedIndex = getHeaderIndex(normalizedHeaders, ["applied"]);
const emailIndex = getHeaderIndex(normalizedHeaders, ["email"]);
const firstNameIndex = getHeaderIndex(normalizedHeaders, ["first name", "first_name", "firstname"]);
const lastNameIndex = getHeaderIndex(normalizedHeaders, ["last name", "last_name", "lastname"]);
const nameIndex = getHeaderIndex(normalizedHeaders, ["name"]);
const countryIndex = getHeaderIndex(normalizedHeaders, ["country"]);
const canUseIndex = getHeaderIndex(normalizedHeaders, ["can use", "can_use"]);
const instagramIndex = getHeaderIndex(normalizedHeaders, ["instagram", "insta", "instagram_url"]);
const websiteIndex = getHeaderIndex(normalizedHeaders, ["website", "website_url", "site"]);
const acceptedIndex = getHeaderIndex(normalizedHeaders, ["accepted"]);
const levelIndex = getHeaderIndex(normalizedHeaders, ["level", "designer_level"]);

if (instagramIndex === -1) {
  console.error("❌ Could not find Instagram column.");
  process.exit(1);
}

fs.mkdirSync(mdOutputDir, { recursive: true });
fs.mkdirSync(assetsOutputDir, { recursive: true });

let created = 0;
let skipped = 0;

for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);

  const applied = rowValue(row, appliedIndex);
  const email = rowValue(row, emailIndex);
  const firstName = rowValue(row, firstNameIndex);
  const lastName = rowValue(row, lastNameIndex);

  const existingName = rowValue(row, nameIndex);
  const name = existingName || [firstName, lastName].filter(Boolean).join(" ");

  const country = rowValue(row, countryIndex);
  const canUse = rowValue(row, canUseIndex);
  const instagram = rowValue(row, instagramIndex);
  const website = rowValue(row, websiteIndex);
  const accepted = rowValue(row, acceptedIndex);
  const level = rowValue(row, levelIndex);

  const instagramHandle = getInstagramHandle(instagram);
  const slug = safeSlug(instagramHandle);

  if (!slug) {
    skipped++;
    continue;
  }

  const assetFolder = `wiki/assets/designers/${slug}`;
  const designerAssetsDir = path.join(assetsOutputDir, slug);

  fs.mkdirSync(path.join(designerAssetsDir, "profile"), { recursive: true });
  fs.mkdirSync(path.join(designerAssetsDir, "instagram"), { recursive: true });
  fs.mkdirSync(path.join(designerAssetsDir, "website"), { recursive: true });

  const mdPath = path.join(mdOutputDir, `${slug}.md`);

  const yaml = `---
applied: ${yamlString(applied)}
email: ${yamlString(email)}
name: ${yamlString(name)}
slug: ${yamlString(slug)}
type: "pattern designer"
experience: ""
open to: ["",""]
pricing: ["",""]
skills: ["","","",""]
country: ${yamlString(country)}
can_use: ${yamlString(canUse)}
instagram_handle: ${yamlString(instagramHandle)}
instagram: ${yamlString(instagram)}
bio: ""
website: ${yamlString(website)}
website_about: ""
accepted: ${yamlString(accepted)}
level: ${yamlString(level)}
asset_folder: ${yamlString(assetFolder)}
profile_url: ""
instagram_images: ["","","","","",""]
website_images: ["","","",""]
tags:
  - pattern_designer
${level ? `  - ${level}` : ""}
---`;

  const markdown = `${yaml}

# ${slug}

## Profile Image

## Instagram Images

## Website Images


## Overview

## Style and Aesthetic

## Techniques and Tools

## Markets and Clients

## Portfolio and Presence

## Career Path

## Pattern Focus

## Connections
`;

  fs.writeFileSync(mdPath, markdown);
  created++;
}

console.log(`✅ Created ${created} MD files in: ${mdOutputDir}`);
console.log(`✅ Created asset folders in: ${assetsOutputDir}`);

if (skipped) {
  console.log(`⚠️ Skipped ${skipped} rows with no Instagram handle.`);
}