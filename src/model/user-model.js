const Joi = require("joi");
const mongoose = require("mongoose");
const User = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tags: [String],
  joinDate: {
    type: Date,
    default: Date.now,
  },
  onActive: Boolean,
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  extraDoc : [{
    id: { type: Number ,unique: true, required: true},
    data: Buffer,
    contentType: String,
  }]
});

const ValidationUser = function (user) {
  const schema = Joi.object({
    username: Joi.string().max(16).min(5).required().alphanum(),
    password: Joi.string()
      .max(25)
      .min(5)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9,@]{3,30}$")),
    email: Joi.string().max(50).min(5).required().email(),
    tags: Joi.array().items(Joi.string().min(1).max(30).required()),
    joinDate: Joi.date().greater("now").iso(),
    onActive: Joi.boolean().required(),
    profileImage: Joi.object({
      data: Joi.binary().required(),
      contentType: Joi.string().required(),
    }),
    extraDoc: Joi.array().items(
      Joi.object({
        id: Joi.integer().required(),
        data: Joi.binary().required(),
        contentType: Joi.string().required(),
      })
    ),
  });

  return schema.validate(user);
};

exports.validate = ValidationUser;
exports.Users = mongoose.model("Users", User);
