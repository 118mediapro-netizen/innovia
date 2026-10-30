# Inovia : l'appli complète (à coder maintenant)

Décision de Yannis (29 oct. 2026, soir) : on code **toute l'appli Inovia**, exactement comme la maquette en ligne. Ce fichier remplace `inovia-v1/INOVIA_V1.md` (qui ne prévoyait que l'Actu).

Message de l'appli : **« Apprends l'IA et apprends à créer et gérer ton entreprise. »**
- Bouton de gauche : **l'Actu** (les vraies actus de l'IA, en temps réel).
- Bouton du milieu : **le jeu** (tu crées et fais grandir ta boîte, sans fin).
- Bouton de droite : **Apprendre** (parcours en jeu, défi du jour, vidéos).

## 1. La maquette qui fait foi
- En ligne : https://118mediapro-netizen.github.io/innovia/?phone (iPad : `/ipad/`).
- Dans le dépôt :

| Fichier | Rôle |
|---|---|
| `index.html` | L'appli (iPhone) : chargement, en-tête, menu, barre du bas, Actu, Apprendre, mode nuit, admin. |
| `ipad/index.html` | La même appli, mise en page iPad. |
| `jeu/index.html` | **Le jeu complet**, autonome. L'appli l'affiche dans l'onglet du milieu. |
| `monde-inovia/index.html` | **Mon monde** en 3D, 9 étapes. Le jeu l'ouvre par le bouton « Mon monde ». |
| `dossier-claude-code/2-source-maquette/Main.inovia.dc.html` | Code source de l'appli (gabarit et classe `Component`). Le parcours d'Apprendre est dans les méthodes `pc*` (données dans `pcData()`). |

Ne pas toucher à `monde/` ni à `neocorp/` : ils servent à Neo Corp, l'autre appli.

## 2. Architecture
- Expo (React Native), dossier **`appli-inovia/`**. iPhone d'abord, iPad ensuite.
- **Actu** : écrans natifs, branchés sur Supabase (voir `../APPLI.md` § 2).
- **Le jeu** : `jeu/index.html` et `monde-inovia/index.html` embarqués **tels quels** dans l'appli et affichés dans une WebView (fichiers locaux, le jeu marche hors ligne). C'est la garantie qu'il soit identique à la maquette. Ne pas le réécrire.
- **Apprendre** : écrans natifs qui reproduisent la maquette (défi du jour, onglets « Mon parcours » et « Toutes les vidéos », carte du parcours, sessions de mini-jeux, fin de session). Les questions et les unités sont dans `pcData()` du code source. Si c'est trop long à refaire en natif pour la première version, une WebView est acceptable : demander à Yannis.
- Sons et vibrations : comme la maquette. En natif, `expo-audio` et `expo-haptics`.

### Messages entre l'appli et la WebView du jeu
- Appli → jeu : `{ type: 'inovia-app', night: bool, sound: bool, hapt: bool }` à chaque changement de réglage (mode nuit, sons, vibrations), et quand le jeu envoie `inovia-jeu-ready`.
- Jeu → appli :
  - `{ type: 'inovia-jeu-ready' }` : le jeu est prêt ;
  - `{ type: 'inovia-buzz', p }` : vibration à jouer (nombre ou liste, en millisecondes) ;
  - `{ type: 'inovia-full', on }` : « Mon monde » s'ouvre (`on: true`, le jeu doit passer en plein écran par-dessus l'en-tête et la barre du bas) ou se ferme.
