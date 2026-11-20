/**
 * Formulaire de contact.
 * Le site est statique (GitHub Pages) : l'envoi passe par FormSubmit,
 * qui transfère le message par email. Sans JavaScript, le formulaire
 * est envoyé normalement à la même adresse.
 */
const EMAIL = 'wissam.aitelhadii@gmail.com';
const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

const RULES = {
  nom: (v) => (v.trim().length >= 2 ? '' : 'Indiquez votre nom.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Indiquez une adresse email valide.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Votre message doit contenir au moins 10 caractères.'),
};

function showError(field, message) {
  const error = document.getElementById(`${field.id}-err`);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (!error) return;
  error.textContent = message;
  error.hidden = !message;
  if (message) field.setAttribute('aria-describedby', error.id);
  else field.removeAttribute('aria-describedby');
}

function validate(form) {
  let firstInvalid = null;
  Object.entries(RULES).forEach(([name, rule]) => {
    const field = form.elements[name];
    const message = rule(field.value);
    showError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  });
  return firstInvalid;
}

function mailtoFallback(data) {
  const subject = encodeURIComponent(`Contact depuis le portfolio : ${data.nom}`);
  const body = encodeURIComponent(`${data.message}\n\n${data.nom} (${data.email})`);
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function initContactForm(form) {
  if (!form) return;
  form.noValidate = true;

  const status = form.querySelector('.form__status');
  const button = form.querySelector('button[type="submit"]');

  const setStatus = (text, kind) => {
    status.className = `form__status${kind ? ` is-${kind}` : ''}`;
    status.textContent = text;
  };

  // On efface l'erreur d'un champ dès qu'il redevient valide.
  form.addEventListener('input', (e) => {
    const rule = RULES[e.target.name];
    if (rule && e.target.getAttribute('aria-invalid') === 'true') showError(e.target, rule(e.target.value));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = validate(form);
    if (invalid) { invalid.focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return; // robot

    button.disabled = true;
    setStatus('Envoi en cours…');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nom: data.nom.trim(),
          email: data.email.trim(),
          message: data.message.trim(),
          _subject: data._subject,
          _template: data._template,
          _replyto: data.email.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || res.statusText);

      form.reset();
      setStatus('Merci, votre message est bien parti. Je vous réponds rapidement.', 'ok');
    } catch {
      setStatus('', 'error');
      status.append(
        "L'envoi n'a pas abouti. ",
        Object.assign(document.createElement('a'), {
          href: mailtoFallback(data),
          textContent: 'Ouvrir votre messagerie avec ce message',
        }),
        '.'
      );
    } finally {
      button.disabled = false;
    }
  });
}
