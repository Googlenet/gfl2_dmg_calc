// ─────────────────────────────────────────────────────────────────────────────
// dolls.js  —  GFL2 Doll Database: registry + helpers
//
// Individual doll files live in js/data/dolls/ and each call DOLLS.push({...}).
// Load order: dolls.js (this file) → each doll file → calculator.js → ui.js
//
// ─────────────────────────────────────────────────────────────────────────────
//
// DOLL SCHEMA
// ────────────
//   id          string   — unique identifier, e.g. 'klukai'
//   name        string   — display name
//   class       string   — 'Sentinel', 'Support', 'Bulwark', 'Vanguard'
//   ammoType    string   — 'Light', 'Medium', 'Heavy', 'Shotgun', 'Melee'
//   phase       string   — elemental phase: 'Electric', 'Corrosion', etc.
//   baseCritDmg number   — base crit DMG %, pre-fills the locked crit DMG field
//   skills      array    — see SKILL SCHEMA below
//   passives    array    — see PASSIVES SCHEMA below
//   supportSkills array  — see SUPPORT SKILLS SCHEMA below
//   flowerSlots array    — 6 entries, each a flower type key
//   imagoform   array    — see IMAGOFORM SCHEMA below (optional)
//   notes       string   — freeform notes shown nowhere, just for reference
//
// ─────────────────────────────────────────────────────────────────────────────
//
// SKILL SCHEMA
// ─────────────
//   id              string   — unique skill id
//   name            string   — display name
//   phase_dmg_type  string|null  — 'electric','corrosion','physical','burn','hydro','freeze'
//   target_type     string|null  — 'aoe', 'targeted'
//   skill_type      string|null  — 'active', 'oot'
//   ammo_type       string|null  — 'light','medium','heavy','melee','shotgun'
//   description     string
//   multiplier      number|array|null  — single value, array of {label,value}, or null
//   vertebrae       array|null   — valid V levels, or null = all levels
//   cooldown        number|null
//   stability_dmg   number|null
//   confectance_cost number|null
//   canCrit         bool
//   scalingStat     string   — e.g. 'ATK'
//   notes           string   — optional, shown on skill card
//   // Optional scaling overrides:
//   multiHit        bool     — true if multiplier is a multi-hit array (not selectable)
//   scalingType     string   — 'stack_bonus' | 'stability_overflow'
//   stackLabel      string   — label for stack input
//   stackRate       number   — % per stack
//   stackMax        number   — max stacks
//   overflowRate    number   — % per overflow point (stability_overflow only)
//
// ─────────────────────────────────────────────────────────────────────────────
//
// PASSIVES SCHEMA  (self-only effects when this doll is the active doll)
// ────────────────
//   { type: 'stack_selector',
//     key, label, max,
//     effect: (stacks) => ({ atkPct?, dmgPct?, critDmg?, critRate?, defReducPct?, ... }),
//     vertebrae?, notes? }
//
//   { type: 'toggle',
//     key, label, condition?,
//     effect: { atkPct?, dmgPct?, critDmg?, critRate?,
//               fixedDmgPct?, fixedAtkPct?, dmgMultiplier?, fixedAtkMultiplier?,
//               defReducPct?, ... },
//     vertebrae?, notes? }
//
// Effect key sign convention:
//   Positive values = buff (atkPct, dmgPct, critDmg, critRate)
//   Positive values = reduction amount for reduction keys (defReducPct, defReduc)
//   The calculator handles the sign internally; the UI derives display sign from key name.
//
// ─────────────────────────────────────────────────────────────────────────────
//
// SUPPORT SKILLS SCHEMA  (effects this doll applies to the team)
// ──────────────────────
//   Same shape as passives. Used in the Team Skills panel when this doll is
//   selected as a teammate. Effects feed into getTeamSkillResult().
//
// ─────────────────────────────────────────────────────────────────────────────
//
// IMAGOFORM SCHEMA
// ─────────────────
//   { tier: string,           — matches IMAGOFORM_TIERS key
//     requires: { bulwark?, vanguard?, support?, sentinel? },
//     effect: { ... },        — same effect keys as passives
//     description: string }
//
// ─────────────────────────────────────────────────────────────────────────────

const DOLLS = [];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getDoll(id) {
  return DOLLS.find(d => d.id === id);
}

function getDollList() {
  return [...DOLLS].sort((a, b) => a.name.localeCompare(b.name));
}

// Normalize a vertebrae level to a number (accepts 'v0'–'v6' or 0–6)
function parseVLevel(v) {
  return typeof v === 'number' ? v : parseInt(v.slice(1));
}

function getSkillsForVertebrae(doll, vLevel) {
  if (!doll) return [];
  const seen = new Set();
  const result = [];
  const vNum = parseVLevel(vLevel);
  for (const skill of doll.skills) {
    if (seen.has(skill.id)) continue;
    if (skill.vertebrae === null || skill.vertebrae.includes(vNum)) {
      seen.add(skill.id);
      result.push(skill);
    }
  }
  return result;
}
