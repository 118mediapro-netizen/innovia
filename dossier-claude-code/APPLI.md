# Inovia : spécification de l'appli (hors jeu)

Comme pour le jeu, **la maquette fait foi** (`1-maquette-web/index.html?phone`, source `2-source-maquette/Main.dc.html`, captures `4-captures/`). Ce document résume ce qu'il faut reproduire et ce qu'il faut ajouter pour l'App Store.

---

## 1. Design

### Couleurs (jour)

| Rôle | Couleur |
|---|---|
| Violet principal (logo, boutons, accents) | `#7046DC` |
| Violet clair | `#8A63F0` |
| Fond violet très clair (boutons secondaires, puces) | `#EBE4F6` |
| Fond de l'appli | `#F4F2F8` |
| Fond de cartes secondaires | `#F9F7FC` |
| Cartes | `#FFFFFF` |
| Bordures | `#DED6EC` et `#EBE4F6` |
| Texte principal | `#260E4F` |
| Texte secondaire | `#6C5A8C` |
| Rouge (alerte, nouveauté) | `#E5484D`, foncé `#B4232A` |
| Vert (gains) | `#1F8A5B` |

### Couleurs (nuit)

| Rôle | Couleur |
|---|---|
| Fond | `#0A070F` |
| Cartes | `#1A1326` |
| Bordures | `#2A2140` |
| Texte principal | `#F2EEFA` |
| Texte secondaire | `#A99BC4` |
| Accents violets | `#8A63F0` et `#B49BFF` |

### Typographie, éléments communs et réglages
- **Polices** : Plus Jakarta Sans (400 à 800) pour toute l'appli. **Anton** pour le mot « INOVIA » dans l'en-tête (27 px, violet).
- **En-tête** : bouton menu rond à gauche, logo (`assets/logo-inovia.png`) avec « INOVIA » au centre, bouton rond « niveau » (jauge) à droite.
- **Barre du bas** : pilule flottante avec 3 boutons ronds. Actu (icône journal) à gauche, Jeu (curseur, gros bouton violet) au milieu, Apprendre (livre) à droite. L'onglet actif est violet.
- **Écran de chargement** : logo et « INOVIA » qui apparaissent environ 2 secondes, puis fondu.
- **Sensations** : une vibration légère et un son court à chaque toucher. Les sons sont dans `1-maquette-web/sfx/` : pop, whoosh, level, tap, click, combo, pluck, coin, cash, success, error, alert, spark, alarm.
- **Mode nuit** sur toutes les pages, réglable dans le menu, mémorisé.
- **Textes** : français, tutoiement, jamais le mot « formation », aucun emoji.

---

## 2. Actu (gratuit, natif)

Voir `4-captures/dos_12-actu.png` et `dos_13-actu-article.png`.

