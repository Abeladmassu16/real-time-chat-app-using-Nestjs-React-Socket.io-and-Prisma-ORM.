/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const general = await prisma.room.upsert({
    where: { name: 'general' },
    update: {},
    create: { name: 'general' }
  });
  console.log('[seed] ensured default room:', general.name);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
