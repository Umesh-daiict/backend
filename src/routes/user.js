const { User, validate } = require("../model/user-model");
const multer = require("multer");
const upload = multer();

const router = require("express").Router();

// Multer configuration for handling profile image uploads
const storage = multer.memoryStorage();
const profileImageUpload = multer({ storage: storage }).single("profileImage");

router.post("/", (req, res) => {
  // Use profileImageUpload middleware to handle the profile image upload
  profileImageUpload(req, res, (err) => {
    if (err) {
      // MulterError: Unexpected field
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "Unexpected field in file upload", data: null });
      }
      // ValidationError: File validation failed
      else if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit", data: null });
      } else {
        console.error("Error uploading file:", err);
        return res
          .status(500)
          .json({ error: "Internal server error", data: null });
      }
    }

    const user = req.body;
    if (req.file) {
      user.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const { error } = validate(user);
    if (error) {
      return res.status(405).json({ error, data: req.body });
    }

    const userData = new User(user);
    userData
      .save()
      .then((doc) => {
        res.json({ msg: "User data saved successfully", user: doc });
      })
      .catch((err) => {
        console.error(err);
        res
          .status(405)
          .json({ error: "Error saving user to database", info: err });
      });
  });
});

module.exports = router;
