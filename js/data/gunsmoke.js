// ─────────────────────────────────────────────────────────────────────────────
// gunsmoke.js  —  GFL2 Gunsmoke Mode Buff Database
//
// SCHEMA
// ──────
//   {
//     id:          string,   — unique identifier, used as state key
//     label:       string,   — display name on the toggle row
//     description: string,   — source / condition note
//     group?:      string,   — if set, only one buff in the same group can be
//                              active at once (toggling one deactivates others)
//     buff: {
//       atkPct?:   number,   — ATK% added (percentage points, e.g. 25 = +25%)
//       dmgPct?:   number,   — DMG% added (percentage points, e.g. 40 = +40%)
//     }
//   }
//
// Ordering: list buffs from lowest to highest milestone so the UI renders
// them in progression order.
// ─────────────────────────────────────────────────────────────────────────────

const GUNSMOKE_BUFFS = [

  {
    id:          'gs_1_2',
    label:       '1.2 — +15% ATK/HP/DEF Boost',
    description: 'Platoon milestone 1.2. ATK, HP, and DEF increased by 15%. Mutually exclusive with 7.1.',
    group:       'atk_boost',
    buff: { atkPct: 15 },
  },

  {
    id:          'gs_3_1',
    label:       '3.1 — +30% AoE DMG Boost',
    description: 'Platoon milestone 3.1. AoE damage dealt increased by 30%.',
    buff: { dmgPct: 30 },
  },

  {
    id:          'gs_5_1',
    label:       '5.1 — +30% Targeted DMG Boost',
    description: 'Platoon milestone 5.1. Targeted (single-target) damage dealt increased by 30%.',
    buff: { dmgPct: 30 },
  },

  {
    id:          'gs_7_1',
    label:       '7.1 — +25% ATK/HP/DEF Boost',
    description: 'Platoon milestone 7.1. ATK, HP, and DEF increased by 25%. Mutually exclusive with 1.2.',
    group:       'atk_boost',
    buff: { atkPct: 25 },
  },

  {
    id:          'gs_9_1',
    label:       '9.1 — +40% DMG Dealt Boost',
    description: 'Platoon milestone 9.1. All damage dealt increased by 40%.',
    buff: { dmgPct: 40 },
  },

];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGunsmokeBuffList() {
  return GUNSMOKE_BUFFS;
}

function getGunsmokeBuffById(id) {
  return GUNSMOKE_BUFFS.find(b => b.id === id);
}
