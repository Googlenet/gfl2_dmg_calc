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

// ── Doll-Specific Mechanics ───────────────────────────────────────────────────
// dollMechState is defined and managed in ui.js

function getDollMechanicsResult() {
  const out = { atkPct: 0, dmgPct: 0, critDmg: 0, critRate: 0, fixedDmgPct: 0, fixedAtkPct: 0, dmgMultiplier: 1 };
  if (!window.dollMechState || !activeDoll?.mechanics) return out;

  for (const mech of activeDoll.mechanics) {
    if (mech.type === 'stack_selector') {
      const stacks = window.dollMechState[mech.key] || 0;
      if (stacks > 0) {
        const eff = mech.effect(stacks);
        out.atkPct   += eff.atkPct   || 0;
        out.dmgPct   += eff.dmgPct   || 0;
        out.critDmg  += eff.critDmg  || 0;
        out.critRate += eff.critRate  || 0;
      }
    } else if (mech.type === 'toggle') {
      if (window.dollMechState[mech.key]) {
        out.atkPct        += mech.effect.atkPct        || 0;
        out.dmgPct        += mech.effect.dmgPct        || 0;
        out.critDmg       += mech.effect.critDmg       || 0;
        out.critRate      += mech.effect.critRate       || 0;
        out.fixedDmgPct   += mech.effect.fixedDmgPct   || 0;
        out.fixedAtkPct   += mech.effect.fixedAtkPct   || 0;
        if (mech.effect.dmgMultiplier) {
          out.dmgMultiplier *= mech.effect.dmgMultiplier;
        }
      }
    }
  }
  return out;
}



function getWeaknessMult() {
  const ammo  = document.getElementById('ammoWeak')?.checked ? 1 : 0;
  const phase = document.getElementById('phaseWeak')?.checked ? 1 : 0;
  return 1 + (ammo + phase) * 0.10;
}

// ── Main Calculate ────────────────────────────────────────────────────────────

// ── Main Calculate ────────────────────────────────────────────────────────────

function calculate() {
  const mech        = getDollMechanicsResult();
  const baseAtk     = getAtkFinal();
  const atkFinal    = baseAtk * (1 + mech.atkPct / 100);
  const finalDef    = getFinalDef();
  const baseDmgMult = getDmgMult();
  const mechDmgMult = 1 + mech.dmgPct / 100;
  const dmgMult     = baseDmgMult * mechDmgMult * mech.dmgMultiplier;
  const weakMult    = getWeaknessMult();
  const skillPct    = readNum('skillmod', 100);
  const skillMod    = skillPct / 100;
  const { critDmg: baseCritDmg, critRate: baseCritRate } = getEffectiveCritStats();
  const critDmgPct  = Math.min(baseCritDmg + mech.critDmg, 9999);
  const critRate    = Math.min(baseCritRate + mech.critRate, 100);
  const critMult    = critDmgPct / 100;

  const effAtk      = atkFinal === 0 ? 0 : atkFinal / (1 + finalDef / atkFinal);
  const normalDmg   = effAtk * dmgMult * weakMult * skillMod;
  const critDmgVal  = effAtk * dmgMult * critMult  * weakMult * skillMod;
  const cr          = Math.min(critRate, 100) / 100;
  const avgDmg      = normalDmg * (1 - cr) + critDmgVal * cr;

  // Fixed damage added after main calc — ignores DEF/multipliers
  const fixedDmg    = Math.ceil(normalDmg * mech.fixedDmgPct / 100)
                    + Math.ceil(atkFinal   * mech.fixedAtkPct / 100);

  const normalOut   = Math.ceil(normalDmg)  + fixedDmg;
  const critOut     = Math.ceil(critDmgVal) + fixedDmg;
  const avgOut      = Math.ceil(avgDmg)     + fixedDmg;

  // Breakdown
  const totalFlat    = getFlatATKSources();
  const totalPct     = getAtkPctSources();
  const baseAtkTotal = getBaseAtkTotal();
  const battleFlat   = getBattleFlatTotal();
  const battleFlatVal= battleFlat - baseAtkTotal;
  const battlePct    = getBattleAtkPct();
  const baseDmgSum   = Math.ceil((baseDmgMult - 1) * 10000) / 100;
  const mechDmgSum   = mech.dmgPct;
  const weakCount    = (document.getElementById('ammoWeak')?.checked ? 1 : 0)
                     + (document.getElementById('phaseWeak')?.checked ? 1 : 0);

  const steps = [
    { cls:'atk-step', name:'Flat ATK Sources',                                               val: fmt(totalFlat),                                      col:'atk-col' },
    { cls:'atk-step', name:`× ATK% Boost (+${totalPct}%)`,                                   val: `→ ${fmt(baseAtkTotal)}`,                            col:'atk-col' },
    battleFlatVal > 0   ? { cls:'atk-step', name:`+ In-Battle Flat (+${fmt(battleFlatVal)})`,val: `→ ${fmt(battleFlat)}`,                              col:'atk-col' } : null,
    battlePct > 0       ? { cls:'atk-step', name:`× Battle ATK% (+${battlePct}%)`,           val: `→ ${fmt(baseAtk)}`,                                col:'atk-col' } : null,
    mech.atkPct > 0     ? { cls:'atk-step', name:`× Mech ATK% (+${mech.atkPct}%)`,           val: `→ ${fmt(atkFinal)}  [Final ATK]`,                  col:'atk-col' } : null,
    { cls:'',           name:`Final DEF  [base ${fmt(readNum('def_base'))} → reduced]`,      val: fmt(finalDef),                                       col:''        },
    { cls:'',           name:'÷ DEF Formula  [ATK/(1+DEF/ATK)]',                             val: fmt(effAtk),                                         col:''        },
    { cls:'dmg-step',   name:`× DMG Pool (+${baseDmgSum}%${mechDmgSum>0?' +'+mechDmgSum+'% mech':''}${mech.dmgMultiplier>1?' ×'+mech.dmgMultiplier:''})`,
                                                                                              val: `×${dmgMult.toFixed(3)}  → ${fmt(effAtk*dmgMult)}`,  col:'dmg-col' },
    { cls:'',           name:`× CritDMG  [normal ×1.00 | crit ×${critMult.toFixed(2)}]`,    val: 'see cards →',                                       col:''        },
    { cls:'',           name:`× Weakness  [${weakCount} match × 10%]`,                       val: `×${weakMult.toFixed(2)}`,                           col:''        },
    { cls:'',           name:`× Skill Mod  [${skillPct}%]`,                                  val: `×${skillMod.toFixed(3)}`,                           col:''        },
    fixedDmg > 0   ? { cls:'active', name:'+ Fixed DMG (mech bonus, ignores DEF)',           val: `+${fixedDmg.toLocaleString()}`,                     col:''        } : null,
    { cls:'active',     name:'= Normal Hit',                                                  val: normalOut.toLocaleString(),                          col:''        },
    { cls:'active',     name:'= Critical Hit',                                                val: critOut.toLocaleString(),                            col:''        },
    { cls:'active',     name:`= Avg (${critRate}% crit rate)`,                               val: avgOut.toLocaleString(),                             col:''        },
  ].filter(Boolean);

  return { normalDmg: normalOut, critDmgVal: critOut, avgDmg: avgOut, fixedDmg, steps };
}
