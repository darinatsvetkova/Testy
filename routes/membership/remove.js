const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.post("/", async (req, res) => {
  const { listId, user } = req.body;

  if (!listId || !user) {
    return res.status(400).json({ uuAppErrorMap: { invalidDtoIn: "Chybí listId nebo user" } });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) return res.status(404).json({ error: "Seznam nenalezen" });

    
    if (shoppingList.owner === user) {
      return res.status(403).json({ error: "Owner nemůže být odstraněn ze seznamu" });
    }

    shoppingList.members = shoppingList.members.filter(u => u !== user);
    await shoppingList.save();

    res.json({ members: shoppingList.members, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;


