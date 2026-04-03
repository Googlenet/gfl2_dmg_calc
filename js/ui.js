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

window.gunsmokeBuffState = {};
getGunsmokeBuffList().forEach(b => { window.gunsmokeBuffState[b.id] = false; });

function onGunsmokeBuffToggle(id) {
  const buff  = getGunsmokeBuffById(id);
  const wasOn = window.gunsmokeBuffState[id];
  if (buff.group) {
    getGunsmokeBuffList()
      .filter(b => b.group === buff.group)
      .forEach(b => { window.gunsmokeBuffState[b.id] = false; });
  }
  window.gunsmokeBuffState[id] = !wasOn;
  renderGunsmokeBuffs();
  updateLive();
}

function renderGunsmokeBuffs() {
  document.getElementById('gunsmoke-buff-list').innerHTML = `
    <table class="atk-buff-table" style="width:100%;">
      <tbody>
        ${getGunsmokeBuffList().map(b => {
          const on  = window.gunsmokeBuffState[b.id];
          const badge = on && b.buff
            ? b.buff.atkPct ? `<span class="lv-badge lv1 atk-col"> +${b.buff.atkPct}% ATK</span>`
            : b.buff.dmgPct ? `<span class="lv-badge lv1 dmg-col"> +${b.buff.dmgPct}% DMG</span>`
            : ''
            : '';
          return `
            <tr class="atk-buff-row ${on ? 'active-I' : ''}">
              <td class="atk-buff-name">${b.label}${badge}</td>
              <td class="atk-buff-check" style="width:36px; min-width:36px; text-align:center;"><input type="checkbox" class="atk-cb" ${on ? 'checked' : ''} onchange="onGunsmokeBuffToggle('${b.id}')"></td>
            </tr>`;
        }).join('')}
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
  { key:'support_boost_ab',label:'Support Boost',        valI:15, valII:30 },
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

// ── Doll Mechanics Panel ──────────────────────────────────────────────────────

window.dollMechState = {};  // exposed globally so calculator.js can read it

function onDollMechToggle(key) {
  window.dollMechState[key] = !window.dollMechState[key];
  renderDollMechanics();
  updateLive();
}

function onDollMechStack(key, val) {
  // clicking active value turns it off
  window.dollMechState[key] = window.dollMechState[key] === val ? 0 : val;
  renderDollMechanics();
  updateLive();
}

function renderDollMechanics() {
  const panel = document.getElementById('doll-mechanics-panel');
  if (!panel) return;

  if (!activeDoll?.mechanics?.length) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = 'block';

  const mechHtml = activeDoll.mechanics.filter(mech =>
    !mech.vertebrae || mech.vertebrae.includes(activeVertebrae)
  ).map(mech => {
    if (mech.type === 'stack_selector') {
      const active = window.dollMechState[mech.key] || 0;
      const eff    = active > 0 ? mech.effect(active) : {};
      const badges = Object.entries(eff)
        .filter(([, v]) => v)
        .map(([k, v]) => `<span style="font-size:10px;padding:1px 5px;border-radius:3px;margin-left:4px;background:rgba(255,170,0,0.15);color:var(--crit);">${k} +${v}${k==='atkPct'||k==='dmgPct'||k==='critDmg'||k==='critRate'?'%':''}</span>`)
        .join('');
      const buttons = Array.from({length: mech.max}, (_, i) => {
        const n = i + 1;
        const isActive = active === n;
        return `<button type="button" onclick="onDollMechStack('${mech.key}',${n})"
          style="padding:4px 9px;font-family:'Share Tech Mono',monospace;font-size:11px;
                 background:${isActive?'rgba(255,170,0,0.2)':'var(--panel2)'};
                 border:1px solid ${isActive?'var(--crit)':'var(--border)'};
                 color:${isActive?'var(--crit)':'var(--text-dim)'};
                 border-radius:3px;cursor:pointer;margin-right:3px;">${n}</button>`;
      }).join('');
      return `
        <div style="padding:8px 0;border-bottom:1px solid rgba(30,58,95,0.4);">
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-bright);margin-bottom:6px;">
            ${mech.label}${badges}
          </div>
          <div style="display:flex;align-items:center;gap:0;flex-wrap:wrap;">
            <button type="button" onclick="onDollMechStack('${mech.key}',0)"
              style="padding:4px 9px;font-family:'Share Tech Mono',monospace;font-size:11px;
                     background:${active===0?'rgba(255,170,0,0.2)':'var(--panel2)'};
                     border:1px solid ${active===0?'var(--crit)':'var(--border)'};
                     color:${active===0?'var(--crit)':'var(--text-dim)'};
                     border-radius:3px;cursor:pointer;margin-right:3px;">0</button>
            ${buttons}
          </div>
          ${mech.notes ? `<div style="font-size:10px;color:var(--text-dim);margin-top:5px;font-family:'Share Tech Mono',monospace;">${mech.notes}</div>` : ''}
        </div>`;

    } else if (mech.type === 'toggle') {
      const on = !!window.dollMechState[mech.key];
      const effEntries = Object.entries(mech.effect).filter(([,v]) => v);
      const badge = on
        ? effEntries.map(([k,v]) => {
            const isMultiplier = k === 'dmgMultiplier' || k === 'fixedAtkMultiplier';
            const display = isMultiplier ? `×${v}` : `+${v}%`;
            return `<span style="font-size:10px;padding:1px 5px;border-radius:3px;margin-left:4px;background:rgba(167,139,250,0.15);color:var(--dmg-color);">${k} ${display}</span>`;
          }).join('')
        : '';
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(30,58,95,0.4);gap:10px;">
          <div style="flex:1;">
            <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-bright);">${mech.label}${badge}</div>
            ${mech.condition ? `<div style="font-size:10px;color:var(--text-dim);margin-top:2px;font-family:'Share Tech Mono',monospace;">${mech.condition}</div>` : ''}
            ${mech.notes ? `<div style="font-size:10px;color:var(--text-dim);margin-top:2px;font-family:'Share Tech Mono',monospace;">${mech.notes}</div>` : ''}
          </div>
          <input type="checkbox" class="atk-cb" ${on?'checked':''} onchange="onDollMechToggle('${mech.key}')" style="flex-shrink:0;">
        </div>`;
    }
    return '';
  }).join('');

  panel.innerHTML = `
    <div class="panel" style="margin-bottom:14px;border-color:var(--crit);">
      <div class="panel-label" style="color:var(--crit);">${activeDoll.name} — Kit Mechanics</div>
      ${mechHtml}
    </div>`;
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
  // Reset all mechanic state when doll changes
  window.dollMechState = {};
  if (activeDoll?.mechanics) {
    activeDoll.mechanics.forEach(m => {
      window.dollMechState[m.key] = m.type === 'stack_selector' ? 0 : false;
    });
  }
  renderDollMechanics();
  renderSkillSelector();
  applyDollPassives();
  updateLive();
}

function onVertebraeChange() {
  activeVertebrae = document.getElementById('vertebrae-select').value;
  activeMultIndex = 0;
  // Reset state for any mechanics that are no longer valid at this V level
  if (activeDoll?.mechanics) {
    activeDoll.mechanics.forEach(m => {
      if (m.vertebrae && !m.vertebrae.includes(activeVertebrae)) {
        window.dollMechState[m.key] = m.type === 'stack_selector' ? 0 : false;
      }
    });
  }
  renderSkillSelector();
  renderDollMechanics();
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

let activeStackBonusStacks = 0;  // persisted so renderSkillCard doesn't fight user input

function onStackBonusInput(val) {
  const rate      = activeSkill?.stackRate ?? 0;
  const maxStack  = activeSkill?.stackMax  ?? 0;
  const stacks    = Math.min(Math.max(parseFloat(val) || 0, 0), maxStack);
  const baseTotal = Array.isArray(activeSkill?.multiplier)
    ? activeSkill.multiplier.reduce((s, h) => s + h.value, 0)
    : 0;
  activeStackBonusStacks = stacks;
  const combined  = baseTotal + stacks * rate / 100;
  const el = document.getElementById('skillmod');
  if (el) el.value = (combined * 100).toFixed(0);
  const disp = document.getElementById('stack-bonus-display');
  const scaleStat = activeSkill?.scalingStat ?? 'ATK';
  if (disp) disp.textContent = baseTotal > 0
    ? `Combined: ${(baseTotal * 100).toFixed(0)}% + ${stacks}×${rate}% = ${(combined * 100).toFixed(0)}% ${scaleStat}`
    : `Effective multiplier: ${stacks}×${rate}% = ${stacks * rate}% ${scaleStat}`;
  updateLive();
}

function onOverflowStabInput(val) {
  const overflow = parseFloat(val) || 0;
  const rate = activeSkill?.overflowRate ?? 5;
  const el = document.getElementById('skillmod');
  if (el) el.value = (overflow * rate).toFixed(0);
  const disp = document.getElementById('overflow-mult-display');
  if (disp) disp.textContent = `Effective multiplier: ${overflow * rate}% ATK  [×${rate}% per pt]`;
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
  if (activeSkill.scalingType === 'stack_bonus' && !activeSkill.multiHit) {
    const rate     = activeSkill.stackRate ?? 0;
    const maxStack = activeSkill.stackMax  ?? 0;
    const stacks   = activeStackBonusStacks;
    multSection = `
      <div style="margin-top:10px;">
        <div class="skill-card-name" style="margin-bottom:6px;">${activeSkill.stackLabel ?? 'Stacks'} (max ${maxStack})</div>
        <div class="stat-row" style="border-bottom:none;margin:0;">
          <span class="stat-label" style="font-size:11px;">Stacks on target</span>
          <div class="stat-input">
            <input type="number" id="stack-bonus-input" value="${stacks}" min="0" max="${maxStack}"
              style="width:80px;"
              oninput="onStackBonusInput(this.value)">
            <div class="suf">×+${rate}%</div>
          </div>
        </div>
        <div class="skill-card-mult" style="margin-top:8px;" id="stack-bonus-display">
          Effective multiplier: ${stacks}×${rate}% = ${stacks * rate}% ${activeSkill.scalingStat ?? 'ATK'}
        </div>
      </div>`;
  } else if (activeSkill.scalingType === 'stability_overflow') {
    const rate = activeSkill.overflowRate ?? 5;
    const current = readNum('skillmod', 0);
    const overflow = current > 0 ? Math.round(current / rate) : 0;
    multSection = `
      <div style="margin-top:10px;">
        <div class="skill-card-name" style="margin-bottom:6px;">Overflow Stability Damage</div>
        <div class="stat-row" style="border-bottom:none;margin:0;">
          <span class="stat-label" style="font-size:11px;">Overflow Stab Dealt</span>
          <div class="stat-input">
            <input type="number" id="overflow-stab-input" value="${overflow}" min="0"
              style="width:80px;"
              oninput="onOverflowStabInput(this.value)">
            <div class="suf">pts</div>
          </div>
        </div>
        <div class="skill-card-mult" style="margin-top:8px;" id="overflow-mult-display">
          Effective multiplier: ${overflow * rate}% ATK  [×${rate}% per pt]
        </div>
      </div>`;
  } else if (isMulti && activeSkill.multiHit) {
    const baseTotal = activeSkill.multiplier.reduce((s, h) => s + h.value, 0);
    const scaleStat = activeSkill.scalingStat ?? 'ATK';
    multSection = `
      <div style="margin-top:10px;">
        <div class="skill-card-name" style="margin-bottom:6px;">Multi-Hit</div>
        <table class="atk-buff-table" style="margin-top:0;">
          <tbody>
            ${activeSkill.multiplier.map(hit => `
              <tr class="atk-buff-row">
                <td class="atk-buff-name">${hit.label}</td>
                <td class="atk-buff-name" style="color:var(--atk-color);text-align:right;padding-right:8px;">${(hit.value * 100).toFixed(0)}% ${scaleStat}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="skill-card-mult" style="margin-top:8px;">
          Combined: ${(baseTotal * 100).toFixed(0)}% ${scaleStat}
        </div>
      </div>`;
  } else if (isMulti) {
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
  const el = document.getElementById('skillmod');
  if (!el || !activeSkill) return;
  if (activeSkill.scalingType === 'stability_overflow') {
    el.value = 0;
    return;
  }
  if (activeSkill.scalingType === 'stack_bonus') {
    activeStackBonusStacks = 0;
    el.value = 0;
    return;
  }
  if (activeSkill.multiplier === null) return;
  let val;
  if (activeSkill.multiHit) {
    val = activeSkill.multiplier.reduce((s, h) => s + h.value, 0);
  } else if (Array.isArray(activeSkill.multiplier)) {
    val = activeSkill.multiplier[activeMultIndex].value;
  } else {
    val = activeSkill.multiplier;
  }
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

  const mech = getDollMechanicsResult();

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

  const ckeyAtkPct = getCommonKeyAtkPct();
  const el = document.getElementById('ckey-atk-pct-display');
  if (el) el.textContent = ckeyAtkPct > 0 ? `+${ckeyAtkPct}%` : '+0%';

  document.getElementById('total-flat-atk').textContent = `${fmt(totalFlat)} (${flatWhole.toLocaleString()})`;
  document.getElementById('total-atk-pct').childNodes[0].textContent = `+${totalPct + ckeyAtkPct}% `;
  document.getElementById('total-atk-pct-abs').textContent = `(+${fmt(flatWhole * (totalPct + ckeyAtkPct) / 100)})`;
  document.getElementById('base-atk-total').textContent = fmt(baseAtkTotal);
  document.getElementById('atk-ichor-total').textContent = `${fmt(battleFlatTotal)} (${battleFlatWhole.toLocaleString()})`;
  document.getElementById('total-battle-pct').childNodes[0].textContent = `+${battlePct}% `;
  document.getElementById('total-battle-pct-abs').textContent = `(+${fmt(battleFlatWhole * battlePct / 100)})`;
  document.getElementById('in-battle-atk').textContent = `${fmt(atkFinal)} (${atkFinalWhole.toLocaleString()})`;

  // Kit mech ATK% read-only row
  const kitAtkRow = document.getElementById('kit-atk-pct-row');
  const kitAtkInput = document.getElementById('kit_atk_pct');
  if (kitAtkRow && kitAtkInput) {
    if (mech.atkPct > 0) {
      kitAtkRow.style.display = '';
      kitAtkInput.value = mech.atkPct;
    } else {
      kitAtkRow.style.display = 'none';
      kitAtkInput.value = 0;
    }
  }

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

  // Kit DMG% read-only row
  const kitDmgRow   = document.getElementById('kit-dmg-pct-row');
  const kitDmgInput = document.getElementById('kit_dmg_pct');
  if (kitDmgRow && kitDmgInput) {
    if (mech.dmgPct > 0) {
      kitDmgRow.style.display = '';
      kitDmgInput.value = mech.dmgPct;
    } else {
      kitDmgRow.style.display = 'none';
      kitDmgInput.value = 0;
    }
  }

  // DMG total display
  const dmgMult = getDmgMult();
  const dmgSum  = Math.ceil((dmgMult - 1) * 10000) / 100;
  const fullDmgMult = dmgMult * mech.dmgMultiplier;
  let dmgHtml = `+${dmgSum}%`;
  if (mech.dmgMultiplier > 1) {
    const kitStyle = `font-size:10px;padding:1px 5px;border-radius:3px;margin-left:6px;background:rgba(167,139,250,0.15);color:var(--dmg-color);font-family:'Share Tech Mono',monospace;`;
    dmgHtml += ` <span style="${kitStyle}">×${mech.dmgMultiplier} kit</span>`;
  }
  dmgHtml += ` → ×${fullDmgMult.toFixed(3)}`;
  document.getElementById('dmg-total-display').innerHTML = dmgHtml;

  // Crit (including mech contributions)
  const { critDmg, critRate } = getEffectiveCritStats();
  const totalCritDmg  = Math.min(critDmg  + mech.critDmg,  9999);
  const totalCritRate = Math.min(critRate + mech.critRate, 100);
  const critStyle = `font-size:10px;padding:1px 5px;border-radius:3px;margin-left:6px;background:rgba(255,170,0,0.15);color:var(--crit);font-family:'Share Tech Mono',monospace;`;
  const critDmgBadge  = mech.critDmg  > 0 ? ` <span style="${critStyle}">+${mech.critDmg}% kit</span>`  : '';
  const critRateBadge = mech.critRate > 0 ? ` <span style="${critStyle}">+${mech.critRate}% kit</span>` : '';
  document.getElementById('crit-dmg-display').innerHTML  = `${totalCritDmg}%${critDmgBadge}`;
  document.getElementById('crit-rate-display').innerHTML = `${totalCritRate}%${critRateBadge}`;

  const ckeyCritDmg  = getCommonKeyCritDmg();
  const ckeyCritRate = getCommonKeyCritRate();
  const ckeyCritDmgRow  = document.getElementById('ckey-crit-dmg-row');
  const ckeyCritRateRow = document.getElementById('ckey-crit-rate-row');
  ckeyCritDmgRow.style.display  = ckeyCritDmg  > 0 ? '' : 'none';
  ckeyCritRateRow.style.display = ckeyCritRate > 0 ? '' : 'none';
  if (ckeyCritDmg  > 0) document.getElementById('ckey-crit-dmg-display').textContent  = `+${ckeyCritDmg}%`;
  if (ckeyCritRate > 0) document.getElementById('ckey-crit-rate-display').textContent = `+${ckeyCritRate}%`;

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
  const { normalDmg, critDmgVal, avgDmg, fixedDmg, steps } = calculate();

  document.getElementById('result-normal').textContent = normalDmg.toLocaleString();
  document.getElementById('result-crit').textContent   = critDmgVal.toLocaleString();
  document.getElementById('result-avg').textContent    = avgDmg.toLocaleString();

  const fixedRow = document.getElementById('fixed-dmg-row');
  if (fixedDmg > 0) {
    fixedRow.style.display = 'block';
    document.getElementById('result-fixed').textContent       = `+${fixedDmg.toLocaleString()}`;
    document.getElementById('result-total-normal').textContent = (normalDmg + fixedDmg).toLocaleString();
    document.getElementById('result-total-crit').textContent   = (critDmgVal + fixedDmg).toLocaleString();
    document.getElementById('result-total-avg').textContent    = (avgDmg    + fixedDmg).toLocaleString();
  } else {
    fixedRow.style.display = 'none';
  }

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
    'critdmg_extra','critrate',
  ];
  numInputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateLive);
  });
  ['ammoWeak','phaseWeak'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateLive);
  });
}

