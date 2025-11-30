# 📊 Schéma de la base de données SailingLoc

## 📋 Vue d'ensemble

Ce document présente le schéma complet de la base de données SailingLoc avec toutes les tables, colonnes, types et relations.

## 🔐 Tables ASP.NET Identity

### AspNetUsers

Table principale des utilisateurs, étendue avec les propriétés métier.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | NVARCHAR(450) | NO | - | PK - Identifiant unique |
| UserName | NVARCHAR(256) | YES | - | Nom d'utilisateur |
| NormalizedUserName | NVARCHAR(256) | YES | - | Nom normalisé (index) |
| Email | NVARCHAR(256) | YES | - | Email |
| NormalizedEmail | NVARCHAR(256) | YES | - | Email normalisé (index) |
| EmailConfirmed | BIT | NO | 0 | Email confirmé |
| PasswordHash | NVARCHAR(MAX) | YES | - | Hash du mot de passe |
| SecurityStamp | NVARCHAR(MAX) | YES | - | Stamp de sécurité |
| ConcurrencyStamp | NVARCHAR(MAX) | YES | - | Stamp de concurrence |
| PhoneNumber | NVARCHAR(MAX) | YES | - | Téléphone |
| PhoneNumberConfirmed | BIT | NO | 0 | Téléphone confirmé |
| TwoFactorEnabled | BIT | NO | 0 | 2FA activé |
| LockoutEnd | DATETIMEOFFSET(7) | YES | - | Fin du verrouillage |
| LockoutEnabled | BIT | NO | 0 | Verrouillage activé |
| AccessFailedCount | INT | NO | 0 | Nombre d'échecs |
| **FullName** | NVARCHAR(256) | NO | - | 🔵 Nom complet |
| **Avatar** | NVARCHAR(500) | YES | - | 🔵 URL avatar |
| **UserType** | NVARCHAR(50) | NO | - | 🔵 Type (renter/owner/admin) |
| **Verified** | BIT | NO | 0 | 🔵 Utilisateur vérifié |
| **MemberSince** | DATETIME2(7) | NO | GETUTCDATE() | 🔵 Membre depuis |
| **CreatedAt** | DATETIME2(7) | NO | GETUTCDATE() | 🔵 Date création |
| **UpdatedAt** | DATETIME2(7) | YES | - | 🔵 Date modification |

🔵 = Colonnes personnalisées SailingLoc

**Index :**
- `UserNameIndex` : UNIQUE sur NormalizedUserName
- `EmailIndex` : sur NormalizedEmail

### AspNetRoles

Rôles de l'application.

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| **Id** | NVARCHAR(450) | NO | PK - Identifiant unique |
| Name | NVARCHAR(256) | YES | Nom du rôle |
| NormalizedName | NVARCHAR(256) | YES | Nom normalisé |
| ConcurrencyStamp | NVARCHAR(MAX) | YES | Stamp de concurrence |

**Valeurs :**
- Admin
- Owner
- Renter

**Index :**
- `RoleNameIndex` : UNIQUE sur NormalizedName

### AspNetUserRoles

Association Many-to-Many entre Users et Roles.

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| **UserId** | NVARCHAR(450) | NO | PK, FK → AspNetUsers |
| **RoleId** | NVARCHAR(450) | NO | PK, FK → AspNetRoles |

### AspNetUserClaims

Claims personnalisés des utilisateurs.

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| **Id** | INT IDENTITY | NO | PK - Auto-incrémenté |
| UserId | NVARCHAR(450) | NO | FK → AspNetUsers |
| ClaimType | NVARCHAR(MAX) | YES | Type de claim |
| ClaimValue | NVARCHAR(MAX) | YES | Valeur du claim |

### AspNetRoleClaims

Claims des rôles.

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| **Id** | INT IDENTITY | NO | PK - Auto-incrémenté |
| RoleId | NVARCHAR(450) | NO | FK → AspNetRoles |
| ClaimType | NVARCHAR(MAX) | YES | Type de claim |
| ClaimValue | NVARCHAR(MAX) | YES | Valeur du claim |

### AspNetUserLogins

