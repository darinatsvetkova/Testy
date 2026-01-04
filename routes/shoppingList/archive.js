const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping"); // Import modelu

// Endpoint pro archivování seznamu
router.put("/", async (req, res) => {
  const dtoIn = req.body; // { id: "...", archive: true }

  if (!dtoIn.id || dtoIn.archive === undefined) {
    return res.status(400).json({
      uuAppErrorMap: { invalidDtoIn: "Chybí id nebo archive" }
    });
  }

  try {
    // Hledáme seznam podle id a aktualizujeme jeho stav
    const shoppingList = await ShoppingList.findById(dtoIn.id);

    if (!shoppingList) {
      return res.status(404).json({
        error: "Seznam nenalezen",
        uuAppErrorMap: {}
      });
    }

    // Aktualizujeme archivovaný stav
    shoppingList.archived = dtoIn.archive;

    // Uložíme změny do databáze
    await shoppingList.save();

    // Odeslání úspěšné odpovědi
    res.json({
      shoppingList,
      uuAppErrorMap: {}
    });
  } catch (err) {
    res.status(500).json({
      error: "Chyba serveru",
      details: err.toString()
    });
  }
});

module.exports = router;

