const express = require("express");
const cors =require("cors")
const app = express();
require("dotenv").config();
require("./conn/conn");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const Favourites= require("./routes/favourite")
const cart= require("./routes/cart")
const order=require("./routes/order")
app.use(cors());
app.use(express.json());

app.use("/api/v1", userRoutes);
app.use("/api/v1",bookRoutes);
app.use("/api/v1",Favourites);
app.use("/api/v1",cart);
app.use("/api/v1",order),


app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
