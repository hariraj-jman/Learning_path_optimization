// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const main = async () => {
  console.log("📋 Seeding database...");

  // Seed Skills
  const skillsData = [
    { name: 'JavaScript', description: 'Programming language' },
    { name: 'React', description: 'Frontend library' },
    { name: 'Node.js', description: 'Backend runtime' },
    { name: 'CSS', description: 'Styling language' },
    { name: 'SQL', description: 'Database language' },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
    console.log(`✅ Seeded Skill: ${skill.name}`);
  }

  // Seed Users
  const usersData = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'ADMIN',
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'EMPLOYEE',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      role: 'EMPLOYEE',
    },
  ];

  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: hashedPassword, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
    console.log(`✅ Seeded User: ${user.email}`);
  }

  // Seed Courses
  const coursesData = [
    { title: 'Introduction to JavaScript', duration: 120, difficultyLevel: 'EASY' },
    { title: 'Advanced React', duration: 180, difficultyLevel: 'HARD' },
    { title: 'Node.js Basics', duration: 150, difficultyLevel: 'MEDIUM' },
    { title: 'CSS Flexbox and Grid', duration: 90, difficultyLevel: 'EASY' },
    { title: 'SQL for Beginners', duration: 200, difficultyLevel: 'MEDIUM' },
  ];

  for (const course of coursesData) {
    await prisma.course.upsert({
      where: { title: course.title },
      update: {},
      create: course,
    });
    console.log(`✅ Seeded Course: ${course.title}`);
  }

  // Seed Learning Paths
  const learningPathsData = [
    {
      title: 'Full Stack JavaScript Developer',
      description: 'Become a proficient full stack developer using JavaScript technologies.',
      courseTitles: [
        'Introduction to JavaScript',
        'Advanced React',
        'Node.js Basics',
        'CSS Flexbox and Grid',
        'SQL for Beginners',
      ],
    },
    // Add more learning paths if needed
  ];

  for (const path of learningPathsData) {
    const existingPath = await prisma.learningPath.findFirst({
      where: { title: path.title },
    });

    if (!existingPath) {
      const newPath = await prisma.learningPath.create({
        data: {
          title: path.title,
          description: path.description,
        },
      });
      console.log(`✅ Created Learning Path: ${path.title}`);

      for (let i = 0; i < path.courseTitles.length; i++) {
        const course = await prisma.course.findUnique({
          where: { title: path.courseTitles[i] },
        });

        if (course) {
          await prisma.learningPathCourse.upsert({
            where: {
              learningPathId_courseId: {
                learningPathId: newPath.id,
                courseId: course.id,
              },
            },
            update: { order: i + 1 },
            create: {
              learningPathId: newPath.id,
              courseId: course.id,
              order: i + 1,
            },
          });
          console.log(`✅ Associated Course: ${course.title} with Learning Path: ${path.title}`);
        } else {
          console.log(`⚠️ Course not found: ${path.courseTitles[i]}`);
        }
      }
    } else {
      console.log(`⚠️ Learning Path already exists: ${path.title}`);
    }
  }

  console.log("🎉 Seeding completed successfully.");
};

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
