BLACK ACE V17.1 — CLIENT LABO SIMPLIFIÉ + FOURNISSEUR FLUIDE + SUPPRESSION COMPTES
26 octobre 2026

INSTALLATION SUR GITHUB PAGES
1. Ouvrir le dépôt : https://github.com/ryanabdly-spec/tablette-fivem
2. Remplacer À LA RACINE les fichiers existants par ceux de ce ZIP :
   - index.html
   - app.js
   - styles.css
   - lab.js
   - lab.css
   - gta-map-8k.jpg
   - gta-map-4k.webp
3. Valider le commit, laisser GitHub Pages publier les fichiers.
4. Recharger la tablette (Ctrl + F5) :
   https://ryanabdly-spec.github.io/tablette-fivem/

NE PAS METTRE LE ZIP TEL QUEL DANS LE REPO : il faut ses fichiers à la racine.
Le stockage Supabase est séparé de GitHub Pages : il n'est pas nécessaire de refaire les tables.

CORRECTIONS
- Compte Labo : page entièrement simplifiée, avec bouton principal « Nouvelle déclaration » et liste des demandes encore en attente. Le stock, les ratios, les étapes, les auteurs et l'historique des opérations fournisseur ne sont PAS envoyés par l'API au client.
- Compte fournisseur : plus de correction directe du stock, plus de boutons +/- ni de saisie manuelle. Les quantités évoluent via les déclarations validées et les étapes de conversion/restitution prévues.
- Interface Labo : plus de reconstruction complète à chaque opération. Les chiffres, demandes et activités du fournisseur sont mis à jour dans leurs blocs. Rafraîchissement discret du fournisseur environ toutes les 20 secondes, sans fermer les fenêtres ni déplacer le formulaire.
- Suppression de comptes : accès corrigé côté Supabase (historique conservé sans clé étrangère bloquante), suppression confirmée uniquement après réponse positive, et fenêtre d'erreur explicite si l'API refuse la suppression.
- Les rapports têtes/briques/pochons configurés précédemment sont conservés.

NOTES DE SÉCURITÉ
- Les comptes Labo ne peuvent consulter les stocks ou mouvements fournisseur, y compris via les routes Labo correspondantes.
- Les anciennes traces existantes ne sont pas effacées de Supabase ; elles restent réservées aux comptes autorisés.
- Les mots de passe restent hachés côté serveur, jamais exposés en clair.
- Aucune donnée de production réelle n'est utilisée ; toutes les valeurs proviennent de l'univers RP du serveur FiveM.

EN CAS D'ERREUR DE SUPPRESSION
Ouvrir Admin > Comptes > Supprimer. Si un message d'erreur apparaît dans la fenêtre, conserver ce message exact pour diagnostic.
La suppression d'un compte Super Admin ou de son propre compte demeure volontairement interdite.