### Serveur Supabase (déjà en production)
- **Projet** : `swlzdzzfudomdqtgqjjo`, URL `https://swlzdzzfudomdqtgqjjo.supabase.co`.
- **Clé publique** (publishable, utilisable dans l'appli) : `sb_publishable__w68mk60GQjnadt8zAuTtw_mhIX7L8t`.
- **Table `news`** : `id uuid, url, source, title, excerpt, image, tag (défaut 'Société'), lead, why, module, published_at, fetched_at, hidden boolean`. RLS : lecture publique (anon et authenticated) des lignes où `hidden = false`.
- **Table `news_sources`** : `id, name, feed_url, ai_only, enabled, last_ok, last_error, last_count`. Il y a 16 flux de médias, Le Figaro est désactivé (erreur 403).
- **Fonction `fetch-news`** (`3-supabase/functions/fetch-news/index.ts`, `verify_jwt = false`) :
  - lit les flux RSS/Atom ;
  - garde uniquement les articles qui parlent d'IA (filtre par expressions) ;
  - écarte les contenus parasites ;
  - attribue une catégorie (tag) ;
  - récupère l'image de l'article (og:image) ;
  - insère ou met à jour les articles ;
  - supprime ce qui a plus de 30 jours.
- **Tâche planifiée pg_cron** `inovia-actu-chaque-minute` (toutes les minutes) : `net.http_post` vers la fonction. Une info publiée par un média arrive dans l'appli en moins d'une minute.
- **Requête de l'appli** : `GET /rest/v1/news?select=id,url,source,title,excerpt,image,tag,lead,why,module,published_at&order=published_at.desc&limit=60` avec l'en-tête `apikey`.

### Écran liste
- Barre de recherche « Rechercher une actu, un sujet, un média ».
- **Catégories** en puces horizontales :
  - Tout, Société, Création, Business, Emploi, Image et vidéo, Code (par tag) ;
  - OpenAI, Anthropic, Google (repérées par mots-clés : openai|chatgpt|gpt|sora|altman, anthropic|claude, google|gemini|deepmind|alphabet) ;
  - plus les catégories créées par l'admin (nom et mots-clés). L'admin peut supprimer ou masquer des catégories, sauf « Tout ».
- Ligne d'état « En direct · Mis à jour il y a X » avec le bouton « Actualiser ». Sans connexion : « Hors connexion » et un message pour réessayer.
- **Rafraîchissement** : tirer vers le bas, ou toucher le bouton. Vérification automatique toutes les 60 secondes. S'il y a des nouveautés, une pastille « N nouvelles actus » apparaît, qu'on touche pour les afficher. La liste ne saute pas toute seule.
- **Cartes** :
  - grande photo de l'article ; si elle échoue, photo de repli selon la catégorie, avec mémoire des images en échec ;
  - pastille « NOUVEAU » sur les articles récents ;
  - titre ;
  - catégorie · source · « il y a X » ;
  - icône pour enregistrer.
- **Aucun article inventé** : seulement les vrais articles de la base.

### Écran article
- Photo en haut, bouton retour et bouton enregistrer.
- « Catégorie · Source · il y a X », titre.
- « Extrait de l'article » avec le texte (`lead`, sinon `excerpt`).
- « Ce que ça change pour toi » (si `why` existe).
- Bloc « Source » : média, date, titre d'origine, bouton « Lire l'article complet sur [média] » (ouvre le navigateur intégré), mention de la photo.
- Bloc violet « Apprends à le faire » : nom du module lié, bouton « Voir le module », qui ouvre Apprendre sur le bon module.

### Listes
- « Favoris » et « À lire plus tard », plus des listes créées par l'utilisateur.
- Quand on enregistre un article, on **doit** choisir une liste.
- Accès par le menu, « Mes listes ».

---

## 3. Apprendre (payant, natif)

Voir `4-captures/dos_14` et `dos_15`. Contenu complet : `5-contenu/catalogue-apprendre.json` (4 parcours : Les bases de l'IA, Créer, Travailler, Automatiser ; 10 modules, 32 vidéos).

### Mise en page façon Netflix
1. Titre « Apprendre », boutons recherche et téléchargements.
2. Puces des parcours.
3. Ligne « À ne pas rater » : grandes vignettes, avec les badges NOUVEAU et TOP, la durée et un bouton lecture.
4. **À ajouter** : une ligne « Continuer la lecture » juste en dessous (vidéos commencées).
5. Les modules dans l'ordre, chacun avec « MODULE N », son titre, « X vidéos · durée · Gratuit ou prix » et une ligne de petites vignettes. Coche verte si la vidéo est vue, prix affiché si elle est payante.
6. Version nuit façon Netflix.

### Fiche vidéo
Titre, grande description, ce qu'on va apprendre, mission pratique, lecteur vidéo.

### Prix
- **Le premier module est gratuit.**
- Prix par défaut par vidéo selon le niveau : Débutant 4,99 €, Intermédiaire 6,99 €, Avancé 9,99 €.
- **Apprentissage complet : 69 €** (toutes les vidéos, accès à vie).
- L'admin peut changer chaque prix, le prix du pack et le prix global.
- À l'achat, on propose les deux choix : « Cette vidéo » ou « L'apprentissage complet ».

### Achats
- Uniquement par **achat intégré Apple** (In-App Purchase, non-consommable, accès à vie). Aucun lien vers un paiement extérieur.
- Bouton « Restaurer mes achats ».
- Achats liés au compte.

### Vidéos
Hébergées hors de l'appli, par exemple Supabase Storage ou un service vidéo, et lues en streaming. Prévoir le téléchargement hors ligne (bouton présent dans l'en-tête).

### Plus tard
Parrainage à un seul niveau (exemple : le parrain gagne 20 € par achat du pack à 69 € via son code). Attention aux règles d'Apple sur les récompenses. À étudier avant de coder.

---

## 4. Mode admin

Dans la maquette, il est accessible à tous par le menu, puis « Mode admin ». Dans l'appli finale, il est **réservé au compte de Yannis** et ses changements passent par Supabase, sans mise à jour Apple. Sections :

- **Le jeu** : vitesse, phases, fin, faillite, remise à zéro (voir `JEU_NEO_CORP.md`).
- **Apprendre** :
  - créer, modifier et supprimer des modules et des vidéos (titre, description, niveau, prix, gratuit ou payant) ;
  - prix par niveau, prix du pack, prix global.
- **L'Actu** :
  - créer une catégorie (nom et mots-clés) ;
  - supprimer, masquer ou rétablir des catégories ;
  - publier un article à la main (lien, titre, texte, catégorie) qui apparaît en haut de l'Actu ;
  - supprimer ses articles.

À prévoir dans Supabase : des tables `modules`, `videos`, `prices`, `categories`, `admin_articles`, et `purchases` ou la vérification des reçus Apple, avec une RLS stricte (écriture réservée à l'admin).

---

## 5. Comptes et sauvegarde

- On peut **jouer sans compte**. Le compte sert à sauvegarder et à acheter.
- **Se connecter avec Apple** est obligatoire si d'autres connexions sont proposées. Supabase Auth est conseillé.
- Sauvegarde de la partie et de la progression Apprendre sur le compte. Quand on retrouve sa partie, afficher le message « Partie retrouvée : ta progression est sauvegardée sur ton compte. » (bandeau violet très foncé, texte blanc en gras).
- **Suppression du compte depuis l'appli** (exigence Apple).

---

## 6. Autres éléments de la maquette à garder

- **Menu** (bouton en haut à gauche) : profil, mode nuit, son et vibrations, taille du texte, Mes listes, Mode admin.
- **Quiz de niveau** (bouton jauge en haut à droite) : questions adaptées pour situer le niveau de l'utilisateur. Un rappel de quiz apparaît après environ 150 secondes d'utilisation.
- **Mon monde** (3D) : vue ville et vue intérieur, mode nuit. Ses niveaux sont Le garage, Le labo, Data center, L'usine, Perte de contrôle (fichier `1-maquette-web/monde/index.html`, piloté par `postMessage` avec `{ type: 'neocorp', lvl, worth, wl, staff, night }`).

---

## 7. Check-list App Store (à faire avant l'envoi)

- [ ] Compte Apple Developer (99 $ par an) au nom de Yannis ou de sa société.
- [ ] Achats intégrés configurés dans App Store Connect, avec « Restaurer mes achats ».
- [ ] Se connecter avec Apple, et suppression du compte depuis l'appli.
- [ ] Politique de confidentialité (URL), étiquettes de confidentialité dans App Store Connect, mentions légales, page d'aide ou de contact.
- [ ] Mention des sources et liens vers les articles des médias dans l'Actu.
- [ ] Classification d'âge.
- [ ] Compte de démonstration et notes pour la vérification d'Apple (expliquer le jeu, l'Actu et le mode admin caché).
- [ ] Icône, écran de lancement, captures iPhone et iPad, texte de la fiche.
- [ ] Tests complets sur iPhone réel (TestFlight) avant l'envoi.