- Dans la maquette web, ces messages passent par `postMessage`. Dans l'appli, utiliser `window.ReactNativeWebView.postMessage` côté jeu et `injectJavaScript` côté appli (adapter les 3 petites fonctions du jeu, sans rien changer d'autre).
- **La WebView du jeu s'arrête au-dessus de la barre du bas** (dans la maquette : de 96 px sous le haut jusqu'à 130 px du bas). Rien du jeu (fenêtres, bilan, boutons, bulle d'Ino) ne doit jamais passer derrière la barre du bas ; les fenêtres du jeu sont des cartes arrondies posées juste au-dessus. Quand Mon monde est ouvert (`inovia-full`), la WebView prend tout l'écran.
- La sauvegarde du jeu est dans le `localStorage` de la WebView (clé `inoviaJeu2`). Vérifier qu'elle survit à la fermeture de l'appli et aux mises à jour ; sinon la recopier dans `AsyncStorage`.

## 3. Le jeu (résumé, le code fait foi)
- On clique sur la planète « Clic ». L'anneau doré autour se remplit en continu ; plein = commande livrée, le client paie.
- **1 doigt = un demi-pas.** À partir du **mois 4** seulement (message « Nouveau : 2 doigts »), **2 doigts en même temps = un pas entier**. Pendant les mois 1 à 3, le 2e doigt ne compte pas. **Chaque toucher compte, sans limite de vitesse** : si le joueur tape très vite, le jeu suit.
- Sur la planète est écrit ce que tu fais (« Faire le flyer », « Créer le logo »…) et, en dessous, ce que la commande rapporte en blanc (« +16 € »). L'anneau qui tourne autour est **violet** (plus de jaune).
- **Quand ça tourne tout seul** (les équipes livrent plus d'une commande par seconde) : plus de noms de clients ni d'anneau qui se remplit et se vide en boucle. L'anneau devient un arc violet lumineux qui tourne en continu, la planète affiche « Ça tourne tout seul » et « +X € / mois », la ligne du client devient « Tes équipes travaillent pour toi · N commandes livrées », et les gains arrivent groupés une fois par seconde (un seul « + X € », une pulsation). Objectif : satisfaisant à l'œil et léger pour le téléphone.
- 1 mois de jeu = 60 secondes. Bilan à chaque fin de mois (ventes, charges, cotisations ou impôt, bénéfice), avec les mois d'avant (flèches ‹ ›).
- Un seul objectif affiché à la fois, cliquable quand il y a une action. Une ligne « Prochaine étape » sous le bouton.
- Étapes : déclarer son activité (micro-entreprise), abonnements IA, prix réglable (trop cher = le client part), site, agents IA, stagiaire, **société (SASU)**, dividendes, salariés, bureaux, autres villes, international, rachats.
- Ce que la boîte vend évolue (flyers, logos, posts, sites, vidéos, campagnes, contrats…).
- Plus tard, petit à petit : **Patrimoine** (argent perso, bourse avec cours simulés, immobilier qui rapporte des loyers, valeur de chaque société), **plusieurs sociétés** (agence, restauration rapide, boutique en ligne, start-up d'IA), jusqu'aux milliards.
- **Pas de fin, pas de mort, pas de faillite définitive.** Bouton pause à droite.
- **Mon monde** s'ouvre par une **bulle ronde avec une maison**, que le joueur peut déplacer n'importe où sur l'écran (position mémorisée, clé `inoviaBulle`) ; un simple toucher l'ouvre. À l'étape de la chambre, Mon monde s'ouvre directement **en vue intérieure** (`&mode=in`), ensuite en vue extérieure.
- **Renommer une société** : dans la fenêtre des sociétés (touche le nom en haut), un bouton crayon à côté de chaque société. Le nom s'affiche partout et sur l'enseigne de Mon monde.
- **La bulle Mon monde devient transparente** quand elle passe au-dessus de quelque chose (trésorerie, objectif, anneau, prix, message d'Ino…), et redevient violette quand elle ne gêne rien.
- **Petite notif qui motive** : au tout début (mois 1, après 3 clics), une pilule discrète glisse en haut, « Fais le plus d'argent possible ce mois-ci ! », sans bloquer les clics, puis disparaît.
- Le graphique du bilan n'apparaît qu'à partir de 2 mois (barres fines, sans jaune).
- **Recommencer la partie** n'est plus en bas de l'écran : petit lien discret en bas de la fenêtre des sociétés, et « Recommencer le jeu » dans le menu de l'appli (message `{ type: 'inovia-app', reset: true }`).
- **Mode admin** : « Le jeu » liste les 14 étapes (du tout début à l'empire) ; toucher une étape envoie `{ type: 'inovia-app', stage: k }` au jeu, qui remplace la partie par une partie déjà arrivée à cette étape (`adminJump` dans `jeu/index.html`).
- Mon monde : chambre, local, un étage, bureaux, bureaux agrandis, immeuble, tour, siège, empire, avec l'enseigne au nom de la société.
- Mis de côté pour plus tard : les duels 1 contre 1 entre amis (rivalités d'entreprises).
- Chiffres réels utilisés (simplifiés, à revérifier avant la sortie) : cotisations micro-entreprise d'environ 22 % pour un service, plafond d'environ 77 000 € par an, impôt sur les sociétés de 15 % puis 25 %, environ 30 % sur les dividendes. Mettre ces taux dans une config facile à mettre à jour.

## 3 bis. Le test de niveau en IA
- Ce n'est **pas un QCM** : 12 questions sur soi (« À quelle fréquence utilises-tu une IA ? », « Sais-tu ce qu'est une clé API ? », « As-tu déjà automatisé une tâche ? »…), sans bonne ni mauvaise réponse, deux questions à choix multiples. Non obligatoire.
- Résultat en pourcentage et en niveau (Découverte, Débutant, Intermédiaire, Avancé, Expert), plafonné si la personne n'utilise presque jamais l'IA (cohérence). Mémorisé (`inoviaLevelPct`).
- **Page Apprendre** : juste sous le titre, deux cartes compactes côte à côte, **Mon parcours** (icône manette, « C'est un jeu ») et **Les vidéos** (icône lecture, « 32 vidéos »). La carte choisie est pleine (violet) ; l'autre bouge un peu. **Mon parcours a un contour doré qui tourne** (et l'unité en cours du parcours aussi) pour donner envie de cliquer (halo, icône qui s'agite, flèche) pour donner envie de changer. À chaque arrivée sur Apprendre, ce sont **les vidéos** (« À ne pas rater » bien visible). Le **défi du jour** est tout en bas.
- **Test de niveau** : plus de carte dans Apprendre. Tant qu'il n'est pas fait, le bouton jauge en haut à droite est violet, avec un halo qui pulse, l'aiguille qui bouge et une pastille ; le toucher ouvre directement le test. Aucun message à l'écran.
- Accès : le bouton jauge en haut à droite (il appelle tant que le test n'est pas fait), le menu, et la pastille « Niveau IA X % » dans Mon parcours pour le refaire. Le code est dans les méthodes `lv*` du code source (`lvData()` pour les questions).

## 4. Ordre de travail
Chaque étape se termine par un test sur l'iPhone de Yannis, expliqué pas à pas, et sa validation.
1. Projet Expo `appli-inovia/` : polices, couleurs, écran de chargement, en-tête, menu, barre du bas, mode nuit, sons, vibrations.
2. **L'Actu** native (Supabase), avec les listes.
3. **Le jeu** en WebView avec `jeu/` et `monde-inovia/`, les messages ci-dessus, et la sauvegarde.
4. **Apprendre** : défi du jour, parcours, sessions de mini-jeux, vidéos (lecteur), profil relié au parcours.
5. Ensuite (plus tard) : comptes (Se connecter avec Apple), achats intégrés, mode admin réservé à Yannis, envoi à Apple (voir `../APPLI.md` § 7).

## 5. Règles
- La maquette fait foi. Ne rien « améliorer » sans demander.
- Français, tutoiement, jamais le mot « formation », aucun emoji.
- Avant chaque livraison, vérifier que rien de ce qui marchait n'est cassé.
