BLACK ACE — VERSION 17.0 : MODULE LABO (FIVEM / RP)
===================================================

INSTALLATION SUR GITHUB PAGES
1. Ouvrir le dépôt ryanabdly-spec/tablette-fivem sur GitHub.
2. Remplacer à la racine : index.html, app.js, styles.css et les deux cartes GTA.
3. Ajouter à la racine : lab.js et lab.css.
4. Publier les modifications. Recharger ensuite la tablette avec Ctrl + F5.
5. Adresse habituelle : https://ryanabdly-spec.github.io/tablette-fivem/

IMPORTANT : ne pas envoyer simplement le ZIP dans le dépôt : décompresser puis
placer les fichiers directement à la racine de la branche utilisée par Pages.

SUPABASE
Le backend est déjà déployé dans le projet Supabase BLACK ACE habituel.
Les tables et fonctions du Labo sont créées. Aucune clé privée n'est incluse
et il n'y a pas de serveur à héberger en supplément.

CE QUI CHANGE
- La navigation « Événements » est remplacée par « Labo ».
- Les anciennes données Événements sont conservées dans la base, non affichées.
- Black Ace : rôle Super Admin ou permission "lab.supplier" sur un rôle interne.
  Permet de créer/renommer/archiver les groupes, gérer les stocks et les ratios,
  confirmer les quantités reçues, consulter les logs des opérations et restituer.
- Clients Labo : rôle « Labo », avec la case « Catégorie Labo » cochée.
  Chaque compte voit UNIQUEMENT son groupe dans l'espace Labo et peut déclarer
  ses têtes reçues, corriger/annuler les déclarations en attente et voir les suivis.
- Les comptes clients ne voient plus la Boutique, les Commandes ni les annonces
  de vente. Messages, rendez-vous, signalements, profil et paramètres sont conservés.

CRÉATION D'UN COMPTE LABO
Administration > Comptes > + Compte.
- Entrer les identifiants et le nom du partenaire.
- Cocher « Catégorie Labo » et saisir le nom du groupe Labo.
- Enregistrer : le rôle Labo est attribué et sa fiche est créée automatiquement.
  Si une catégorie non attribuée porte déjà ce nom, elle est associée au compte.
- Une seule tablette cliente (compte) peut être associée à chaque fiche Labo.

CIRCUIT DE CALCUL DU JEU
Dans « Labo », cliquer sur « Circuit de calcul » et renseigner les deux ratios :
  Têtes (quantité de jeu) -> Briques (quantité de jeu)
  Briques (quantité de jeu) -> Pochons (quantité de jeu)
Les ratios sont initialement Vides afin de ne supposer aucune valeur.
Ils sont fictifs, personnalisables et n'ont aucun lien avec un procédé réel.
Les conversions retirent exactement la quantité consommée et ajoutent le
résultat calculé, si le stock est suffisant. Les opérations enregistrent leur
acteur, le ratio utilisé et les quantités avant/après.

STATUTS DES GROUPES
BLANC : rien à traiter / stock vide ;
ROUGE : têtes ou briques restant à transformer OU déclaration à vérifier ;
VERT : pochons prêts à être restitués et plus rien à transformer.

SUPPRESSION D'UN GROUPE
Une catégorie sans compte ni historique peut être supprimée définitivement.
Sinon, le groupe est archivé pour préserver les données de traçabilité.
L'archivage est réversible via la case « Archivés ».

TESTS EFFECTUÉS
- Validation et sauvegarde du rôle Labo et du lien compte-groupe.
- Simulation transactionnelle des ratios, transformations et erreurs de stock.
- Interface vérifiée dans Chromium avec réponses API simulées : fournisseur,
  client et formulaire de création de compte (sans erreurs JavaScript).
- Le déploiement de l'interface GitHub n'a PAS été effectué automatiquement.

NOTES
- Les anciens comptes Client ne deviennent pas automatiquement comptes Labo.
  Leur attribuer « Catégorie Labo » dans Admin pour activer le service.
- Ne pas modifier les tables Supabase manuellement, sauf opération intentionnelle.
- Le module est conçu comme inventaire virtuel pour le jeu FiveM ; aucune
  recette ou méthode réelle de fabrication n'est fournie.
