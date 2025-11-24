# Guide d'installation Epitrello

## Prérequis

- Node.js 18+ installé
- PostgreSQL installé et en cours d'exécution
- Compte Clerk (gratuit) pour l'authentification
- Compte Unsplash (gratuit) pour les images

## Étapes d'installation

### 1. Cloner ou copier le projet

Le projet est déjà dans `/home/plv92/Downloads/epitrello`

### 2. Installer les dépendances

```bash
cd /home/plv92/Downloads/epitrello
npm install
```

### 3. Configurer la base de données PostgreSQL

Créez une nouvelle base de données PostgreSQL :

```sql
CREATE DATABASE epitrello;
```

### 4. Configurer les variables d'environnement

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Puis modifiez `.env` avec vos vraies valeurs :

#### Clerk (https://clerk.com)
1. Créez un compte sur clerk.com
2. Créez une nouvelle application
3. Copiez vos clés API dans le `.env`

#### Base de données
Remplacez avec vos informations PostgreSQL :
```
POSTGRES_PRISMA_URL=postgresql://user:password@localhost:5432/epitrello
POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/epitrello
```

#### Unsplash (https://unsplash.com/developers)
1. Créez un compte développeur Unsplash
2. Créez une nouvelle application
3. Copiez votre Access Key dans le `.env`

### 5. Initialiser la base de données avec Prisma

```bash
npx prisma generate
npx prisma db push
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Fonctionnalités principales

✅ Authentification complète avec Clerk
✅ Gestion des organisations
✅ Création de boards avec images Unsplash
✅ Listes avec drag & drop
✅ Cartes avec descriptions
✅ Réorganisation complète drag & drop
✅ Journal d'audit des actions
✅ Interface moderne avec Tailwind CSS

## Pas de limitations

Contrairement à la version Taskify originale, Epitrello n'a **aucune limitation** :
- Nombre illimité de boards
- Pas de système de paiement
- Pas de plan Pro/Free
- Toutes les fonctionnalités accessibles gratuitement

## Structure du projet

```
epitrello/
├── actions/          # Server actions (create, update, delete)
├── app/             # Pages et layouts Next.js
├── components/      # Composants React réutilisables
├── lib/            # Utilitaires et helpers
├── prisma/         # Schéma de base de données
└── public/         # Assets statiques
```

## Dépannage

### Erreur de connexion à la base de données
Vérifiez que PostgreSQL est en cours d'exécution et que les credentials dans `.env` sont corrects.

### Erreur Clerk
Assurez-vous d'avoir configuré les bonnes URLs dans Clerk Dashboard et dans votre `.env`.

### Images Unsplash ne chargent pas
Vérifiez votre clé API Unsplash et assurez-vous qu'elle est valide.
