# Neo Corp, par Inovia : l'appli à construire EN PREMIER

Décision du projet : on sort d'abord **Neo Corp**, le jeu seul, gratuit avec pubs. Inovia (Actu, Apprendre, jeu RP) vient ensuite. Neo Corp sert aussi à remplir la liste d'attente d'Inovia.

## 1. Ce qu'est l'appli
- Une appli Expo **séparée** de la future appli Inovia, dans le dossier `appli-neocorp/` du dépôt (ne pas toucher à la racine ni à `neocorp/`, qui sont en ligne sur GitHub Pages).
- Un seul écran : le jeu, affiché en plein écran dans une **WebView**, avec le code exact de la maquette.
- La maquette de référence : `neocorp/index.html` du dépôt (en ligne : https://118mediapro-netizen.github.io/innovia/neocorp/?phone). Elle utilise `../assets/` et `neocorp/monde/` (copier aussi `assets/`, `sfx/` et `icon-*.png`).
- Le jeu est décrit dans `../JEU_NEO_CORP.md`. Ne rien changer au jeu.

## 2. Embarquer le jeu
- Copier `neocorp/index.html`, `neocorp/monde/`, `assets/` et `sfx/` dans l'appli (par exemple `appli-neocorp/assets/web/`) en gardant les chemins relatifs, et les charger **depuis l'appli** (fichiers locaux), pas depuis GitHub Pages : le jeu doit marcher hors ligne.
- Avant le chargement, injecter (`injectedJavaScriptBeforeContentLoaded`) :
  ```js
  window.__ncProd = true;      // cache le bouton du mode admin
  window.__nativeAds = true;   // les pubs passent par AdMob (voir § 3)
  window.__nativeSound = true; // les sons passent par expo-audio
  true;
  ```
- Garder le pont de `../2-source-maquette/expo-test-App.js` : la page envoie `{ t: 'snd', n, r }` (son) et `{ t: 'vib', p }` (vibration) par `window.ReactNativeWebView.postMessage`. Brancher `expo-audio` et `expo-haptics`.
- La sauvegarde est dans le `localStorage` de la WebView (clés `inoviaNx1`, `inoviaNxMeta`, `inoviaNxSpeed3`). Vérifier qu'elle survit à la fermeture de l'appli et à une mise à jour (WKWebView avec un `baseUrl`/origine stable). Si elle se perd, la recopier côté natif avec `AsyncStorage`.
- Barre d'état claire, zone sûre (encoche) respectée, pas de rebond de défilement, pas de zoom.

## 3. Les pubs (Google AdMob)
Module : `react-native-google-mobile-ads` (nécessite une **build de développement** EAS, pas Expo Go).

La page demande une pub ainsi :
```js
window.ReactNativeWebView.postMessage(JSON.stringify({ t: 'ad', kind: 'force' | 'bonus', reward: 'x2' | 'cash' | 'data' | 'ctl' | null }))
```
- `kind: 'force'` : afficher une **pub interstitielle** (plein écran). Déclenchée au bouton « Recommencer » et au retour après plus de 30 minutes d'absence.
- `kind: 'bonus'` : afficher une **pub récompensée**. Les récompenses sont gérées par la page.

Quand la pub est terminée, répondre à la page :
```js
webviewRef.current.injectJavaScript('window.__ncAdDone && window.__ncAdDone(true); true;')
```
- `true` = pub vue jusqu'au bout (pour une pub bonus : le joueur reçoit sa récompense) ;
- `false` = pub fermée trop tôt, pas chargée ou erreur (pas de récompense ; pour une pub forcée, la partie continue quand même).
- Si rien ne répond en 60 secondes, la page débloque toute seule (sécurité).
- Si aucune pub n'est disponible, répondre `false` tout de suite : le joueur ne doit jamais rester bloqué.

Pendant le développement, utiliser **les identifiants de test d'AdMob**. Les vrais identifiants viendront du compte AdMob de Yannis.

## 4. Suivi publicitaire (App Tracking Transparency)
- `expo-tracking-transparency` : demander l'autorisation **après** la première partie lancée (pas au tout premier écran), avec le texte :
  « Neo Corp affiche des publicités pour rester gratuit. Autoriser le suivi permet d'afficher des pubs plus adaptées. »
- Si refus : pubs non personnalisées. Ajouter aussi le formulaire de consentement de Google (UMP) pour l'Europe.

## 5. Notifications locales
- `expo-notifications`, seulement si le joueur accepte (demande après 10 minutes de jeu, pas avant).
- Quand l'appli passe en arrière-plan, programmer une notification dans 2 heures : « Ton IA a continué à travailler sans toi. Viens voir ce qu'elle a fait. » Annuler au retour.
- Une seule notification à la fois, jamais la nuit (entre 22 h et 9 h, décaler à 9 h).

## 6. Liste d'attente d'Inovia
Déjà faite dans la page (menu « Découvrir l'appli Inovia » et écran de fin). Elle écrit dans la table Supabase `waitlist` avec la clé publique. Rien à faire côté natif, juste vérifier qu'elle marche dans l'appli.

## 7. Pages et App Store
- Pages en ligne (à compléter : email de contact et éditeur, marqués « À COMPLÉTER ») :
  - Aide : https://118mediapro-netizen.github.io/innovia/neocorp/aide.html
  - Confidentialité : https://118mediapro-netizen.github.io/innovia/neocorp/confidentialite.html
  - Mentions légales : https://118mediapro-netizen.github.io/innovia/neocorp/mentions-legales.html
- Fiche App Store prête : `FICHE_APP_STORE.md` (nom, sous-titre, description, mots-clés, captures, questionnaire de confidentialité, notes pour Apple).
- Icône : celle d'Inovia (`icon-512.png`) en attendant une icône Neo Corp. Écran de démarrage : fond noir, « NEO CORP / par Inovia ».
- Identifiant de l'appli proposé : `com.inovia.neocorp`.
- Risque Apple n° 4.2 (appli qui ne serait qu'un site) : le jeu est un vrai jeu, embarqué, avec pubs natives, notifications, vibrations et sons natifs. Le dire dans les notes pour la vérification.

## 8. Ordre de travail
Chaque étape se termine par un test sur l'iPhone de Yannis, expliqué pas à pas, et sa validation.
1. Projet Expo `appli-neocorp/`, écran de démarrage, le jeu embarqué en plein écran, sons et vibrations. Test avec Expo Go.
2. Build de développement EAS, installée sur l'iPhone. Vérifier la sauvegarde (fermer l'appli, revenir).
3. AdMob avec les pubs de test, forcées et bonus. Vérifier que le joueur n'est jamais bloqué.
4. ATT, consentement UMP, notifications locales.
5. Icône, captures (5, voir la fiche), build de production, TestFlight.
6. Envoi à Apple avec la fiche.

## 9. Ce dont Claude Code a besoin de Yannis
- Un compte **Apple Developer** (99 $ par an) et un compte **Expo** (gratuit).
- Un compte **AdMob** relié à l'appli (pour les vrais identifiants de pub ; au début, les pubs de test suffisent).
- L'email de contact et l'éditeur (nom de l'entreprise ou de l'entrepreneur, adresse) pour les pages légales.
