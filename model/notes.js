const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    Date: {
      type: Date,
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ─── Feature 1: Note Categories/Tags ──────────────────────────────
    tag: {
      type: String,
      enum: ["Work", "Personal", "Study", "Other"],
      default: "Other"
    },

    // ─── Feature 2: Pin Important Notes ───────────────────────────────
    pinned: {
      type: Boolean,
      default: false
    },

    // ─── Feature 3: Note Colors ────────────────────────────────────────
    color: {
      type: String,
      default: "#ffffff"
    }

   
  },
  {
    timestamps: true   // gives createdAt + updatedAt automatically
  }
);

module.exports = mongoose.model("Note", noteSchema);
