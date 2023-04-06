const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_member: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

UserSchema.virtual("url").get(function () {
  return `/home/user/${this._id}`;
});

module.exports = new mongoose.model("User", UserSchema);
