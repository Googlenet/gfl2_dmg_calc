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
  const ids = ['atk_wpn_pct','atk_attach_pct','atk_helix_node_pct','atk_helix_extra_pct','atk_covenant_pct','atk_fixedkey_pct'];
  return ids.reduce((sum, id) => sum + readNum(id), 0);
}

// Base ATK Total: ceil(flatATK) × (1 + pct%) — decimal for display
function getBaseAtkTotal() {
  return getFlatATKWhole() * (1 + (getAtkPctSources() + getCommonKeyAtkPct()) / 100);
}

// Ichor Flower flat ATK = selected level (0–5, 0.2/0.4/0.6/0.8/1.0%) × max HP
function getIchorFlatATK() {
  const level = parseInt(document.getElementById('ichor-level')?.value ?? '0') || 0;
  if (level === 0) return 0;
  const maxHp = readNum('doll_max_hp');
  const pct   = level * 0.2 / 100;   // level 1=0.2%, 2=0.4%, ..., 5=1.0%
  return maxHp * pct;
}

// Gunsmoke — sums all active milestone buff toggles
function getGunsmokeResult() {
  const out = { atkPct: 0, dmgPct: 0 };
  if (!window.gunsmokeBuffState) return out;
  for (const b of getGunsmokeBuffList()) {
    if (!window.gunsmokeBuffState[b.id] || !b.buff) continue;
    out.atkPct += b.buff.atkPct || 0;
    out.dmgPct += b.buff.dmgPct || 0;
  }
  return out;
}

// Common key — sums a given stat type across all 3 key columns, all 3 slots each
function getCommonKeyStat(statKey) {
  let total = 0;
  for (const i of [0, 1, 2]) {
    const sel = document.getElementById(`ckey-col-${i}`)?.querySelector('.ckey-col-select');
    const id  = sel?.value;
    if (!id) continue;
    const key = getCommonKey(id);
    if (!key) continue;
    if (key.defaultStat === statKey)
      total += parseFloat(document.getElementById(`ckey-${i}-s1-val`)?.value) || 0;
    for (const s of [2, 3]) {
      const type = document.getElementById(`ckey-${i}-s${s}-type`)?.value;
      if (type === statKey)
        total += parseFloat(document.getElementById(`ckey-${i}-s${s}-val`)?.value) || 0;
    }
  }
  return total;
}

function getCommonKeyAtkPct()  { return getCommonKeyStat('atkPct');   }
function getCommonKeyCritRate() { return getCommonKeyStat('critRate'); }
function getCommonKeyCritDmg()  { return getCommonKeyStat('critDmg');  }

// Active common key effects — sums effectBuff values for toggled-on key effects
function getCommonKeyEffectResult() {
  const out = { atkPct: 0, dmgPct: 0, critRate: 0, critDmg: 0 };
  if (!window.ckeyEffectActive) return out;
  for (const i of [0, 1, 2]) {
    if (!window.ckeyEffectActive[i]) continue;
    const sel = document.getElementById(`ckey-col-${i}`)?.querySelector('.ckey-col-select');
    const key = sel?.value ? getCommonKey(sel.value) : null;
    if (!key?.effectBuff) continue;
    out.atkPct   += key.effectBuff.atkPct   || 0;
    out.dmgPct   += key.effectBuff.dmgPct   || 0;
    out.critRate += key.effectBuff.critRate  || 0;
    out.critDmg  += key.effectBuff.critDmg  || 0;
  }
  return out;
}

