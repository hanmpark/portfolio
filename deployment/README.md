# Accès aux dossiers du serveur de médias

Le portfolio utilise l'accueil et les cinq pages projet listées dans
`src/data/home.js`. Les cinq entrées de `src/data/projectDetails.js` sont utilisées.
Les URL `assets.hpark.me/` et `assets.hpark.me/premium/` relèvent du serveur de
médias, pas du routeur React. `?NA` est un paramètre de requête, pas une route.

## Correction à appliquer dans cPanel

1. Dans **Domaines**, identifier la racine documentaire de `assets.hpark.me`.
2. Dans le gestionnaire de fichiers, activer l'affichage des fichiers cachés,
   ouvrir cette racine et sauvegarder son éventuel `.htaccess` hors de la racine publique.
3. Fusionner les directives de `assets.htaccess` dans ce fichier, avant les
   règles de réécriture existantes, en conservant sa configuration actuelle.
   Inspecter aussi les `.htaccess` enfants pour repérer les exceptions.
4. Vérifier que les dossiers `/` et `/premium/`, avec et sans `?NA`, répondent
   en HTTP 404, et que ces trois vidéos restent accessibles et lisibles :
   - `/premium/so_long.mp4`
   - `/premium/rt.mp4`
   - `/premium/tetris-multiplayer.mp4`

Ne pas supprimer le dossier `premium` ni ses vidéos : les pages projet les utilisent.
Ce fichier est une configuration à fusionner, pas un déploiement automatique.
La règle `Options -Indexes` du portfolio est également incluse dans
`public/.htaccess` et sera copiée lors de sa prochaine compilation.

Lors de la vérification du 22 octobre 2026, les deux URL signalées répondaient
par une redirection HTTP 302 vers `/cgi-sys/suspendedpage.cgi?NA`.
Si cette redirection persiste, l'état de l'hébergement doit être résolu dans
cPanel ou avec l'hébergeur avant de pouvoir vérifier les règles en production.

Références : [Options](https://httpd.apache.org/docs/2.4/mod/core.html#options)
et [RewriteRule](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html#rewriterule).
