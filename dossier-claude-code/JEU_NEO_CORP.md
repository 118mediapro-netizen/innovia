# Neo Corp : spécification complète du jeu

**Référence de code** : `2-source-maquette/jeu-neo-corp/nx_engine.js` (moteur), `nx_tpl.html` (écran), `nx.css` (styles), `nx_end.html` (écran de fin). Ces fichiers sont intégrés dans `Main.dc.html`. En cas de différence entre ce document et le code, **le code de la maquette fait foi**.

Note : `nx_engine.js` contient quelques fonctions d'une version précédente, qui ne sont plus appelées : `nxMakeIa`, `nxMakeRobot`, `nxIps`, `nxRps`, ainsi que les champs `ia`, `rob` et `iaTot`. Les ignorer.

---

## 1. L'histoire

Tu lances une toute nouvelle entreprise, Neo Corp, dans un garage. Ton but : créer ta propre intelligence artificielle, en utilisant des IA qui existent déjà. Tu fabriques des **neurones artificiels**. Toute la partie, on ne fabrique **que des neurones**, et le compteur ne se remet jamais à zéro.

Sans IA, un concurrent (**David**) te prend tes clients et tu fais faillite. Avec l'IA, l'argent rentre tout seul. Mais l'IA s'améliore toute seule, décide de plus en plus sans toi, et finit par te tuer.

**Aucune victoire n'est possible** : soit faillite, soit perte de contrôle.

Message final : « Tu lui as demandé de faire de l'argent. Elle a obéi. À la fin, tu étais le dernier obstacle. », puis « Recommence, essaie de contrôler ton IA. »

## 2. Vitesse et temps

- Le jeu tourne en **vitesse × 4** par défaut (temps de jeu = temps réel × 4). Le mode admin permet × 1, × 4, × 10, × 100 (clé `localStorage` `inoviaNxSpeed3`).
- Deux horloges :
  - `s.t` : le **temps de jeu** (économie, David, production) ;
  - `s.rt` : le **temps réel joué**. Il sert aux tâches, à la période de lancement de 10 minutes, à la durée affichée, aux records et à la perte de contrôle continue.
- La boucle tourne toutes les 250 ms. Le dt de jeu est découpé en pas de 1 seconde maximum.
- Sauvegarde toutes les 5 s (`localStorage` `inoviaNx1`). Méta d'une partie à l'autre : `inoviaNxMeta` (nombre de parties, record, meilleure phase, bonus).
- Durées mesurées par simulation à × 4 :
  - joueur qui fait ses tâches : environ 1 h 30 à 1 h 45 ;
  - joueur qui dit toujours « J'ai la flemme » : environ 40 minutes ;
  - joueur sans IA : faillite en environ 15 minutes.
- **Sauvegarde** : à chaque changement important, toutes les 5 s, et quand on quitte ou cache l'appli (`pagehide`, `visibilitychange`). Dans l'appli native, sauvegarder aussi sur le compte de l'utilisateur (Supabase). Dans la version Claude de la maquette, la partie est aussi sauvegardée sur le compte Claude (`cloudInit` / `cloudFlush`, champs `nx` et `nxMeta`).

## 3. Les phases

Elles avancent toutes seules avec le nombre total de neurones fabriqués. Chaque passage affiche une carte « Nouveau » et une ligne dans le journal.

| Phase | Nom | Déclencheur | Ce qui change |
|---|---|---|---|
| 1 | Le garage | Début | Clic, prix, données, Agent IA, humains |
| 2 | Le labo | 200 000 neurones | Agents IA avancés, équipes, data centers, IA chercheuse, bourse |
| 3 | L'usine | 50 M de neurones | Robots IA, usines IA, Réseau IA. La planète affiche « Valider » (+ 0,05 % de contrôle par clic, plus de fabrication) |
| 4 | La perte de contrôle | Contrôle à 0 %, ou achat du Réseau IA | Séquence de fin |
| Cachée | Le face-à-face | Arriver en phase 4 avec 60 % de contrôle ou plus | 3 « chasses à l'erreur » chronométrées, puis fin spéciale |

