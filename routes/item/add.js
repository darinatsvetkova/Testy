const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");
const { randomUUID } = require("crypto");

router.post("/", async (req, res) => {
  const { listId, name, loggedUser } = req.body;

  if (!listId || !name || !loggedUser) {
    return res.status(400).json({ uuAppErrorMap: { invalidDtoIn: "Chybí listId, name nebo loggedUser" } });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) return res.status(404).json({ error: "Seznam nenalezen" });

    if (shoppingList.owner !== loggedUser && !shoppingList.members.includes(loggedUser)) {
      return res.status(403).json({ error: "Nemáte právo upravovat tento seznam" });
    }

    const newItem = { id: randomUUID(), name, completed: false };
    shoppingList.items.push(newItem);
    await shoppingList.save();

    res.json({ item: newItem, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;