// ── Common Keys ───────────────────────────────────────────────────────────────

const CKEY_STAT_OPTIONS = [
  { value: '',         label: '— None —'      },
  { value: 'atkPct',   label: 'Attack Boost'  },
  { value: 'critRate', label: 'Crit Rate'     },
  { value: 'critDmg',  label: 'Crit DMG'      },
  { value: 'defPct',   label: 'DEF Boost'     },
  { value: 'hpPct',    label: 'HP Boost'      },
];

// State: array of 3 effect-active booleans, one per column
window.ckeyEffectActive = [false, false, false];

function populateCommonKeySelector() {
  [0, 1, 2].forEach(i => {
    document.getElementById(`ckey-col-${i}`).innerHTML = renderCkeyColumn(i, null);
  });
}

function renderCkeyColumn(i, key) {
  const slotOptHtml = CKEY_STAT_OPTIONS.map(o =>
    `<option value="${o.value}">${o.label}</option>`
  ).join('');

  const keyOptHtml = `<option value="" disabled selected>— Select a key —</option>`
    + getCommonKeyList().slice().sort((a, b) => a.name.localeCompare(b.name))
        .map(k => `<option value="${k.id}">${k.name}</option>`).join('');

  const slot1Label = key ? key.defaultStatLabel : '—';

  return `
    <div class="ckey-col">
      <select class="ckey-col-select" onchange="onCommonKeyChange(${i}, this.value)">
        ${keyOptHtml}
      </select>

      <div class="ckey-slot">
        <div class="ckey-slot-label is-default">${slot1Label}</div>
        <input class="ckey-slot-input" type="number" id="ckey-${i}-s1-val"
               value="0" min="0" ${!key ? 'disabled' : ''} oninput="updateLive()">
      </div>

      <div class="ckey-slot">
        <select class="ckey-slot-type" id="ckey-${i}-s2-type"
                onchange="updateLive()" ${!key ? 'disabled' : ''}>${slotOptHtml}</select>
        <input class="ckey-slot-input" type="number" id="ckey-${i}-s2-val"
               value="0" min="0" ${!key ? 'disabled' : ''} oninput="updateLive()">
      </div>

      <div class="ckey-slot">
        <select class="ckey-slot-type" id="ckey-${i}-s3-type"
                onchange="updateLive()" ${!key ? 'disabled' : ''}>${slotOptHtml}</select>
        <input class="ckey-slot-input" type="number" id="ckey-${i}-s3-val"
               value="0" min="0" ${!key ? 'disabled' : ''} oninput="updateLive()">
      </div>
    </div>`;
}