// Flower + team buff result — maps stat ids to calc-relevant fields.
// Conditional stats (element, aoe, target, boss) are only applied when the
// active skill matches. Unconditional stats (atkPct, critDmg, critRate, dmgPct)
// are always applied.
function getFlowerResult() {
  const out = { atkPct: 0, dmgPct: 0, critDmg: 0, critRate: 0 };
  const phaseDmg  = activeSkill?.phase_dmg_type?.toLowerCase() || '';
  const targetType = activeSkill?.target_type?.toLowerCase()   || '';
  const skillType  = activeSkill?.skill_type?.toLowerCase()    || '';
  const isAoe    = targetType === 'aoe';
  const isTarget = targetType === 'targeted';
  const isActive = skillType  === 'active';
  const isOot    = skillType  === 'oot';

  // Map from flower stat id → where it contributes
  const apply = (id, val) => {
    switch (id) {
      case 'atkPct':        out.atkPct  += val; break;
      case 'critDmg':       out.critDmg += val; break;
      case 'critRate':      out.critRate += val; break;
      case 'dmgPct':        out.dmgPct  += val; break;
      // Elemental DMG% — only if skill phase matches
      case 'corroDmgPct':   if (phaseDmg === 'corrosion') out.dmgPct += val; break;
      case 'hydroDmgPct':   if (phaseDmg === 'hydro')     out.dmgPct += val; break;
      case 'burnDmgPct':    if (phaseDmg === 'burn')      out.dmgPct += val; break;
      case 'elecDmgPct':    if (phaseDmg === 'electric')  out.dmgPct += val; break;
      case 'physDmgPct':    if (phaseDmg === 'physical')  out.dmgPct += val; break;
      case 'freezeDmgPct':  if (phaseDmg === 'freeze')    out.dmgPct += val; break;
      // Target-type conditional
      case 'aoeDmgPct':     if (isAoe)    out.dmgPct  += val; break;
      case 'targetDmgPct':  if (isTarget) out.dmgPct  += val; break;
      case 'aoeCritDmg':    if (isAoe)    out.critDmg += val; break;
      case 'targetCritDmg': if (isTarget) out.critDmg += val; break;
      // Elemental crit DMG — vanguard sub2 smite bonuses
      case 'corroCritDmg':  if (phaseDmg === 'corrosion') out.critDmg += val; break;
      case 'hydroCritDmg':  if (phaseDmg === 'hydro')     out.critDmg += val; break;
      case 'burnCritDmg':   if (phaseDmg === 'burn')      out.critDmg += val; break;
      case 'elecCritDmg':   if (phaseDmg === 'electric')  out.critDmg += val; break;
      case 'physCritDmg':   if (phaseDmg === 'physical')  out.critDmg += val; break;
      case 'freezeCritDmg': if (phaseDmg === 'freeze')    out.critDmg += val; break;
      // Skill-type conditional (active vs out-of-turn)
      case 'activeDmgPct':  if (isActive) out.dmgPct  += val; break;
      case 'ootDmgPct':     if (isOot)    out.dmgPct  += val; break;
      case 'activeCritDmg': if (isActive) out.critDmg += val; break;
      case 'ootCritDmg':    if (isOot)    out.critDmg += val; break;
      // Not yet wired: bossDmgPct, hpPct, defPct, healPct, shieldPct, dmgReduc, flat stats
    }
  };

  for (const [id, val] of Object.entries(window.flowerTotals  || {})) apply(id, val);
  for (const [id, val] of Object.entries(window.teamBuffTotals || {})) apply(id, val);

  return out;
}

// Active food buff — reads current food-select dropdown, returns buff object
function getActiveFoodBuff() {
  const id = document.getElementById('food-select')?.value;
  if (!id) return {};
  return getFood(id)?.buff || {};
}

// In-Battle Flat ATK Total: baseAtkTotal + ichor + food flat
function getBattleFlatTotal() {
  return getBaseAtkTotal() + getIchorFlatATK() + (getActiveFoodBuff().flatAtk || 0);
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
  pct += getActiveFoodBuff().atkPct || 0;
  pct += getGunsmokeResult().atkPct;
  pct += getDollPassivesResult().atkPct;
  pct += getCommonKeyEffectResult().atkPct;
  pct += getFlowerResult().atkPct;
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
  pct -= getDollPassivesResult().defReducPct;
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
  sum += getGunsmokeResult().dmgPct;
  sum += getDollPassivesResult().dmgPct;
  sum += getActiveFoodBuff().dmgPct || 0;
  sum += getCommonKeyEffectResult().dmgPct;
  sum += getFlowerResult().dmgPct;
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
    critDmg:  Math.min(baseDmg  + dmgBonus  + getCommonKeyCritDmg()  + getCommonKeyEffectResult().critDmg  + getFlowerResult().critDmg  + getDollPassivesResult().critDmg,  9999),
    critRate: Math.min(readNum('critrate', 0) + rateBonus + (getActiveFoodBuff().critRate || 0) + getCommonKeyCritRate() + getCommonKeyEffectResult().critRate + getFlowerResult().critRate + getDollPassivesResult().critRate, 100),
  };
}

