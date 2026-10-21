BLACK ACE V15.8 — MODULE ÉVÉNEMENTS
=================================

Version basée sur la tablette BLACK ACE V15.7 (sans supprimer les fonctions existantes).

NOUVELLE CATÉGORIE "Événements" (menu gauche)
- Partenaires : créer, renommer, annoter, archiver/réactiver des groupes propres au module.
- Fiche distincte pour chaque partenaire.
- Dons : Graines, Eau, Pots, Fertilisant, Lumière, Terre et Autre ; quantité, unité, date, note.
- Réception : Têtes fraîches uniquement, avec quantité en g ou kg, date et note.
- Totaux par élément, dernière opération, nombre de mouvements.
- Suivi global avec filtre par partenaire, dates, type.
- Historique des mouvements : date, groupe, auteur, note, édition et suppression contrôlées.
- Export CSV des historiques filtrés.
- Affichage nuit/vert/bleu inspiré du visuel fourni.

DONNÉES PARTAGÉES ET SÉCURITÉ
- Tables Supabase : event_groups et event_entries (RLS activée).
- Edge Function : blackace-events (authentification par session de la tablette).
- Membres Black Ace autorisés à voir et modifier ; super-admin accès total.
- Les clients n'accèdent pas à cette section par défaut.
- Suppression d'une ligne = suppression logique conservée en base et action journalisée.
- Archiver un groupe ne supprime jamais ses mouvements.
- Conversion des réceptions : 1 kg = 1 000 g pour les totaux.

DÉPLOIEMENT SUR TON SITE GITHUB PAGES
1. Ouvrir ton dépôt "tablette-fivem".
2. Envoyer/mettre à jour TOUS les fichiers du ZIP à la racine, y compris events.js et events.css.
3. Attendre la publication GitHub Pages puis actualiser la tablette (Ctrl+F5).
4. Se connecter en tant que membre ou super-admin ; aller dans "Événements".
5. Créer les partenaires souhaités. Aucune donnée fictive n'a été créée dans ta base.

IMPORTANT
La migration SQL et la fonction Supabase ont DÉJÀ ÉTÉ déployées sur le projet
jxwgiugpgvcuufbkzdhd.supabase.co utilisé par cette tablette.
Ne pas réexécuter le SQL pour ce même projet sans raison.
Le fichier BLACK_ACE_V15_8_SUPABASE.sql est joint uniquement comme documentation et
pour une éventuelle installation sur un autre projet (il faudrait alors aussi déployer la fonction Edge).

Les fichiers du ZIP ne sont pas publiés automatiquement sur GitHub par ce téléchargement.