function onCommonKeyChange(i, id) {
  const key = id ? getCommonKey(id) : null;
  window.ckeyEffectActive[i] = false;

  document.getElementById(`ckey-col-${i}`).innerHTML = renderCkeyColumn(i, key);
  // Restore the selected value in the dropdown after re-render
  const sel = document.getElementById(`ckey-col-${i}`).querySelector('.ckey-col-select');
  if (sel && id) sel.value = id;

  renderCkeyEffects();
  updateLive();
}

function renderCkeyEffects() {
  const rows = [0, 1, 2].map(i => {
    const sel = document.getElementById(`ckey-col-${i}`)?.querySelector('.ckey-col-select');
    const id  = sel?.value;
    const key = id ? getCommonKey(id) : null;
    if (!key || !key.effectBuff) return '';
    const on = window.ckeyEffectActive[i];
    return `
      <div class="toggle-row" style="padding:4px 0;">
        <div class="toggle-info">
          <strong style="font-size:11px;">Key ${i + 1} Effect</strong>
          <span>${key.effect}</span>
        </div>
        <label class="toggle">
          <input type="checkbox" ${on ? 'checked' : ''} onchange="onCkeyEffectToggle(${i}, this.checked)">
          <span class="toggle-track"></span>
        </label>
      </div>`;
  }).join('');

  const el = document.getElementById('ckey-effects-list');
  el.innerHTML = rows;
  el.style.display = rows.trim() ? '' : 'none';
}

