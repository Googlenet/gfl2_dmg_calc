// ─────────────────────────────────────────────────────────────────────────────
// lind.js  —  Lind doll data
// ─────────────────────────────────────────────────────────────────────────────

DOLLS.push({
  id: 'lind',
  name: 'Lind',
  class: 'Support',
  ammoType: 'Medium',
  phase: 'Corrosion',
  baseCritDmg: 120,   // update with actual base value when confirmed

  skills: [

    {
      id: 'lind_basic',
      name: 'Repulsive Shot',
      phase_dmg_type: 'physical',
      target_type:    'targeted',
      skill_type:     'active',
      ammo_type:      'shotgun',
      description: 'Selects one enemy target within 6 tiles and deals Physical damage equal to 80% of attack to it.',
      multiplier: 0.80,
      vertebrae: null,
      cooldown: null,
      stability_dmg: 3,
      confectance_cost: null,
      canCrit: true,
      scalingStat: 'ATK',
    },

  ],

  passives: [],

  flowerSlots: ['sentinel', 'sentinel', 'sentinel', 'sentinel', 'vanguard', 'bulwark'],
  supportSkills: [

    {
      key:       'fk_radio',
      label:     'Radio Invitation',
      type:      'toggle',
      condition: 'Applied by Lind',
      effect:    { defReducPct: 15 },
      notes:     'All enemy units\' defense is reduced by 15% until the sacrificed Doll dies.',
      vertebrae: null,
    },

  ],

});
