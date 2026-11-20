import { initNavigation } from './modules/navigation.js';
import { initReveal } from './modules/reveal.js';
import { initContactForm } from './modules/contact-form.js';

initNavigation();
initReveal();
initContactForm(document.getElementById('contact-form'));
