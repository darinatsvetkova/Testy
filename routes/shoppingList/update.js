const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.put("/", async (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.id) {
    return res.status(400).json({
      uuAppErrorMap: { invalidDtoIn: "Chybí ID seznamu" }
    });
  }

  try {
    const shoppingList = await ShoppingList.findById(dtoIn.id);  // Najdeme seznam podle ID

    if (!shoppingList) {
      return res.status(404).json({ error: "Seznam nenalezen" });
    }

    shoppingList.name = dtoIn.name || shoppingList.name;
    shoppingList.members = dtoIn.members || shoppingList.members;

    await shoppingList.save();  

    res.json({ shoppingList, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({
      error: "Chyba serveru",
      details: err.toString()
    });
  }
});

module.exports = router;
