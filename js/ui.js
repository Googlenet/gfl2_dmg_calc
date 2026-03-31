// ─────────────────────────────────────────────────────────────────────────────
// ui.js  —  All DOM rendering, toggle state, and event wiring.
//           Calls calculator.js functions for values; never does math itself.
// ─────────────────────────────────────────────────────────────────────────────

// ── ATK Fixed Toggles ─────────────────────────────────────────────────────────

const ATK_FIXED = [
  { key:'atk_up', label:'Attack Up', valI:10, valII:15, type:'pct' },
];
const atkToggleState = {};
ATK_FIXED.forEach(b => { atkToggleState[b.key] = null; });

function onAtkToggle(key, level) {
  atkToggleState[key] = atkToggleState[key] === level ? null : level;
  renderAtkBuffs();
  updateLive();
}

function renderAtkBuffs() {
  document.getElementById('atk-buff-list').innerHTML = `
    <table class="atk-buff-table">
      <thead><tr><th>Buff</th><th>I</th><th>II</th></tr></thead>
      <tbody>
        ${ATK_FIXED.map(b => {
          const state  = atkToggleState[b.key];
          const rowCls = state === 'II' ? 'active-II' : state === 'I' ? 'active-I' : '';
          const badge  = state
            ? `<span class="lv-badge lv${state==='I'?'1':'2'}"> ${state==='I'?`+${b.valI}`:` +${b.valII}`}${b.type==='flat'?'':' %'}</span>`
            : '';
          return `
            <tr class="atk-buff-row ${rowCls}">
              <td class="atk-buff-name">${b.label}${badge}</td>
              <td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${state==='I'?'checked':''} onchange="onAtkToggle('${b.key}','I')"></td>
              <td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${state==='II'?'checked':''} onchange="onAtkToggle('${b.key}','II')"></td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── DEF Debuff Toggles ────────────────────────────────────────────────────────

const DEF_DEBUFFS = [
  { key:'def_down', label:'Defense Down / Acid Corrosion', valI:-20, valII:-30 },
  { key:'piercing', label:'Piercing',                      valI:-20, valII:-30 },
];
const defDebuffState = {};
DEF_DEBUFFS.forEach(b => { defDebuffState[b.key] = null; });

function onDefDebuffToggle(key, level) {
  defDebuffState[key] = defDebuffState[key] === level ? null : level;
  renderDefDebuffs();
  updateLive();
}

function renderDefDebuffs() {
  document.getElementById('def-debuff-list').innerHTML = `
    <table class="atk-buff-table">
      <thead><tr><th>Debuff</th><th>I</th><th>II</th></tr></thead>
      <tbody>
        ${DEF_DEBUFFS.map(b => {
          const state  = defDebuffState[b.key];
          const rowCls = state === 'II' ? 'active-II' : state === 'I' ? 'active-I' : '';
          const badge  = state ? `<span class="lv-badge lv${state==='I'?'1':'2'}"> ${state==='I'?b.valI:b.valII}%</span>` : '';
          return `
            <tr class="atk-buff-row ${rowCls}">
              <td class="atk-buff-name">${b.label}${badge}</td>
              <td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${state==='I'?'checked':''} onchange="onDefDebuffToggle('${b.key}','I')"></td>
              <td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${state==='II'?'checked':''} onchange="onDefDebuffToggle('${b.key}','II')"></td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── Gunsmoke Mode ─────────────────────────────────────────────────────────────

let gunsmokeActive = false;

const PLATOON_ATK = [
  { key:'p1_2', label:'1.2', val:15 },
  { key:'p7_1', label:'7.1', val:25 },
];
let platoonAtkState = null;

const PLATOON_DMG = [
  { key:'p3_1', label:'3.1', val:30 },
  { key:'p5_1', label:'5.1', val:30 },
  { key:'p9_1', label:'9.1', val:40 },
];
let platoonDmgState = null;

function getPlatoonAtkBonus() {
  if (!gunsmokeActive || !platoonAtkState) return 0;
  return PLATOON_ATK.find(o => o.key === platoonAtkState)?.val || 0;
}

function getPlatoonDmgBonus() {
  if (!gunsmokeActive || !platoonDmgState) return 0;
  return PLATOON_DMG.find(o => o.key === platoonDmgState)?.val || 0;
}

function onGunsmokeToggle() {
  gunsmokeActive = document.getElementById('gunsmokeMode').checked;
  document.getElementById('row-platoon-atk').style.display = gunsmokeActive ? 'block' : 'none';
  document.getElementById('row-platoon-dmg').style.display = gunsmokeActive ? 'block' : 'none';
  if (!gunsmokeActive) {
    platoonAtkState = null;
    platoonDmgState = null;
    renderPlatoonAtk();
    renderPlatoonDmg();
  }
  updateLive();
}

function onPlatoonAtkSelect(key) {
  platoonAtkState = platoonAtkState === key ? null : key;
  renderPlatoonAtk();
  updateLive();
}

function onPlatoonDmgSelect(key) {
  platoonDmgState = platoonDmgState === key ? null : key;
  renderPlatoonDmg();
  updateLive();
}

function renderPlatoonAtk() {
  const sel = platoonAtkState;
  document.getElementById('platoon-atk-list').innerHTML = `
    <table class="atk-buff-table">
      <thead><tr><th>Platoon ATK Boost</th>${PLATOON_ATK.map(o=>`<th>${o.label}</th>`).join('')}</tr></thead>
      <tbody>
        <tr class="atk-buff-row ${sel?'active-I':''}">
          <td class="atk-buff-name">Platoon ATK Boost${sel?`<span class="lv-badge lv1"> +${PLATOON_ATK.find(o=>o.key===sel)?.val}%</span>`:''}</td>
          ${PLATOON_ATK.map(o=>`<td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${sel===o.key?'checked':''} onchange="onPlatoonAtkSelect('${o.key}')"></td>`).join('')}
        </tr>
      </tbody>
    </table>`;
}

function renderPlatoonDmg() {
  const sel = platoonDmgState;
  document.getElementById('platoon-dmg-list').innerHTML = `
    <table class="atk-buff-table">
      <thead><tr><th>Platoon DMG Buff</th>${PLATOON_DMG.map(o=>`<th>${o.label}</th>`).join('')}</tr></thead>
      <tbody>
        <tr class="atk-buff-row ${sel?'active-I':''}">
          <td class="atk-buff-name">Platoon DMG Buff${sel?`<span class="lv-badge lv1 dmg-col"> +${PLATOON_DMG.find(o=>o.key===sel)?.val}%</span>`:''}</td>
          ${PLATOON_DMG.map(o=>`<td class="atk-buff-check"><input type="checkbox" class="atk-cb dmg-cb" ${sel===o.key?'checked':''} onchange="onPlatoonDmgSelect('${o.key}')"></td>`).join('')}
        </tr>
      </tbody>
    </table>`;
}

// ── DMG Toggles ───────────────────────────────────────────────────────────────

const DMG_TOGGLES = [
  { key:'dmg_up',          label:'Damage Up',            valI:10, valII:20 },
  { key:'phase_boost',     label:'Phase Boost',          valI:10, valII:20 },
  { key:'targeted_boost',  label:'Targeted Attack Boost',valI:10, valII:20 },
  { key:'aoe_boost',       label:'AoE Attack Boost',     valI:10, valII:20 },
  { key:'vulnerable',      label:'Vulnerable',           valI:10, valII:20 },
  { key:'support_boost_ab',label:'Support Boost 15/30%', valI:15, valII:30 },
  { key:'support_boost',   label:'Support Boost',        valI:10, valII:20 },
];
const dmgToggleState = {};
DMG_TOGGLES.forEach(b => { dmgToggleState[b.key] = null; });

function onDmgToggle(key, level) {
  dmgToggleState[key] = dmgToggleState[key] === level ? null : level;
  renderDmgToggles();
  updateLive();
}

function renderDmgToggles() {
  document.getElementById('dmg-toggle-list').innerHTML = `
    <table class="atk-buff-table">
      <thead><tr><th>Buff</th><th>I</th><th>II</th></tr></thead>
      <tbody>
        ${DMG_TOGGLES.map(b => {
          const state  = dmgToggleState[b.key];
          const rowCls = state === 'II' ? 'active-II' : state === 'I' ? 'active-I' : '';
          const badge  = state ? `<span class="lv-badge lv${state==='I'?'1':'2'}"> +${state==='I'?b.valI:b.valII}%</span>` : '';
          return `<tr class="atk-buff-row ${rowCls}">
            <td class="atk-buff-name">${b.label}${badge}</td>
            <td class="atk-buff-check"><input type="checkbox" class="atk-cb dmg-cb" ${state==='I'?'checked':''} onchange="onDmgToggle('${b.key}','I')"></td>
            <td class="atk-buff-check"><input type="checkbox" class="atk-cb dmg-cb" ${state==='II'?'checked':''} onchange="onDmgToggle('${b.key}','II')"></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── Crit Toggles ──────────────────────────────────────────────────────────────

const CRIT_TOGGLES = [
  { key:'crit_dmg_up',  label:'Critical Damage Up', valI:10, valII:20 },
  { key:'crit_rate_up', label:'Critical Rate Up',   valI:10, valII:20 },
];
const critToggleState = {};
CRIT_TOGGLES.forEach(b => { critToggleState[b.key] = null; });

function onCritToggle(key, level) {
  critToggleState[key] = critToggleState[key] === level ? null : level;
  renderCritToggles();
  updateLive();
}

function renderCritToggles() {
  document.getElementById('crit-toggle-list').innerHTML = `
    <table class="atk-buff-table">
      <thead><tr><th>Buff</th><th>I</th><th>II</th></tr></thead>
      <tbody>
        ${CRIT_TOGGLES.map(b => {
          const state  = critToggleState[b.key];
          const rowCls = state === 'II' ? 'active-II' : state === 'I' ? 'active-I' : '';
          const badge  = state ? `<span class="lv-badge lv${state==='I'?'1':'2'}"> +${state==='I'?b.valI:b.valII}%</span>` : '';
          return `<tr class="atk-buff-row ${rowCls}">
            <td class="atk-buff-name">${b.label}${badge}</td>
            <td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${state==='I'?'checked':''} onchange="onCritToggle('${b.key}','I')"></td>
            <td class="atk-buff-check"><input type="checkbox" class="atk-cb" ${state==='II'?'checked':''} onchange="onCritToggle('${b.key}','II')"></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── Skill Profile ─────────────────────────────────────────────────────────────

let activeDoll = null;
let activeSkill = null;

function populateDollSelector() {
  const sel = document.getElementById('doll-select');
  if (!sel) return;
  const list = getDollList();
  sel.innerHTML = `<option value="generic">— Select a Doll —</option>`
    + list.map(d => `<option value="${d.id}">${d.name} (${d.class})</option>`).join('');
}

function onDollChange() {
  const id = document.getElementById('doll-select').value;
  activeDoll = getDoll(id) || getDoll('generic');
  renderSkillSelector();
  renderSkillCard();
  applyDollPassives();
  updateLive();
}

function renderSkillSelector() {
  const sel = document.getElementById('skill-select');
  if (!sel || !activeDoll) return;
  sel.innerHTML = activeDoll.skills.map(s =>
    `<option value="${s.id}">${s.name} (${s.hits > 1 ? s.hits + '× ' : ''}${s.multiplier !== null ? (s.multiplier * 100).toFixed(0) + '%' : 'manual'})</option>`
  ).join('');
  // Default to first skill
  activeSkill = activeDoll.skills[0] || null;
  applySkillMultiplier();
}

function onSkillChange() {
  const id = document.getElementById('skill-select').value;
  activeSkill = activeDoll?.skills.find(s => s.id === id) || null;
  renderSkillCard();
  applySkillMultiplier();
  updateLive();
}

function renderSkillCard() {
  const card = document.getElementById('skill-card');
  if (!card || !activeSkill) return;
  const multText = activeSkill.multiplier !== null
    ? `${(activeSkill.multiplier * 100).toFixed(0)}% ${activeSkill.scalingStat}${activeSkill.hits > 1 ? ` × ${activeSkill.hits} hits` : ''}`
    : 'Manual entry';
  card.innerHTML = `
    <div class="skill-card-name">${activeSkill.type.toUpperCase()} — ${activeSkill.name}</div>
    <div class="skill-card-desc">${activeSkill.description}</div>
    <div class="skill-card-mult">${multText}</div>
    ${activeSkill.notes ? `<div class="skill-card-desc" style="margin-top:6px;color:var(--crit);">⚠ ${activeSkill.notes}</div>` : ''}
  `;
}

function applySkillMultiplier() {
  if (!activeSkill || activeSkill.multiplier === null) return;
  const el = document.getElementById('skillmod');
  if (el) {
    // Total multiplier = per-hit × hits
    el.value = (activeSkill.multiplier * activeSkill.hits * 100).toFixed(0);
  }
}

function applyDollPassives() {
  if (!activeDoll) return;
  // Reset all passive-sourced fields first
  const allPassiveFields = DOLLS.flatMap(d => d.passives.map(p => p.field));
  [...new Set(allPassiveFields)].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
  // Apply this doll's passives
  activeDoll.passives.forEach(p => {
    const el = document.getElementById(p.field);
    if (el) el.value = p.value;
  });
}

// ── Live Update (display only) ────────────────────────────────────────────────

function updateLive() {
  const totalFlat    = getFlatATKSources();
  const totalPct     = getAtkPctSources();
  const baseAtkTotal = getBaseAtkTotal();
  const atkIchorTotal= getAtkIchorTotal();
  const battlePct    = getBattleAtkPct();

  // ATK
  document.getElementById('total-flat-atk').textContent = fmt(totalFlat);
  document.getElementById('total-atk-pct').childNodes[0].textContent = `+${totalPct}% `;
  document.getElementById('total-atk-pct-abs').textContent = `(+${fmt(totalFlat * totalPct / 100)})`;
  document.getElementById('base-atk-total').textContent = fmt(baseAtkTotal);
  document.getElementById('atk-ichor-total').textContent = fmt(atkIchorTotal);
  document.getElementById('total-battle-pct').childNodes[0].textContent = `+${battlePct}% `;
  document.getElementById('total-battle-pct-abs').textContent = `(+${fmt(atkIchorTotal * battlePct / 100)})`;
  document.getElementById('in-battle-atk').textContent = fmt(getAtkFinal());

  // DEF
  const baseDef  = parseFloat(document.getElementById('def_base')?.value) || 0;
  const buffPct  = parseFloat(document.getElementById('def_buff_pct')?.value) || 0;
  const rounded  = Math.ceil(baseDef * (1 + buffPct / 100));
  document.getElementById('def-rounded').textContent  = fmt(baseDef);
  document.getElementById('def-buff-total').childNodes[0].textContent = `+${buffPct}% `;
  document.getElementById('def-buff-abs').textContent = `(+${fmt(rounded - baseDef)})`;
  document.getElementById('def-boosted').textContent  = fmt(rounded);
  document.getElementById('def-reduction-total').textContent = `${getTotalDefReduction()}%`;
  document.getElementById('def-final').textContent    = fmt(getFinalDef());

  // DMG
  const dmgMult = getDmgMult();
  const dmgSum  = Math.round((dmgMult - 1) * 10000) / 100;
  document.getElementById('dmg-total-display').textContent = `+${dmgSum}% → ×${dmgMult.toFixed(3)}`;

  // Crit
  const { critDmg, critRate } = getEffectiveCritStats();
  document.getElementById('crit-dmg-display').textContent  = `${critDmg}%`;
  document.getElementById('crit-rate-display').textContent = `${critRate}%`;

  // Weakness
  const a = document.getElementById('ammoWeak')?.checked ? 1 : 0;
  const p = document.getElementById('phaseWeak')?.checked ? 1 : 0;
  const c = a + p;
  document.getElementById('pip1').classList.toggle('active', c >= 1);
  document.getElementById('pip2').classList.toggle('active', c >= 2);
  document.getElementById('weakTotal').textContent = `×${(1 + c * 0.1).toFixed(2)}`;
}

// ── Calculate Button ──────────────────────────────────────────────────────────

function runCalculate() {
  const { normalDmg, critDmgVal, avgDmg, steps } = calculate();

  document.getElementById('result-normal').textContent = fmt(normalDmg);
  document.getElementById('result-crit').textContent   = fmt(critDmgVal);
  document.getElementById('result-avg').textContent    = fmt(avgDmg);

  ['result-normal','result-crit','result-avg'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('pulsing');
    void el.offsetWidth;
    el.classList.add('pulsing');
  });

  document.getElementById('breakdown-steps').innerHTML = steps.map((s, i) =>
    `<div class="step ${s.cls}">
       <span class="step-name">${s.name}</span>
       <span class="step-val ${s.col}">${s.val}</span>
     </div>${i === steps.length - 4 ? '<div class="step-arrow">↓</div>' : ''}`
  ).join('');
}

// ── Event Listeners & Init ────────────────────────────────────────────────────

function initEventListeners() {
  const numInputIds = [
    'atk','atk_wpn_flat','atk_attach_flat','atk_helix_flat','atk_affinity_flat','atk_dispatch_flat','atk_remold_flat',
    'atk_wpn_pct','atk_attach_pct','atk_helix_node_pct','atk_helix_extra_pct','atk_keys_pct','atk_covenant_pct','atk_fixedkey_pct',
    'atk_ichor_flat_boost','atk_remold_pct','battle_fixedkey_pct','battle_skill_pct',
    'def_base','def_buff_pct','def_weapon_trait','def_skill_debuff',
    'dmg_doll_passive','dmg_weapon_trait','dmg_attach_set','dmg_common_keys','dmg_fixed_keys',
    'critdmg','critrate','skillmod',
  ];
  numInputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateLive);
  });
  ['isCrit','ammoWeak','phaseWeak'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateLive);
  });
}

function init() {
  renderAtkBuffs();
  renderDefDebuffs();
  renderDmgToggles();
  renderCritToggles();
  renderPlatoonAtk();
  renderPlatoonDmg();
  populateDollSelector();
  onDollChange();
  initEventListeners();
  updateLive();
}

document.addEventListener('DOMContentLoaded', init);
