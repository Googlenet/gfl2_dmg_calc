// ─────────────────────────────────────────────────────────────────────────────
// ui.js  —  All DOM rendering, toggle state, and event wiring.
//           Calls calculator.js functions for values; never does math itself.
// ─────────────────────────────────────────────────────────────────────────────

// ── ATK Fixed Toggles (I/II) ──────────────────────────────────────────────────

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
  renderAtkMultiBuffs();
}

// ── ATK Multi-Level Buffs (I–V or I–III) ─────────────────────────────────────
// vals array: index 0 = level I, index N-1 = level N
const ATK_MULTI = [
  { key:'atk_unity',    label:'Attack Unity',    vals:[0.2, 0.4, 0.6, 0.8, 1.0] },
  { key:'supp_embryo',  label:'Support — Embryo',vals:[1, 2, 3] },
  { key:'supp_shoot',   label:'Support — Shoot', vals:[4, 7, 9] },
  { key:'supp_blossom', label:'Support — Blossom',vals:[3] },
];
const atkMultiState = {};
ATK_MULTI.forEach(b => { atkMultiState[b.key] = 0; }); // 0 = off, 1–N = level

function onAtkMultiSelect(key, level) {
  // clicking the active level turns it off
  atkMultiState[key] = atkMultiState[key] === level ? 0 : level;
  renderAtkMultiBuffs();
  updateLive();
}

