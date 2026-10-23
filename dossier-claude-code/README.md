# Inovia — dossier de passation pour Claude Code

Ce dossier contient tout ce qu'il faut pour transformer la maquette Inovia en vraie application iPhone publiée sur l'App Store.

**Règle n° 1 : la maquette est la référence absolue.** Le résultat final (en particulier le jeu Neo Corp) doit être visuellement et fonctionnellement **identique** à la maquette : mêmes écrans, mêmes textes, mêmes chiffres, mêmes animations, mêmes sons, mêmes vibrations. En cas de doute, ouvrir la maquette et faire pareil. Ne rien « améliorer » sans l'accord de Yannis.

Le propriétaire du projet est Yannis (débutant en technique). Il parle français : toutes les explications, textes d'interface et messages de commit destinés à lui doivent être en français simple. Il veut zéro bug : avant chaque livraison, revérifier que rien de ce qui marchait n'a été cassé.

---

## 1. Contenu du dossier

| Dossier | Contenu |
|---|---|
| `1-maquette-web/` | La maquette complète, **telle qu'elle tourne aujourd'hui**. `index.html` = version iPhone, `ipad/index.html` = version iPad, `monde/index.html` = « Mon monde » en 3D (Three.js), `assets/` = images et logo, `sfx/` = les sons (.wav). Ouvrir `index.html?phone` dans un navigateur à 390 × 844 pour la voir. Elle est aussi en ligne : https://118mediapro-netizen.github.io/innovia/ |
| `2-source-maquette/` | `Main.dc.html` = le code source unique de la maquette (gabarit HTML + une classe JavaScript `Component` qui contient toute la logique). `jeu-neo-corp/` = le moteur du jeu isolé (fichiers déjà inclus dans Main.dc.html, fournis à part pour lecture facile). `expo-test-App.js` = un ancien test Expo qui affichait la maquette dans une WebView avec vibrations et sons natifs (réutilisable). |
| `3-supabase/` | Le code de la fonction serveur `fetch-news` (récupère les actus des médias toutes les minutes). |
| `4-captures/` | 15 captures d'écran de référence (jeu, tâches, phases, fin, Actu, Apprendre, mode nuit, admin). |
| `5-contenu/` | `catalogue-apprendre.json` = les 10 modules et 32 vidéos d'Apprendre (titres, niveaux, descriptions, prix). |
| `JEU_NEO_CORP.md` | La spécification complète du jeu (règles, chiffres, textes, fin). |
| `APPLI.md` | La spécification du reste de l'appli : Actu, Apprendre, admin, design, Supabase, règles Apple. |
| `PROMPT_A_COLLER.txt` | Le message que Yannis colle dans Claude Code pour démarrer. |

---

## 2. L'appli en bref

Inovia est une appli iOS (iPhone et iPad, en français) qui apprend l'IA au grand public. Trois onglets, avec une barre de 3 boutons ronds en bas :

1. **Actu** (gauche, gratuit) : les vraies actus IA des médias français, en temps réel, avec leurs photos et leur source.
2. **Jeu Neo Corp** (milieu, gratuit, **écran d'arrivée de l'appli**) : un jeu incrémental façon Universal Paperclips où l'on fabrique des neurones artificiels, où l'IA fait gagner de l'argent puis prend le contrôle. Aucune victoire possible.
3. **Apprendre** (droite, payant) : des vidéos façon Netflix. Le premier module est gratuit, le reste se paie (vidéo à l'unité ou apprentissage complet à 69 €).

Modèle économique : le jeu et l'Actu attirent, Apprendre rapporte.

---

## 3. Architecture recommandée

- **Expo (React Native), SDK le plus récent**, JavaScript ou TypeScript. Build et envoi à Apple avec **EAS** (pas besoin de Mac). Lire le fichier `AGENTS.md` généré par `create-expo-app` et la doc Expo de la version utilisée : Expo change à chaque version.
- **Actu et Apprendre en écrans natifs** (React Native). Une appli qui ne serait qu'un site web dans une WebView risque d'être refusée par Apple (règle 4.2, « fonctionnalités minimales »).
- **Le jeu Neo Corp dans une WebView**, en réutilisant le code exact de la maquette. C'est **la garantie que le jeu sera identique** à la maquette (même moteur, mêmes animations, même équilibrage). Recommandations :
  - embarquer les fichiers du jeu **dans l'appli** (pas de chargement depuis GitHub Pages) pour que le jeu marche hors ligne et ne change pas sans mise à jour ;
  - extraire de `Main.dc.html` uniquement ce qui sert au jeu, ou charger la maquette complète avec un paramètre `?embed=jeu` qui cache la barre de navigation web et renvoie vers les onglets natifs (voir `JEU_NEO_CORP.md` § 12) ;
  - garder le pont natif de `expo-test-App.js` : `navigator.vibrate` → `expo-haptics`, et les sons → `expo-audio` (la page envoie `{ t: 'snd', n, r }` et `{ t: 'vib', p }` via `window.ReactNativeWebView.postMessage`) ;
  - « Mon monde » (3D Three.js, `monde/index.html`) reste lui aussi en WebView, comme dans la maquette.
  - Alternative : réécrire le jeu en natif. Uniquement si Yannis le valide, et en reproduisant à l'identique `JEU_NEO_CORP.md` et les captures.
- **Serveur : Supabase**, déjà en place (projet `swlzdzzfudomdqtgqjjo`, région eu-west-1). Voir `APPLI.md`.
- **Achats : achats intégrés Apple** (In-App Purchase), par exemple via RevenueCat, plus le bouton « Restaurer mes achats ».

---

## 4. Ordre de travail proposé

Chaque étape se termine par un test sur l'iPhone de Yannis, avec Expo Go ou une build de développement EAS, et par sa validation.

1. **Base de l'appli** : projet Expo, polices, couleurs, écran de chargement (logo), barre du bas à 3 boutons, arrivée sur le jeu.
2. **Jeu Neo Corp** en WebView, identique à la maquette (vibrations, sons, mode nuit, Mon monde, notifications de retour). Vérifier la checklist de `JEU_NEO_CORP.md` § 13.
3. **Actu** native branchée sur Supabase (liste, catégories, recherche, article, rafraîchissement, favoris et listes).
4. **Apprendre** natif : catalogue façon Netflix, lecteur vidéo, premier module gratuit, progression, « Continuer la lecture ».
5. **Achats Apple** : vidéo à l'unité et apprentissage complet à 69 €, restauration des achats.
6. **Comptes** : « Se connecter avec Apple », sauvegarde de la progression, suppression du compte depuis l'appli.
7. **Mode admin** relié à Supabase (prix, modules, vidéos, catégories, articles) pour modifier sans repasser par Apple.
8. **Préparation App Store** : icône, captures, confidentialité, mentions légales, page d'aide, compte de démonstration pour Apple, notes pour la vérification, classification d'âge.

---

## 5. Règles de marque (à respecter partout)

- Langue : français, tutoiement, phrases courtes et simples.
- **Le mot « formation » est interdit** : dire apprentissage, parcours, module, vidéo.
- **Aucun emoji** nulle part dans l'appli.
- Couleur principale : le violet du logo. Pas de bleu (sauf la planète en mode nuit, comme dans la maquette).
- Vibration et petit son à chaque interaction, comme dans la maquette.
- Mode nuit disponible sur toutes les pages.
- Le jeu doit rester honnête : pas de faux avis, pas de fausse urgence, pas de faux compteur.
