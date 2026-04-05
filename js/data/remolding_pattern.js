// ─────────────────────────────────────────────────────────────────────────────
// remolding_pattern.js  —  Flower (Remolding Pattern) system definitions.
//   - FLOWER_TYPES: the 4 flower types, their main stat pools, and whether
//     they affect the current doll ('self') or teammates ('all').
//   - FLOWER_SUB2_POOL / FLOWER_SUB3_POOL: separate substat pools.
//   - FLOWER_LEVEL_CAPS: max levels per slot tier.
//
// Stat entries use { id, label, values } where:
//   id     = the internal effect key used by calculator.js (e.g. 'bossDmgPct')
//   label  = the in-game display name shown in the UI (e.g. 'Thronebreaker')
//   values = array of stat values indexed by level: values[0] = Lv1, values[N-1] = LvN
//            Main stat: 6 values  (Lv1–Lv6)
//            Sub2:      5 values  (Lv1–Lv5)
//            Sub3:      2 values  (Lv1–Lv2)
//
// affects values:
//   'self' = buff applies to this doll only (Sentinel, Vanguard)
//   'all'  = buff applies to the whole team including this doll (Support, Bulwark)
//
// Per-doll slot layouts (flowerSlots array) live on each doll in dolls.js.
// ─────────────────────────────────────────────────────────────────────────────

const FLOWER_TYPES = {
  sentinel: {
    label: 'Sentinel',
    affects: 'self',
    mainStatPool: [
      { id: 'atkPct',       label: 'Attack Boost',           values: [0.8, 1.2, 2, 2.4, 3.2, 3.6] },
      { id: 'bossDmgPct',   label: 'Thronebreaker',          values: [2, 2.5, 3.5, 4, 5, 5.5] },
      { id: 'aoeDmgPct',    label: 'Area Specialization',    values: [2, 2.5, 3.5, 4, 5, 5.5] },
      { id: 'targetDmgPct', label: 'Pinpoint Specialization',values: [2, 2.5, 3.5, 4, 5, 5.5] },
    ],
  },

  vanguard: {
    label: 'Vanguard',
    affects: 'self',
    mainStatPool: [
      { id: 'critDmg',       label: 'Smite Boost',    values: [1.2, 1.6, 2.4, 2.8, 3.6, 4.0] },
      { id: 'bossDmgPct',    label: 'Beheading Blade', values: [1.5, 2, 3, 3.5, 4.5, 5] },
      { id: 'targetCritDmg', label: 'Precision Blow', values: [1.5, 2, 3, 3.5, 4.5, 5] },
      { id: 'aoeCritDmg',    label: 'Area Smite',     values: [1.5, 2, 3, 3.5, 4.5, 5] },
    ],
  },

  support: {
    label: 'Support',
    affects: 'all',
    mainStatPool: [
      { id: 'atkPct',                  label: 'Attack Unity',   values: [0.3, 0.4, 0.6, 0.7, 0.9, 1] },
      { id: 'hpPct',                   label: 'HP Unity',       values: [0.3, 0.4, 0.6, 0.7, 0.9, 1] },
      { id: ['healPct', 'shieldPct'],  label: 'Healing Boost',  values: [1.5, 2, 3, 3.5, 4.5, 5] },
      { id: ['atkPct', 'hpPct'],       label: 'Fighting Spirit',values: [0.4, 0.6, 1, 1.2, 1.6, 1.8] },
    ],
  },

  bulwark: {
    label: 'Bulwark',
    affects: 'all',
    mainStatPool: [
      { id: 'hpPct',             label: 'HP Boost',         values: [0.8, 1.2, 2, 2.4, 3.2, 3.6] },
      { id: 'defPct',            label: 'Defense Boost',    values: [0.8, 1.2, 2, 2.4, 3.2, 3.6] },
      { id: 'targetDmgReducPct', label: 'Pinpoint Defense', values: [2, 2.5, 3.5, 4, 5, 5.5] },
      { id: 'aoeDmgReducPct',    label: 'Annular Defense',  values: [2, 2.5, 3.5, 4, 5, 5.5] },
    ],
  },
};

// ── Substat pools ─────────────────────────────────────────────────────────────
// Sub2 and sub3 have separate pools regardless of flower type.
// Each entry has a `type` field indicating which flower class it belongs to —
// used by the imagoform system to track total levels invested per type.
// values: 5 entries for sub2 (Lv1–Lv5), 2 entries for sub3 (Lv1–Lv2).

