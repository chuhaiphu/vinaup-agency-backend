import { PrismaClient, Prisma } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash, genSalt } from 'bcrypt';
import * as crypto from 'crypto';
import { SECTION_METADATA } from 'src/_common/constants/section-metadata';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

async function seedAdmin() {
  console.log('Seeding admin user...');

  // Validate environment variables
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME must be set');
  }

  // Check if admin user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists, skipping...');
    return;
  }

  // Hash password using bcrypt
  const hashedPassword = await hash(password, await genSalt());

  // Create admin user with role 'admin'
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    },
  });

  console.log('Admin user created successfully');
}

async function seedSuperAdmin() {
  console.log('Seeding super admin user...');

  // Validate environment variables
  const email = process.env.SUPADMIN_EMAIL;
  const password = process.env.SUPADMIN_PASSWORD;
  const name = process.env.SUPADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error('SUPADMIN_EMAIL, SUPADMIN_PASSWORD, SUPADMIN_NAME must be set');
  }

  // Check if super admin user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Super admin user already exists, skipping...');
    return;
  }

  // Hash password using bcrypt
  const hashedPassword = await hash(password, await genSalt());

  // Create super admin user with role 'supadmin'
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'supadmin',
    },
  });

  console.log('Super admin user created successfully');
}

async function seedAppConfig() {
  console.log('Seeding app config...');

  // Check if app config already exists
  const existing = await prisma.appConfig.findUnique({
    where: { id: '__singleton__' },
  });

  if (existing) {
    console.log('App config already exists, skipping...');
    return;
  }

  // Create app config with default values
  await prisma.appConfig.create({
    data: {
      id: '__singleton__',
      maintenanceMode: false,
      websiteTitle: 'Jena Hair',
      websiteDescription:
        'Jena Hair is a premium salon brand delivering styling, hair treatment, and personalized beauty services.',
    },
  });

  console.log('App config created successfully');
}

async function seedRootTourCategory() {
  console.log('Seeding root tour category...');

  // Check if root tour category already exists
  const existing = await prisma.tourCategory.findUnique({
    where: { endpoint: '__root__' },
  });

  if (existing) {
    console.log('Root tour category already exists, skipping...');
    return;
  }

  // Create root tour category
  await prisma.tourCategory.create({
    data: {
      title: 'NONE',
      endpoint: '__root__',
      sortOrder: 0,
    },
  });

  console.log('Root tour category created successfully');
}

async function seedRootBlogCategory() {
  console.log('Seeding root blog category...');

  // Check if root blog category already exists
  const existing = await prisma.blogCategory.findUnique({
    where: { endpoint: '__root__' },
  });

  if (existing) {
    console.log('Root blog category already exists, skipping...');
    return;
  }

  // Create root blog category
  await prisma.blogCategory.create({
    data: {
      title: 'NONE',
      endpoint: '__root__',
      sortOrder: 0,
    },
  });

  console.log('Root blog category created successfully');
}

async function seedRootDiaryCategory() {
  console.log('Seeding root diary category...');

  // Check if root diary category already exists
  const existing = await prisma.diaryCategory.findUnique({
    where: { endpoint: '__root__' },
  });

  if (existing) {
    console.log('Root diary category already exists, skipping...');
    return;
  }

  // Create root diary category
  await prisma.diaryCategory.create({
    data: {
      title: 'NONE',
      endpoint: '__root__',
      sortOrder: 0,
    },
  });

  console.log('Root diary category created successfully');
}

async function seedRootMenu() {
  console.log('Seeding root menu...');

  // Check if root menu already exists
  const existing = await prisma.menu.findFirst({
    where: { isRoot: true },
  });

  if (existing) {
    console.log('Root menu already exists, skipping...');
    return;
  }

  // Create root menu item
  await prisma.menu.create({
    data: {
      title: 'NONE',
      isRoot: true,
      sortOrder: 0,
    },
  });

  console.log('Root menu created successfully');
}

async function seedSectionUICredentials() {
  console.log('Seeding section UI credentials from registry...');

  for (const [componentKey, metadata] of Object.entries(SECTION_METADATA)) {
    const existing = await prisma.sectionUICredentials.findFirst({
      where: { componentKey },
    });

    if (!existing) {
      await prisma.sectionUICredentials.create({
        data: {
          code: 'section-ui-' + crypto.randomUUID(),
          componentKey,
          propertyFormat: metadata.properties as Prisma.InputJsonValue,
        },
      });
      console.log(`Section UI credentials "${componentKey}" created successfully`);
    } else {
      console.log(
        `Section UI credentials "${componentKey}" already exists, skipping...`
      );
    }
  }
}

async function main() {
  console.log('Start seeding...');

  await seedAdmin();
  await seedSuperAdmin();
  await seedAppConfig();
  await seedRootTourCategory();
  await seedRootBlogCategory();
  await seedRootDiaryCategory();
  await seedRootMenu();
  await seedSectionUICredentials();

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