function renderAtkMultiBuffs() {
  const container = document.getElementById('battle-atk-extra-list');
  if (!container) return;
  container.innerHTML = `
    <table class="atk-buff-table">
      <thead>
        <tr>
          <th>Buff</th>
          ${['I','II','III','IV','V'].slice(0, Math.max(...ATK_MULTI.map(b => b.vals.length))).map(l => `<th>${l}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${ATK_MULTI.map(b => {
          const active = atkMultiState[b.key];
          const rowCls = active > 0 ? 'active-I' : '';
          const badge  = active > 0
            ? `<span class="lv-badge lv1"> +${b.vals[active-1]}%</span>`
            : '';
          const maxCols = Math.max(...ATK_MULTI.map(x => x.vals.length));
          const checkboxes = Array.from({length: maxCols}, (_, i) => {
            const lvl = i + 1;
            if (lvl > b.vals.length) return `<td class="atk-buff-check"></td>`;
            return `<td class="atk-buff-check">
              <input type="checkbox" class="atk-cb"
                ${active === lvl ? 'checked' : ''}
                onchange="onAtkMultiSelect('${b.key}', ${lvl})">
            </td>`;
          }).join('');
          return `<tr class="atk-buff-row ${rowCls}">
            <td class="atk-buff-name">${b.label}${badge}</td>
            ${checkboxes}
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── Ichor Flower Level Selector ───────────────────────────────────────────────

function renderIchorSelector() {
  const wrap = document.getElementById('ichor-select-wrap');
  if (!wrap) return;
  // Hidden input stores the current level (0 = off)
  const currentLevel = parseInt(document.getElementById('ichor-level')?.value ?? '0') || 0;
  const levels = ['—','I','II','III','IV','V'];
  wrap.innerHTML = `
    <input type="hidden" id="ichor-level" value="${currentLevel}">
    ${levels.map((lbl, i) => `
      <button type="button"
        style="padding:4px 8px;margin-right:3px;font-family:'Share Tech Mono',monospace;font-size:11px;
               background:${currentLevel===i?'rgba(255,107,107,0.25)':'var(--panel2)'};
               border:1px solid ${currentLevel===i?'var(--atk-color)':'var(--border)'};
               color:${currentLevel===i?'var(--atk-color)':'var(--text-dim)'};
               border-radius:3px;cursor:pointer;"
        onclick="onIchorSelect(${i})">${lbl}</button>
    `).join('')}`;
}

function onIchorSelect(level) {
  const el = document.getElementById('ichor-level');
  // Clicking active level turns it off
  if (el) el.value = (parseInt(el.value) === level ? 0 : level);
  renderIchorSelector();
  updateLive();
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

let activeDoll      = null;
let activeSkill     = null;
let activeVertebrae = 'v0';
let activeMultIndex = 0;   // which option is selected for multi-multiplier skills

function populateDollSelector() {
  const sel = document.getElementById('doll-select');
  if (!sel) return;
  sel.innerHTML = `<option value="">— Select a Doll —</option>`
    + getDollList().map(d =>
        `<option value="${d.id}">${d.name} (${d.class})</option>`
      ).join('');
}

function onDollChange() {
  activeDoll = getDoll(document.getElementById('doll-select').value);
  activeMultIndex = 0;
  renderSkillSelector();
  applyDollPassives();
  updateLive();
}

function onVertebraeChange() {
  activeVertebrae = document.getElementById('vertebrae-select').value;
  activeMultIndex = 0;
  renderSkillSelector();
  updateLive();
}

function renderSkillSelector() {
  const sel = document.getElementById('skill-select');
  if (!sel) return;

  if (!activeDoll) {
    sel.innerHTML = '<option>— Select a doll first —</option>';
    renderSkillCard();
    return;
  }

  const skills = getSkillsForVertebrae(activeDoll, activeVertebrae);
  sel.innerHTML = skills.map(s => {
    const multLabel = Array.isArray(s.multiplier)
      ? 'variable'
      : s.multiplier !== null ? `${(s.multiplier * 100).toFixed(0)}%` : 'passive';
    return `<option value="${s.id}">${s.name} — ${s.dmg_type} / ${s.skill_type} (${multLabel})</option>`;
  }).join('');

  // Default to first skill
  activeSkill     = skills[0] || null;
  activeMultIndex = 0;
  renderSkillCard();
  applySkillToCalc();
}

function onSkillChange() {
  if (!activeDoll) return;
  const id     = document.getElementById('skill-select').value;
  const skills = getSkillsForVertebrae(activeDoll, activeVertebrae);
  activeSkill     = skills.find(s => s.id === id) || null;
  activeMultIndex = 0;
  renderSkillCard();
  applySkillToCalc();
  updateLive();
}

// Called when user picks a multiplier option on a multi-mult skill
function onMultSelect(index) {
  activeMultIndex = activeMultIndex === index ? 0 : index;
  renderSkillCard();
  applySkillToCalc();
  updateLive();
}

function renderSkillCard() {
  const card = document.getElementById('skill-card');
  if (!card) return;

  if (!activeSkill) {
    card.innerHTML = '<div class="skill-card-name">No skill selected</div>';
    return;
  }

  const isMulti = Array.isArray(activeSkill.multiplier);
  const dmgBadge = `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:rgba(167,139,250,0.15);color:var(--dmg-color);margin-left:6px;">${activeSkill.dmg_type}</span>`;
  const typeBadge = `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:rgba(0,170,255,0.1);color:var(--accent);margin-left:4px;">${activeSkill.skill_type}</span>`;

  let multSection = '';
  if (isMulti) {
    // Render mutually exclusive checkboxes for each multiplier option
    multSection = `
      <div style="margin-top:10px;">
        <div class="skill-card-name" style="margin-bottom:6px;">Select Multiplier</div>
        <table class="atk-buff-table" style="margin-top:0;">
          <tbody>
            ${activeSkill.multiplier.map((opt, i) => `
              <tr class="atk-buff-row ${activeMultIndex === i ? 'active-I' : ''}">
                <td class="atk-buff-name">${opt.label}</td>
                <td class="atk-buff-check" style="width:40px;">
                  <input type="checkbox" class="atk-cb"
                    ${activeMultIndex === i ? 'checked' : ''}
                    onchange="onMultSelect(${i})">
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="skill-card-mult" style="margin-top:8px;">
          Active: ${(activeSkill.multiplier[activeMultIndex].value * 100).toFixed(0)}% ${activeSkill.scalingStat ?? 'ATK'}
        </div>
      </div>`;
  } else if (activeSkill.multiplier !== null) {
    const scaleStat = activeSkill.scalingStat ?? 'ATK';
    multSection = `<div class="skill-card-mult" style="margin-top:8px;">${(activeSkill.multiplier * 100).toFixed(0)}% ${scaleStat}</div>`;
  } else {
    multSection = `<div class="skill-card-mult" style="margin-top:8px;color:var(--text-dim);font-size:13px;">Passive — no direct multiplier</div>`;
  }

  card.innerHTML = `
    <div class="skill-card-name" style="display:flex;align-items:center;flex-wrap:wrap;gap:2px;">
      ${activeSkill.name}${dmgBadge}${typeBadge}
    </div>
    <div class="skill-card-desc" style="margin-top:6px;">${activeSkill.description}</div>
    ${multSection}
    ${activeSkill.notes ? `<div class="skill-card-desc" style="margin-top:8px;color:var(--crit);">⚠ ${activeSkill.notes}</div>` : ''}
    ${activeSkill.cooldown ? `<div class="skill-card-desc" style="margin-top:4px;color:var(--text-dim);">Cooldown: ${activeSkill.cooldown} turn${activeSkill.cooldown > 1 ? 's' : ''}</div>` : ''}
  `;
}

function applySkillToCalc() {
  if (!activeSkill || activeSkill.multiplier === null) return;
  const el = document.getElementById('skillmod');
  if (!el) return;
  const val = Array.isArray(activeSkill.multiplier)
    ? activeSkill.multiplier[activeMultIndex].value
    : activeSkill.multiplier;
  el.value = (val * 100).toFixed(0);
}

function applyDollPassives() {
  if (!activeDoll) return;
  // Reset all fields that any doll's passives could touch
  const allFields = DOLLS.flatMap(d => d.passives.map(p => p.field));
  [...new Set(allFields)].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
  activeDoll.passives.forEach(p => {
    const el = document.getElementById(p.field);
    if (el) el.value = p.value;
  });
  // Set base crit DMG from doll data (read-only field)
  const critEl = document.getElementById('critdmg');
  if (critEl && activeDoll.baseCritDmg != null) {
    critEl.value = activeDoll.baseCritDmg;
  } else if (critEl && !activeDoll.baseCritDmg) {
    critEl.value = 150; // default if not set in doll data
  }
}

// ── Live Update (display only) ────────────────────────────────────────────────

function updateLive() {

  // ATK
  const totalFlat      = getFlatATKSources();
  const flatWhole      = getFlatATKWhole();
  const totalPct       = getAtkPctSources();
  const baseAtkTotal   = getBaseAtkTotal();
  const battleFlatTotal= getBattleFlatTotal();
  const battleFlatWhole= getBattleAtkFlatWhole();
  const battlePct      = getBattleAtkPct();
  const atkFinal       = getAtkFinal();
  const atkFinalWhole  = Math.ceil(atkFinal);

  document.getElementById('total-flat-atk').textContent = `${fmt(totalFlat)} (${flatWhole.toLocaleString()})`;
  document.getElementById('total-atk-pct').childNodes[0].textContent = `+${totalPct}% `;
  document.getElementById('total-atk-pct-abs').textContent = `(+${fmt(flatWhole * totalPct / 100)})`;
  document.getElementById('base-atk-total').textContent = fmt(baseAtkTotal);
  document.getElementById('atk-ichor-total').textContent = `${fmt(battleFlatTotal)} (${battleFlatWhole.toLocaleString()})`;
  document.getElementById('total-battle-pct').childNodes[0].textContent = `+${battlePct}% `;
  document.getElementById('total-battle-pct-abs').textContent = `(+${fmt(battleFlatWhole * battlePct / 100)})`;
  document.getElementById('in-battle-atk').textContent = `${fmt(atkFinal)} (${atkFinalWhole.toLocaleString()})`;

  renderIchorSelector();

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
  const dmgSum  = Math.ceil((dmgMult - 1) * 10000) / 100;
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

  document.getElementById('result-normal').textContent = normalDmg.toLocaleString();
  document.getElementById('result-crit').textContent   = critDmgVal.toLocaleString();
  document.getElementById('result-avg').textContent    = avgDmg.toLocaleString();

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
    'doll_max_hp','food_buff_flat','food_atk_pct',
    'atk_remold_pct','battle_fixedkey_pct','battle_skill_pct',
    'def_base','def_buff_pct','def_weapon_trait','def_skill_debuff',
    'dmg_doll_passive','dmg_weapon_trait','dmg_attach_set','dmg_common_keys','dmg_fixed_keys','dmg_remolding',
    'critdmg_extra','critrate','skillmod',
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
  renderAtkBuffs();       // also calls renderAtkMultiBuffs
  renderIchorSelector();
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
