// ─────────────────────────────────────────────────────────────────────────────
// mechty.js  —  Mechty doll data
// ─────────────────────────────────────────────────────────────────────────────

DOLLS.push({
  id: 'mechty',
  name: 'Mechty',
  class: 'Support',
  ammoType: 'Medium',
  phase: 'Corrosion',
  baseCritDmg: 120,   // update with actual base value when confirmed

  skills: [

    {
      id: 'mechty_basic',
      name: 'Bedtime Warmup',
      phase_dmg_type: 'physical',
      target_type:    'targeted',
      skill_type:     'active',
      ammo_type:      'medium',
      description: 'Selects one enemy target within 8 tiles and deals Physical damage equal to 80% of attack to it.',
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

  flowerSlots: ['support', 'support', 'support', 'bulwark', 'bulwark', 'sentinel'],
  supportSkills: [

    {
      key:       'toxic_inundation',
      label:     'Toxic Inundation',
      type:      'toggle',
      condition: 'Applied by Mechty',
      effect:    { corroDmgPct: 25 },
      notes:     'Corrosion Damage taken is increased by 25%. Considered a Corrosion defense debuff.',
      vertebrae: null,
    },

    {
      key:       'nightmare_form_lv1',
      label:     'Nightmare Form',
      type:      'toggle',
      condition: 'Applied by Mechty',
      effect:    { aoeDmgPct: 10 },
      notes:     'AoE damage dealt is increased by 10%. (aoeDmgSupPct +50% not yet wired.) Considered a Corrosion buff, cannot be cleansed.',
      vertebrae: [0, 1, 2, 3, 4, 5],
    },

    {
      key:       'nightmare_form_lv2',
      label:     'Nightmare Form',
      type:      'toggle',
      condition: 'Applied by Mechty',
      effect:    { aoeDmgPct: 20 },
      notes:     'AoE damage dealt is increased by 20%. (aoeDmgSupPct +80% not yet wired.) Considered a Corrosion buff, cannot be cleansed.',
      vertebrae: [6],
    },

    {
      key:       'dream_exhilaration',
      label:     'Dreamscape Exhilaration',
      type:      'stack_selector',
      condition: 'Applied by Mechty',
      max:       6,
      effect:    (stacks) => ({ corroDmgPct: stacks * 5 }),
      notes:     'Corrosion damage dealt is increased by 5% per stack. Considered a buff.',
      vertebrae: null,
    },

  ],

});
