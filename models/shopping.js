const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  archived: { type: Boolean, default: false },
  members: { type: [String], default: [] },
  items: [{
    name: String,
    completed: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
