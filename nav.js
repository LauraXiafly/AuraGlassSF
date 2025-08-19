

(function () {
  const links = [
    ['chapter2.html', 'Intro'],
    ['story.html', 'Story'],
    ['calendar.html', 'Calendar'],
    ['story-live.html', 'Live'],
    ['end.html', 'End']
  ];

  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Site');

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  links.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (here === href.toLowerCase()) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });

 
  if (document.querySelector('.ag-topbar')) {
    nav.classList.add('site-nav--below-topbar');
  }

  document.body.appendChild(nav);
})();
