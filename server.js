const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const dotenv = require("dotenv");

const path = require("path");

const open = (...args) => 
import('open').then(module => module.default(...args));

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((error) => {

    console.log(error);

});

const authRoutes = require("./routes/authRoutes");

const contactRoutes = require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => {

    console.log(`Server running on port ${PORT}`);

    await open(`http://localhost:${PORT}`);

});