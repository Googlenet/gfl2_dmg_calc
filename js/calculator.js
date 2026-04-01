// ─────────────────────────────────────────────────────────────────────────────
// calculator.js  —  All formula logic. No DOM writes happen here.
// ─────────────────────────────────────────────────────────────────────────────

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

// Total Flat ATK ceiled to whole number — base for % calculations
function getFlatATKWhole() {
  return Math.ceil(getFlatATKSources());
}

function getAtkPctSources() {
  const ids = ['atk_wpn_pct','atk_attach_pct','atk_helix_node_pct','atk_helix_extra_pct','atk_keys_pct','atk_covenant_pct','atk_fixedkey_pct'];
  return ids.reduce((sum, id) => sum + readNum(id), 0);
}

// Base ATK Total: ceil(flatATK) × (1 + pct%) — decimal for display
function getBaseAtkTotal() {
  return getFlatATKWhole() * (1 + getAtkPctSources() / 100);
}

// Ichor Flower flat ATK = selected level (0–5, 0.2/0.4/0.6/0.8/1.0%) × max HP
function getIchorFlatATK() {
  const level = parseInt(document.getElementById('ichor-level')?.value ?? '0') || 0;
  if (level === 0) return 0;
  const maxHp = readNum('doll_max_hp');
  const pct   = level * 0.2 / 100;   // level 1=0.2%, 2=0.4%, ..., 5=1.0%
  return maxHp * pct;
}

// In-Battle Flat ATK Total: baseAtkTotal + ichor + food flat
function getBattleFlatTotal() {
  return getBaseAtkTotal() + getIchorFlatATK() + readNum('food_buff_flat');
}

// In-Battle Flat ATK Total ceiled — base for battle % calculations
function getBattleAtkFlatWhole() {
  return Math.ceil(getBattleFlatTotal());
}

function getBattleAtkPct() {
  let pct = 0;
  // Attack Up I/II toggle
  for (const b of ATK_FIXED) {
    const state = atkToggleState[b.key];
    if (!state || b.type !== 'pct') continue;
    pct += state === 'I' ? b.valI : b.valII;
  }
  // Multi-level ATK buffs (Attack Unity, Support buffs)
  for (const b of ATK_MULTI) {
    const level = atkMultiState[b.key] || 0;
    if (level > 0) pct += b.vals[level - 1];
  }
  pct += readNum('atk_remold_pct');
  pct += readNum('battle_fixedkey_pct');
  pct += readNum('battle_skill_pct');
  pct += readNum('food_atk_pct');
  pct += getPlatoonAtkBonus();
  return pct;
}

// In-Battle ATK: ceil(flatTotal) × (1 + battle%) — decimal for display
function getAtkFinal() {
  return getBattleAtkFlatWhole() * (1 + getBattleAtkPct() / 100);
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
  const flatIds = ['dmg_doll_passive','dmg_weapon_trait','dmg_attach_set','dmg_common_keys','dmg_fixed_keys','dmg_remolding'];
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
  // critdmg is read-only (set from doll profile); critdmg_extra is user-editable
  const baseDmg  = readNum('critdmg', 100) + readNum('critdmg_extra', 0);
  let dmgBonus = 0, rateBonus = 0;
  for (const b of CRIT_TOGGLES) {
    const state = critToggleState[b.key];
    if (!state) continue;
    const val = state === 'I' ? b.valI : b.valII;
    if (b.key === 'crit_dmg_up')  dmgBonus  += val;
    if (b.key === 'crit_rate_up') rateBonus += val;
  }
  return {
    critDmg:  Math.min(baseDmg  + dmgBonus,  9999),
    critRate: Math.min(readNum('critrate', 0) + rateBonus, 100),
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

  const effAtk     = atkFinal === 0 ? 0 : atkFinal / (1 + finalDef / atkFinal);
  const normalDmg  = effAtk * dmgMult * weakMult * skillMod;
  const critDmgVal = effAtk * dmgMult * critMult  * weakMult * skillMod;
  const cr         = Math.min(critRate, 100) / 100;
  const avgDmg     = normalDmg * (1 - cr) + critDmgVal * cr;

  // Output values always ceil'd
  const normalOut  = Math.ceil(normalDmg);
  const critOut    = Math.ceil(critDmgVal);
  const avgOut     = Math.ceil(avgDmg);

  // Breakdown
  const totalFlat    = getFlatATKSources();
  const totalPct     = getAtkPctSources();
  const baseAtkTotal = getBaseAtkTotal();
  const battleFlat   = getBattleFlatTotal();
  const battleFlatVal= battleFlat - baseAtkTotal;
  const battlePct    = getBattleAtkPct();
  const dmgSum       = Math.ceil((dmgMult - 1) * 10000) / 100;
  const weakCount    = (document.getElementById('ammoWeak')?.checked ? 1 : 0)
                     + (document.getElementById('phaseWeak')?.checked ? 1 : 0);

  const steps = [
    { cls:'atk-step', name:'Flat ATK Sources',                                            val: fmt(totalFlat),                                     col:'atk-col' },
    { cls:'atk-step', name:`× ATK% Boost (+${totalPct}%)`,                                val: `→ ${fmt(baseAtkTotal)}`,                           col:'atk-col' },
    battleFlatVal > 0 ? { cls:'atk-step', name:`+ In-Battle Flat (+${fmt(battleFlatVal)})`, val: `→ ${fmt(battleFlat)}`,                           col:'atk-col' } : null,
    battlePct > 0     ? { cls:'atk-step', name:`× Battle ATK% (+${battlePct}%)`,           val: `→ ${fmt(atkFinal)}  [In-Battle ATK]`,             col:'atk-col' } : null,
    { cls:'',         name:`Final DEF  [base ${fmt(readNum('def_base'))} → reduced]`,     val: fmt(finalDef),                                      col:''        },
    { cls:'',         name:'÷ DEF Formula  [ATK/(1+DEF/ATK)]',                            val: fmt(effAtk),                                        col:''        },
    { cls:'dmg-step', name:`× DMG Buff Pool (+${dmgSum}%)`,                               val: `×${dmgMult.toFixed(3)}  → ${fmt(effAtk*dmgMult)}`, col:'dmg-col' },
    { cls:'',         name:`× CritDMG  [normal ×1.00 | crit ×${critMult.toFixed(2)}]`,   val: 'see cards →',                                      col:''        },
    { cls:'',         name:`× Weakness  [${weakCount} match × 10%]`,                      val: `×${weakMult.toFixed(2)}`,                          col:''        },
    { cls:'',         name:`× Skill Mod  [${skillPct}%]`,                                 val: `×${skillMod.toFixed(3)}`,                          col:''        },
    { cls:'active',   name:'= Normal Hit',                                                 val: normalOut.toLocaleString(),                         col:''        },
    { cls:'active',   name:'= Critical Hit',                                               val: critOut.toLocaleString(),                           col:''        },
    { cls:'active',   name:`= Avg (${critRate}% crit rate)`,                              val: avgOut.toLocaleString(),                             col:''        },
  ].filter(Boolean);

  return { normalDmg: normalOut, critDmgVal: critOut, avgDmg: avgOut, steps };
}
