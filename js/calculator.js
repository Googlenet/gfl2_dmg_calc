// ─────────────────────────────────────────────────────────────────────────────
// calculator.js  —  All formula logic. No DOM writes happen here.
//                   Functions return values; ui.js handles display.
// ─────────────────────────────────────────────────────────────────────────────

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  return Number(n.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function readNum(id, fallback = 0) {
  const el = document.getElementById(id);
  return el ? (parseFloat(el.value) || fallback) : fallback;
}

// ── ATK Sources ───────────────────────────────────────────────────────────────

function getFlatATKSources() {
  const ids = ['atk','atk_wpn_flat','atk_attach_flat','atk_helix_flat','atk_affinity_flat','atk_dispatch_flat','atk_remold_flat'];
  return ids.reduce((sum, id) => sum + readNum(id), 0);
}

function getAtkPctSources() {
  const ids = ['atk_wpn_pct','atk_attach_pct','atk_helix_node_pct','atk_helix_extra_pct','atk_keys_pct','atk_covenant_pct','atk_fixedkey_pct'];
  return ids.reduce((sum, id) => sum + readNum(id), 0);
}

function getBaseAtkTotal() {
  return getFlatATKSources() * (1 + getAtkPctSources() / 100);
}

function getAtkIchorTotal() {
  return getBaseAtkTotal() + readNum('atk_ichor_flat_boost');
}

function getBattleAtkPct() {
  let pct = 0;
  // Attack Up I/II toggle
  for (const b of ATK_FIXED) {
    const state = atkToggleState[b.key];
    if (!state || b.type !== 'pct') continue;
    pct += state === 'I' ? b.valI : b.valII;
  }
  pct += readNum('atk_remold_pct');
  pct += readNum('battle_fixedkey_pct');
  pct += readNum('battle_skill_pct');
  pct += getPlatoonAtkBonus();
  return pct;
}

function getAtkFinal() {
  return getAtkIchorTotal() * (1 + getBattleAtkPct() / 100);
}

// ── DEF Sources ───────────────────────────────────────────────────────────────

function getTotalDefReduction() {
  let pct = 0;
  for (const b of DEF_DEBUFFS) {
    const state = defDebuffState[b.key];
    if (!state) continue;
    pct += state === 'I' ? b.valI : b.valII;
  }
  pct -= readNum('def_weapon_trait');
  pct -= readNum('def_skill_debuff');
  return pct;
}

function getFinalDef() {
  const baseDef = readNum('def_base');
  const buffPct = readNum('def_buff_pct');
  const boosted = Math.ceil(baseDef * (1 + buffPct / 100));
  return boosted * (1 + getTotalDefReduction() / 100);
}

// ── DMG Multiplier ────────────────────────────────────────────────────────────

function getDmgMult() {
  const flatIds = ['dmg_doll_passive','dmg_weapon_trait','dmg_attach_set','dmg_common_keys','dmg_fixed_keys'];
  let sum = flatIds.reduce((s, id) => s + readNum(id), 0);
  for (const b of DMG_TOGGLES) {
    const state = dmgToggleState[b.key];
    if (!state) continue;
    sum += state === 'I' ? b.valI : b.valII;
  }
  sum += getPlatoonDmgBonus();
  return 1 + sum / 100;
}

// ── Crit Stats ────────────────────────────────────────────────────────────────

function getEffectiveCritStats() {
  let dmgBonus = 0, rateBonus = 0;
  for (const b of CRIT_TOGGLES) {
    const state = critToggleState[b.key];
    if (!state) continue;
    const val = state === 'I' ? b.valI : b.valII;
    if (b.key === 'crit_dmg_up')  dmgBonus  += val;
    if (b.key === 'crit_rate_up') rateBonus += val;
  }
  return {
    critDmg:  Math.min(readNum('critdmg', 100) + dmgBonus, 9999),
    critRate: Math.min(readNum('critrate', 0)  + rateBonus, 100),
  };
}

// ── Weakness ──────────────────────────────────────────────────────────────────

function getWeaknessMult() {
  const ammo  = document.getElementById('ammoWeak')?.checked ? 1 : 0;
  const phase = document.getElementById('phaseWeak')?.checked ? 1 : 0;
  return 1 + (ammo + phase) * 0.10;
}

// ── Main Calculate ────────────────────────────────────────────────────────────

function calculate() {
  const atkFinal   = getAtkFinal();
  const finalDef   = getFinalDef();
  const dmgMult    = getDmgMult();
  const weakMult   = getWeaknessMult();
  const skillPct   = readNum('skillmod', 100);
  const skillMod   = skillPct / 100;
  const { critDmg: critDmgPct, critRate } = getEffectiveCritStats();
  const critMult   = critDmgPct / 100;
  const isCrit     = document.getElementById('isCrit')?.checked;

  const effAtk     = atkFinal === 0 ? 0 : atkFinal / (1 + finalDef / atkFinal);
  const normalDmg  = effAtk * dmgMult * weakMult * skillMod;
  const critDmgVal = effAtk * dmgMult * critMult * weakMult * skillMod;
  const cr         = Math.min(critRate, 100) / 100;
  const avgDmg     = normalDmg * (1 - cr) + critDmgVal * cr;

  // Breakdown steps
  const totalFlat    = getFlatATKSources();
  const totalPct     = getAtkPctSources();
  const baseAtkTotal = getBaseAtkTotal();
  const ichorVal     = readNum('atk_ichor_flat_boost');
  const atkIchor     = getAtkIchorTotal();
  const battlePct    = getBattleAtkPct();
  const dmgSum       = Math.round((dmgMult - 1) * 10000) / 100;
  const weakCount    = (document.getElementById('ammoWeak')?.checked ? 1 : 0) + (document.getElementById('phaseWeak')?.checked ? 1 : 0);

  const steps = [
    { cls:'atk-step', name:'Flat ATK Sources',                                             val: fmt(totalFlat),                                    col:'atk-col' },
    { cls:'atk-step', name:`× ATK% Boost (+${totalPct}%)`,                                 val: `→ ${fmt(baseAtkTotal)}`,                          col:'atk-col' },
    ichorVal > 0 ? { cls:'atk-step', name:`+ Ichor Flower (+${fmt(ichorVal)})`,            val: `→ ${fmt(atkIchor)}`,                              col:'atk-col' } : null,
    battlePct > 0 ? { cls:'atk-step', name:`× Battle ATK% (+${battlePct}%)`,              val: `→ ${fmt(atkFinal)}  [In-Battle ATK]`,             col:'atk-col' } : null,
    { cls:'',         name:`Final DEF  [base ${fmt(readNum('def_base'))} → reduced]`,      val: fmt(finalDef),                                     col:''        },
    { cls:'',         name:'÷ DEF Formula  [ATK/(1+DEF/ATK)]',                             val: fmt(effAtk),                                       col:''        },
    { cls:'dmg-step', name:`× DMG Buff Pool (+${dmgSum}%)`,                                val: `×${dmgMult.toFixed(3)}  → ${fmt(effAtk*dmgMult)}`,col:'dmg-col' },
    { cls:'',         name:`× CritDMG  [normal ×1.00 | crit ×${critMult.toFixed(2)}]`,    val: 'see cards →',                                     col:''        },
    { cls:'',         name:`× Weakness  [${weakCount} match × 10%]`,                       val: `×${weakMult.toFixed(2)}`,                         col:''        },
    { cls:'',         name:`× Skill Mod  [${skillPct}%]`,                                  val: `×${skillMod.toFixed(3)}`,                         col:''        },
    { cls:'active',   name:'= Normal Hit',                                                  val: fmt(normalDmg),                                    col:''        },
    { cls:'active',   name:'= Critical Hit',                                                val: fmt(critDmgVal),                                   col:''        },
    { cls:'active',   name:`= Avg (${critRate}% crit rate)`,                               val: fmt(avgDmg),                                       col:''        },
  ].filter(Boolean);

  return { normalDmg, critDmgVal, avgDmg, steps };
}
