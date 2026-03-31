// ─────────────────────────────────────────────────────────────────────────────
// dolls.js  —  GFL2 Doll Database
//
// Each entry in DOLLS represents one doll.
// Schema:
//
// {
//   id:        string   — unique slug, used as key (e.g. 'suomi')
//   name:      string   — display name
//   class:     string   — 'Bulwark' | 'Vanguard' | 'Sentinel' | 'Support'
//   ammoType:  string   — e.g. 'Light', 'Medium', 'Heavy', 'Shotgun', 'Melee'
//   phase:     string   — e.g. 'Burn', 'Freeze', 'Electric', 'Corrosion', 'Hydro'
//
//   skills: [           — ordered list of skills the calculator can use
//     {
//       id:          string   — unique slug within the doll (e.g. 'active_1')
//       name:        string   — display name (e.g. 'Focused Strike')
//       type:        string   — 'active' | 'ultimate' | 'passive' | 'support'
//       description: string   — short tooltip text
//       hits:        number   — number of hit instances (1 for single, N for multi-hit)
//       multiplier:  number   — base skill multiplier as a decimal (e.g. 2.50 = 250%)
//                              if multi-hit, this is per-hit multiplier
//       scalingStat: string   — 'ATK' (default) | 'HP' | 'DEF'
//       // optional fields:
//       canCrit:     bool     — defaults to true
//       notes:       string   — any extra context (e.g. 'Only applies if target is burning')
//     }
//   ],
//
//   passives: [         — doll-specific passive bonuses that pre-fill calculator fields
//     {
//       field:   string  — the input id this maps to (e.g. 'dmg_doll_passive')
//       value:   number  — the value to pre-fill (e.g. 20 for 20%)
//       label:   string  — display label in the UI
//     }
//   ],
//
//   notes: string       — general notes about the doll's kit or quirks
// }
//
// ─────────────────────────────────────────────────────────────────────────────

const DOLLS = [

  // ── Template (copy this when adding a new doll) ───────────────────────────
  // {
  //   id: 'doll_id',
  //   name: 'Doll Name',
  //   class: 'Sentinel',
  //   ammoType: 'Light',
  //   phase: 'Burn',
  //   skills: [
  //     {
  //       id: 'active_1',
  //       name: 'Skill Name',
  //       type: 'active',
  //       description: 'Deals X% ATK damage to a single target.',
  //       hits: 1,
  //       multiplier: 2.50,
  //       scalingStat: 'ATK',
  //       canCrit: true,
  //     },
  //   ],
  //   passives: [],
  //   notes: '',
  // },

  // ── Placeholder — replace with real data ─────────────────────────────────
  {
    id: 'generic',
    name: '— Select a Doll —',
    class: '',
    ammoType: '',
    phase: '',
    skills: [
      {
        id: 'manual',
        name: 'Manual Entry',
        type: 'active',
        description: 'Enter your skill multiplier manually in the Skill panel.',
        hits: 1,
        multiplier: null,   // null = user fills in manually
        scalingStat: 'ATK',
        canCrit: true,
      },
    ],
    passives: [],
    notes: 'No doll selected. All fields are manual.',
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — used by ui.js and calculator.js
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the full doll object by id, or undefined. */
function getDoll(id) {
  return DOLLS.find(d => d.id === id);
}

/** Returns all dolls sorted alphabetically by name, excluding the generic placeholder. */
function getDollList() {
  return DOLLS
    .filter(d => d.id !== 'generic')
    .sort((a, b) => a.name.localeCompare(b.name));
}