Logins externes (OAuth : Google, Facebook, etc.).

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| **LoginProvider** | NVARCHAR(450) | NO | PK - Fournisseur |
| **ProviderKey** | NVARCHAR(450) | NO | PK - Clé |
| ProviderDisplayName | NVARCHAR(MAX) | YES | Nom d'affichage |
| UserId | NVARCHAR(450) | NO | FK → AspNetUsers |

### AspNetUserTokens

Tokens d'authentification.

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| **UserId** | NVARCHAR(450) | NO | PK, FK → AspNetUsers |
| **LoginProvider** | NVARCHAR(450) | NO | PK - Fournisseur |
| **Name** | NVARCHAR(450) | NO | PK - Nom du token |
| Value | NVARCHAR(MAX) | YES | Valeur du token |

---

## 🚢 Tables métiers

### Destinations

Destinations nautiques disponibles.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| Name | NVARCHAR(200) | NO | - | Nom destination |
| Region | NVARCHAR(200) | NO | - | Région |
| Country | NVARCHAR(100) | NO | - | Pays |
| Description | NVARCHAR(MAX) | YES | - | Description |
| Image | NVARCHAR(500) | YES | - | URL image |
| AveragePrice | DECIMAL(10,2) | NO | 0 | Prix moyen |
| PopularMonths | NVARCHAR(500) | YES | - | Mois populaires (JSON) |
| Highlights | NVARCHAR(MAX) | YES | - | Points d'intérêt (JSON) |
| BoatCount | INT | NO | 0 | Nombre de bateaux |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date création |
| UpdatedAt | DATETIME2(7) | YES | - | Date modification |

**Index :**
- `IX_Destinations_Country`
- `IX_Destinations_Region`

### Boats

Bateaux disponibles à la location.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| Name | NVARCHAR(200) | NO | - | Nom du bateau |
| Type | NVARCHAR(50) | NO | - | Type (sailboat/catamaran/motor/semirigid) |
| Location | NVARCHAR(200) | NO | - | Localisation |
| City | NVARCHAR(200) | NO | - | Ville |
| DestinationId | INT | YES | - | FK → Destinations |
| Country | NVARCHAR(100) | NO | - | Pays |
| Price | DECIMAL(10,2) | NO | - | Prix par jour (€) |
| Capacity | INT | NO | - | Capacité (personnes) |
| Cabins | INT | NO | 0 | Nombre de cabines |
| Length | DECIMAL(5,2) | NO | - | Longueur (mètres) |
| Year | INT | NO | - | Année de construction |
| Image | NVARCHAR(500) | YES | - | URL image principale |
| Rating | DECIMAL(3,2) | NO | 0 | Note moyenne (0-5) |
| ReviewCount | INT | NO | 0 | Nombre d'avis |
| Equipment | NVARCHAR(MAX) | YES | - | Équipements (JSON array) |
| Description | NVARCHAR(MAX) | YES | - | Description |
| **OwnerId** | NVARCHAR(450) | NO | - | FK → AspNetUsers |
| IsActive | BIT | NO | 1 | Bateau actif |
| IsVerified | BIT | NO | 0 | Bateau vérifié |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date création |
| UpdatedAt | DATETIME2(7) | YES | - | Date modification |

**Index :**
- `IX_Boats_OwnerId`
- `IX_Boats_Type`
- `IX_Boats_Location`
- `IX_Boats_DestinationId`
- `IX_Boats_Price`
- `IX_Boats_IsActive`

**Contraintes :**
- CHECK: Type IN ('sailboat', 'catamaran', 'motor', 'semirigid')

### Bookings

