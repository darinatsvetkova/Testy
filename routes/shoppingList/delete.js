const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.delete("/", async (req, res) => {
  const { id, owner } = req.body;

  if (!id || !owner) {
    return res.status(400).json({
      uuAppErrorMap: { invalidDtoIn: "Chybí id nebo owner" }
    });
  }

  try {
    const shoppingList = await ShoppingList.findById(id);

    if (!shoppingList) {
      return res.status(404).json({ error: "Seznam nenalezen" });
    }

    if (shoppingList.owner !== owner) {
      return res.status(403).json({
        error: "Owner může smazat seznam pouze sám sebe"
      });
    }

    await shoppingList.deleteOne();

    res.json({ message: "Seznam odstraněn", uuAppErrorMap: {} });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
