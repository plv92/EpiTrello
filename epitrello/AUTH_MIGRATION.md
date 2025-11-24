# Migration de Clerk vers Authentification Locale

## ✅ Migration complétée

L'application a été migrée de Clerk vers un système d'authentification local basé sur Prisma, JWT et bcrypt.

## 📋 Changements effectués

### 1. **Schéma de base de données (Prisma)**
Ajout des modèles :
- `User` : Utilisateurs avec email/password
- `Organization` : Organisations
- `OrganizationMember` : Relation entre utilisateurs et organisations
- `Session` : Gestion des sessions avec JWT

### 2. **Authentification**
- **Inscription** : `/sign-up` - Création de compte avec nom, email et mot de passe
- **Connexion** : `/sign-in` - Authentification par email/mot de passe
- **Déconnexion** : Via le UserButton dans la navbar
- **Sessions** : Gérées par JWT avec cookies HTTP-only

### 3. **Composants remplacés**
- `UserButton` de Clerk → Composant custom (`/components/user-button.tsx`)
- `OrganizationSwitcher` → Composant custom (`/components/organization-switcher.tsx`)
- `OrganizationList` → Page custom (`/app/(auth)/select-org/page.tsx`)

### 4. **Middleware**
Remplacement de `authMiddleware` de Clerk par un middleware custom qui :
- Vérifie les tokens JWT
- Protège les routes nécessitant une authentification
- Gère les redirections selon l'état de connexion

## 🚀 Utilisation

### Créer un premier utilisateur

1. Lancez l'application : `npm run dev`
2. Allez sur http://localhost:3000
3. Cliquez sur "Get Epitrello for free" ou allez sur `/sign-up`
4. Remplissez le formulaire d'inscription
5. Vous serez automatiquement connecté et redirigé vers `/select-org`

### Créer une organisation

Après connexion :
1. Vous arrivez sur `/select-org`
2. Remplissez le formulaire "Créer une organisation"
3. Vous êtes redirigé vers le dashboard de l'organisation

### Se déconnecter

Cliquez sur votre avatar en haut à droite, puis "Déconnexion"

## 🔐 Sécurité

### Variables d'environnement

Ajoutez dans votre `.env` :

```env
# JWT Secret (générez une clé aléatoire forte)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

**⚠️ IMPORTANT** : Générez une clé secrète forte pour la production !

```bash
# Générer une clé aléatoire (Linux/Mac)
openssl rand -base64 32
```

### Mots de passe

- Hashés avec bcrypt (10 rounds)
- Minimum 6 caractères requis
- Stockés de manière sécurisée dans PostgreSQL

### Sessions

- Tokens JWT signés avec HS256
- Expiration : 7 jours
- Cookies HTTP-only, Secure en production
- Stockage en base de données pour invalidation

## 📁 Structure des fichiers

```
actions/
  sign-in/index.ts          # Action de connexion
  sign-up/index.ts          # Action d'inscription
  sign-out/index.ts         # Action de déconnexion
  create-organization/      # Création d'organisation

app/
  (auth)/
    sign-in/page.tsx        # Page de connexion
    sign-up/page.tsx        # Page d'inscription
    select-org/page.tsx     # Sélection d'organisation

components/
  user-button.tsx           # Menu utilisateur
  organization-switcher.tsx # Sélecteur d'organisation

lib/
  auth.ts                   # Fonctions d'authentification
    - encrypt()             # Chiffrement JWT
    - decrypt()             # Déchiffrement JWT
    - getSession()          # Récupération de session
    - getCurrentUser()      # Utilisateur actuel
    - auth()                # Context d'authentification

middleware.ts               # Protection des routes
```

## 🔄 Migration depuis Clerk

Tous les imports de Clerk ont été remplacés :

```typescript
// Avant (Clerk)
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

// Après (Custom)
import { auth } from "@/lib/auth";
import { UserButton } from "@/components/user-button";
```

## 🧪 Test de l'application

1. **Créer un utilisateur** :
   - Email : `test@example.com`
   - Password : `password123`

2. **Créer une organisation** :
   - Nom : `Mon Équipe`

3. **Créer un board** :
   - Cliquez sur "Create" dans la navbar
   - Sélectionnez une image
   - Donnez un titre

## ⚙️ API Endpoints

### POST `/api/set-organization`
Change l'organisation active de l'utilisateur

Body :
```json
{
  "organizationId": "uuid"
}
```

## 📝 Notes

- Les boards sont liés à `orgId` (ID d'organisation) comme avant
- L'audit log utilise `userId` et `orgId` comme avant
- Compatible avec la structure existante des boards/lists/cards

## 🐛 Debugging

Si vous avez des problèmes :

1. **Vérifier la base de données** :
   ```bash
   npx prisma studio
   ```

2. **Régénérer le client Prisma** :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Vérifier les cookies** :
   - Ouvrir DevTools → Application → Cookies
   - Vérifier la présence de `session` et `currentOrgId`

4. **Logs** :
   - Les erreurs d'authentification sont loggées dans la console serveur
