require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "zomato_secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Import Routes
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

// Protected Home Route
app.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("home", { user: req.session.user });
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// Menu & Order System
let cart = [];
const menu = [
  { id: 1, name: "Burger", price: 5.99 },
  { id: 2, name: "Pizza", price: 8.99 },
  { id: 3, name: "Pasta", price: 6.49 }
];

app.get("/menu", (req, res) => res.render("menu", { menu }));
app.get("/order", (req, res) => res.render("order", { cart }));

app.post("/add-to-cart", (req, res) => {
  const { id, name, price } = req.body;
  const itemIndex = cart.findIndex(item => item.id == id);
  if (itemIndex >= 0) cart[itemIndex].quantity += 1;
  else cart.push({ id, name, price: parseFloat(price), quantity: 1 });
  res.redirect("/menu");
});

app.post("/remove-from-cart", (req, res) => {
  const { id } = req.body;
  cart = cart.filter(item => item.id != id);
  res.redirect("/order");
});

app.post("/place-order", (req, res) => {
  const { address, paymentMethod } = req.body;
  if (cart.length === 0) return res.redirect("/order");
  console.log("Order Placed:", { cart, address, paymentMethod });
  cart = [];
  res.send('<h2>Order Successfully Placed!</h2><a href="/">Go Home</a>');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
