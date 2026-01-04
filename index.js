const mongoose = require("mongoose");
const app = require("./app");

const PORT = 3001;

mongoose
  .connect("mongodb://127.0.0.1:27017/shoppinglist")
  .then(() => {
    console.log("MongoDB připojeno");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Chyba MongoDB:", err));
