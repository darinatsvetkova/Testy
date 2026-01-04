const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(id);  
    if (!shoppingList) {
      return res.status(404).json({ error: "Seznam nenalezen" });
    }

    res.json({ shoppingList, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({
      error: "Chyba serveru",
      details: err.toString()
    });
  }
});

module.exports = router;