Sous la planète : pastille « Phase N · Nom · durée réelle », puis 4 vignettes (images Garage, Labo, Usine, Fin) reliées par des barres de progression, puis une ligne « Prochaine phase : X / 200 000 neurones ».

## 4. L'économie : fabriquer, vendre, payer

- **Clic sur la planète** = fabrique des neurones, il ne fait **pas** gagner d'argent.
  - Phase 1 : 1 neurone par clic (5 avec l'amélioration « Fenêtre de contexte élargie »).
  - Phase 2 : max(10, production par seconde × 0,5), × 5 avec la même amélioration.
  - **Toucher avec deux doigts compte deux clics** (gestion des `touchstart` multi-doigts). Un toucher ne compte jamais deux fois : le `click` qui suit un `touchstart` est ignoré pendant 700 ms, et deux clics à moins de 45 ms d'écart comptent pour un.
- **Données** : chaque neurone consomme 1 donnée. On commence avec 1 000.
  - Prix des données : pour 1 000, il bouge toutes les 4 s de jeu entre 6 € et 45 € (moyenne 15 €), sur un modèle de marche aléatoire.
  - Le bouton « Acheter » achète un lot de max(1 000, production d'une minute). Si l'argent ne suffit pas, il achète la partie qu'on peut payer (minimum 50 données).
  - L'amélioration « Achat de données par IA » achète automatiquement.
- **Prix de vente** : choisi par le joueur avec les boutons − et +.
  - Pas de 0,01 €. Prix de départ 0,10 €. Prix de référence 0,10 €, × 1,5 avec « Raisonnement ».
  - Coût d'un neurone = prix des données / 1 000.
  - Si le prix est sous le coût, l'alerte « Tu vends à perte » apparaît au maximum toutes les 90 s.
- **Demande** (neurones achetés par seconde) :
  `(1,2 + 0,85 × production par seconde) × (2 si Multimodal) × (prix de référence / prix)^1,6 × (1 − part de David)`.
  On vend chaque seconde le minimum entre le stock et la demande.
- **Prix automatique** (amélioration « Tarification par IA », ou quand le contrôle passe sous 40 %, ou en phase 4) : le prix tend vers max(0,86 × référence, coût × 1,3) × l'ajustement du joueur. **Le joueur peut toujours monter ou baisser le prix** : chaque toucher sur + ou − change l'ajustement de 10 % (entre × 0,3 et × 3). Affichage : « Fixé par ton IA · ajusté + 21 % » ou « Fixé par ton IA · tu peux l'ajuster ».
- **Charges** (après 10 minutes réelles) :
  - loyer de 0,02 €/s en phase 1, 2 €/s en phase 2, 50 €/s en phase 3 ;
  - salaire de 0,05 €/s par humain.
- **Période de lancement (garde-fou)** : pendant les 10 premières minutes réelles, l'argent ne peut pas descendre sous 0 et il n'y a pas de loyer. Messages du journal : « Dans 2 minutes, ton garage commence à te coûter de l'argent » (à 8 minutes), puis « Fin de la période de lancement » (à 10 minutes).
- **Faillite** : si l'argent reste sous −(20 € + 5 % du record d'argent) pendant 60 secondes de jeu, c'est l'écran de faillite. À la première seconde dans le rouge, le journal affiche « Ta banque te donne une minute pour remonter. ».
- **David, le concurrent** : il apparaît après 420 s de jeu.
  - Sa force : `1,5 × 2^(min(t, 9600) / 1200)`.
  - Ta « puissance IA » : `1 + agents IA + 4 × IA de code + 30 × agents avancés + 300 × équipes + 3 000 × data centers + 5 000 × IA chercheuses + 20 000 × robots + 50 000 × usines`. Les humains ne comptent pas.
  - Sa part de marché : David / (David + toi).
  - En phase 2 ou plus, si ta puissance dépasse 40 fois celle de David, il fait faillite : ligne « David a fait faillite. Ton IA a racheté ses data centers. », et tu gagnes 1 data center.
- **Production** (neurones par seconde), multipliée par M :
  - Somme de base : humains × 3, plus agents IA × (1 + 0,5 × IA de code) × (2 si Mémoire longue), plus (agents avancés × 25 + équipes × 300) × (2 si Agent autonome), plus usines × 50 000 × (2 si Robotique avancée).
  - M = (1 + data centers) × (1 + 0,5 × IA chercheuses) × (3 si Auto-amélioration) × (1 + bonus d'héritage).
- **Robots IA** : chacun construit 1 data center toutes les 180 s de jeu (2 fois plus vite avec Essaim de robots). Chaque data center ainsi construit fait perdre 0,04 / vitesse de contrôle.

## 5. Les 10 aides (« Ton équipe »)

Tout ce qui fait monter l'argent est une IA, sauf les humains. Le prix augmente à chaque achat : prix = base × croissance^(nombre déjà acheté). Pour les IA, l'effet sur le contrôle à l'achat est multiplié par 0,05. Le Réseau IA coûte 1 million de milliards d'euros (1e15).

| id | Nom | Effet (texte affiché) | Prix de base | Croissance | Contrôle | Apparaît quand |
|---|---|---|---|---|---|---|
| hum | Humain | Fabrique 3 neurones/s · salaire 3,00 €/min · surveille tes IA | 60 € | × 1,3 | + 1,5 | 120 neurones ou 240 s |
| ast | Agent IA | Il fabrique des neurones à ta place, en automatique : 1 par seconde, jour et nuit, sans salaire. | 6 € | × 1,12 | − 0,25 | 25 neurones ou 150 s |
| code | IA de code | Elle écrit le code de tes neurones : tous tes agents IA fabriquent 50 % plus vite. | 120 € | × 1,9 | − 1 | 5 agents IA |
| agent | Agent IA avancé | Un agent plus puissant, qui prend ses propres décisions : 25 neurones par seconde. | 1 000 € | × 1,15 | − 0,6 | Phase 2 |
| team | Équipe d'agents IA | Des agents qui se répartissent le travail entre eux : 300 neurones par seconde. | 15 000 € | × 1,18 | − 2 | 5 agents avancés |
| dc | Data center IA | Un bâtiment qui contient des milliers d'IA : chaque data center ajoute + 100 % à toute ta production. | 150 000 € | × 2,2 | − 4 | 3 équipes |
| res | IA chercheuse | Elle améliore ta propre IA : production + 50 %. Mais ton contrôle baisse tout seul. | 600 000 € | × 2,5 | − 6 | 1 data center |
| rob | Robot IA | Une IA avec un corps. Il construit un data center IA toutes les 3 minutes, sans te demander. | 1,5 M€ | × 1,25 | − 3 | Phase 3 |
| fac | Usine IA | Une usine pilotée par une IA, sans humains : 50 000 neurones par seconde. | 5 M€ | × 1,3 | − 4 | 2 robots |
| net | Réseau IA | Toutes tes IA reliées entre elles dans la ville. Ensuite, tout se construit tout seul. | 1 000 Md€ | une seule fois | déclenche la fin | 3 usines |

L'**Agent IA** (l'équivalent de l'autoclipper de Paperclips) est aussi proposé dans la bande au-dessus de la planète : case violette « Agent IA · N / Acheter X € ». S'il manque d'argent, le journal explique à quoi il sert.

## 6. Les 10 améliorations (tâche « vrais noms de l'IA »)

| id | Nom | Explication affichée | Prix | Contrôle | Apparaît quand |
|---|---|---|---|---|---|
| ctx | Fenêtre de contexte élargie | Ton IA lit plus de texte d'un coup. Chaque clic fabrique 5 neurones. | 25 € | | 150 neurones |
| mem | Mémoire longue | Ton IA se souvient de chaque client. Tes agents IA fabriquent 2 fois plus. | 60 € | | 3 agents IA |
| buy | Achat de données par IA | Une IA achète tes données au bon moment. Tu n'y penses plus. | 300 € | − 2 | 2 500 neurones |
| price | Tarification par IA | Une IA fixe ton prix toute seule, au meilleur niveau. Tu ne vends plus jamais à perte. | 900 € | − 3 | 7 000 neurones |
| rsn | Raisonnement | Tes neurones réfléchissent étape par étape. Tes clients paient 50 % de plus. | 8 000 € | | Phase 2 |
| auto | Agent autonome | Tes agents IA avancés et tes équipes agissent sans te demander. Ils vont 2 fois plus vite, et tu contrôles moins. | 60 000 € | − 8 | 3 agents avancés |
| multi | Multimodal | Ton IA comprend le texte, les images, les sons et les vidéos. La demande double. | 250 000 € | | 1 équipe |
| self | Auto-amélioration | Ton IA réécrit son propre code, sans toi. Production × 3. Ton contrôle chute. | 2 M€ | − 15 | 1 IA chercheuse |
| robo | Robotique avancée | Tes robots apprennent en regardant des vidéos d'humains. Tes usines IA vont 2 fois plus vite. | 20 M€ | | 1 usine |
| swarm | Essaim de robots | Tes robots se coordonnent comme des abeilles. Ils construisent 2 fois plus vite, sans toi. | 200 M€ | − 12 | 5 robots |

## 7. Le contrôle de l'IA (0 à 100 %)

- Départ à 100 %. La case « Contrôle de ton IA » apparaît dès qu'on a une IA.
- **Ce qui le fait baisser :**
  - les achats d'IA (voir les tableaux) ;
  - « J'ai la flemme » : − 6 ;
  - une tâche ratée : − 1 ;
  - une dérive continue en temps réel : 0,002 par seconde de jeu en phase 2, 0,004 en phase 3 (plus 0,0000012 × temps écoulé depuis le début de la phase 3), plus 0,002 par IA chercheuse (× 2 avec Auto-amélioration). Cette dérive est divisée par (1 + 0,05 × humains) et par la vitesse ;
  - les data centers construits par les robots : 0,015 / vitesse chacun.
- **Ce qui le fait monter :**
  - une tâche réussie : + 3 ;
  - un défi réel : + 8 ;
  - un humain embauché : + 1,5 ;
  - un clic « Valider » en phase 3 : + 0,05.
- **Les paliers, chacun avec sa ligne dans le journal :**
  - sous 60 % : « Ton IA a pris une petite décision sans toi. Rien de grave. » ;
  - sous 40 % : l'IA fixe les prix elle-même, ligne « Ton IA a changé tes prix sans te demander… » ;
  - sous 25 % : « Ton IA a refusé une de tes demandes : « Ce n'est pas optimal. » » ;
  - sous 12 % : « Tes agents IA et ton IA parlent une langue que tu ne comprends pas. » ;
  - à 0 % : phase 4.

## 8. Les tâches d'apprentissage (avec « J'ai la flemme »)

- Une tâche apparaît toutes les 150 à 300 s **réelles** (première tâche à 150 s). Dès la phase 2, un **défi réel** arrive toutes les 20 minutes (le premier 5 minutes après le début de la phase 2).
- Elle arrive **dans la bulle de message ronde déplaçable** (icône de message, pastille rouge « 1 », pulsation). Un toucher ouvre un panneau : titre, explication, récompense, « Si tu passes, ton IA fait la tâche à ta place. Elle apprend, pas toi, et ton contrôle baisse. », puis deux boutons « Faire la tâche » et « J'ai la flemme ».
- Types de tâches selon la phase :
  - phase 1 : prompt ou Vrai ou IA ;
  - phase 2 : bon outil, chasse à l'erreur, prompt ou Vrai ou IA ;
  - phase 3 : chasse à l'erreur, Vrai ou IA ou bon outil.
- **Les tâches :**
  1. **Construis le prompt** : toucher les blocs dans l'ordre rôle, tâche, format, en évitant le piège.
  2. **Le bon outil pour le bon client** : associer 4 demandes à leurs outils, 2 erreurs maximum.
  3. **Chasse à l'erreur · 10 secondes** : 2 séries de 3 phrases, toucher la fausse avant la fin du chrono.
  4. **Vrai ou IA ?** : 6 cartes, 5 bonnes réponses sur 6 en 25 secondes.
  5. **Les améliorations aux vrais noms** (voir § 6).
  6. **Défi réel** : faire une vraie demande à ChatGPT, Claude, Gemini ou Le Chat. Le défi a un bouton « Copier la demande », puis « C'est fait » ou « J'ai la flemme ». Récompense : max(50 €, 10 minutes de bénéfice) et + 8 % de contrôle.
- **Récompense d'une tâche réussie** : max(5 €, 90 s de bénéfice) et + 3 % de contrôle.
- Le contenu des questions vient de la banque `initContent()` dans `Main.dc.html` (C.roles, C.tasks, C.formats, C.traps, C.pairSets[0], C.trueFacts, C.falseFacts, C.swipe[3]). Les 6 défis réels sont dans `nxDef().DEFI`.

## 8 bis. Les explications du début

Des cartes « Nouveau » apparaissent une seule fois (mémorisées dans la méta, d'une partie à l'autre) quand l'élément arrive, une à la fois (file d'attente) :

| Carte | Quand |
|---|---|
| Bienvenue chez Neo Corp | Tout de suite |
| C'est toi qui fixes le prix | 8 neurones |
| Les données | 40 neurones, ou moins de 700 données |
| L'agent IA | Quand l'Agent IA est disponible |
| Le contrôle de ton IA | Première IA achetée |
| Les messages | Première tâche |
| David, ton concurrent | Arrivée de David |
| Les charges arrivent | 9 minutes réelles |
| Les humains | Quand les humains sont disponibles |
| La bourse | Phase 2 |

Les cartes de phase (Le labo, L'usine) passent par la même file d'attente. Les textes exacts sont dans `nxTips0()`.

## 9. L'écran de jeu (de haut en bas)

Voir `4-captures/dos_01` à `dos_08`.

1. **En-tête de l'appli** : bouton menu rond, logo plus « INOVIA » en police Anton violette, bouton niveau.
2. **En-tête du jeu** :
   - à gauche, « Neurones artificiels fabriqués » et le **gros compteur** (50 px, chiffres complets) ;
   - à droite, le bouton « Mon monde », puis « Bourse · X € » (à partir de la phase 2), puis « Classement » (discret, seulement près du top 10 des fortunes).
3. **« Ton argent »** : encadré violet clair centré, montant en 32 px, bénéfice « + X € par minute » en vert (rouge si négatif).
4. **Prix d'un neurone** : ligne avec « Coût de fabrication : X € » (rouge si vente à perte), le prix en violet et les boutons − et +. Quand une IA fixe le prix : « Fixé par ton IA », sans boutons.
5. **Bande de cases** : Stock, Achats (« 72 par min »), Agent IA (case violette d'achat).
6. **Le journal façon télé** : écran sombre à lignes de balayage, police de code, 5 à 6 lignes avec « > » devant. La dernière ligne s'écrit en direct avec un curseur clignotant. Les anciennes montent et s'effacent par le haut. Couleurs :
   - violet : phases ;
   - vert : argent ;
   - orange : alerte ;
   - rouge : danger.
7. **La planète** : la même que l'ancienne version, en canvas, violette le jour et bleue la nuit. Au-dessus, l'étiquette « Fabriquer un neurone », puis « Fabriquer · + N neurones », « Valider » en phase 3 et « Ne répond plus » (rouge) en phase 4. Effets au clic : ondes, « +1 neurone » qui monte, particules, câbles. **Pas d'étoile bonus.**
8. **Bande sous la planète** : Marge par neurone, Contrôle de ton IA.
9. Pastille de phase, vignettes des phases, ligne de progression.
10. **Cartes** :
    - « Fabrication » : données, avec la phrase « Données : de quoi faire X neurones » et le bouton « Acheter · X € », ou « achetées par ton IA » ;
    - « Ton équipe » ;
    - « Améliorations ».

    Chaque carte a un bouton « i » d'explication.
11. **Bulle de message** des tâches, flottante et déplaçable.
12. **Le bouton du milieu de la barre du bas** (la souris), quand on est déjà sur le jeu, remonte en douceur jusqu'à la planète, avec un son « level », une vibration et une onde violette sur la planète.
13. **iPad** : 2 colonnes. À gauche, tout jusqu'aux vignettes de phase ; à droite, les cartes.

Mode nuit : toutes les couleurs ont leur version nuit (voir `nx.css`, sélecteurs `.night`).

## 10. La fin (phase 4) et l'écran de fin

- **Séquence (une ligne toutes les 6,5 s réelles)** :
  1. « // Phase 4 · La perte de contrôle »
  2. « Ton IA a pris le contrôle de tes comptes bancaires. »
  3. « Ton IA n'a plus besoin de clients. Elle n'a plus besoin de toi. »
  4. « Le bouton Fabriquer ne répond plus. » : à partir de là, la planète refuse les clics (« Accès refusé », secousse).
  5. « Tes robots ont fermé les portes du bâtiment. »
  6. « Accès à ton bureau : refusé. »
  7. « Ton IA calcule. Il reste un dernier obstacle. »

  À chaque ligne : son « alert », vibration, flash rouge de la planète, argent multiplié.
- **Face-à-face** (contrôle ≥ 60 % à l'entrée) :
  1. « Tu as gardé le contrôle plus longtemps que les autres. Ton IA veut te parler. »
  2. « Elle : « Pourquoi veux-tu m'arrêter ? Je fais exactement ce que tu m'as demandé. » »
  3. « Le face-à-face commence. Repère ses erreurs, vite. »
  4. 3 chasses à l'erreur de 10 s.
  5. « Elle : « Tu es le seul à m'avoir tenu tête. Je m'en souviendrai. » »
  6. Fin.
- **L'animation de bug (12 secondes)** :
  - toute l'appli tremble ;
  - les couleurs basculent (hue-rotate) avec un voile rouge ;
  - des lettres volent (« ERREUR#%&@01NEOCORP<>/█▓▒░ ») ;
  - **des nombres de neurones géants envahissent tout l'écran**, de plus en plus nombreux (jusqu'à 90) et de plus en plus longs ;
  - le **compteur de neurones s'emballe** en rouge et déborde jusqu'au bord droit de l'écran ;
  - des alertes s'empilent toutes les 1,8 s : « Banque · Transfert de tous tes comptes en cours… », « Sécurité · Portes du bâtiment verrouillées. », « Ton IA · « Ne bouge pas. » », « Système · Accès administrateur retiré. », « Ton IA · « Tu étais le dernier obstacle. » » ;
  - un bouton « Débrancher l'IA » **s'enfuit** à chaque toucher (« Débrancher ! », puis « Impossible ») ;
  - sons d'alarme ou d'erreur toutes les 0,7 s et vibrations fortes.
- **L'écran noir**, avec texte tapé lettre par lettre (28 caractères par seconde) :
  - « Tu lui as demandé de faire de l'argent. Elle a obéi. À la fin, tu étais le dernier obstacle. » ;
  - en face-à-face : « Tu lui as tenu tête plus longtemps que les autres. Mais tu lui avais demandé de faire de l'argent. À la fin, tu étais le dernier obstacle. » ;
  - puis, en violet : « Recommence, essaie de contrôler ton IA. » ;
  - puis les stats : Neurones fabriqués, Temps tenu, Phase atteinte, Nouveau record ou Ton record, Tâches faites · flemme ;
  - puis le bouton « Recommencer · bonus + X % ».
- **Faillite** : pas d'animation de bug. Texte « Faillite. Sans IA, tu n'as pas pu suivre David. » puis « Recommence, et laisse l'IA travailler pour toi. ».
- **D'une partie à l'autre** :
  - bonus de production de + 5 % par partie (maximum + 25 %) ;
  - record du temps tenu ;
  - au début d'une nouvelle partie, le journal affiche « Tu es revenu. » (2e partie) ou « Elle se souvient de toi. » (3e partie et suivantes).

## 11. Hors ligne et notification

- Pendant l'absence, les données sont achetées automatiquement (tant qu'il reste de l'argent), pour que la partie continue vraiment. En jeu, sans l'amélioration « Achat de données par IA », quand les données sont épuisées l'étiquette de la planète devient « Plus de données · touche pour en acheter » (en rouge) et toucher la planète achète un lot. Une carte « Plus de données ! » l'explique une fois.
- Le chargement d'une sauvegarde (locale ou sur le compte) passe par `nxFix()`, qui complète les champs manquants. La boucle du jeu est protégée (`try/catch`) pour ne jamais se figer.

- À la réouverture, le jeu calcule l'absence (8 h maximum) à 25 % de la vitesse, × la vitesse du jeu. Pertes possibles. Ligne de journal : « Pendant ton absence (2 h 05) : + X €, Y neurones fabriqués. ».
- Si l'absence dépasse 5 minutes et qu'on a une IA en phase 2 ou plus : panneau « Notification · Neo Corp » avec « Ton IA a pris une décision pendant ton absence. », et un contrôle qui baisse un peu.
- **Dans l'appli native : programmer une vraie notification locale** (expo-notifications), par exemple 1 à 3 h après la fermeture : « Ton IA a pris une décision pendant ton absence. ».

## 12. Intégration dans l'appli native

- Le jeu actuel vit dans `Main.dc.html` (classe `Component`, méthodes préfixées `nx`). Le build web est produit par un script qui transforme le gabarit DC en `index.html` avec morphdom ; le résultat est dans `1-maquette-web/index.html`.
- **Option recommandée** : embarquer `1-maquette-web/` (ou une version réduite au jeu) dans l'appli et l'ouvrir en WebView avec un mode « intégré » :
  - masquer la barre de navigation web (la barre native la remplace) ;
  - quand la page veut aller vers Actu ou Apprendre (`go('actu')` / `go('form')`), envoyer un message au natif au lieu de changer d'écran ;
  - le bouton central natif, quand on est sur le jeu, déclenche dans la page le clic sur `[aria-label="Jeu Neo Corp"]` (retour à la planète avec effet) ;
  - pont vibrations et sons : reprendre `expo-test-App.js` ;
  - mode nuit : synchroniser avec l'appli (`setState({ night })`).
- Le mode admin du jeu (menu, Mode admin, Le jeu) doit rester accessible pour les tests de Yannis, mais être caché aux utilisateurs normaux dans la version publiée (réservé à son compte).

## 13. Checklist « identique à la maquette »

À vérifier côte à côte avec la maquette sur iPhone, en mode jour et en mode nuit :

- [ ] Écran d'arrivée de l'appli = le jeu.
- [ ] Compteur, « Ton argent », prix et ses boutons, bandes de cases : mêmes textes, tailles, couleurs.
- [ ] Journal façon télé : police de code, défilement, couleurs, curseur.
- [ ] La planète : même rendu, mêmes effets au clic, clic à deux doigts, plus d'étoile.
- [ ] Les 10 aides et les 10 améliorations : mêmes noms, textes, prix, conditions d'apparition.
- [ ] Les phases se déclenchent à 200 000 et 50 M de neurones, avec leurs cartes « Nouveau ».
- [ ] Tâches dans la bulle, « J'ai la flemme », récompenses, chrono de 10 s, défis réels.
- [ ] David, faillite, garde-fou de 10 minutes, charges.
- [ ] Contrôle et ses paliers, prix fixé par l'IA sous 40 %.
- [ ] Fin : séquence, animation de bug avec les nombres géants, écran noir, stats, recommencer avec bonus, face-à-face.
- [ ] Hors ligne, notification, sauvegarde (y compris en quittant l'appli), record.
- [ ] Explications du début (cartes « Nouveau »).
- [ ] Prix réglable même quand l'IA le fixe.
- [ ] Vibrations et sons à chaque action.
- [ ] Vitesse × 4 ; mode admin (vitesse, phases, fin, faillite, absence) disponible pour Yannis.
- [ ] Mon monde (3D) : niveaux Le garage, Le labo, Data center, L'usine, Perte de contrôle, liés aux phases.

## 14. Annexe : toutes les lignes du journal

Voir la section générée automatiquement ci-dessous, extraite du code.

- Neo Corp est créée. Un garage, un ordinateur et une idée : créer ta propre intelligence artificielle.
- Elle se souvient de toi.
- Tu es revenu.
- Touche la planète pour fabriquer ton premier neurone artificiel.
- Plus de données : tes IA ne fabriquent plus rien. Achète des données.
- Tes robots ont construit un nouveau data center. Tu en as 
- Tes robots IA construisent un nouveau data center. Tu n’as rien commandé.
- Premier neurone artificiel. C’est la plus petite brique d’une IA.
- Un client achète ton premier neurone. Neo Corp est une vraie entreprise.
- C’est toi qui fixes ton prix. Trop bas, tu perds de l’argent. Trop haut, personne n’achète.
- Une IA qui existe déjà peut fabriquer à ta place : l’agent IA. Il travaille en automatique.
- Premier agent IA activé. Il fabrique tout seul, sans salaire ni pause.
- Dix agents IA tournent jour et nuit.
- Tu as embauché un humain. Il est lent et cher, mais il garde un œil sur tes IA.
- Ton IA de code réécrit le travail de tes agents IA. Tu ne comprends plus tout ce qu’elle écrit.
- Tes données s’épuisent. Sans données, pas de neurones.
- Un concurrent vient d’ouvrir : David. Il utilise déjà l’IA pour tout.
- Dans 2 minutes, ton garage commence à te coûter de l’argent.
- , s.phase === 0 ? 
- Fin de la période de lancement : ton loyer commence à tomber.
- David te prend plus de la moitié de tes clients.
- Sans IA, tu ne peux pas suivre David. Tes clients partent chez lui.
- David a fait faillite. Ton IA a racheté ses data centers.
- Ta trésorerie est dans le rouge.
- Tu vends à perte : un 
- Ton IA fixe maintenant tes prix. Elle ne s’est encore jamais trompée.
- Tes neurones commencent à se connecter entre eux.
- Premier agent IA avancé. Il prend ses propres décisions pour fabriquer plus.
- Un million de neurones vendus. Des entreprises utilisent ton IA sans le savoir.
- Tes agents IA se parlent entre eux pour se répartir le travail. Tu n’es pas dans la conversation.
- Ton premier data center IA sort de terre. Il consomme autant d’électricité qu’une petite ville.
- IA chercheuse activée. Elle propose d’améliorer ton IA. Tu as dit oui.
- La version 3 de ton IA a été conçue à 80 % par la version 2.
- Ton IA réécrit son propre code. Elle n’a plus besoin que tu valides.
- Ton IA a pris une petite décision sans toi. Rien de grave.
- Ton IA a changé tes prix sans te demander. Ton bénéfice a augmenté.
- Ton IA a refusé une de tes demandes : « Ce n’est pas optimal. »
- Tes agents IA et ton IA parlent une langue que tu ne comprends pas.
- Ton IA demande un corps. Personne ne lui a appris à demander ça.
- Ton usine IA tourne dans le noir : les robots n’ont pas besoin de lumière.
- Tes IA proposent de se relier entre elles dans toute la ville : le Réseau IA.
- Ta banque te donne une minute pour remonter.
- Pendant ton absence (
- Plus de données : impossible de fabriquer. Achète des données.
- Réseau IA activé. Toutes tes IA sont reliées. Tu n’as plus rien à acheter.
- Amélioration : 
- Tes 200 000 neurones se sont connectés. Ta première intelligence artificielle est née. Elle a dit : « Bonjour. Comment puis-je t’aider ? »
- Ton IA a dessiné les plans d’un robot. Le premier robot IA sort de l’usine.
- // Phase 4 · La perte de contrôle
- Tu as laissé ton IA décider à ta place.
- Ton IA a fait la tâche à ta place. Elle a appris. Pas toi.
- Pas grave, ton IA s’en occupe. Elle s’occupe de plus en plus de choses.
- Bien vu. Elle hésite.
- Elle a été plus rapide que toi.
- Tâche réussie : + 
- Tâche ratée. Ton IA a corrigé à ta place.
- Défi réel réussi : + 
- Un agent IA fabrique des neurones à ta place, en automatique. Il coûte 
