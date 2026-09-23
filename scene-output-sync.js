document.querySelectorAll('.question-switcher').forEach((switcher) => {
  const pages = switcher.parentElement.querySelectorAll('.scene-model-output-page');
  // Native label activation scrolls its invisible radio into view. In a
  // horizontal carousel this can shift both the page and the selected card.
  switcher.querySelectorAll('.question-tab').forEach((label) => {
    label.addEventListener('click', (event) => {
      const radio = document.getElementById(label.htmlFor);
      if (!radio || radio.disabled) return;
      event.preventDefault();
      radio.checked = true;
      radio.focus({preventScroll: true});
      radio.dispatchEvent(new Event('change', {bubbles: true}));
    });
  });
  const sync = () => {
    const selected = switcher.querySelector('.question-radio:checked')?.id;
    const radios = [...switcher.querySelectorAll('.question-radio')];
    const index = radios.findIndex((radio) => radio.id === selected);
    switcher.querySelectorAll('.question-page').forEach((page, pageIndex) => {
      const active = pageIndex === index;
      page.style.visibility = active ? 'visible' : 'hidden';
      page.style.pointerEvents = active ? 'auto' : 'none';
      page.setAttribute('aria-hidden', String(!active));
    });
    pages.forEach((page) => {
      const active = page.dataset.questionId === selected;
      page.classList.toggle('is-active', active);
      page.setAttribute('aria-hidden', String(!active));
    });
  };
  switcher.addEventListener('change', sync);
  sync();
});
