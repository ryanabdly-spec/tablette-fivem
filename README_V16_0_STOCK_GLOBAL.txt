BLACK ACE V16.0 - STOCK GLOBAL AUTOMATISÉ DES ÉVÉNEMENTS
21 octobre 2026

INSTALLATION
1. Décompresse ce ZIP.
2. Envoie les fichiers à la racine du dépôt GitHub tablette-fivem en remplaçant les versions existantes.
3. Attends la publication GitHub Pages puis recharge la tablette avec Ctrl + F5.
4. Connecte-toi avec un compte membre autorisé et ouvre Événements > Notre stock global.
5. Clique sur + Approvisionner pour enregistrer les quantités que BLACK ACE possède réellement.

CE QUI CHANGE
- Une seule réserve BLACK ACE commune pour tous les groupes de la rubrique Événements.
- Aucun effet sur le stock principal (boutique / Stock de la tablette).
- Chaque nouveau don enregistré pour un groupe soustrait automatiquement sa quantité du stock commun.
- Chaque nouvelle réception de têtes fraîches ajoute automatiquement au stock commun, en grammes. Exemple 1,5 kg = 1500 g.
- Les modifications d'un don ou d'une réception corrigent le stock dans la même opération.
- La suppression d'un mouvement annule son effet sur le stock si le solde le permet.
- Si le stock est insuffisant, l'enregistrement / la modification / la suppression est refusée, afin d'éviter les stocks négatifs ou faux.
- Les ajustements manuels et les mouvements automatiques apparaissent avec le groupe et l'auteur dans l'historique du stock.
- La traçabilité par groupe et les filtres par période sont conservés.

IMPORTANT : DONNÉES EXISTANTES
Les mouvements enregistrés AVANT cette version sont préservés dans la traçabilité.
Ils ne sont PAS déduits rétroactivement du nouveau stock commun : une ancienne déduction risquerait de créer une quantité incorrecte. Le stock global commence à 0, à renseigner selon votre inventaire réel.
Les anciennes tables de stock PAR GROUPE de la V15.9 sont conservées en base pour sécurité, mais ne sont plus utilisées par cette interface V16.0.

SUPABASE
La base et la fonction blackace-events v6 sont déjà déployées sur le projet existant. Aucune clé secrète n'est incluse dans les fichiers de la tablette. Les permissions events.view et events.edit sont appliquées côté serveur.

URL : https://ryanabdly-spec.github.io/tablette-fivem/
Ce ZIP ne modifie pas tout seul GitHub : tu dois remplacer les fichiers pour mettre la V16 en ligne.
