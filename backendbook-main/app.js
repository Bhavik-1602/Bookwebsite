require("dotenv").config();
const express = require("express");
const cors =require("cors")
const app = express();
require("./conn/db");


// const paymentRoutes = require('./routes/paymentRoutes');

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const Favourites= require("./routes/favourite")
const cart= require("./routes/cart")
const order=require("./routes/order")
const router =require("./routes/payments")

//middleware

app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1", userRoutes);
app.use("/api/v1",bookRoutes);
app.use("/api/v1",Favourites);
app.use("/api/v1",cart);
app.use("/api/v1",order),
app.use('/public', express.static('public')); // ✅ Correct way

app.use('/api', router);

app.get('/public/:filename', (req, res) => {
  const {  filename } = req.params;

  // Optional: Validate type and folder for securi
  const filePath = path.join(__dirname,  'uploads',  filename);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  } else {
    return res.status(404).send('File not found');
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
