# 🗄️ Base de données SailingLoc - SQL Server

## 📋 Vue d'ensemble

Fichier SQL complet pour créer la base de données **SailingLoc** sur SQL Server, incluant :
- ✅ Tables ASP.NET Identity complètes
- ✅ Tables métiers (Boats, Bookings, Reviews, etc.)
- ✅ Contraintes et index optimisés
- ✅ Vues utiles
- ✅ Procédures stockées
- ✅ Triggers automatiques
- ✅ Données de test

## 🚀 Installation rapide

### 1. Ouvrir SQL Server Management Studio (SSMS)

Lancez **SQL Server Management Studio 21** ou version ultérieure.

### 2. Se connecter au serveur

Connectez-vous à votre instance SQL Server :
- Serveur : `localhost` ou `.\SQLEXPRESS`
- Authentification : Windows ou SQL Server

### 3. Exécuter le script

1. Ouvrir le fichier : **Fichier** > **Ouvrir** > **Fichier...**
2. Sélectionner : `SailingLoc_Database_Complete.sql`
3. Cliquer sur **Exécuter** ou appuyer sur **F5**

⏱️ **Temps d'exécution** : ~10-15 secondes

### 4. Vérifier la création

```sql
USE SailingLoc;
GO

-- Vérifier les tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Vérifier les données
SELECT COUNT(*) AS UserCount FROM AspNetUsers;
SELECT COUNT(*) AS BoatCount FROM Boats;
SELECT COUNT(*) AS BookingCount FROM Bookings;
```

✅ **Résultat attendu** :
- 15+ tables créées
- 5 utilisateurs
- 14 bateaux
- 3 réservations
- 10 avis

## 📊 Structure de la base de données

### Tables ASP.NET Identity

| Table | Description | Lignes |
|-------|-------------|--------|
| **AspNetUsers** | Utilisateurs (étendu avec propriétés métier) | 5 |
| **AspNetRoles** | Rôles (Admin, Owner, Renter) | 3 |
| **AspNetUserRoles** | Association utilisateurs-rôles | 0 |
| **AspNetUserClaims** | Claims des utilisateurs | 0 |
| **AspNetRoleClaims** | Claims des rôles | 0 |
| **AspNetUserLogins** | Logins externes (OAuth) | 0 |
| **AspNetUserTokens** | Tokens d'authentification | 0 |

### Tables métiers

| Table | Description | Lignes |
|-------|-------------|--------|
| **Destinations** | Destinations nautiques | 7 |
| **Boats** | Bateaux disponibles | 14 |
| **Bookings** | Réservations | 3 |
| **Reviews** | Avis sur les bateaux | 10 |
| **BoatImages** | Images supplémentaires des bateaux | 0 |
| **BoatAvailability** | Disponibilités des bateaux | 0 |
| **UserDocuments** | Documents des utilisateurs | 0 |
| **Messages** | Messages entre utilisateurs | 0 |

### Vues

| Vue | Description |
|-----|-------------|
| **vw_OwnerStats** | Statistiques des propriétaires |
| **vw_RenterStats** | Statistiques des locataires |
| **vw_BookingDetails** | Détails complets des réservations |

### Procédures stockées

| Procédure | Description |
|-----------|-------------|
| **sp_UpdateBoatRating** | Met à jour la note moyenne d'un bateau |
| **sp_UpdateDestinationBoatCount** | Met à jour le nombre de bateaux par destination |

### Triggers

| Trigger | Table | Description |
|---------|-------|-------------|
| **tr_Reviews_AfterInsert** | Reviews | Met à jour la note du bateau après ajout d'un avis |
| **tr_Boats_AfterInsertUpdate** | Boats | Met à jour le nombre de bateaux par destination |

## 🔐 Comptes de test

### Format des mots de passe

⚠️ **IMPORTANT** : Les mots de passe dans le script sont des **exemples** avec un hash fictif.

Pour générer de vrais hashs de mots de passe en C# :

```csharp
using Microsoft.AspNetCore.Identity;

var hasher = new PasswordHasher<IdentityUser>();
var hash = hasher.HashPassword(null, "Password123!");
Console.WriteLine(hash);
```

### Comptes disponibles

| Email | Type | Mot de passe | Description |
|-------|------|--------------|-------------|
| `admin@sailingloc.com` | Admin | `Password123!` | Administrateur |
| `jean.dupont@example.com` | Owner | `Password123!` | Propriétaire |
| `marie.martin@example.com` | Owner | `Password123!` | Propriétaire |
| `thomas.petit@example.com` | Renter | `Password123!` | Locataire |
| `sophie.bernard@example.com` | Renter | `Password123!` | Locataire |

## 🔧 Configuration ASP.NET Core

### 1. Connection String

