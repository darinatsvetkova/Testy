const express = require("express");
const router = express.Router();
const ShoppingList = require("../../models/shopping");

router.get("/", async (req, res) => {
  try {
    const {
      owner,
      member,
      archived,
      page = 1,
      pageSize = 10
    } = req.query;

    const filter = {};

    if (owner) filter.owner = owner;
    if (member) filter.members = member;
    if (archived !== undefined) filter.archived = archived === "true";

    const skip = (Number(page) - 1) * Number(pageSize);

    const totalItems = await ShoppingList.countDocuments(filter);

    const shoppingLists = await ShoppingList.find(filter)
      .skip(skip)
      .limit(Number(pageSize));

    res.json({
      shoppingLists,
      pageInfo: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalItems
      },
      uuAppErrorMap: {}
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