// ── Doll-Specific Passives ────────────────────────────────────────────────────
// dollMechState is defined and managed in ui.js

function getDollPassivesResult() {
  const out = { atkPct: 0, dmgPct: 0, critDmg: 0, critRate: 0, fixedDmgPct: 0, fixedAtkPct: 0, dmgMultiplier: 1, fixedAtkMultiplier: 1, defReducPct: 0 };
  if (!window.dollMechState || !activeDoll?.passives) return out;

  const phaseDmg  = activeSkill?.phase_dmg_type?.toLowerCase() || '';
  const targetType = activeSkill?.target_type?.toLowerCase()   || '';
  const skillType  = activeSkill?.skill_type?.toLowerCase()    || '';
  const isAoe    = targetType === 'aoe';
  const isTarget = targetType === 'targeted';
  const isActive = skillType  === 'active';
  const isOot    = skillType  === 'oot';

  // Collect all raw effect key/value pairs from active passives
  const raw = {};
  for (const p of activeDoll.passives) {
    if (p.vertebrae && !p.vertebrae.includes(activeVertebrae)) continue;
    let eff = {};
    if (p.type === 'stack_selector') {
      const stacks = window.dollMechState[p.key] || 0;
      if (stacks > 0) eff = p.effect(stacks);
    } else if (p.type === 'toggle') {
      if (window.dollMechState[p.key]) eff = p.effect;
    }
    for (const [k, v] of Object.entries(eff)) {
      raw[k] = (raw[k] || 0) + v;
    }
  }

  // Apply conditional logic — same rules as getFlowerResult()
  for (const [id, val] of Object.entries(raw)) {
    switch (id) {
      case 'atkPct':        out.atkPct      += val; break;
      case 'dmgPct':        out.dmgPct      += val; break;
      case 'critDmg':       out.critDmg     += val; break;
      case 'critRate':      out.critRate    += val; break;
      case 'fixedDmgPct':   out.fixedDmgPct += val; break;
      case 'fixedAtkPct':   out.fixedAtkPct += val; break;
      case 'dmgMultiplier':      out.dmgMultiplier      *= val; break;
      case 'fixedAtkMultiplier': out.fixedAtkMultiplier *= val; break;
      // Elemental DMG% — conditional on skill phase
      case 'corroDmgPct':   if (phaseDmg === 'corrosion') out.dmgPct += val; break;
      case 'elecDmgPct':    if (phaseDmg === 'electric')  out.dmgPct += val; break;
      case 'burnDmgPct':    if (phaseDmg === 'burn')      out.dmgPct += val; break;
      case 'hydroDmgPct':   if (phaseDmg === 'hydro')     out.dmgPct += val; break;
      case 'physDmgPct':    if (phaseDmg === 'physical')  out.dmgPct += val; break;
      case 'freezeDmgPct':  if (phaseDmg === 'freeze')    out.dmgPct += val; break;
      // Elemental crit DMG — conditional on skill phase
      case 'corroCritDmg':  if (phaseDmg === 'corrosion') out.critDmg += val; break;
      case 'elecCritDmg':   if (phaseDmg === 'electric')  out.critDmg += val; break;
      case 'burnCritDmg':   if (phaseDmg === 'burn')      out.critDmg += val; break;
      case 'hydroCritDmg':  if (phaseDmg === 'hydro')     out.critDmg += val; break;
      case 'physCritDmg':   if (phaseDmg === 'physical')  out.critDmg += val; break;
      case 'freezeCritDmg': if (phaseDmg === 'freeze')    out.critDmg += val; break;
      // Target-type conditional
      case 'aoeDmgPct':     if (isAoe)    out.dmgPct  += val; break;
      case 'targetDmgPct':  if (isTarget) out.dmgPct  += val; break;
      case 'aoeCritDmg':    if (isAoe)    out.critDmg += val; break;
      case 'targetCritDmg': if (isTarget) out.critDmg += val; break;
      // Skill-type conditional (active vs out-of-turn)
      case 'activeDmgPct':  if (isActive) out.dmgPct  += val; break;
      case 'ootDmgPct':     if (isOot)    out.dmgPct  += val; break;
      case 'activeCritDmg': if (isActive) out.critDmg += val; break;
      case 'ootCritDmg':    if (isOot)    out.critDmg += val; break;
      // DEF reduction
      case 'defReducPct':   out.defReducPct += val; break;
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
  const mech        = getDollPassivesResult();
  const atkFinal    = getAtkFinal();
  const finalDef    = getFinalDef();
  const baseDmgMult = getDmgMult();
  const dmgMult     = baseDmgMult * mech.dmgMultiplier;
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
                    + Math.ceil(atkFinal   * mech.fixedAtkPct * mech.fixedAtkMultiplier / 100);

  const normalOut   = Math.ceil(normalDmg);
  const critOut     = Math.ceil(critDmgVal);
  const avgOut      = Math.ceil(avgDmg);

  // Breakdown
  const totalFlat    = getFlatATKSources();
  const totalPct     = getAtkPctSources();
  const baseAtkTotal = getBaseAtkTotal();
  const battleFlat   = getBattleFlatTotal();
  const battleFlatVal= battleFlat - baseAtkTotal;
  const battlePct    = getBattleAtkPct();
  const baseDmgSum   = Math.ceil((baseDmgMult - 1) * 10000) / 100;
  const weakCount    = (document.getElementById('ammoWeak')?.checked ? 1 : 0)
                     + (document.getElementById('phaseWeak')?.checked ? 1 : 0);

  const steps = [
    { cls:'atk-step', name:'Flat ATK Sources',                                               val: fmt(totalFlat),                                      col:'atk-col' },
    { cls:'atk-step', name:`× ATK% Boost (+${totalPct}%)`,                                   val: `→ ${fmt(baseAtkTotal)}`,                            col:'atk-col' },
    battleFlatVal > 0   ? { cls:'atk-step', name:`+ In-Battle Flat (+${fmt(battleFlatVal)})`,val: `→ ${fmt(battleFlat)}`,                              col:'atk-col' } : null,
    battlePct > 0       ? { cls:'atk-step', name:`× Battle ATK% (+${battlePct}%)`,           val: `→ ${fmt(atkFinal)}  [Final ATK]`,                  col:'atk-col' } : null,
    { cls:'',           name:`Final DEF  [base ${fmt(readNum('def_base'))} → reduced]`,      val: fmt(finalDef),                                       col:''        },
    { cls:'',           name:'÷ DEF Formula  [ATK/(1+DEF/ATK)]',                             val: fmt(effAtk),                                         col:''        },
    { cls:'dmg-step',   name:`× DMG Pool (+${baseDmgSum}%${mech.dmgMultiplier>1?' ×'+mech.dmgMultiplier:''})`,
                                                                                              val: `×${dmgMult.toFixed(3)}  → ${fmt(effAtk*dmgMult)}`,  col:'dmg-col' },
    { cls:'',           name:`× CritDMG  [normal ×1.00 | crit ×${critMult.toFixed(2)}]`,    val: 'see cards →',                                       col:''        },
    { cls:'',           name:`× Weakness  [${weakCount} match × 10%]`,                       val: `×${weakMult.toFixed(2)}`,                           col:''        },
    { cls:'',           name:`× Skill Mod  [${skillPct}%]`,                                  val: `×${skillMod.toFixed(3)}`,                           col:''        },
    { cls:'active',     name:'= Normal Hit',                                                  val: normalOut.toLocaleString(),                          col:''        },
    { cls:'active',     name:'= Critical Hit',                                                val: critOut.toLocaleString(),                            col:''        },
    { cls:'active',     name:`= Avg (${critRate}% crit rate)`,                               val: avgOut.toLocaleString(),                             col:''        },
    fixedDmg > 0   ? { cls:'active', name:'+ Fixed DMG (kit, ignores DEF)',                  val: `+${fixedDmg.toLocaleString()}`,                     col:''        } : null,
  ].filter(Boolean);

  return { normalDmg: normalOut, critDmgVal: critOut, avgDmg: avgOut, fixedDmg, steps };
}
