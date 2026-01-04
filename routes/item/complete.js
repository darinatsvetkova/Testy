const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.post("/", async (req, res) => {
  const { listId, itemId } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) return res.status(404).json({ error: "Seznam nenalezen" });

    const item = shoppingList.items.find(i => i.id === itemId);
    if (!item) return res.status(404).json({ error: "Položka nenalezena" });

    item.completed = true;
    await shoppingList.save();

    res.json({ item, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;

