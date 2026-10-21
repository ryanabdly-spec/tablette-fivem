BLACK ACE V16.1 — Fiches groupes directement reliées aux inventaires
==============================================================

Installation : dans le dépôt GitHub Pages « ryanabdly-spec/tablette-fivem »,
remplacer les fichiers à la racine par le contenu du ZIP (pas le ZIP lui-même).
Mettre aussi à jour events.js, events.css et index.html. Vider le cache avec Ctrl+F5.

Ce qui change dans Événements :

1. Une fiche de groupe présente désormais tout en haut son inventaire dédié,
   séparé des autres groupes et accessible par « Inventaire du groupe ».
2. Le contenu se met à jour automatiquement toutes les 12 secondes pendant
   la consultation, et immédiatement après les actions de la tablette.
3. Le bouton « Ouvrir l'inventaire » mène au détail avec + / − rapides,
   saisie directe, ajustements et historique des mouvements.
4. Un don enregistré sur la fiche du groupe est TRANSFÉRÉ depuis notre réserve
   globale Événements vers l'inventaire du groupe, en une opération atomique :
   - 10 graines retirées de « Notre stock global » ;
   - 10 graines ajoutées chez le groupe bénéficiaire.
5. Corriger/supprimer un don corrige les deux réserves. Si la suppression
   ferait descendre le stock du groupe sous zéro après une consommation
   déjà enregistrée, elle est refusée pour éviter un inventaire incohérent.
6. Les réceptions de têtes fraîches restent rattachées à la fiche groupe et
   ajoutent la quantité à notre réserve commune ; elles ne sont PAS ajoutées
   aux articles donnés au groupe.
7. Les ajustements MANUELS de l'inventaire du groupe ne modifient pas notre
   réserve globale et ne sont pas assimilés à des dons : ils servent à noter
   les consommations/corrections constatées chez ce groupe.
8. Les six dons historiques précédents ont été repris dans leurs inventaires
   partenaires, sans retrait rétroactif du stock global.
9. Cette fonctionnalité reste TOTALEMENT indépendante du stock de la boutique
   principale de BLACK ACE.

Serveur : la base et la fonction Supabase blackace-events (v8) ont été mises
à jour pour cet espace de travail, aucune migration SQL à lancer manuellement.
Attention : le frontend de la V16.1 n'est pas en ligne tant que le dépôt
GitHub n'est pas mis à jour (les écritures depuis le connecteur peuvent être
bloquées). Le ZIP contient les fichiers prêts à transférer.

Contrôles réalisés : création de don, correction, suppression, ajustements,
refus de suppression si inventaire insuffisant et indépendance des groupes.
Les tests SQL de transactions ont été annulés (ROLLBACK) : aucune quantité
réelle n'a été modifiée par les tests.
