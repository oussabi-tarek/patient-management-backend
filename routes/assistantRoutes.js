const express = require("express");
const router = express.Router();
const {
  registerAssistant,
  loginAssistant,
  getMe,
} = require("../controllers/assistantConroller");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerAssistant);
router.post("/login", loginAssistant);
router.get("/me", protect, getMe);
router.get("/",(req,res)=>{
  res.send('hello again')
})

module.exports = router;