Réservations de bateaux.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | NVARCHAR(50) | NO | - | PK - Format BK{timestamp} |
| **BoatId** | INT | NO | - | FK → Boats |
| **RenterId** | NVARCHAR(450) | NO | - | FK → AspNetUsers |
| StartDate | DATE | NO | - | Date de départ |
| EndDate | DATE | NO | - | Date de retour |
| Days | INT | - | COMPUTED | Nombre de jours (calculé) |
| DailyPrice | DECIMAL(10,2) | NO | - | Prix journalier |
| Subtotal | DECIMAL(10,2) | NO | - | Sous-total |
| ServiceFee | DECIMAL(10,2) | NO | - | Frais de service |
| TotalPrice | DECIMAL(10,2) | NO | - | Prix total |
| Status | NVARCHAR(50) | NO | 'pending' | Statut réservation |
| RenterName | NVARCHAR(256) | NO | - | Nom locataire |
| RenterEmail | NVARCHAR(256) | NO | - | Email locataire |
| RenterPhone | NVARCHAR(50) | YES | - | Téléphone locataire |
| PaymentIntentId | NVARCHAR(200) | YES | - | ID Stripe |
| PaymentStatus | NVARCHAR(50) | NO | 'pending' | Statut paiement |
| PaidAt | DATETIME2(7) | YES | - | Date paiement |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date création |
| UpdatedAt | DATETIME2(7) | YES | - | Date modification |
| CancelledAt | DATETIME2(7) | YES | - | Date annulation |

**Index :**
- `IX_Bookings_BoatId`
- `IX_Bookings_RenterId`
- `IX_Bookings_Status`
- `IX_Bookings_StartDate`
- `IX_Bookings_EndDate`
- `IX_Bookings_CreatedAt`

**Contraintes :**
- CHECK: Status IN ('pending', 'confirmed', 'completed', 'cancelled')
- CHECK: PaymentStatus IN ('pending', 'succeeded', 'failed', 'refunded')

### Reviews

Avis sur les bateaux.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| **BoatId** | INT | NO | - | FK → Boats |
| BookingId | NVARCHAR(50) | YES | - | FK → Bookings |
| **UserId** | NVARCHAR(450) | NO | - | FK → AspNetUsers |
| UserName | NVARCHAR(256) | NO | - | Nom utilisateur |
| UserAvatar | NVARCHAR(500) | YES | - | Avatar utilisateur |
| Rating | INT | NO | - | Note (1-5) |
| Comment | NVARCHAR(MAX) | YES | - | Commentaire |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date création |
| UpdatedAt | DATETIME2(7) | YES | - | Date modification |

**Index :**
- `IX_Reviews_BoatId`
- `IX_Reviews_UserId`
- `IX_Reviews_BookingId`
- `IX_Reviews_CreatedAt`

**Contraintes :**
- CHECK: Rating >= 1 AND Rating <= 5

### BoatImages

Images supplémentaires des bateaux.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| **BoatId** | INT | NO | - | FK → Boats |
| ImageUrl | NVARCHAR(500) | NO | - | URL image |
| Caption | NVARCHAR(500) | YES | - | Légende |
| DisplayOrder | INT | NO | 0 | Ordre d'affichage |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date ajout |

**Index :**
- `IX_BoatImages_BoatId`

### BoatAvailability

Disponibilités des bateaux (périodes bloquées).

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| **BoatId** | INT | NO | - | FK → Boats |
| StartDate | DATE | NO | - | Date début |
| EndDate | DATE | NO | - | Date fin |
| IsAvailable | BIT | NO | 1 | Disponible |
| Reason | NVARCHAR(500) | YES | - | Raison (Maintenance, etc.) |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date création |

**Index :**
- `IX_BoatAvailability_BoatId`
- `IX_BoatAvailability_Dates` (StartDate, EndDate)

### UserDocuments

Documents des utilisateurs (permis, ID, etc.).

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| **UserId** | NVARCHAR(450) | NO | - | FK → AspNetUsers |
| DocumentType | NVARCHAR(100) | NO | - | Type document |
| DocumentUrl | NVARCHAR(500) | NO | - | URL document |
| FileName | NVARCHAR(256) | NO | - | Nom fichier |
| FileSize | BIGINT | NO | - | Taille (bytes) |
| IsVerified | BIT | NO | 0 | Document vérifié |
| VerifiedAt | DATETIME2(7) | YES | - | Date vérification |
| VerifiedBy | NVARCHAR(450) | YES | - | FK → AspNetUsers (admin) |
| UploadedAt | DATETIME2(7) | NO | GETUTCDATE() | Date upload |

