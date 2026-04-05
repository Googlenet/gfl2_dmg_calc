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
  renderDollPassives();
  updateLive();
}

function onDollMechStack(key, val) {
  // clicking active value turns it off
  window.dollMechState[key] = window.dollMechState[key] === val ? 0 : val;
  renderDollPassives();
  updateLive();
}

function renderDollPassives() {
  const panel = document.getElementById('doll-mechanics-panel');
  if (!panel) return;

  if (!activeDoll?.passives?.length) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = 'block';

  const mechHtml = activeDoll.passives.filter(mech =>
    !mech.vertebrae || mech.vertebrae.includes(activeVertebrae)
  ).map(mech => {
    if (mech.type === 'stack_selector') {
      const active = window.dollMechState[mech.key] || 0;
      const eff    = active > 0 ? mech.effect(active) : {};
      const badges = Object.entries(eff)
        .filter(([, v]) => v)
        .map(([k, v]) => { const suf = (k.endsWith('Pct')||k.endsWith('CritDmg')||k==='critDmg'||k==='critRate') ? '%' : (k.endsWith('Multiplier') ? '×' : ''); return `<span style="font-size:10px;padding:1px 5px;border-radius:3px;margin-left:4px;background:rgba(255,170,0,0.15);color:var(--crit);">${k} +${v}${suf}</span>`; })
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
            const suf = k.endsWith('Multiplier') ? '×' : '%';
            const display = k.endsWith('Multiplier') ? `×${v}` : `+${v}${suf}`;
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
      <div class="panel-label" style="color:var(--crit);">${activeDoll.name} — Passives</div>
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
  // Reset all passive state when doll changes
  window.dollMechState = {};
  if (activeDoll?.passives) {
    activeDoll.passives.forEach(m => {
      window.dollMechState[m.key] = m.type === 'stack_selector' ? 0 : false;
    });
  }
  window.imagoformState = {};
  renderDollPassives();
  renderSkillSelector();
  applyDollPassives();
  renderFlowerPanel();
  renderImagoformPanel();
  updateLive();
}

function onVertebraeChange() {
  activeVertebrae = document.getElementById('vertebrae-select').value;
  activeMultIndex = 0;
  // Reset state for any passives that are no longer valid at this V level
  if (activeDoll?.passives) {
    activeDoll.passives.forEach(m => {
      if (m.vertebrae && !m.vertebrae.includes(activeVertebrae)) {
        window.dollMechState[m.key] = m.type === 'stack_selector' ? 0 : false;
      }
    });
  }
  renderSkillSelector();
  renderDollPassives();
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

  const PHASE_COLORS = {
    electric: '#a78bfa', corrosion: '#7ec87e', burn: '#ff8c42',
    hydro: '#63b3ed', physical: '#c8dff0', freeze: '#93e4f5',
  };
  const makeBadge = (text, bg, color) =>
    `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:${bg};color:${color};margin-left:4px;font-family:'Share Tech Mono',monospace;">${text}</span>`;

  const phaseKey = activeSkill.phase_dmg_type?.toLowerCase() || '';
  const phaseColor = PHASE_COLORS[phaseKey] || 'var(--text)';
  const phaseBadge   = activeSkill.phase_dmg_type
    ? makeBadge(activeSkill.phase_dmg_type, `${phaseColor}22`, phaseColor) : '';
  const targetBadge  = activeSkill.target_type
    ? makeBadge(activeSkill.target_type, 'rgba(0,170,255,0.1)', 'var(--accent)') : '';
  const skillBadge   = activeSkill.skill_type
    ? makeBadge(activeSkill.skill_type, 'rgba(255,170,0,0.1)', 'var(--crit)') : '';
  const ammoBadge    = activeSkill.ammo_type
    ? makeBadge(activeSkill.ammo_type, 'rgba(255,107,107,0.1)', 'var(--atk-color)') : '';

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
      ${activeSkill.name}${phaseBadge}${targetBadge}${skillBadge}${ammoBadge}
    </div>
    <div class="skill-card-desc" style="margin-top:6px;">${activeSkill.description}</div>
    ${multSection}
    ${activeSkill.notes ? `<div class="skill-card-desc" style="margin-top:8px;color:var(--crit);">⚠ ${activeSkill.notes}</div>` : ''}
    <div style="display:flex;gap:16px;margin-top:6px;flex-wrap:wrap;">
      ${activeSkill.cooldown != null ? `<div class="skill-card-desc" style="color:var(--text-dim);">CD: ${activeSkill.cooldown} turn${activeSkill.cooldown > 1 ? 's' : ''}</div>` : ''}
      ${activeSkill.stability_dmg != null ? `<div class="skill-card-desc" style="color:var(--def-color);">Stab DMG: ${activeSkill.stability_dmg} pt${activeSkill.stability_dmg !== 1 ? 's' : ''}</div>` : ''}
      ${activeSkill.confectance_cost != null ? `<div class="skill-card-desc" style="color:var(--accent2);">Cost: ${activeSkill.confectance_cost}</div>` : ''}
    </div>
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
  renderFlowerSummary();
  renderTeamBuffSummary();

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

  // Passive DEF reduction row
  const passiveDefPct = getDollPassivesResult().defReducPct;
  const passiveDefRow = document.getElementById('passive-def-reduc-row');
  if (passiveDefRow) {
    passiveDefRow.style.display = passiveDefPct > 0 ? '' : 'none';
    if (passiveDefPct > 0) document.getElementById('passive-def-reduc-display').textContent = `-${passiveDefPct.toFixed(0)}%`;
  }

  // Flower display rows
  const flower = getFlowerResult();
  const flowerAtkRow  = document.getElementById('flower-atk-pct-row');
  const flowerDmgRow  = document.getElementById('flower-dmg-pct-row');
  const flowerCritDmgRow  = document.getElementById('flower-crit-dmg-row');
  const flowerCritRateRow = document.getElementById('flower-crit-rate-row');
  if (flowerAtkRow)  flowerAtkRow.style.display  = flower.atkPct  > 0 ? '' : 'none';
  if (flowerDmgRow)  flowerDmgRow.style.display  = flower.dmgPct  > 0 ? '' : 'none';
  if (flowerCritDmgRow)  flowerCritDmgRow.style.display  = flower.critDmg  > 0 ? '' : 'none';
  if (flowerCritRateRow) flowerCritRateRow.style.display = flower.critRate > 0 ? '' : 'none';
  if (flower.atkPct  > 0) document.getElementById('flower-atk-pct-display').textContent = `+${flower.atkPct.toFixed(2)}%`;
  if (flower.dmgPct  > 0) document.getElementById('flower-dmg-pct-display').textContent = `+${flower.dmgPct.toFixed(2)}%`;
  if (flower.critDmg  > 0) document.getElementById('flower-crit-dmg-display').textContent  = `+${flower.critDmg.toFixed(2)}%`;
  if (flower.critRate > 0) document.getElementById('flower-crit-rate-display').textContent = `+${flower.critRate.toFixed(2)}%`;

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

// ── Remolding Pattern (Flowers) ──────────────────────────────────────────────

const FLOWER_TYPE_COLORS = {
  sentinel: 'var(--atk-color)',
  vanguard: 'var(--dmg-color)',
  support:  'var(--accent2)',
  bulwark:  'var(--def-color)',
};

// Stat ids whose values are flat (not percentages) — no % sign in summary
const FLOWER_FLAT_IDS = new Set(['stabDmg', 'fixedDmg', 'stabRecov']);

// Stat id → display label for summary
const FLOWER_STAT_DISPLAY = {
  atkPct: 'ATK%', critRate: 'Crit Rate', critDmg: 'Crit DMG', dmgPct: 'DMG%',
  bossDmgPct: 'Boss DMG%', aoeDmgPct: 'AOE DMG%', targetDmgPct: 'Target DMG%',
  targetCritDmg: 'Target Crit DMG', aoeCritDmg: 'AOE Crit DMG',
  corroDmgPct: 'Corrosive DMG%', hydroDmgPct: 'Hydro DMG%', burnDmgPct: 'Burn DMG%',
  elecDmgPct: 'Electric DMG%', physDmgPct: 'Physical DMG%', freezeDmgPct: 'Freeze DMG%',
  corroDmgReduc: 'Corrosive Res', hydroDmgReduc: 'Hydro Res', burnDmgReduc: 'Burn Res',
  elecDmgReduc: 'Electric Res', physDmgReduc: 'Physical Res', freezeDmgReduc: 'Freeze Res',
  dmgReduc: 'DMG Reduction', activeCritDmg: 'Active Crit DMG', ootCritDmg: 'OOT Crit DMG',
  ootDmgPct: 'OOT DMG%', activeDmgPct: 'Active DMG%', flatAtk: 'Flat ATK',
  flatHp: 'Flat HP', defPct: 'DEF%', hpPct: 'HP%',
  stabBreakDmgPct: 'Stab Break DMG%', stabDmg: 'Stab DMG', fixedDmg: 'Fixed DMG',
  hpRecov: 'HP Recovery', stabRecov: 'Stab Recovery', healPct: 'Heal%', shieldPct: 'Shield%',
  targetDmgReducPct: 'Target DMG Reduc', aoeDmgReducPct: 'AOE DMG Reduc',
};

function buildFlowerOptgroups(pool) {
  const grouped = {};
  for (const s of pool) {
    if (!grouped[s.type]) grouped[s.type] = [];
    grouped[s.type].push(s);
  }
  return Object.entries(grouped).map(([typeKey, entries]) => {
    const groupLabel = FLOWER_TYPES[typeKey]?.label || typeKey;
    const opts = entries.map(s => `<option value="${s.label}">${s.label}</option>`).join('');
    return `<optgroup label="${groupLabel}">${opts}</optgroup>`;
  }).join('');
}

function findFlowerEntry(tier, typeKey, label) {
  if (!label) return null;
  if (tier === 'main') {
    return (getFlowerType(typeKey)?.mainStatPool || []).find(s => s.label === label) || null;
  }
  return (tier === 'sub2' ? FLOWER_SUB2_POOL : FLOWER_SUB3_POOL).find(s => s.label === label) || null;
}

function updateFlowerLevelSelect(slot, tier) {
  const typeEl = document.getElementById(`flower-${slot}-${tier}-type`);
  const lvEl   = document.getElementById(`flower-${slot}-${tier}-lv`);
  if (!typeEl || !lvEl) return;
  const entry = findFlowerEntry(tier, activeDoll?.flowerSlots?.[slot], typeEl.value);
  if (!entry) {
    lvEl.innerHTML = '<option value="">—</option>';
    lvEl.disabled = true;
    return;
  }
  lvEl.disabled = false;
  const maxPerSlot = FLOWER_LEVEL_CAPS[tier];
  const prevLv = parseInt(lvEl.value) || 0;
  lvEl.innerHTML = '<option value="">—</option>' +
    Array.from({ length: maxPerSlot }, (_, i) => {
      const lv = i + 1;
      return `<option value="${lv}"${lv === prevLv ? ' selected' : ''}>Lv ${lv}</option>`;
    }).join('');
}

function renderFlowerStatRow(slot, tier, label) {
  let opts;
  if (tier === 'main') {
    const ftype = getFlowerType(activeDoll.flowerSlots[slot]);
    opts = (ftype?.mainStatPool || []).map(s => `<option value="${s.label}">${s.label}</option>`).join('');
  } else if (tier === 'sub2') {
    opts = buildFlowerOptgroups(FLOWER_SUB2_POOL);
  } else {
    opts = buildFlowerOptgroups(FLOWER_SUB3_POOL);
  }
  return `
    <div class="flower-stat-row">
      <div class="flower-stat-label">${label}</div>
      <select class="flower-select" id="flower-${slot}-${tier}-type"
        oninput="updateFlowerLevelSelect(${slot},'${tier}');updateLive()">
        <option value="">—</option>
        ${opts}
      </select>
      <select class="flower-lv-select" id="flower-${slot}-${tier}-lv"
        disabled oninput="updateLive()">
        <option value="">—</option>
      </select>
    </div>`;
}

// ── Imagoform ─────────────────────────────────────────────────────────────────

window.imagoFactors = { sentinel: 0, vanguard: 0, support: 0, bulwark: 0 };
window.imagoformState = {}; // tierKey → boolean (user toggled on)

const IMAGO_TYPE_COLORS = {
  sentinel: 'var(--atk-color)',
  vanguard: 'var(--dmg-color)',
  support:  'var(--accent2)',
  bulwark:  'var(--def-color)',
};

// Compute imago factors by summing all selected levels per slot, grouped by slot type.
// Called at the end of renderFlowerSummary() so it stays in sync with flower changes.
function computeImagoFactors() {
  const factors = { sentinel: 0, vanguard: 0, support: 0, bulwark: 0 };
  if (!activeDoll?.flowerSlots?.length) { window.imagoFactors = factors; return; }
  for (let i = 0; i < activeDoll.flowerSlots.length; i++) {
    const slotType = activeDoll.flowerSlots[i];
    for (const tier of ['main', 'sub2', 'sub3']) {
      const typeEl = document.getElementById(`flower-${i}-${tier}-type`);
      const lvEl   = document.getElementById(`flower-${i}-${tier}-lv`);
      const lv = parseInt(lvEl?.value) || 0;
      if (!lv || !typeEl?.value) continue;
      const entry = findFlowerEntry(tier, slotType, typeEl.value);
      // Main stats belong to the slot's type; sub2/sub3 entries carry their own type
      const statType = (tier === 'main') ? slotType : (entry?.type || slotType);
      if (statType in factors) factors[statType] += lv;
    }
  }
  window.imagoFactors = factors;
}

function renderImagoformPanel() {
  const panel   = document.getElementById('imagoform-panel');
  const content = document.getElementById('imagoform-content');

  // Always show the panel; content varies by doll state
  panel.style.display = '';

  if (!activeDoll) {
    content.innerHTML = '<div style="font-size:11px;color:var(--text-dim);padding:4px 0;">Select a doll to view imagoform.</div>';
    return;
  }

  if (!activeDoll.imagoform?.length) {
    content.innerHTML = '<div style="font-size:11px;color:var(--text-dim);padding:4px 0;">No imagoform data for this doll.</div>';
    return;
  }

  const factors = window.imagoFactors;

  function isTierUnlocked(tier) {
    return Object.entries(tier.requires).every(([type, min]) => (factors[type] || 0) >= min);
  }

  const factorChips = ['bulwark', 'vanguard', 'support', 'sentinel'].map(type => `
    <div class="imagoform-factor-chip">
      <span class="imagoform-factor-label" style="color:${IMAGO_TYPE_COLORS[type]};">${type}</span>
      <span class="imagoform-factor-val">${factors[type] || 0}</span>
    </div>`).join('');

  const tierRows = activeDoll.imagoform.map(tier => {
    const unlocked = isTierUnlocked(tier);
    const active   = unlocked && !!window.imagoformState[tier.tier];
    const reqChips = Object.entries(tier.requires).map(([type, min]) => {
      const met = (factors[type] || 0) >= min;
      return `<span class="imagoform-tier-req ${met ? 'met' : ''}" style="${met ? `color:${IMAGO_TYPE_COLORS[type]};` : ''}">${type[0].toUpperCase()}${type.slice(1,3)} ${factors[type] || 0}/${min}</span>`;
    }).join('');
    const label = IMAGOFORM_TIERS.find(t => t.key === tier.tier)?.label ?? tier.tier;
    const desc  = tier.description
      ? `<div class="imagoform-tier-desc">${tier.description}</div>`
      : '';
    return `
      <div class="imagoform-tier-row ${unlocked ? 'unlocked' : ''} ${active ? 'active' : ''}">
        <div class="imagoform-tier-header">
          <span class="imagoform-tier-name">${label}</span>
          <div class="imagoform-tier-reqs">${reqChips}</div>
          <label class="toggle" style="opacity:${unlocked ? '1' : '0.3'};pointer-events:${unlocked ? 'auto' : 'none'};">
            <input type="checkbox" ${active ? 'checked' : ''} ${unlocked ? '' : 'disabled'}
              onchange="onImagoformToggle('${tier.tier}', this.checked)">
            <span class="toggle-track"></span>
          </label>
        </div>
        ${desc}
      </div>`;
  }).join('');

  content.innerHTML = `
    <div style="font-size:9px;letter-spacing:2px;color:var(--text-dim);font-family:'Share Tech Mono',monospace;text-transform:uppercase;margin-bottom:6px;">Imago Factor</div>
    <div class="imagoform-factor-row">${factorChips}</div>
    <div style="font-size:9px;letter-spacing:2px;color:var(--text-dim);font-family:'Share Tech Mono',monospace;text-transform:uppercase;margin-bottom:6px;margin-top:10px;">Tiers</div>
    ${tierRows}
  `;
}

function onImagoformToggle(tierKey, checked) {
  window.imagoformState[tierKey] = checked;
  renderImagoformPanel();
  updateLive();
}

function renderFlowerPanel() {
  const grid = document.getElementById('flower-grid');
  if (!activeDoll?.flowerSlots?.length) {
    grid.innerHTML = '<div style="font-size:11px;color:var(--text-dim);padding:4px 0;">Select a doll to view flower slots.</div>';
    document.getElementById('flower-summary').innerHTML = '';
    return;
  }

  grid.innerHTML = activeDoll.flowerSlots.map((typeKey, i) => {
    const ftype = getFlowerType(typeKey);
    if (!ftype) return '';
    const color = FLOWER_TYPE_COLORS[typeKey] || 'var(--text)';
    return `
      <div class="flower-slot" id="flower-slot-${i}">
        <div class="flower-type-badge" style="color:${color};border-color:${color};">${ftype.label}</div>
        ${renderFlowerStatRow(i, 'main', 'Main')}
        ${renderFlowerStatRow(i, 'sub2', 'Sub 2')}
        ${renderFlowerStatRow(i, 'sub3', 'Sub 3')}
      </div>`;
  }).join('');
}

function renderFlowerSummary() {
  const el = document.getElementById('flower-summary');
  if (!activeDoll?.flowerSlots?.length) { el.innerHTML = ''; return; }

  // Sum per-slot levels for each stat label
  const combined = {};  // label → { entry, totalLevel }
  for (let i = 0; i < activeDoll.flowerSlots.length; i++) {
    const typeKey = activeDoll.flowerSlots[i];
    for (const tier of ['main', 'sub2', 'sub3']) {
      const typeEl = document.getElementById(`flower-${i}-${tier}-type`);
      const lvEl   = document.getElementById(`flower-${i}-${tier}-lv`);
      if (!typeEl || !lvEl) continue;
      const lv = parseInt(lvEl.value) || 0;
      if (!typeEl.value || !lv) continue;
      const entry = findFlowerEntry(tier, typeKey, typeEl.value);
      if (!entry) continue;
      if (!combined[typeEl.value]) combined[typeEl.value] = { entry, total: 0 };
      combined[typeEl.value].total += lv;
    }
  }

  if (!Object.keys(combined).length) {
    window.flowerTotals = {};
    el.innerHTML = '';
    computeImagoFactors();
    renderImagoformPanel();
    return;
  }

  // Look up value at combined level, accumulate by stat id
  const totals = {};
  for (const { entry, total } of Object.values(combined)) {
    const idx = Math.min(total, entry.values.length) - 1;
    if (idx < 0) continue;
    const val = entry.values[idx];
    if (!val) continue;
    for (const id of (Array.isArray(entry.id) ? entry.id : [entry.id])) {
      totals[id] = (totals[id] || 0) + val;
    }
  }

  window.flowerTotals = totals;
  computeImagoFactors();
  renderImagoformPanel();

  if (!Object.keys(totals).length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="stat-divider" style="margin-top:10px;"></div>
    <div class="section-header" style="margin-top:8px;">Summary of Flower Stats</div>
    <div class="flower-summary-grid">
      ${Object.entries(totals).map(([id, val]) => {
        const label = FLOWER_STAT_DISPLAY[id] || id;
        const suffix = FLOWER_FLAT_IDS.has(id) ? '' : '%';
        return `<div class="flower-sum-entry"><span class="flower-sum-label">${label}</span><span class="flower-sum-val">+${val.toFixed(2)}${suffix}</span></div>`;
      }).join('')}
    </div>`;
}

// ── Team Buffs (Support / Bulwark flowers from teammates) ────────────────────

const TEAM_BUFF_SLOT_COUNT = 3;

function buildTeamBuffOpts() {
  const isUnity = s => s.label.includes('Unity');
  const sections = [
    { label: 'Main Stat',  pool: FLOWER_TYPES.support.mainStatPool.filter(isUnity) },
    { label: 'Sub 2',      pool: FLOWER_SUB2_POOL.filter(s => s.type === 'support' && isUnity(s)) },
  ];
  return sections.map(({ label, pool }) => {
    const opts = pool.map(s => `<option value="${s.label}">${s.label}</option>`).join('');
    return `<optgroup label="${label}">${opts}</optgroup>`;
  }).join('');
}

function findTeamBuffEntry(label) {
  if (!label) return null;
  for (const pool of [FLOWER_TYPES.support.mainStatPool, FLOWER_SUB2_POOL]) {
    const e = pool.find(s => s.label === label);
    if (e) return e;
  }
  return null;
}

function syncTeamBuffSelects() {
  const selected = new Set();
  for (let i = 0; i < TEAM_BUFF_SLOT_COUNT; i++) {
    const v = document.getElementById(`tbuff-${i}-type`)?.value;
    if (v) selected.add(v);
  }
  for (let i = 0; i < TEAM_BUFF_SLOT_COUNT; i++) {
    const sel = document.getElementById(`tbuff-${i}-type`);
    if (!sel) continue;
    const own = sel.value;
    for (const opt of sel.options) {
      if (!opt.value) continue;
      opt.disabled = opt.value !== own && selected.has(opt.value);
    }
  }
}

function updateTeamBuffLevelSelect(i) {
  const typeEl = document.getElementById(`tbuff-${i}-type`);
  const lvEl   = document.getElementById(`tbuff-${i}-lv`);
  if (!typeEl || !lvEl) return;
  const entry = findTeamBuffEntry(typeEl.value);
  if (!entry) {
    lvEl.innerHTML = '<option value="">—</option>';
    lvEl.disabled = true;
    return;
  }
  lvEl.disabled = false;
  const prevLv = parseInt(lvEl.value) || 0;
  lvEl.innerHTML = '<option value="">—</option>' +
    entry.values.map((v, idx) => {
      const lv = idx + 1;
      return `<option value="${lv}"${lv === prevLv ? ' selected' : ''}>Lv ${lv}  (+${v})</option>`;
    }).join('');
}

function renderTeamBuffPanel() {
  const opts = buildTeamBuffOpts();
  document.getElementById('team-buff-rows').innerHTML =
    Array.from({ length: TEAM_BUFF_SLOT_COUNT }, (_, i) => `
      <div class="team-buff-row">
        <div class="flower-stat-label">Buff ${i + 1}</div>
        <select class="flower-select" id="tbuff-${i}-type"
          oninput="updateTeamBuffLevelSelect(${i});syncTeamBuffSelects();updateLive()">
          <option value="">—</option>
          ${opts}
        </select>
        <select class="flower-lv-select" id="tbuff-${i}-lv"
          disabled oninput="updateLive()">
          <option value="">—</option>
        </select>
      </div>`).join('');
}

function renderTeamBuffSummary() {
  const el = document.getElementById('team-buff-summary');
  const totals = {};
  for (let i = 0; i < TEAM_BUFF_SLOT_COUNT; i++) {
    const typeEl = document.getElementById(`tbuff-${i}-type`);
    const lvEl   = document.getElementById(`tbuff-${i}-lv`);
    if (!typeEl || !lvEl) continue;
    const lv = parseInt(lvEl.value) || 0;
    if (!typeEl.value || !lv) continue;
    const entry = findTeamBuffEntry(typeEl.value);
    if (!entry) continue;
    const val = entry.values[lv - 1];
    if (!val) continue;
    for (const id of (Array.isArray(entry.id) ? entry.id : [entry.id])) {
      totals[id] = (totals[id] || 0) + val;
    }
  }

  window.teamBuffTotals = totals;
  if (!Object.keys(totals).length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="stat-divider" style="margin-top:10px;"></div>
    <div class="section-header" style="margin-top:8px;">Summary of Team Buffs</div>
    <div class="flower-summary-grid">
      ${Object.entries(totals).map(([id, val]) => {
        const label = FLOWER_STAT_DISPLAY[id] || id;
        const suffix = FLOWER_FLAT_IDS.has(id) ? '' : '%';
        return `<div class="flower-sum-entry"><span class="flower-sum-label">${label}</span><span class="flower-sum-val">+${val.toFixed(2)}${suffix}</span></div>`;
      }).join('')}
    </div>`;
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
  renderTeamBuffPanel();
  document.getElementById('vertebrae-select').value = 'v0';
  activeVertebrae = 'v0';
  onDollChange();         // also calls renderDollMechanics
  initEventListeners();
  updateLive();
}

document.addEventListener('DOMContentLoaded', init);
