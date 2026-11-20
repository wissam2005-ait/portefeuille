# Portfolio — Wissam Ait El Hadi

Portfolio de développeuse full stack, publié avec GitHub Pages :
https://wissam2005-ait.github.io/portefeuille/

## Structure

```
index.html              contenu de toutes les sections
css/base.css            variables (couleurs, typographies), reset, thème sombre
css/components.css      composants réutilisables : en-tête, boutons, liens, listes
css/sections.css        mise en page de chaque section et responsive
js/main.js              point d'entrée (module ES)
js/modules/navigation.js   menu mobile, section active
js/modules/reveal.js       apparition au défilement (désactivée si « mouvement réduit »)
js/modules/contact-form.js validation et envoi du formulaire
assets/                 captures des projets, favicon
cv.pdf                  CV téléchargeable
```

Aucune dépendance ni étape de build : HTML, CSS et JavaScript natifs.

## Lancer en local

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 (les modules ES ne se chargent pas en `file://`).

## Formulaire de contact

Le site étant statique, le formulaire passe par [FormSubmit](https://formsubmit.co), qui transfère les messages
par email. Au tout premier envoi, FormSubmit envoie un email d'activation à l'adresse de destination : il faut
cliquer sur le lien qu'il contient une fois. Si l'envoi échoue, le formulaire propose d'ouvrir la messagerie
avec le message pré-rempli.

## Mettre à jour

- Projets : chaque projet est un bloc `<article class="case">` dans `index.html` ; les projets courts sont des
  `<li class="other">`.
- Couleurs et polices : variables en haut de `css/base.css`.
