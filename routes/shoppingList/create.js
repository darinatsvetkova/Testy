const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

function getLoggedUser(req) {
  return req.body.loggedUser || "testUser"; 
}

router.post("/", async (req, res) => {
  const dtoIn = req.body;
  const loggedUser = getLoggedUser(req); 

  if (!dtoIn.name) {
    return res.status(400).json({ uuAppErrorMap: { invalidDtoIn: "Chybí name" } });
  }

  try {
    const shoppingList = new ShoppingList({
      name: dtoIn.name,
      owner: loggedUser,
      members: [loggedUser] 
    });

    await shoppingList.save();

    res.json({ shoppingList, uuAppErrorMap: {} });

  } catch (err) {
    res.status(500).json({ error: "Chyba serveru", details: err.toString() });
  }
});

module.exports = router;
