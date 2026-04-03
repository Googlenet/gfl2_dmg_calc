// ─────────────────────────────────────────────────────────────────────────────
// food_buffs.js  —  GFL2 Food Buff Database
//
// SCHEMA
// ──────
//   {
//     id:          string,   — unique identifier (e.g. 'food_grilled_steak')
//     name:        string,   — display name shown in the dropdown
//     description: string,   — flavour text or in-game description
//     buff: {
//       flatAtk?:  number,   — flat ATK added in-battle
//       atkPct?:   number,   — ATK% added in-battle (e.g. 5 = +5%)
//       dmgPct?:   number,   — DMG% added
//       critRate?: number,   — Crit Rate% added
//     }
//   }
//
// To add a new food: copy a block below, give it a unique id, and fill in the
// name, description, and buff values. Unused buff fields can be omitted entirely.
// buff can be null if the effect does not affect damage calculations.
// Entries are sorted alphabetically by name.
// ─────────────────────────────────────────────────────────────────────────────

const FOOD_BUFFS = [

  {
    id:          'big_mex',
    name:        'Big Mex',
    description: 'When making Out-Of-Turn attacks, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'black_truffle',
    name:        'Black Truffle Double Beefburger',
    description: 'Damage dealt by active attacks which are not Ultimate skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'blazing_tomahawk',
    name:        'Blazing Tomahawk Steak',
    description: 'Max HP is increased by 25 points. Considered a buff, cannot be cleansed.',
    buff:        null,
  },

  {
    id:          'borscht',
    name:        'Borscht',
    description: 'When dealing Physical damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'braised_intestines',
    name:        'Braised Intestines In Brown Source',
    description: 'Damage dealt to Boss units is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'brussels_salad',
    name:        'Brussels Sprout Salad',
    description: 'Defense is increased by 25 points. Considered a buff, cannot be cleansed.',
    buff:        null,
  },

  {
    id:          'buttered_escargots',
    name:        'Buttered Escargots',
    description: 'Damage dealt by Ultimate skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'country_style',
    name:        'Country-style Stir Fry',
    description: 'When dealing Electric damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'doner_kebab',
    name:        'Doner Kebab',
    description: 'When dealing Burn damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'faraway_hulatang',
    name:        'Faraway Hulatang',
    description: 'Hydro damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 2 },
  },

  {
    id:          'golden_yanbaochi',
    name:        'Golden Yanbaochi',
    description: 'Physical and phase damage taken is reduced by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        null,
  },

  {
    id:          'hot_sour_pork',
    name:        'Hot and Sour Double-Cooked Pork',
    description: 'Targeted damage dealt is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'kofta',
    name:        'Kofta',
    description: 'When dealing Hydro damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'miso_oden',
    name:        'Miso Oden',
    description: 'Damage dealt by Confectance skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'potatoes',
    name:        'Potatoes au Gratin',
    description: 'Attack is increased by 25 points. Considered a buff, cannot be cleansed.',
    buff:        { flatAtk: 25 },
  },

  {
    id:          'prawn_platter',
    name:        'Prawn Platter',
    description: 'Freeze damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 2 },
  },

  {
    id:          'prawn_potstickers',
    name:        'Prawn Potstickers',
    description: 'When making an active attack, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'roasted_shawarma',
    name:        'Roasted Shawarma',
    description: 'Burn damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 2 },
  },

  {
    id:          'rosemary_chicken',
    name:        'Rosemary Chicken',
    description: 'Damage dealt by non-Confectance skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'sanxian_jiaozi',
    name:        'Sanxian Jiaozi',
    description: 'Physical damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 2 },
  },

  {
    id:          'sea_snails',
    name:        'Sea Snails in Spicy Wine',
    description: 'When dealing Freeze damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'seafood_sashimi',
    name:        'Seafood Sashimi',
    description: 'AoE damage is increased by 3%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 3 },
  },

  {
    id:          'stargazy_pie',
    name:        'Stargazy Pie',
    description: 'Electric damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 2 },
  },

  {
    id:          'sweet_sour_lion',
    name:        'Sweet and Sour Lion\'s Head',
    description: 'Corrosion damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { dmgPct: 2 },
  },

  {
    id:          'tabbouleh',
    name:        'Tabbouleh',
    description: 'When dealing Corrosion damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff:        { atkPct: 2.5 },
  },

  {
    id:          'takoyaki',
    name:        'Takoyaki',
    description: 'Critical rate is increased by 2%. Considered a buff, cannot be cleansed.',
    buff:        { critRate: 2 },
  },

];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFood(id) {
  return FOOD_BUFFS.find(f => f.id === id) || null;
}

function getFoodList() {
  return FOOD_BUFFS;
}
