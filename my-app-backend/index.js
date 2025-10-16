const express = require("express");
const errorHandler = require("./utils/errorHandler");
const AppError = require("./utils/AppError");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./models");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

app.use(
  cors({
    origin: "*",
  })
);
app.use("/api", require("./routes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
