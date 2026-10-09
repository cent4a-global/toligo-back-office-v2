GET /api/superadmin/zones
GET /api/superadmin/zones/:id
POST /api/superadmin/zones
PUT /api/superadmin/zones/:id
DELETE /api/superadmin/zones/:id


{
  "success": true,
  "data": {
    "id": "01a0f7c8-a26a-70a6-a069-f9f024888db6",
    "nom": "Zone Abidjan Nord",
    "code": "ZN-ABJ-NORD",
    "polygone": [
      {
        "lat": 5.4,
        "lng": -4.05
      },
      {
        "lat": 5.45,
        "lng": -4.05
      },
      {
        "lat": 5.45,
        "lng": -3.95
      },
      {
        "lat": 5.4,
        "lng": -3.95
      }
    ],
    "est_active": true,
    "communes": [
      {
        "id": "01a0f266-5fa8-7025-9aad-7e75624012cf",
        "nom": "Marcory",
        "code": "MARCORY"
      }
    ],
    "created_at": "2026-10-01T14:05:16.000000Z",
    "updated_at": "2026-10-01T14:05:16.000000Z",
    "archive_le": null
  },
  "message": "Zone ajoutée avec succès."
}