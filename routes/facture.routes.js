const {
  generateFacture,
  saveFacture,
  getFacture
} = require("../controller/facture.controller");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set the maximum file size to 10MB (adjust as needed)
  },
});
module.exports = function (app) {
  app.post("/api/facture", generateFacture);
  app.post("/api/saveFacture", upload.single("document"), saveFacture);
  app.get("/api/getFacture", getFacture);
};
