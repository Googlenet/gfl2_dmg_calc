// ─────────────────────────────────────────────────────────────────────────────
// _template.js  —  Blank doll template
// Copy this file, rename it to <dollname>.js, and fill in the fields.
// Add a <script> tag for it in index.html after dolls.js.
// ─────────────────────────────────────────────────────────────────────────────

DOLLS.push({
  id:          'jiangyu',          // lowercase, no spaces (used as key)
  name:        'Jiangyu',         // display name
  class:       'Support',          // Sentinel | Support | Bulwark | Vanguard
  ammoType:    'Medium',            // Light | Medium | Heavy | Shotgun | Melee
  phase:       'Electric',          // Physical | Electric | Corrosion | Burn | Hydro | Freeze
  baseCritDmg: 120,                // base crit DMG % 

  skills: [

    // ── Basic Attack ─────────────────────────────────────────────────────────
    {
      id:               'dollname_basic',
      name:             'Basic Attack Name',
      phase_dmg_type:   'physical',   // physical | electric | corrosion | thermal | hydro
      target_type:      'targeted',   // targeted | aoe
      skill_type:       'active',     // active | oot
      ammo_type:        'medium',     
      description:      '',
      multiplier:       0.80,         // number, or array of { label, value } for multi-hit/options
      vertebrae:        null,         // null = all levels; or array of numbers e.g. [0, 1, 2]
      cooldown:         null,
      stability_dmg:    3,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

    // ── Skill 1 Lv.1 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s1_lv1',
      name:             '(S1) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [0, 1, 2, 3],
      cooldown:         1,
      stability_dmg:    2,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

    // ── Skill 1 Lv.2 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s1_lv2',
      name:             '(S1) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [4, 5, 6],
      cooldown:         1,
      stability_dmg:    2,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

    // ── Skill 2 Lv.1 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s2_lv1',
      name:             '(S2) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [0, 1],
      cooldown:         2,
      stability_dmg:    1,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

    // ── Skill 2 Lv.2 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s2_lv2',
      name:             '(S2) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [2, 3, 4, 5, 6],
      cooldown:         2,
      stability_dmg:    1,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

    // ── Ultimate Lv.1 ────────────────────────────────────────────────────────
    {
      id:               'dollname_ult_lv1',
      name:             '(Ult) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [0, 1, 2],
      cooldown:         null,
      stability_dmg:    2,
      confectance_cost: 6,
      scalingStat:      'ATK',
    },

    // ── Ultimate Lv.2 ────────────────────────────────────────────────────────
    {
      id:               'dollname_ult_lv2',
      name:             '(Ult) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [3, 4, 5, 6],
      cooldown:         null,
      stability_dmg:    2,
      confectance_cost: 6,
      scalingStat:      'ATK',
    },

    // ── Passive Lv.1 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_passive_lv1',
      name:             'Passive Name',
      phase_dmg_type:   'physical',
      target_type:      'targeted',
      skill_type:       'oot',
      ammo_type:        null,
      description:      '',
      multiplier:       0.50,
      vertebrae:        [0, 1, 2],
      cooldown:         null,
      stability_dmg:    1,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

    // ── Passive Lv.2 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_passive_lv2',
      name:             'Passive Name',
      phase_dmg_type:   'physical',
      target_type:      'targeted',
      skill_type:       'oot',
      ammo_type:        null,
      description:      '',
      multiplier:       0.50,
      vertebrae:        [3, 4, 5, 6],
      cooldown:         null,
      stability_dmg:    1,
      confectance_cost: null,
      scalingStat:      'ATK',
    },

  ],

  // ── Doll Passives (in-calc toggles/selectors) ─────────────────────────────
  // These show up in the Doll Passives panel as checkboxes or stack selectors.
  // type: 'toggle'         — checkbox; effect is a plain object
  // type: 'stack_selector' — numbered buttons 0–max; effect is a function
  passives: [

    // Example toggle:
    // {
    //   type:      'toggle',
    //   key:       'dollname_some_buff',
    //   label:     'Buff Name — +X% ATK',
    //   condition: 'When condition is met',
    //   effect:    { atkPct: 10 },           
    //   vertebrae: [4, 5, 6],               
    //   notes:     'Optional clarification.',
    // },

    // Example stack selector:
    // {
    //   type:   'stack_selector',
    //   key:    'dollname_stack_buff',
    //   label:  'Stack Buff Name',
    //   max:    5,
    //   effect: (stacks) => ({ dmgPct: stacks * 10 }),
    //   notes:  '+10% DMG per stack.',
    // },

  ],

  // ── Support Skills (shown in Team Skills panel when this doll is a teammate) ─
  // Same shape as passives. Leave empty [] if doll has no relevant team buffs.
  supportSkills: [

    {
      key:      'jy_pas_vs_lv1',
      label:    '(Passive) Voltage Sag - Elec Dmg Up',
      type:     'stack_selector',
      max:      3,
      effect:    (stacks) => ({ elecDmgPct: stacks * 6 }),
      vertebrae: [0, 1, 2, 3, 4, 5],
      notes:    'Electric damage taken is increased by 6%. Maximum of 3 stacks.',
    },
    // ignoring fixed damage portion of debuff for simplicity sake

    {
      key:      'jy_pas_vs_lv3',
      label:    '(Passive) Voltage Sag - Elec Dmg Up',
      type:     'stack_selector',
      max:      6,
      effect:    (stacks) => ({ elecDmgPct: stacks * 6 }),
      vertebrae: [6],
      notes:    'Electric damage taken is increased by 6%. Maximum of 6 stacks.',
    },

    {
      key:      'jy_pas_ps_lv1',
      label:    '(Passive) Power Surge - Def Ignore %',
      type:     'stack_selector',
      max:      3,
      effect:    (stacks) => ({ defReduc: stacks * 5 }),
      vertebrae: [0, 1, 2, 3, 4, 5],
      notes:    'When dealing Electric damage, ignores 5% of the target\'s defense. Maximum of 3 stacks.',
    },

    {
      key:      'jy_pas_ps_lv2',
      label:    '(Passive) Power Surge - Def Ignore %',
      type:     'stack_selector',
      max:      3,
      effect:    (stacks) => ({ defReduc: stacks * 10 }),
      vertebrae: [6],
      notes:    'When dealing Electric damage, ignores 10% of the target\'s defense. Maximum of 3 stacks.',
    },

  ],

  flowerSlots: ['support', 'support', 'support', 'support', 'vanguard', 'vanguard'],
  imagoform: [
    { tier: 'embryo',   requires: {               vanguard: 2, support: 5  }, effect: { elecDmgPct: 3 },        description: 'For every instance of Electric damage dealt by this unit, Electric damage dealt by all allied units is increased by 1%, maximum of 3%. Does not stack.' },
    { tier: 'seedling', requires: {               vanguard: 3, support: 8  }, effect: { dmgReduc: 5 },          description: 'Physical and phase damage taken is reduced by 5%.' },
    { tier: 'sprout',   requires: { sentinel: 1,  vanguard: 4, support: 9  }, effect: { elecDmgPct: 5 },        description: 'Electric damage dealt is increased by 5%.' },
    { tier: 'shoot',    requires: { sentinel: 2,  vanguard: 6, support: 11 }, effect: { dmgPct: 9 },            description: 'Damage dealt by all allied units is increased by 4%, maximum of 3 stacks. The effect\'s potency is progressively reduced by 1% each time a new stack is applied.' },
    { tier: 'bud',      requires: { sentinel: 2,  vanguard: 7, support: 15 }, effect: { atkPct: 4 },            description: 'Attack and max HP is increased by 4%.' },
    { tier: 'blossom',  requires: { sentinel: 3,  vanguard: 8, support: 18 }, effect: { fixedStabilityDmg: 3 }, description: 'After inflicting a critical hit, deals 3 points of fixed stability damage to the enemy target. This effect can trigger up to 2 times per turn.' },
  ],

  notes: '',
});
