const { Users, validate } = require("../model/user-model");
const multer = require("multer");
const upload = multer();

const router = require("express").Router();

// Multer configuration for handling profile image uploads
const storage = multer.memoryStorage();
// const profileImageUpload = multer({ storage: storage }).single("profileImage");

const upload = multer({ storage: storage });

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

    const userData = new Users(user);
    userData
      .save()
      .then((doc) => {
        res.json({ msg: "Users data saved successfully", user: doc });
      })
      .catch((err) => {
        console.error(err);
        res
          .status(405)
          .json({ error: "Error saving user to database", info: err });
      });
  });
});

router.get("/profileImage/:userId", async (req, res) => {
  try {
    const user = await Users.findById({ _id: req.params.userId });

    if (!user || !user.profileImage) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
