import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Créer deux utilisateurs
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@demo.com',
      name: 'Alice Dupont',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@demo.com',
      name: 'Bob Martin',
      password: hashedPassword,
    },
  });

  console.log('✅ Utilisateurs créés:', user1.email, user2.email);

  // Créer une organisation
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Company',
      slug: 'demo-company',
      imageUrl: null,
    },
  });

  console.log('✅ Organisation créée:', org.name);

  // Ajouter les deux users à l'organisation
  await prisma.organizationMember.create({
    data: {
      userId: user1.id,
      organizationId: org.id,
      role: 'ADMIN',
    },
  });

  await prisma.organizationMember.create({
    data: {
      userId: user2.id,
      organizationId: org.id,
      role: 'MEMBER',
    },
  });

  console.log('✅ Membres ajoutés à l\'organisation');

  // Créer un board
  const board = await prisma.board.create({
    data: {
      orgId: org.id,
      title: 'Projet Demo',
      imageId: 'demo',
      imageThumbUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
      imageFullUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600',
      imageUserName: 'Unsplash',
      imageLinkHTML: 'https://unsplash.com',
    },
  });

  console.log('✅ Board créé:', board.title);

  // Créer des listes
  const list1 = await prisma.list.create({
    data: {
      boardId: board.id,
      title: 'À faire',
      order: 0,
    },
  });

  const list2 = await prisma.list.create({
    data: {
      boardId: board.id,
      title: 'En cours',
      order: 1,
    },
  });

  const list3 = await prisma.list.create({
    data: {
      boardId: board.id,
      title: 'Terminé',
      order: 2,
    },
  });

  console.log('✅ Listes créées');

  // Créer des cartes
  const card1 = await prisma.card.create({
    data: {
      listId: list1.id,
      title: 'Préparer la présentation',
      description: 'Créer les slides pour la réunion client',
      order: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
    },
  });

  const card2 = await prisma.card.create({
    data: {
      listId: list2.id,
      title: 'Développer la nouvelle fonctionnalité',
      description: 'Implémenter le système d\'authentification',
      order: 0,
    },
  });

  const card3 = await prisma.card.create({
    data: {
      listId: list3.id,
      title: 'Configurer la base de données',
      order: 0,
      isCompleted: true,
    },
  });

  console.log('✅ Cartes créées');

  // Assigner des cartes aux utilisateurs
  await prisma.cardAssignee.create({
    data: {
      cardId: card1.id,
      userId: user1.id,
    },
  });

  await prisma.cardAssignee.create({
    data: {
      cardId: card2.id,
      userId: user2.id,
    },
  });

  await prisma.cardAssignee.create({
    data: {
      cardId: card2.id,
      userId: user1.id,
    },
  });

  console.log('✅ Assignations créées');

  // Ajouter des labels
  await prisma.cardLabel.create({
    data: {
      cardId: card1.id,
      name: 'Urgent',
      color: '#ef4444',
    },
  });

  await prisma.cardLabel.create({
    data: {
      cardId: card2.id,
      name: 'En développement',
      color: '#3b82f6',
    },
  });

  console.log('✅ Labels ajoutés');

  // Ajouter une checklist
  await prisma.checklistItem.create({
    data: {
      cardId: card1.id,
      title: 'Créer le template',
      order: 0,
      isCompleted: true,
    },
  });

  await prisma.checklistItem.create({
    data: {
      cardId: card1.id,
      title: 'Ajouter les graphiques',
      order: 1,
      isCompleted: false,
    },
  });

  await prisma.checklistItem.create({
    data: {
      cardId: card1.id,
      title: 'Relire le contenu',
      order: 2,
      isCompleted: false,
    },
  });

  console.log('✅ Checklist ajoutée');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('\n📋 Comptes démo :');
  console.log('   👤 Alice: alice@demo.com');
  console.log('   👤 Bob: bob@demo.com');
  console.log('   🔑 Password: password123');
  console.log('\n🏢 Organisation: Demo Company');
  console.log('📊 Board: Projet Demo');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
