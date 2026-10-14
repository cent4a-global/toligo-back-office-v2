
Pour la page globale **Locations**, voici les mêmes informations :

### Hook et services

La page `Locations.jsx` utilise deux hooks définis dans `useLocation.js` :

- **`useAllLocations()`** récupère la liste des locations.
- **`useSoldeGeniusPay()`** récupère le solde affiché dans les statistiques.

Ils appellent les méthodes correspondantes de `location.service.js`.

### Routes et endpoints

La page globale est accessible à `/locations` et est réservée aux super-administrateurs, selon `App.jsx`.

Elle appelle :
- `GET /api/superadmin/locations` pour les locations ;
- `GET /api/superadmin/get-solde-geniuspay` pour le solde GeniusPay.

Le service contient aussi des endpoints pour les locations d’un client, d’un entrepôt ou d’une caisse, ainsi qu’un endpoint de statistiques par dates ; **la page globale n’utilise pas ces appels**.

### Données attendues

Le backend n’étant pas visible ici, je ne peux pas confirmer le payload exact renvoyé par la base de données. Le hook extrait la propriété `data` de la réponse. D’après les champs affichés par les cartes et la fenêtre de détail, une location utilise notamment une structure de ce type :

```json
{
  "data": [
    {
      "id": "location-id",
      "statut": "active",
      "montant_total": 5000,
      "duree_heures": 2,
      "date_debut": "2026-10-14T10:00:00.000Z",
      "date_fin": "2026-10-14T12:00:00.000Z",
      "created_at": "2026-10-14T09:55:00.000Z",
      "access_code_status": "genere",
      "client": {
        "nom_complet": "Nom du client",
        "telephone": "+225 00 00 00 00",
        "is_blocked": false
      },
      "objet": {
        "nom": "Objet",
        "type_objet": { "libelle": "Catégorie" }
      },
      "box": {
        "numero": "B-01",
        "prix_par_heure": 2500,
        "dimensions": {
          "longueur": 100,
          "largeur": 80,
          "hauteur": 60
        },
        "entrepot": {
          "nom": "Entrepôt",
          "commune": "Commune",
          "ville": "Ville"
        }
      },
      "paiements": [
        {
          "id": "payment-id",
          "montant": 5000,
          "statut": "paye",
          "mode": "wave",
          "date": "2026-10-14T09:55:00.000Z"
        }
      ]
    }
  ]
}
```

C’est un **exemple indicatif des champs consommés par l’interface**, pas une confirmation du schéma DB exact.

### Ce que fait la page

Elle affiche l’historique global sous forme de cartes et de statistiques : nombre total, locations actives, terminées et revenu total. On peut filtrer par statut, rechercher par client, caisse, objet ou entrepôt, trier par date et ouvrir une location pour voir ses détails et paiements.