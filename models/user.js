const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_member: { type: Boolean, required: true },
  is_admin: { type: Boolean, required: true },
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

exports.module = new mongoose.model("User", UserSchema);
