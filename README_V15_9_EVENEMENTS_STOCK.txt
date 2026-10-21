BLACK ACE V15.9 — STOCKS DES ÉVÉNEMENTS + SUPPRESSION TRAÇABILITÉ
==================================================================

NOUVEAUTÉS
- Nouvelle sous-catégorie « Stocks des événements » dans Événements.
- Stock entièrement distinct du stock principal (boutique, produits, commandes, Kit, Disqueuse).
- Inventaire spécifique pour CHAQUE partenaire/groupe de la rubrique Événements.
- Ajouter des articles standards ou personnalisés avec unité pcs, L, heures, g, kg.
- Réglage direct de la quantité, validation par Entrée, boutons +/- fluides (clics regroupés en 450 ms).
- Historique des ajustements de stock : auteur, date, quantité avant/après, note et différence.
- Les dons et réceptions sont suivis dans leurs onglets et ne débitent/créditent pas automatiquement ce stock événement (pour éviter des doubles mouvements inattendus).
- La rubrique Traçabilité utilise désormais un vrai formulaire de confirmation pour le bouton X ; suppression logique par l'API en POST pour plus de compatibilité.
- Les lignes retirées disparaissent de la vue et la trace de suppression est conservée dans les logs.

INFRASTRUCTURE
- Migration Supabase exécutée : event_stock_items + event_stock_movements et fonction transactionnelle event_stock_change.
- Supabase Edge Function blackace-events mise à jour (v3) avec endpoints stock, stockHistory, changeStock et deleteEntry.
- RLS activée et accès depuis les sessions Black Ace : rôle membre et super-admin avec permissions events.view / events.edit.
- Le stock principal (table products) n'est pas modifié.
- Ne pas relancer les migrations sur le projet Supabase déjà configuré.

INSTALLATION
1. Décompresser le ZIP.
2. Envoyer index.html, app.js, events.js, styles.css, events.css et les ressources à la racine du dépôt GitHub Pages.
3. Attendre la mise en ligne puis Ctrl+F5 / vider le cache.
4. Dans Événements, choisir un groupe puis l'onglet Stocks des événements.
5. Dans Fiches des groupes > Traçabilité, cliquer sur X puis confirmer pour supprimer une ligne.

NOTE : Le ZIP ne publie rien automatiquement sur GitHub. Les services Supabase sont déjà déployés sur le projet actuel.