**Index :**
- `IX_UserDocuments_UserId`
- `IX_UserDocuments_DocumentType`

### Messages

Messages entre propriétaires et locataires.

| Colonne | Type | Null | Default | Description |
|---------|------|------|---------|-------------|
| **Id** | INT IDENTITY | NO | - | PK - Auto-incrémenté |
| **SenderId** | NVARCHAR(450) | NO | - | FK → AspNetUsers |
| **ReceiverId** | NVARCHAR(450) | NO | - | FK → AspNetUsers |
| BookingId | NVARCHAR(50) | YES | - | FK → Bookings |
| BoatId | INT | YES | - | FK → Boats |
| Subject | NVARCHAR(500) | YES | - | Sujet |
| Content | NVARCHAR(MAX) | NO | - | Contenu |
| IsRead | BIT | NO | 0 | Message lu |
| ReadAt | DATETIME2(7) | YES | - | Date lecture |
| CreatedAt | DATETIME2(7) | NO | GETUTCDATE() | Date envoi |

**Index :**
- `IX_Messages_SenderId`
- `IX_Messages_ReceiverId`
- `IX_Messages_BookingId`
- `IX_Messages_CreatedAt`

---

## 📊 Diagramme des relations

### Relations principales

```
AspNetUsers (1) ─────< (N) Boats
     │                   │
     │                   │
     │                   ├───< (N) BoatImages
     │                   │
     │                   ├───< (N) BoatAvailability
     │                   │
     │                   └───> (1) Destinations
     │
     │
     ├───< (N) Bookings ───┐
     │         │            │
     │         │            │
     │         └───< (N) Reviews
     │                      │
     │                      │
     ├─────────────────────┘
     │
     │
     ├───< (N) UserDocuments
     │
     │
     └───< (N) Messages (Sender/Receiver)
```

### Clés étrangères détaillées

| Table | Colonne | Référence | Cascade |
|-------|---------|-----------|---------|
| Boats | OwnerId | AspNetUsers.Id | - |
| Boats | DestinationId | Destinations.Id | SET NULL |
| Bookings | BoatId | Boats.Id | - |
| Bookings | RenterId | AspNetUsers.Id | - |
| Reviews | BoatId | Boats.Id | CASCADE |
| Reviews | UserId | AspNetUsers.Id | - |
| Reviews | BookingId | Bookings.Id | - |
| BoatImages | BoatId | Boats.Id | CASCADE |
| BoatAvailability | BoatId | Boats.Id | CASCADE |
| UserDocuments | UserId | AspNetUsers.Id | CASCADE |
| UserDocuments | VerifiedBy | AspNetUsers.Id | - |
| Messages | SenderId | AspNetUsers.Id | - |
| Messages | ReceiverId | AspNetUsers.Id | - |
| Messages | BookingId | Bookings.Id | - |
| Messages | BoatId | Boats.Id | - |

---

## 🔍 Vues

### vw_OwnerStats

Statistiques agrégées par propriétaire.

| Colonne | Type | Description |
|---------|------|-------------|
| OwnerId | NVARCHAR(450) | ID propriétaire |
| OwnerName | NVARCHAR(256) | Nom propriétaire |
| BoatCount | INT | Nombre de bateaux |
| BookingCount | INT | Nombre de réservations |
| TotalRevenue | DECIMAL | Revenus totaux |
| AverageRating | DECIMAL | Note moyenne |

### vw_RenterStats

Statistiques agrégées par locataire.

| Colonne | Type | Description |
|---------|------|-------------|
| RenterId | NVARCHAR(450) | ID locataire |
| RenterName | NVARCHAR(256) | Nom locataire |
| BookingCount | INT | Nombre de réservations |
| TotalSpent | DECIMAL | Dépenses totales |
| ReviewCount | INT | Nombre d'avis donnés |

### vw_BookingDetails

Détails complets des réservations (JOIN multiple).