function onCkeyEffectToggle(i, checked) {
  window.ckeyEffectActive[i] = checked;
  updateLive();
}

// ── Food Buff ─────────────────────────────────────────────────────────────────

function populateFoodSelector() {
  const sel = document.getElementById('food-select');
  sel.innerHTML = `<option value="" disabled selected>— Select a food —</option>`
    + getFoodList().slice().sort((a, b) => a.name.localeCompare(b.name))
        .map(f => `<option value="${f.id}">${f.name}</option>`).join('');
}

function onFoodChange() {
  const id   = document.getElementById('food-select').value;
  const food = getFood(id);
  const buff = food.buff || {};

  const hasFlat     = !!buff.flatAtk;
  const hasAtkPct   = !!buff.atkPct;
  const hasDmgPct   = !!buff.dmgPct;
  const hasCritRate = !!buff.critRate;
  const hasBuff     = hasFlat || hasAtkPct || hasDmgPct || hasCritRate || !!food.description;

  document.getElementById('food-buff-display').style.display = hasBuff ? '' : 'none';

  const descEl = document.getElementById('food-desc');
  descEl.textContent   = food.description || '';
  descEl.style.display = food.description ? '' : 'none';

  document.getElementById('food-flat-row').style.display     = hasFlat     ? '' : 'none';
  document.getElementById('food-atk-pct-row').style.display  = hasAtkPct   ? '' : 'none';
  document.getElementById('food-dmg-pct-row').style.display  = hasDmgPct   ? '' : 'none';
  document.getElementById('food-crit-rate-row').style.display = hasCritRate ? '' : 'none';

  if (hasFlat)     document.getElementById('food-flat-val').textContent      = `+${buff.flatAtk}`;
  if (hasAtkPct)   document.getElementById('food-atk-pct-val').textContent   = `+${buff.atkPct}%`;
  if (hasDmgPct)   document.getElementById('food-dmg-pct-val').textContent   = `+${buff.dmgPct}%`;
  if (hasCritRate) document.getElementById('food-crit-rate-val').textContent = `+${buff.critRate}%`;

  // Mirror active food values into the ATK panel display rows
  document.getElementById('food-flat-atk-display').textContent = hasFlat   ? `+${buff.flatAtk}` : '0';
  document.getElementById('food-atk-pct-display').textContent  = hasAtkPct ? `+${buff.atkPct}%` : '+0%';

  updateLive();
}

function init() {
  renderAtkBuffs();
  renderIchorSelector();
  renderDefDebuffs();
  renderDmgToggles();
  renderCritToggles();
  renderGunsmokeBuffs();
  populateDollSelector();
  populateCommonKeySelector();
  populateFoodSelector();
  document.getElementById('vertebrae-select').value = 'v0';
  activeVertebrae = 'v0';
  onDollChange();         // also calls renderDollMechanics
  initEventListeners();
  updateLive();
}

document.addEventListener('DOMContentLoaded', init);
