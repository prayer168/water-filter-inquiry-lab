const KEY = 'waterFilterInquiryProgressV1';
export function initProgress() {
  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)) || {visited:[], best:0, safety:false}; }
  catch { state = {visited:[], best:0, safety:false}; }
  const bar = document.querySelector('#progressBar');
  const text = document.querySelector('#progressText');
  const safety = document.querySelector('#safetyCheck');
  safety.checked = Boolean(state.safety);
  safety.addEventListener('change', () => { state.safety = safety.checked; save(); });
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); render(); }
  function render(){ const count = new Set(state.visited).size; bar.style.width = `${count/8*100}%`; text.textContent = `${count} / 8 完成`; }
  function visit(id){ if(!state.visited.includes(id)){ state.visited.push(id); save(); } else render(); }
  function setBest(score){ state.best = Math.max(state.best || 0, score); save(); }
  render();
  return {visit,setBest,getBest:()=>state.best};
}

