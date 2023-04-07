const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message_body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

MessageSchema.virtual("url").get(function () {
  return `/home/message/${this._id}`;
});

MessageSchema.virtual("formatted_timestamp").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString({
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
});

MessageSchema.virtual("iso_timestamp").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

module.exports = new mongoose.model("Message", MessageSchema);
