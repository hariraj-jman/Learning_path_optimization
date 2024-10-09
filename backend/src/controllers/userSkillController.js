const prisma = require("../../prismaClient");

/**
 * Get all skills for a user
 */
const getUserSkills = async (req, res) => {
  const { userId } = req.user; // Assuming `req.user` contains authenticated user's info

  try {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: userId },
      include: { skill: true },
      take: 5, // Limit the number of results to 5
    });
    res.status(200).json(userSkills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Add a skill to user
 */
const addUserSkill = async (req, res) => {
  const { userId } = req.user; // Assuming `req.user` contains authenticated user's info
  const { skillId, proficiencyLevel } = req.body;

  try {
    // Check if the skill already exists for the user
    const existingSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: { userId: userId, skillId: skillId },
      },
    });

    if (existingSkill) {
      return res.status(400).json({ error: "Skill already added." });
    }

    const newUserSkill = await prisma.userSkill.create({
      data: {
        userId: userId,
        skillId: skillId,
        proficiencyLevel: proficiencyLevel,
      },
    });

    res.status(201).json(newUserSkill);
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete a user's skill
 */
const deleteUserSkill = async (req, res) => {
  const { userId } = req.user; // Assuming `req.user` contains authenticated user's info
  const { skillId } = req.params;

  try {
    await prisma.userSkill.deleteMany({
      where: {
        userId: userId,
        skillId: parseInt(skillId),
      },
    });

    res.status(200).json({ message: "Skill deleted successfully." });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getUserSkills,
  addUserSkill,
  deleteUserSkill,
};
