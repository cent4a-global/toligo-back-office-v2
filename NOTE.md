
Dans les détails de l’entrepôt, le front récupère les identifiants TTLock depuis l’API, à la demande, grâce au hook `useTtlockCredentials` dans `useTtlock.js`.

Le hook appelle `ttlockService.getTtlockCredentials` dans `ttlock.services.js`, qui envoie :

```http
GET /api/admin/entrepots/{entrepotId}/ttlock-credentials
```

L’API renvoie les données ; le front lit `data.ttlock_username` et `data.ttlock_password` pour les afficher dans `EntrepotDetails.jsx`. Les valeurs sont masquées par défaut, avec une option pour les afficher ou les copier.

Donc, les identifiants viennent de la réponse du backend, pas d’une génération côté front. La page propose aussi au superadministrateur de réinitialiser le mot de passe via un endpoint séparé.