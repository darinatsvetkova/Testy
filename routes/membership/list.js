const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.get("/:listId", async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Seznam nenalezen" });
    }

    res.json({ members: shoppingList.members, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;

