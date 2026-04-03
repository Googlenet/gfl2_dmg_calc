// ─────────────────────────────────────────────────────────────────────────────
// common_keys.js  —  GFL2 Common Key Database
//
// SCHEMA
// ──────
//   {
//     id:          string,   — '<doll>_ckey' (e.g. 'robella_ckey')
//     name:        string,   — 'Doll - Key Name' (e.g. 'Robella - Justice Is My Strength')
//     defaultStat:      string,   — stat key for the locked first slot
//                                   ('atkPct' | 'critRate' | 'critDmg' | 'defPct' | 'hpPct')
//     defaultStatLabel: string,   — display name for that first slot (e.g. 'Attack Boost')
//     effect:      string,   — full conditional effect description text
//     effectBuff: {          — structured buff for the conditional effect (toggle separately)
//       atkPct?:   number,
//       dmgPct?:   number,
//       critRate?: number,
//       critDmg?:  number,
//       flatAtk?:  number,
//     },
//   }
//
// To add a new key: copy a block below and fill in all fields.
// effectBuff can be null if the effect does not affect damage calculations.
// Entries are sorted alphabetically by name.
// ─────────────────────────────────────────────────────────────────────────────

const COMMON_KEYS = [

  {
    id:               'alva_ckey',
    name:             'Alva - Mind\'s Eye',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Phase damage dealt to enemy units with Shields is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'andoris_ckey',
    name:             'Andoris - Inductive Field',
    defaultStat:      'defPct',
    defaultStatLabel: 'Defense Boost',
    effect:           'At the start of the turn, for every Electric debuff on the field, increases damage dealt by 5%, to a maximum of 10%. This effect lasts until the end of the round.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'balthilde_ckey',
    name:             'Balthilde - Adept Smith',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'Increase defense for the holder\'s Physical Summon by 7%.',
    effectBuff:       null,
  },

  {
    id:               'belka_ckey',
    name:             'Belka - The Will to Fight for Favor',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Increases damage dealt by 10% if this unit expends mobility.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'centaureissi_ckey',
    name:             'Centaureissi - Essential Hot Beverages',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'At the end of action, applies Heat Recovery to the closest allied unit without Heat Recovery. This effect has a 2-turn cooldown.',
    effectBuff:       null,
  },

  {
    id:               'cheeta_ckey',
    name:             'Cheeta - Overengineered Invention',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When using an active heal, there is a 50% chance to apply 1 random buff to the target for 1 turn.',
    effectBuff:       null,
  },

  {
    id:               'colphne_ckey',
    name:             'Colphne - Fabricated Life',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'Before using a single target active heal, cleanses 1 random debuff from the target.',
    effectBuff:       null,
  },

  {
    id:               'daiyan_ckey',
    name:             'Daiyan - Shattering Stone and Silk',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'At the start of the action, gains Movement Up I for 1 turn. This has a cooldown of 1 turn.',
    effectBuff:       null,
  },

  {
    id:               'dushevnaya_ckey',
    name:             'Dushevnaya - Artistic Inspiration',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'For targets with mobility less than or equal to the user or that cannot move, increases Phase damage dealt by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'faye_ckey',
    name:             'Faye - Holmgang',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'Physical damage taken by enemy units within 3 tiles is increased by 5%.',
    effectBuff:       { dmgPct: 5 },
  },

  {
    id:               'florence_ckey',
    name:             'Florence - Master\'s Command',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'The attack of this unit\'s physical summons is increased by 7%.',
    effectBuff:       null,
  },

  {
    id:               'groza_ckey',
    name:             'Groza - Sustained Endurance',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'When Shelter is active, immune to displacement for 1 time. Has a cooldown of 1 turn.',
    effectBuff:       null,
  },

  {
    id:               'jiangyu_ckey',
    name:             'Jiangyu - Might Makes Right',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Damage dealt to enemies in Stability Break is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'klukai_ckey',
    name:             'Klukai - Murderous Return',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'At the start of the turn, if the user\'s Confectance Index is full, the next instance of AoE damage inflicted by an active attack is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'krolik_ckey',
    name:             'Krolik - Art of Violence',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'If under the effects of a Burn buff, gains immunity to Frozen and Frigid, and increases damage dealt by 5%.',
    effectBuff:       { dmgPct: 5 },
  },

  {
    id:               'ksenia_ckey',
    name:             'Ksenia - Blazing Inferno',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'When applying a Burn buff, there is a 50% chance to apply 1 additional buff to the target for 1 turn.',
    effectBuff:       null,
  },

  {
    id:               'lainie_ckey',
    name:             'Lainie - Complete Liberation',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Damage dealt to enemy units with 0 or lower defense is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'lenna_ckey',
    name:             'Lenna - Razor-Sharp Claws',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'When the user deals targeted damage, applies Conductivity on the target for 1 turn. This effect can be triggered up to twice per turn.',
    effectBuff:       null,
  },

  {
    id:               'leva_ckey',
    name:             'Leva - Elite Agent',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Damage dealt to enemy unit with Electric debuffs is increased by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'lewis_ckey',
    name:             'Lewis - Mighty Miracles',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Ultimate Skill damage is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'lind_ckey',
    name:             'Lind - Endless Night',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When attacking enemy units with debuffs, phase damage dealt is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'littara_ckey',
    name:             'Littara - Vulnerability Exploit',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'Damage dealt to targets with defense debuffs is increased by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'lotta_ckey',
    name:             'Lotta - Hunting Trap',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Increase damage dealt against enemy targets with movement debuffs by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'makiatto_ckey',
    name:             'Makiatto - Survival Instinct',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'At the start of the action, if own HP is greater than 80%, reduces stability damage taken from attacks by 2 points. This can trigger at most once per turn.',
    effectBuff:       null,
  },

  {
    id:               'mechty_ckey',
    name:             'Mechty - Gaming Time',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Basic attack damage is increased by 20%.',
    effectBuff:       { dmgPct: 20 },
  },

  {
    id:               'mosin_nagant_ckey',
    name:             'Mosin-Nagant - All Seeing Eye',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When this unit is under the effects of Insight, increases damage dealt by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'nemesis_ckey',
    name:             'Nemesis - Blessing of the Morning Star',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When this unit is under the effects of Insight, gain 3 additional tiles of movement after killing an enemy target.',
    effectBuff:       null,
  },

  {
    id:               'nikketa_ckey',
    name:             'Nikketa - Defender',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When this unit has a Hydro buff, critical rate is increased by 10%.',
    effectBuff:       { critRate: 10 },
  },

  {
    id:               'papasha_ckey',
    name:             'Papasha - Brilliant Medal',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'Increases damage dealt by allied units\' support skills (excluding self) by 10%. Can trigger at most once per turn.',
    effectBuff:       null,
  },

  {
    id:               'peri_ckey',
    name:             'Peri - Still Growing',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'When attacking the same enemy multiple times, phase damage dealt to it is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'peritya_ckey',
    name:             'Peritya - All Points to Damage',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'If an active skill hits 2 or more enemy targets, damage dealt is increased by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'qiongjiu_ckey',
    name:             'Qiongjiu - Strategic Negotiation',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'Increase damage dealt outside of the unit\'s own turn by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'qiuhua_ckey',
    name:             'Qiuhua - Delicious Cooking',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'When Out-of-Turn Attack deals Burn damage, the damage dealt is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'robella_ckey',
    name:             'Robella - Justice Is My Strength',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'While this unit has Shield effects, phase damage dealt is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'sabrina_ckey',
    name:             'Sabrina - Hot Oil Protection',
    defaultStat:      'defPct',
    defaultStatLabel: 'Defense Boost',
    effect:           'When dealing targeted damage, applies Movement Down II to the target for 1 turn.',
    effectBuff:       null,
  },

  {
    id:               'sakura_ckey',
    name:             'Sakura - Ace Courier',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'AoE damage dealt to enemy targets with debuffs is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'sharkry_ckey',
    name:             'Sharkry - Opening Fireworks',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'If the unit has more than 1 buff, increase damage dealt by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'springfield_ckey',
    name:             'Springfield - Meticulous Attention',
    defaultStat:      'hpPct',
    defaultStatLabel: 'Health Boost',
    effect:           'At the start of the turn, if stability is not full, gains Constant Stability Regen II for 1 turn.',
    effectBuff:       null,
  },

  {
    id:               'suomi_ckey',
    name:             'Suomi - Mission\'s Blessing',
    defaultStat:      'defPct',
    defaultStatLabel: 'Defense Boost',
    effect:           'When HP drops below 80%, restore 15% of this unit\'s maximum HP and gain Defense Up III for 2 turns. Can trigger only once per battle.',
    effectBuff:       null,
  },

  {
    id:               'tololo_ckey',
    name:             'Tololo - Afterglow',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When Confectance Index is below max, increases damage dealt by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'ullrid_ckey',
    name:             'Ullrid - Mangle',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'If the enemy target\'s HP is not full before the attack, increase damage dealt to them by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'vector_ckey',
    name:             'Vector - Death Knell',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'At the start of the turn, if any enemy unit has any Burn debuffs, attack is increased by 8%.',
    effectBuff:       { atkPct: 8 },
  },

  {
    id:               'vepley_ckey',
    name:             'Vepley - Heart Melting Strike',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'If the user\'s Mobility is greater than or equal to the target\'s, increase damage dealt by 7%.',
    effectBuff:       { dmgPct: 7 },
  },

  {
    id:               'voymastina_ckey',
    name:             'Voymastina - Laceration Legato',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When dealing melee damage, increases Physical damage dealt by 10% for 1 round.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'yoohee_ckey',
    name:             'Yoohee - Main Dancer\'s Might',
    defaultStat:      'atkPct',
    defaultStatLabel: 'Attack Boost',
    effect:           'When dealing damage which contains an ammo attribute, damage dealt is increased by 10%.',
    effectBuff:       { dmgPct: 10 },
  },

  {
    id:               'zhaohui_ckey',
    name:             'Zhaohui - Suona\'s Realm',
    defaultStat:      'critRate',
    defaultStatLabel: 'Crit Rate',
    effect:           'At the start of the turn, increases the critical damage of the next active attack by 10%.',
    effectBuff:       { critDmg: 10 },
  },

];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getCommonKey(id) {
  return COMMON_KEYS.find(k => k.id === id) || null;
}

function getCommonKeyList() {
  return COMMON_KEYS;
}
