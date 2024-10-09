const express = require("express");
const {
  getUserSkills,
  addUserSkill,
  deleteUserSkill,
} = require("../controllers/userSkillController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

/**
 * @route   GET /api/users/skills
 * @desc    Get all skills for the logged-in user
 * @access  Protected
 */
router.get("/", getUserSkills);

/**
 * @route   POST /api/users/skills
 * @desc    Add a new skill to the logged-in user
 * @access  Protected
 */
router.post("/", addUserSkill);

/**
 * @route   DELETE /api/users/skills/:skillId
 * @desc    Delete a skill for the logged-in user
 * @access  Protected
 */
router.delete("/:skillId", deleteUserSkill);

module.exports = router;
