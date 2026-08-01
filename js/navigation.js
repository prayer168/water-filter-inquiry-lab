export function initNavigation(onChange) {
  const order = ["mission","principles","materials","design","evidence","applications","quiz","resources"];
  const labels = ["任務基地","原理探索","濾材圖鑑","配置實驗","證據紀錄","生活應用","闖關挑戰","自主學習"];
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  const prev = document.querySelector('#prevTab');
  const next = document.querySelector('#nextTab');
  let active = Math.max(0, order.indexOf(location.hash.replace('#','')));

  function show(index, focus = true) {
    active = Math.max(0, Math.min(order.length - 1, index));
    tabs.forEach((tab, i) => {
      const selected = i === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== active;
      panel.classList.toggle('is-active', i === active);
    });
    document.querySelector('#currentChapter').textContent = labels[active];
    prev.disabled = active === 0;
    next.disabled = active === order.length - 1;
    history.replaceState(null, '', `#${order[active]}`);
    if (focus) {
      window.scrollTo({top:0, behavior:'smooth'});
      panels[active].focus({preventScroll:true});
    }
    onChange?.(order[active], active);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? order.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + order.length) % order.length;
      show(nextIndex);
      tabs[nextIndex].focus();
    });
  });
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => show(order.indexOf(button.dataset.go))));
  show(active, false);
  return { showById: id => show(order.indexOf(id)), getActive: () => order[active] };
}
