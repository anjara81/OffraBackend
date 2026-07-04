const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const password = '1234';
  const nom = 'Admin';

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });

  if (existingAdmin) {
    console.log('⚠️  Un admin existe déjà avec cet email :', email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      nom,
      email,
      password: hashedPassword
    }
  });

  console.log('✅ Admin créé avec succès :');
  console.log({ id: admin.id, nom: admin.nom, email: admin.email });
  console.log('🔑 Mot de passe (non hashé, pour te connecter) :', password);
}

main()
  .catch((error) => {
    console.error('❌ Erreur lors du seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });