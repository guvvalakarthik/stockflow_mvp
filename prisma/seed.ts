/**
 * Local demo user — passwords in the DB are bcrypt hashes and cannot be "read back".
 * Run: npx prisma db seed
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma";

const DEMO_EMAIL = "demo@stockflow.local";
const DEMO_PASSWORD = "DemoPass123!";
const ORG_NAME = "Demo Store";

async function main() {
  const prisma = new PrismaClient();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (existing) {
    await prisma.user.update({
      where: { email: DEMO_EMAIL },
      data: { passwordHash },
    });
    console.log(`Updated password for existing user: ${DEMO_EMAIL}`);
  } else {
    await prisma.organization.create({
      data: {
        name: ORG_NAME,
        users: {
          create: {
            email: DEMO_EMAIL,
            passwordHash,
          },
        },
      },
    });
    console.log(`Created demo org "${ORG_NAME}" and user: ${DEMO_EMAIL}`);
  }

  console.log("\n  Login (local demo only):");
  console.log(`    Email:    ${DEMO_EMAIL}`);
  console.log(`    Password: ${DEMO_PASSWORD}\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
