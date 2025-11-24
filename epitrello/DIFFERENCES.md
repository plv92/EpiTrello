# Différences entre Epitrello et Taskify

## Changements principaux

### 1. Branding et identité visuelle

- **Nom**: Taskify → **Epitrello**
- **Couleurs**: 
  - Thème principal: Rouge/Rose → **Violet/Indigo** (262° 83% 58%)
  - Badge: Ambre → **Violet**
  - Dégradé: Fuchsia-Rose → **Violet-Indigo**

### 2. Fonctionnalités supprimées

#### Système de paiement Stripe
- ❌ Intégration Stripe complètement retirée
- ❌ Webhooks de paiement supprimés
- ❌ Actions stripe-redirect supprimées
- ❌ Fichier `lib/stripe.ts` supprimé
- ❌ Route API `/api/webhook` supprimée

#### Système de limitations et abonnements
- ❌ Modal Pro supprimé (`components/modals/pro-modal.tsx`)
- ❌ Hook `use-pro-modal` supprimé
- ❌ Vérification `checkSubscription()` retirée
- ❌ Compteur de boards gratuits supprimé
- ❌ Constante `MAX_FREE_BOARDS` supprimée
- ❌ Fichier `lib/org-limit.ts` supprimé
- ❌ Fichier `lib/subscription.ts` supprimé
- ❌ Page `/billing` supprimée

#### Schéma de base de données
- ❌ Table `OrgLimit` supprimée
- ❌ Table `OrgSubscription` supprimée

Tables conservées:
- ✅ Board
- ✅ List
- ✅ Card
- ✅ AuditLog

### 3. Dépendances NPM

**Supprimé:**
- `stripe` - Package Stripe non nécessaire

**Conservé:**
- `@clerk/nextjs` - Authentification
- `@hello-pangea/dnd` - Drag & drop
- `@prisma/client` - ORM
- `@tanstack/react-query` - Gestion d'état
- `unsplash-js` - Images de fond
- Et toutes les autres dépendances essentielles

### 4. Fonctionnalités conservées

✅ **Authentification complète** avec Clerk
✅ **Gestion des organisations**
✅ **Boards illimités** avec images Unsplash
✅ **Listes avec drag & drop**
✅ **Cartes avec descriptions**
✅ **Réorganisation complète** des cartes et listes
✅ **Journal d'audit** de toutes les actions
✅ **Interface responsive** avec Tailwind CSS
✅ **Tous les composants UI** (dialog, popover, tooltip, etc.)

### 5. Modifications de code

#### Composants mis à jour:
- `components/logo.tsx` - Nom changé en Epitrello
- `components/form/form-popover.tsx` - Logique pro modal retirée
- `components/providers/modal-provider.tsx` - ProModal retiré
- `app/(marketing)/page.tsx` - Texte et couleurs mis à jour
- `app/(marketing)/_components/navbar.tsx` - Texte mis à jour
- `app/(platform)/(dashboard)/organization/[organizationId]/_components/board-list.tsx` - Compteur retiré
- `app/(platform)/(dashboard)/organization/[organizationId]/_components/info.tsx` - Badge Pro/Free retiré
- `app/(platform)/(dashboard)/organization/[organizationId]/page.tsx` - Vérification d'abonnement retirée

#### Actions serveur mises à jour:
- `actions/create-board/index.ts` - Vérifications de limite retirées
- `actions/delete-board/index.ts` - Décompte retiré

### 6. Configuration

**package.json:**
```json
{
  "name": "epitrello"  // au lieu de "taskify"
  // stripe retiré des dépendances
}
```

**config/site.ts:**
```typescript
export const siteConfig = {
    name: "Epitrello",  // au lieu de "Taskify"
    description: "Collaborate, manage projects, and reach new productivity peaks",
};
```

**app/globals.css:**
Nouvelles variables CSS pour le thème violet/indigo

## Avantages d'Epitrello

1. **Simplicité**: Pas de gestion de paiement, focus sur les fonctionnalités essentielles
2. **Pas de limitations**: Utilisez autant de boards que nécessaire
3. **Open source complet**: Aucune fonctionnalité cachée derrière un paywall
4. **Plus léger**: Moins de dépendances = bundle plus petit
5. **Local-first**: Fonctionne entièrement avec votre base de données locale

## Migration depuis Taskify

Si vous avez des données Taskify existantes:

1. Les tables Board, List, Card, et AuditLog sont compatibles
2. Les tables OrgLimit et OrgSubscription peuvent être ignorées
3. Aucune perte de données pour les boards et cartes existants
4. Les images Unsplash restent fonctionnelles

## Cas d'usage idéal

Epitrello est parfait pour:
- 🏢 Équipes internes d'entreprise
- 🎓 Projets éducatifs
- 💻 Usage personnel
- 🚀 Startups en phase de développement
- 🔧 Projets open source

**Pas besoin de:**
- Gérer des abonnements
- Intégrer des paiements
- Limiter les utilisateurs
- Gérer différents plans tarifaires
