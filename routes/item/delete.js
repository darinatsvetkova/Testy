const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.post("/", async (req, res) => {
  const { listId, itemId } = req.body;

  if (!listId || !itemId) {
    return res.status(400).json({
      uuAppErrorMap: { invalidDtoIn: "Chybí listId nebo itemId" }
    });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) return res.status(404).json({ error: "Seznam nenalezen" });

    shoppingList.items = shoppingList.items.filter(i => i.id !== itemId);
    await shoppingList.save();

    res.json({ items: shoppingList.items, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;

