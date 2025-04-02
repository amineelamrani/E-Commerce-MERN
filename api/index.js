const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const userRouter = require("./routes/userRoutes");

// Start express App
const app = express();

app.use(express.static(path.join(__dirname, "../client/dist")));

const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("Database connection successful!!"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);

// Start Server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