Ajouter dans `appsettings.json` :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SailingLoc;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### 2. Configuration Identity dans Program.cs

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Ajouter DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Ajouter Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Ajouter JWT Authentication
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        )
    };
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
```

### 3. ApplicationUser.cs

```csharp
using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; }
    public string? Avatar { get; set; }
    public string UserType { get; set; } // "renter", "owner", "admin"
    public bool Verified { get; set; }
    public DateTime MemberSince { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### 4. ApplicationDbContext.cs

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Boat> Boats { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Destination> Destinations { get; set; }
    public DbSet<BoatImage> BoatImages { get; set; }
    public DbSet<UserDocument> UserDocuments { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Personnaliser les noms de tables Identity si nécessaire
        builder.Entity<ApplicationUser>().ToTable("AspNetUsers");
        builder.Entity<IdentityRole>().ToTable("AspNetRoles");
        
        // Configurer les relations
        builder.Entity<Boat>()
            .HasOne(b => b.Owner)
            .WithMany()
            .HasForeignKey(b => b.OwnerId);
            
        builder.Entity<Booking>()
            .HasOne(b => b.Boat)
            .WithMany()
            .HasForeignKey(b => b.BoatId);
    }
}
```

## 📝 Requêtes SQL utiles

### Statistiques générales

```sql
-- Vue d'ensemble
SELECT 
    (SELECT COUNT(*) FROM AspNetUsers) AS TotalUsers,
    (SELECT COUNT(*) FROM Boats WHERE IsActive = 1) AS ActiveBoats,
    (SELECT COUNT(*) FROM Bookings) AS TotalBookings,
    (SELECT COUNT(*) FROM Reviews) AS TotalReviews;

-- Répartition des utilisateurs par type
SELECT UserType, COUNT(*) AS Count
FROM AspNetUsers
GROUP BY UserType;

-- Top 5 bateaux les mieux notés
SELECT TOP 5 Id, Name, Rating, ReviewCount, Price
FROM Boats
WHERE IsActive = 1 AND ReviewCount > 0
ORDER BY Rating DESC, ReviewCount DESC;
```

### Revenus par propriétaire

```sql
SELECT * FROM vw_OwnerStats
ORDER BY TotalRevenue DESC;
```

### Réservations récentes

```sql
SELECT TOP 10 *
FROM vw_BookingDetails
ORDER BY CreatedAt DESC;
```

### Disponibilité d'un bateau

```sql
DECLARE @BoatId INT = 1;
DECLARE @StartDate DATE = '2025-06-01';
DECLARE @EndDate DATE = '2025-06-30';

SELECT *
FROM Bookings
WHERE BoatId = @BoatId
  AND Status != 'cancelled'
  AND (
    (StartDate BETWEEN @StartDate AND @EndDate)
    OR (EndDate BETWEEN @StartDate AND @EndDate)
    OR (StartDate <= @StartDate AND EndDate >= @EndDate)
  );
```

## 🔍 Dépannage

### Erreur : Base de données déjà existante

Si vous obtenez une erreur car la base existe déjà :

```sql
-- Option 1 : Supprimer et recréer (ATTENTION : perte de données)
USE master;
GO
ALTER DATABASE SailingLoc SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE SailingLoc;
GO
-- Puis réexécuter le script complet
```

```sql
-- Option 2 : Utiliser une autre base
-- Modifier la ligne 20 du script :
CREATE DATABASE SailingLoc_v2
```

### Erreur : Permissions insuffisantes

Assurez-vous d'avoir les droits :
- `CREATE DATABASE`
- `db_owner` sur la base

### Erreur : Timeout

Si le script timeout :
1. SSMS > **Outils** > **Options** > **Exécution de la requête** > **SQL Server**
2. Augmenter **Délai d'exécution** à 600 secondes

### Mots de passe ne fonctionnent pas

Les hashs de mots de passe dans le script sont des **exemples**.

**Solution** : Créer les utilisateurs via l'API Identity :

```csharp
var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

var admin = new ApplicationUser
{
    UserName = "admin@sailingloc.com",
    Email = "admin@sailingloc.com",
    FullName = "Administrateur SailingLoc",
    UserType = "admin",
    Verified = true
};

await userManager.CreateAsync(admin, "Password123!");
```

## 📊 Schéma des relations

```
AspNetUsers (1) ──┬──< (N) Boats
                  │
                  ├──< (N) Bookings (RenterId)
                  │
                  ├──< (N) Reviews
                  │
                  └──< (N) UserDocuments

Boats (1) ──┬──< (N) Bookings
            │
            ├──< (N) Reviews
            │
            ├──< (N) BoatImages
            │
            └──> (1) Destinations

Bookings (1) ──< (N) Reviews
```

## 🚀 Prochaines étapes

Après avoir créé la base de données :

1. ✅ **Configurer ASP.NET Core** (voir ci-dessus)
2. ✅ **Créer les models C#** correspondants aux tables
3. ✅ **Implémenter les controllers** (Boats, Bookings, Auth, etc.)
4. ✅ **Configurer JWT** pour l'authentification
5. ✅ **Tester avec Postman** ou Swagger
6. ✅ **Connecter React** en changeant le mode dans `/config/apiMode.ts`

## 📚 Ressources

- [ASP.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)

## ✅ Checklist de vérification

Après exécution du script :

- [ ] Base de données créée
- [ ] 15+ tables créées
- [ ] 3 vues créées
- [ ] 2 procédures stockées créées
- [ ] 2 triggers créés
- [ ] 5 utilisateurs insérés
- [ ] 3 rôles insérés
- [ ] 7 destinations insérées
- [ ] 14 bateaux insérés
- [ ] 3 réservations insérées
- [ ] 10 avis insérés
- [ ] Connection string configurée
- [ ] ASP.NET Identity configuré
- [ ] Premiers tests API réussis

## 🎯 Résumé

Vous disposez maintenant d'une **base de données complète et prête pour la production** avec :
- ✅ Authentification ASP.NET Identity
- ✅ Gestion multi-rôles (Admin, Owner, Renter)
- ✅ Tables métiers optimisées
- ✅ Index et contraintes appropriés
- ✅ Triggers automatiques
- ✅ Données de test réalistes

**Prochaine étape** : Créer l'API .NET 8 ! 🚀
