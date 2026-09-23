document.querySelectorAll('.speech-condition').forEach((condition) => {
  const carousel = condition.querySelector('.speech-carousel');
  const cards = [...carousel.querySelectorAll('.speech-example')];
  const status = condition.querySelector('.speech-carousel-status');
  const buttons = condition.querySelectorAll('.speech-carousel-button');
  let index = 0;
  const update = () => {
    const width = carousel.clientWidth;
    if (!width) return;
    index = Math.max(0, Math.min(cards.length - 1, Math.round(carousel.scrollLeft / width)));
    status.textContent = `Example ${index + 1} of ${cards.length}`;
    buttons.forEach((button) => {
      const previous = button.dataset.direction === 'previous';
      button.disabled = previous ? index === 0 : index === cards.length - 1;
    });
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    const direction = button.dataset.direction === 'previous' ? -1 : 1;
    carousel.scrollTo({left: carousel.clientWidth * (index + direction), behavior: 'smooth'});
  }));
  carousel.addEventListener('scroll', () => requestAnimationFrame(update), {passive: true});
  new ResizeObserver(update).observe(carousel);
  update();
});

document.querySelectorAll('.speech-task').forEach((task) => {
  const toolbar = task.querySelector('.speech-task-toolbar');
  const tabs = task.querySelector('.speech-condition-tabs');
  if (!toolbar || !tabs) return;
  const placeControls = () => {
    toolbar.style.setProperty('--condition-tabs-width', `${Math.ceil(tabs.getBoundingClientRect().width) + 12}px`);
  };
  new ResizeObserver(placeControls).observe(tabs);
  placeControls();
});

document.querySelectorAll('.scene-condition').forEach((condition) => {
  const carousel = condition.querySelector('.scene-carousel');
  const cards = [...carousel.querySelectorAll('.scene-carousel-card')];
  const status = condition.querySelector('.scene-carousel-status');
  const buttons = condition.querySelectorAll('.scene-carousel-button');
  if (cards.length < 2 || !status) return;
  let index = 0;
  const update = () => {
    const width = carousel.clientWidth;
    if (!width) return;
    index = Math.max(0, Math.min(cards.length - 1, Math.round(carousel.scrollLeft / width)));
    status.textContent = `Example ${index + 1} of ${cards.length}`;
    buttons.forEach((button) => {
      const previous = button.dataset.direction === 'previous';
      button.disabled = previous ? index === 0 : index === cards.length - 1;
    });
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    const direction = button.dataset.direction === 'previous' ? -1 : 1;
    carousel.scrollTo({left: carousel.clientWidth * (index + direction), behavior: 'smooth'});
  }));
  carousel.addEventListener('scroll', () => requestAnimationFrame(update), {passive: true});
  new ResizeObserver(update).observe(carousel);
  update();
});

document.querySelectorAll('.scene-task').forEach((task) => {
  const toolbar = task.querySelector('.scene-task-toolbar');
  const tabs = task.querySelector('.scene-condition-tabs');
  if (!toolbar || !tabs) return;
  const placeControls = () => {
    toolbar.style.setProperty('--scene-condition-tabs-width', `${Math.ceil(tabs.getBoundingClientRect().width) + 12}px`);
  };
  new ResizeObserver(placeControls).observe(tabs);
  placeControls();
});