const FLOWER_SUB2_POOL = [
  // ── Vanguard ──
  { id: 'corroCritDmg',  label: 'Corrosive Smite',         type: 'vanguard', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'hydroCritDmg',  label: 'Hydro Smite',             type: 'vanguard', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'burnCritDmg',   label: 'Burning Smite',           type: 'vanguard', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'elecCritDmg',   label: 'Electric Smite',          type: 'vanguard', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'physCritDmg',   label: 'Physical Smite',          type: 'vanguard', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'freezeCritDmg', label: 'Freezing Smite',          type: 'vanguard', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'activeCritDmg',label: 'Onslaught Mastery',       type: 'vanguard', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'ootCritDmg',   label: 'Ambush Mastery',          type: 'vanguard', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  // ── Sentinel ──
  { id: 'corroDmgPct',  label: 'Corrosion Boost',         type: 'sentinel', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'hydroDmgPct',  label: 'Hydro Boost',             type: 'sentinel', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'burnDmgPct',   label: 'Burn Boost',              type: 'sentinel', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'elecDmgPct',   label: 'Electric Boost',          type: 'sentinel', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'physDmgPct',   label: 'Physical Boost',          type: 'sentinel', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'freezeDmgPct', label: 'Freeze Boost',            type: 'sentinel', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'ootDmgPct',    label: 'Raid Stance',             type: 'sentinel', values: [0.2, 0.6, 1, 1.4, 1.8] },
  { id: 'activeDmgPct', label: 'Onslaught Stance',        type: 'sentinel', values: [0.2, 0.6, 1, 1.4, 1.8] },
  // ── Support ──
  { id: 'corroDmgPct',  label: 'Corrosion Unity',         type: 'support',  values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { id: 'hydroDmgPct',  label: 'Hydro Unity',             type: 'support',  values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { id: 'burnDmgPct',   label: 'Burn Unity',              type: 'support',  values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { id: 'elecDmgPct',   label: 'Electric Unity',          type: 'support',  values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { id: 'physDmgPct',   label: 'Physical Unity',          type: 'support',  values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { id: 'freezeDmgPct', label: 'Freeze Unity',            type: 'support',  values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { id: 'flatAtk',      label: 'Ichor Conversion',        type: 'support',  values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'flatHp',       label: 'Ichor Resonance',         type: 'support',  values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  // ── Bulwark ──
  { id: 'corroDmgReduc', label: 'Corrosion Resistance',      type: 'bulwark', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'hydroDmgReduc', label: 'Hydro Resistance',         type: 'bulwark', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'burnDmgReduc',  label: 'Burning Resistance',       type: 'bulwark', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'elecDmgReduc',  label: 'Electric Resistance',      type: 'bulwark', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'physDmgReduc',  label: 'Physical Resistance',      type: 'bulwark', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'freezeDmgReduc',label: 'Freeze Resistance',        type: 'bulwark', values: [0.2, 0.4, 0.6, 0.8, 1.0] },
  { id: 'dmgReduc',      label: 'Breakout Countermeasures', type: 'bulwark', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
  { id: 'dmgReduc',      label: 'Lone Rider Countermeasures',type:'bulwark', values: [0.2, 0.5, 0.8, 1.1, 1.4] },
];

const FLOWER_SUB3_POOL = [
  { id: 'critRate',              label: 'Critical Boost',        type: 'sentinel', values: [1, 2, 3] },
  { id: 'stabBreakDmgPct',       label: 'Follow-Up Strike',      type: 'sentinel', values: [0.5, 1] },
  { id: 'dmgPct',                label: 'Headhunter',            type: 'sentinel', values: [0.4, 0.8, 1.2] },
  { id: 'stabDmg',               label: 'Shock and Awe',         type: 'vanguard', values: [1, 2] },
  { id: 'hpRecov',               label: 'Bloodthirst',           type: 'vanguard', values: [2, 4, 6] },
  { id: 'dmgPct',                label: 'CQC Elite',             type: 'vanguard', values: [0.4, 0.8, 1.2] },
  { id: ['atkPct', 'hpPct'],     label: 'Purification Feedback', type: 'support',  values: [1, 2, 3] },
  { id: 'stabRecov',             label: 'Equilibrium Recovery',  type: 'support',  values: [1, 2] },
  { id: 'hpRecov',               label: 'Life Recovery',         type: 'support',  values: [0.5, 1, 1.5] },
  { id: 'fixedDmg',              label: 'Lex Talionis',          type: 'bulwark',  values: [2, 4, 6] },
  { id: 'dmgReduc',              label: 'Melee Countermeasures', type: 'bulwark',  values: [0.3, 0.6, 0.9] },
  { id: 'dmgReduc',              label: 'Boss Countermeasures',  type: 'bulwark',  values: [0.4, 0.8] },
];

// ── Level caps per slot tier ──────────────────────────────────────────────────
// These are PER-SLOT maximums. Levels stack across slots of the same stat:
// combined level = sum of per-slot levels → values[combinedLevel - 1]
const FLOWER_LEVEL_CAPS = {
  main: 3,
  sub2: 3,
  sub3: 1,
};

// ── Imagoform tier names ──────────────────────────────────────────────────────
// Ordered list of tier keys/labels — universal across all dolls.
// Thresholds and effects are defined per-doll in dolls.js.
const IMAGOFORM_TIERS = [
  { key: 'embryo',   label: 'Embryo'   },
  { key: 'seedling', label: 'Seedling' },
  { key: 'sprout',   label: 'Sprout'   },
  { key: 'shoot',    label: 'Shoot'    },
  { key: 'bud',      label: 'Bud'      },
  { key: 'blossom',  label: 'Blossom'  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getFlowerType(typeKey) {
  return FLOWER_TYPES[typeKey] || null;
}

function getFlowerTypeList() {
  return Object.entries(FLOWER_TYPES).map(([key, val]) => ({ key, ...val }));
}
