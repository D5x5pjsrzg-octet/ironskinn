# IronSkin Boutique – IronGrip™ V2

Boutique e-commerce 100 % personnalisée pour IronSkin et son produit phare **IronGrip™ V2**. L'objectif : une expérience brandée, prête pour l'intégration Shopify, optimisée pour la conversion organique (SEO, UGC, influence, TikTok).

## Structure du projet

```
.
├── index.html          # Page d’accueil complète IronSkin
├── irongrip.html       # Page produit détaillée IronGrip™ V2
├── story.html          # Page “Notre histoire”
├── suivi.html          # Page “Suivi commande” (module Shopify)
├── account.html        # Page “Mon compte” / Connexion client
├── styles.css          # Styles globaux (Inter / Montserrat, brand IronSkin)
├── script.js           # Timer promo, sticky CTA, accordéons, hooks Shopify
└── images/             # Placeholders visuels (3D grip, lifestyle, etc.)
```

## Fonctionnalités clés

- **Barre promo sticky** avec compte à rebours persistant (6h42) + code TEAM10.
- **Hero split homme / femme** (“Plus de douleur. Plus de limites.” / “Belle, forte, inarrêtable.”).
- Sections conversion : bénéfices, packs (Solo / Duo / His & Her), storytelling, “Comment ça marche”, témoignages, UGC, FAQ.
- **Sticky CTA mobile** “Choisir mon pack” + sticky footer brandé.
- Pages utilitaires prêtes : suivi commande (formulaire placeholder), compte client (module Shopify), storytelling lifestyle.
- **Script unifié** : smooth scroll, accordéons, timer, sticky cart, sélection variantes.
- **Palette IronSkin** : fond noir profond, accents vert perf, rose poudré, violet bouton, gris acier.

## Intégration Shopify

1. **Hébergement** :
   - Uploade chaque page dans Shopify > Boutique en ligne > Pages (ou utilise un thème headless / Hydrogen / Shopify custom). 
   - Option simple : intégrer `index.html` comme page d’accueil via “Modifier le code” > `templates/index.liquid`.

2. **Produit & variantes** :
   - Crée un produit `IronGrip™ V2` dans Shopify avec trois variantes couleur (Noir / Gris / Rose).
   - Récupère les `variant_id` générés par Shopify.
   - Remplace les valeurs `data-variant` dans :
     - `index.html` (pack cards)
     - `irongrip.html` (inputs radio).

3. **Domaine Shopify** :
   - Dans `script.js`, définis `window.SHOPIFY_DOMAIN = 'https://ton-shop.myshopify.com';` **avant** de charger le script (ou remplace la valeur par défaut).
   - Les boutons “Ajouter au panier” ouvriront l’URL `/cart/{variant_id}:1?discount=TEAM10` dans un nouvel onglet.

4. **Code promo** :
   - Crée le code `TEAM10` dans Shopify (Réductions > Créer une réduction). Le script ajoute automatiquement `?discount=TEAM10`.

5. **Formulaires** :
   - `suivi.html` : remplace `{% render 'order-tracking-form' %}` par ton snippet Shopify ou application de tracking.
   - `account.html` : remplace les placeholders par `{% render 'customer-login' %}` et connecte le bouton “Créer mon profil” à `/account/register`.

6. **Pixels & analytics** :
   - Ajoute TikTok Pixel & GA4 dans Shopify > Paramètres > Pixels et conversions.
   - Utilise également les sections `<head>` de chaque page si tu autohéberges le site.

## Déploiement hors Shopify

- Héberge le dossier sur un serveur statique (Netlify, Vercel, GitHub Pages).
- Ajoute les métas Pixel/GA4 dans un fichier `head` global ou via Google Tag Manager.
- Connecte un outil de paiement externe si tu n’utilises pas le checkout Shopify.

## Personnalisation visuelle

- Fonts Google Fonts : Inter & Montserrat.
- Couleurs principales :
  - Fond : `#0F1113`
  - Texte : `#F5F7FA`
  - Vert perf : `#00D084`
  - Rose poudré : `#F3A8C0`
  - Violet bouton : `#6B5CFF`
  - Gris acier : `#C6C9CF`
- Effets : ombres douces, arrondis généreux, gradients subtils.

## SEO & contenu organique

- Balises `title` & `meta description` optimisées sur chaque page.
- Sections prêtes pour les vidéos UGC (TikTok, Reels) avec placeholders.
- Storytelling orienté communauté + influenceurs.

## Développement

- HTML5 + CSS3 + JS vanilla (aucune dépendance externe).
- Responsive mobile-first, CTA sticky visible après scroll.
- Compte à rebours persistant via `localStorage`.

## À connecter

- Remplace les liens CGV / Mentions légales / Politique retour par tes URL.
- Mets à jour les placeholders image si tu disposes de visuels réels (remplace les fichiers dans `images/`).
- Ajoute ton adresse email support si différente de `contact@ironskin.fr`.

Enjoy la boutique IronSkin ⚡️
