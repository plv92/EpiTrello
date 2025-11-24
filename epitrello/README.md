# Epitrello

Un système de gestion de projet collaboratif inspiré de Trello, développé avec Next.js 14.

## Fonctionnalités

- 🔐 Authentification avec Clerk
- 🏢 Gestion des organisations
- 📋 Boards avec drag & drop
- 📝 Listes et cartes personnalisables
- 🔄 Réorganisation par glisser-déposer
- 📜 Journal d'audit des actions
- 🎨 Images de fond via Unsplash
- 💾 Base de données PostgreSQL avec Prisma

## Technologies utilisées

- **Framework:** Next.js 14
- **Base de données:** PostgreSQL
- **ORM:** Prisma
- **Authentification:** Clerk
- **UI:** Tailwind CSS + Radix UI
- **Drag & Drop:** @hello-pangea/dnd
- **Validation:** Zod

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Initialiser la base de données
npx prisma generate
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Variables d'environnement requises

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Unsplash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```

## Développé par

Projet développé comme alternative locale et simplifiée à Taskify.
