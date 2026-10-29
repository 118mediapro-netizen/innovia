> **Remplacé** le 29 oct. 2026 au soir par `../inovia/INOVIA_APPLI.md` (appli complète).

# Inovia, version 1 : l'Actu seule (à coder maintenant)

Décision de Yannis (29 oct. 2026) : on code l'appli Inovia **maintenant**, mais seulement avec l'Actu. Le jeu (bouton du milieu) et Apprendre (bouton de droite) sont encore en conception : ils affichent « Bientôt disponible ». Tout le reste de l'enveloppe de l'appli (chargement, en-tête, barre du bas, menu, mode nuit, sons, vibrations) est fait dès maintenant, à l'identique de la maquette.

## 1. Où travailler
- Créer l'appli Expo dans le dossier **`appli-inovia/`** à la racine du dépôt. Ne rien modifier ailleurs : la racine (`index.html`, `ipad/`, `monde/`, `neocorp/`) est en ligne sur GitHub Pages.
- La maquette de référence est `index.html` à la racine (ouvrir `index.html?phone` dans un navigateur à 390 × 844), ou en ligne : https://118mediapro-netizen.github.io/innovia/?phone
- Les spécifications détaillées de l'Actu, du design et de Supabase sont dans **`../APPLI.md`** (sections 1 et 2). Ce fichier-ci dit seulement ce qui est dans la version 1 et ce qui n'y est pas.
- Expo (React Native), SDK le plus récent, iPhone d'abord. Tester avec Expo Go sur l'iPhone de Yannis.

## 2. Ce qui est DANS la version 1

### L'enveloppe de l'appli (identique à la maquette)
- **Écran de chargement** : fond violet, logo, « INOVIA » en Anton, barre de chargement, environ 2 secondes, puis fondu.
- **Arrivée sur l'Actu** (le jeu n'étant pas prêt).
- **En-tête** : bouton menu rond à gauche, logo + « INOVIA » au centre, bouton rond jauge à droite (voir § 3).
- **Barre du bas** : la pilule flottante à 3 boutons ronds, Actu à gauche, Jeu au milieu, Apprendre à droite, avec l'animation de l'icône et la couleur de l'onglet actif.
- **Menu** (bouton en haut à gauche) : Mes listes, Mode nuit, Vibrations, Sons, Aide. Les réglages sont mémorisés.
- **Mode nuit** sur tous les écrans (couleurs dans `APPLI.md` § 1).
- **Sons et vibrations** à chaque toucher, comme dans la maquette (`expo-haptics`, `expo-audio`, sons dans `1-maquette-web/sfx/`).
- Polices : Plus Jakarta Sans, et Anton pour « INOVIA ».

### L'Actu complète (voir `APPLI.md` § 2)
- Branchée sur Supabase (table `news`, clé publique). **Aucun article inventé.**
- Recherche, catégories en puces (Tout, Société, Création, Business, Emploi, Image et vidéo, Code, OpenAI, Anthropic, Google).
- « En direct · Mis à jour il y a X », bouton Actualiser, tirer pour actualiser, vérification toutes les 60 secondes, pastille « N nouvelles actus ».
- Cartes avec photo de l'article, photo de repli par catégorie (`assets/photo-*.jpg`) si l'image ne charge pas, pastille NOUVEAU, catégorie · source · il y a X, bouton enregistrer.
- Écran article : photo, extrait, « Ce que ça change pour toi » si présent, bloc Source, bouton « Lire l'article complet sur [média] » (navigateur intégré, `expo-web-browser`).
- Hors connexion : message clair et bouton Réessayer.
- **Listes** : Favoris, À lire plus tard, et listes créées par l'utilisateur. Enregistrées sur le téléphone (pas de compte dans la version 1).

## 3. Ce qui n'est PAS dans la version 1
- **Bouton Jeu (milieu)** et **bouton Apprendre (droite)** : ils ouvrent un écran « Bientôt disponible » propre, dans le style de l'appli :
  - Jeu : titre « Le jeu arrive bientôt », texte « Crée ta start-up d'IA et apprends à gérer une entreprise, en jouant. »
  - Apprendre : titre « Apprendre arrive bientôt », texte « Un parcours en jeu, des quiz et des vidéos pour maîtriser l'IA pas à pas. »
  - Chaque écran garde l'en-tête et la barre du bas, avec une petite illustration ou animation discrète (pas d'emoji).
- **Bouton jauge** (en haut à droite, futur questionnaire de niveau) : il ouvre une petite fenêtre « Questionnaire de niveau : bientôt disponible ».
- Dans l'écran article, **pas** de bloc « Apprends à le faire / Voir le module » (Apprendre n'existe pas encore).
- Pas de compte, pas d'achat, pas de mode admin, pas de profil ni de quiz dans le menu. Ils viendront avec les versions suivantes.

## 4. Règles
- La maquette fait foi : mêmes couleurs, mêmes textes, mêmes animations. Ne rien « améliorer » sans demander à Yannis.
- Français, tutoiement, jamais le mot « formation », aucun emoji.
- Avant chaque livraison, vérifier que rien de ce qui marchait n'est cassé.
- Préparer le code pour la suite : le Jeu et Apprendre doivent pouvoir remplacer leur écran « Bientôt disponible » sans tout refaire (un écran par onglet).

## 5. Attention avant l'envoi à Apple (pas pour tout de suite)
- Apple refuse souvent les applis avec des parties « bientôt disponibles » (règle 2.1, appli incomplète). Pour tester sur l'iPhone et sur TestFlight, aucun problème. Avant d'envoyer à Apple, Yannis décidera : cacher les deux boutons, ou attendre que le jeu et Apprendre soient prêts.
- Il faudra aussi : politique de confidentialité, page d'aide, icône, captures (voir `APPLI.md` § 7).

## 6. Ordre de travail
Chaque étape se termine par un test sur l'iPhone de Yannis, expliqué pas à pas, et sa validation.
1. Projet Expo `appli-inovia/`, polices, couleurs, écran de chargement, en-tête, barre du bas, écrans « Bientôt disponible ». Test avec Expo Go.
2. L'Actu : liste branchée sur Supabase, catégories, recherche, actualisation.
3. L'écran article et les listes.
4. Menu, mode nuit, sons, vibrations, hors connexion. Vérification complète contre la maquette.
