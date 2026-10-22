BLACK ACE V16.2 — UN SEUL STOCK GLOBAL POUR TOUS LES ÉVÉNEMENTS
=============================================================

INSTALLATION
1. Ouvre le dépôt GitHub Pages ryanabdly-spec/tablette-fivem.
2. Remplace les fichiers à la racine par ceux présents dans ce ZIP.
3. Vérifie que index.html, events.js et events.css sont bien remplacés.
4. Actualise la tablette avec Ctrl+F5 ou recharge sans cache.

STRUCTURE DE LA RUBRIQUE « ÉVÉNEMENTS »
- Fiches des groupes : dons, réceptions, historique du partenaire.
- Notre stock global : UN stock unique, détenu par BLACK ACE et partagé pour tous les événements.
- Suivi global : récapitulatif et filtres de tous les groupes.

Chaque fiche de groupe affiche EN DIRECT le même stock global (lecture des quantités,
actualisation périodique toutes les 12 secondes). Le bouton « Notre stock global »
ouvre la seule page où modifier et approvisionner ce stock commun.

AUTOMATISATION
- Un don à n'importe quel groupe DÉDUIT sa quantité de notre stock global Événements.
- Une réception de têtes fraîches AJOUTE sa quantité au stock global, conservé en g
  avec conversion automatique de kg vers g.
- Corriger ou supprimer un mouvement réajuste automatiquement le stock global,
  dans la même transaction SQL : impossibilité de stock négatif.
- Chaque don ou réception conserve le groupe concerné et sa date dans l'historique.
- Les anciennes lignes enregistrées avant la synchronisation restent dans l'historique,
  sans retrait rétroactif de notre stock global.
- Le stock de la BOUTIQUE PRINCIPALE n'est jamais affecté.

CHANGEMENT PAR RAPPORT À V16.1
- Aucun inventaire individuel visible par groupe : l'écran et les ajustements individuels
  ont été retirés.
- L'ancienne synchronisation vers les inventaires par groupe est désactivée.
- Les anciennes données des inventaires individuels sont conservées en base comme archive,
  afin de ne pas effacer l'historique ; elles ne sont plus utilisées dans l'interface.
- Il ne faut pas additionner les anciens inventaires par groupe au stock commun.

SERVEUR
La migration Supabase et la fonction blackace-events v9 ont déjà été déployées
sur le projet utilisé par la tablette. Il n'y a aucune commande SQL à exécuter.
La nouvelle interface est fournie dans le ZIP. Elle ne sera visible sur le lien
GitHub Pages qu'une fois ces fichiers installés.

VÉRIFICATIONS
- Tests SQL : don -> baisse globale, correction -> recalcul, suppression -> restitution ;
  aucun inventaire individuel créé pendant le test. Transaction ROLLBACK, aucune donnée réelle modifiée.
- Test interface : navigation Groupe A -> Groupe B -> Notre stock global, même réserve pour les groupes,
  aucune requête à l'ancien inventaire individuel.