| Colonne | Type | Description |
|---------|------|-------------|
| BookingId | NVARCHAR(50) | ID réservation |
| Status | NVARCHAR(50) | Statut |
| StartDate | DATE | Date départ |
| EndDate | DATE | Date retour |
| Days | INT | Nombre de jours |
| TotalPrice | DECIMAL | Prix total |
| ServiceFee | DECIMAL | Frais service |
| BoatId | INT | ID bateau |
| BoatName | NVARCHAR(200) | Nom bateau |
| BoatType | NVARCHAR(50) | Type bateau |
| BoatImage | NVARCHAR(500) | Image bateau |
| OwnerId | NVARCHAR(450) | ID propriétaire |
| OwnerName | NVARCHAR(256) | Nom propriétaire |
| RenterId | NVARCHAR(450) | ID locataire |
| RenterName | NVARCHAR(256) | Nom locataire |

---

## ⚙️ Procédures stockées

### sp_UpdateBoatRating

Met à jour la note moyenne et le nombre d'avis d'un bateau.

**Paramètres :**
- `@BoatId INT` - ID du bateau

**Logique :**
- Calcule AVG(Rating) et COUNT(*) depuis Reviews
- Met à jour Boats.Rating et Boats.ReviewCount
- Met à jour Boats.UpdatedAt

### sp_UpdateDestinationBoatCount

Met à jour le nombre de bateaux actifs pour une destination.

**Paramètres :**
- `@DestinationId INT` - ID de la destination

**Logique :**
- Compte les bateaux WHERE DestinationId = @DestinationId AND IsActive = 1
- Met à jour Destinations.BoatCount
- Met à jour Destinations.UpdatedAt

---

## 🔔 Triggers

### tr_Reviews_AfterInsert

**Table :** Reviews  
**Événement :** AFTER INSERT  
**Action :** Appelle sp_UpdateBoatRating pour le bateau concerné

### tr_Boats_AfterInsertUpdate

**Table :** Boats  
**Événement :** AFTER INSERT, UPDATE  
**Action :** Appelle sp_UpdateDestinationBoatCount pour toutes les destinations affectées

---

## 📏 Tailles et limites

| Type de données | Taille max | Usage |
|-----------------|------------|-------|
| NVARCHAR(50) | 50 caractères | Types, statuts courts |
| NVARCHAR(256) | 256 caractères | Noms, emails |
| NVARCHAR(500) | 500 caractères | URLs, légendes |
| NVARCHAR(MAX) | 2 GB | Descriptions, JSON, commentaires |
| DECIMAL(10,2) | 99 999 999.99 | Prix, montants |
| DECIMAL(3,2) | 9.99 | Notes (0.00 - 5.00) |
| DECIMAL(5,2) | 999.99 | Longueur bateaux (mètres) |

---

## 🎯 Optimisations

### Index stratégiques

- **Recherche de bateaux** : Type, Location, Price, DestinationId
- **Filtrage réservations** : Status, StartDate, EndDate, RenterId
- **Authentification** : NormalizedUserName, NormalizedEmail
- **Performances** : CreatedAt pour les listes chronologiques

### Colonnes calculées

- `Bookings.Days` : PERSISTED (pré-calculé et stocké)

### Triggers automatiques

- Mise à jour automatique des notes
- Mise à jour automatique des compteurs

---

## 💾 Stockage estimé

| Table | Lignes (init) | Lignes (1 an) | Taille estimée |
|-------|---------------|---------------|----------------|
| AspNetUsers | 5 | 10 000 | ~5 MB |
| Boats | 14 | 1 000 | ~2 MB |
| Bookings | 3 | 50 000 | ~25 MB |
| Reviews | 10 | 30 000 | ~15 MB |
| Messages | 0 | 100 000 | ~50 MB |
| **Total** | - | - | **~100 MB** |

---

## ✅ Checklist de validation

- [ ] Toutes les tables Identity créées
- [ ] Toutes les FK configurées
- [ ] Tous les index créés
- [ ] Tous les CHECK constraints valides
- [ ] Toutes les vues fonctionnelles
- [ ] Toutes les procédures testées
- [ ] Tous les triggers activés
- [ ] Données de test insérées
- [ ] Connection string configurée
- [ ] EF Core migrations synchronisées

---

Ce schéma représente une base de données **production-ready** pour l'application SailingLoc ! 🚀
