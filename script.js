const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const body = document.body;

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    body.classList.toggle('nav-open');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
  });

   document.addEventListener('click', (event) => {
       const isClickInsideNav = navMenu.contains(event.target);
       const isClickOnToggle = navToggle.contains(event.target);

       if (!isClickInsideNav && !isClickOnToggle && body.classList.contains('nav-open')) {
           body.classList.remove('nav-open');
           navToggle.setAttribute('aria-expanded', 'false');
       }
   });
}