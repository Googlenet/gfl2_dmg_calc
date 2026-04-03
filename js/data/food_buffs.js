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
//       flatAtk: number,   — flat ATK added in-battle
//       atkPct:  number,   — ATK% added in-battle (e.g. 5 = +5%)
//     }
//   }
//
// To add a new food: copy a block below, give it a unique id, and fill in the
// name, description, and buff values. Unused buff fields can be omitted entirely.
// ─────────────────────────────────────────────────────────────────────────────

const FOOD_BUFFS = [

  {
    id: 'doner_kebab',
    name: 'Doner Kebab',
    description: 'When dealing Burn damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'kofta',
    name: 'Kofta',
    description: 'When dealing Hydro damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'tabbouleh',
    name: 'Tabbouleh',
    description: 'When dealing Corrosion damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'country_style',
    name: 'Country-style Stir Fry',
    description: 'When dealing Electric damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'sea_snails',
    name: 'Sea Snails in Spicy Wine',
    description: 'When dealing Freeze damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'borscht',
    name: 'Borscht',
    description: 'When dealing Physical damage, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'big_mex',
    name: 'Big Mex',
    description: 'When making Out-Of-Turn atacks, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'prawn_potstickers',
    name: 'Prawn Potstickers',
    description: 'When making an active attack, attack is increased by 2.5%. Considered a buff, cannot be cleansed.',
    buff: { atkPct: 2.5 },
  },

  {
    id: 'roasted_shawarma',
    name: 'Roasted Shawarma',
    description: 'Burn damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 2 },
  },

  {
    id: 'faraway_hulatang',
    name: 'Faraway Hulatang',
    description: 'Hydro damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 2 },
  },
  
  {
    id: 'sweet_sour_lion',
    name: 'Sweet and Sour Lion\'s Head',
    description: 'Corrosion damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 2 },
  },

  {
    id: 'stargazy_pie',
    name: 'Stargazy Pie',
    description: 'Electric damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 2 },
  },

  {
    id: 'prawn_platter',
    name: 'Prawn Platter',
    description: 'Freeze damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 2 },
  },

  {
    id: 'sanxian_jiaozi',
    name: 'Sanxian Jiaozi',
    description: 'Physical damage dealt is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 2 },
  },

  {
    id: 'buttered_escargots',
    name: 'Buttered Escargots',
    description: 'Damage dealt by Ultimate skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'black_truffle',
    name: 'Black Truffle Double Beefburger',
    description: 'Damage dealt by active attacks which are not Ultimate skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'golden_yanbaochi',
    name: 'Golden Yanbaochi',
    description: 'Physical and phase damage taken is reduced by 2.5%. Considered a buff, cannot be cleansed.',
    buff: null,
  },

  {
    id: 'seafood_sashimi',
    name: 'Seafood Sashimi',
    description: 'AoE damage is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'hot_sour_pork',
    name: 'Hot and Sour Double-Cooked Pork',
    description: 'Targeted damage dealt is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'miso_oden',
    name: 'Miso Oden',
    description: 'Damage dealt by Confectance skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'rosemary_chicken',
    name: 'Rosemary Chicken',
    description: 'Damage dealt by non-Confectance skills is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'braised_intestines',
    name: 'Braised Intestines In Brown Source',
    description: 'Damage dealt to Boss units is increased by 3%. Considered a buff, cannot be cleansed.',
    buff: { dmgPct: 3 },
  },

  {
    id: 'potatoes',
    name: 'Potatoes au Gratin',
    description: 'Attack is increased by 25 points. Considered a buff, cannot be cleansed.',
    buff: { flatAtk: 25 },
  },

  {
    id: 'brussels_salad',
    name: 'Brussels Sprout Salad',
    description: 'Defense is increased by 25 points. Considered a buff, cannot be cleansed.',
    buff: null,
  },

  {
    id: 'blazing_tomahawk',
    name: 'Blazing Tomahawk Steak',
    description: 'Max HP is increased by 25 points. Considered a buff, cannot be cleansed.',
    buff: null,
  },

  {
    id: 'takoyaki',
    name: 'Takoyaki',
    description: 'Critical rate is increased by 2%. Considered a buff, cannot be cleansed.',
    buff: { critRatePct: 2 },
  },

];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFood(id) {
  return FOOD_BUFFS.find(f => f.id === id) || FOOD_BUFFS[0];
}

function getFoodList() {
  return FOOD_BUFFS;
}
